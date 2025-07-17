
import fs from "fs/promises";
import path from "path";
import Ajv2019 from "ajv/dist/2019.js";
import { InvalidInputError } from "../../utils/errors.js";
import firmwareSizeLimit from "../../utils/limits.js";
import { spawn } from "child_process";
import { once } from "events";

export default class FileService {

    static _NVS_CSV = "nvs.csv";
    static _NVS_BIN = "nvs.bin";
    static _DEFAULT_NVS_CSV = "default-nvs.csv";
    static _DEFAULT_NVS_BIN = "default-nvs.bin";

    static _FIRMWARE = "firmware.bin";
    static _CONFIG_FORM = "config-form.json";
    static _CONFIG_FORM_SCHEMA = "config-form.schema.json";

    static _NVS_SIZE =  0x10000;
    static _DEFAULT_NVS_SIZE =  0x5000;

    /**
     * Creates FileService
     * @param {object} config 
     */
    constructor(config) {

        this._dataDirectoryPath = config.path.dataDirectoryPath;
        this._caBundlePath = config.path.caBundlePath;

        this._brokerUrl = config.url.broker;

        this._validateConfigForm = null;
    }

    /**
     * Loads and compiles config-forms schema
     */
    async init() {

        const ajv = new Ajv2019();
        const schema = await fs.readFile(path.join(this._defaultDir, FileService._CONFIG_FORM_SCHEMA), "utf8");
        const schemaAsObject = JSON.parse(schema);

        this._validateConfigForm = ajv.compile(schemaAsObject);
    }

    /**
     * 
     * @param {string} target 
     * @returns {string}
     */
    getDefaultFirmwarePath(target) {

        return path.join(this._getTargetDir(target), FileService._FIRMWARE);
    }

    /**
     * 
     * @returns {string}
     */
    getDefaultConfigFormPath() {

        return path.join(this._defaultDir, FileService._CONFIG_FORM);
    }

    /**
     * 
     * @param {number} flashSizeMB 
     * @returns {string} 
     */
    getPartitionTablePath(flashSizeMB) {

        return path.join(this._partitionTablesDir, "partition_table_" + flashSizeMB + "MB.bin");
    }

    /**
     * 
     * @param {string} taget 
     * @param {number} flashSizeMB 
     * @returns 
     */
    getBootloaderPath(taget, flashSizeMB) {

        return path.join(this._getBootloadersDir(taget), "bootloader_" + flashSizeMB + "MB.bin");
    }

    /**
     * 
     * @param {string} boardId 
     * @returns {string}
     */
    getDefaultNVSPath(boardId) {

        return path.join(this._getBoardDir(boardId), FileService._DEFAULT_NVS_BIN);
    }

    /**
     * 
     * @param {string} boardId 
     * @returns {string}
     */
    getNVSPath(boardId) {

        return path.join(this._getBoardDir(boardId), FileService._NVS_BIN);
    }

    /**
     * 
     * @param {string} firmwareId 
     * @returns {string}
     */
    getFirmwarePath(firmwareId) {

        return path.join(this._getFirmwareDir(firmwareId), FileService._FIRMWARE);
    }

    /**
     * 
     * @param {string} firmwareId 
     * @returns {string}
     */
    getConfigFormPath(firmwareId) {

        return path.join(this._getFirmwareDir(firmwareId), FileService._CONFIG_FORM);
    }

    /**
     * Stores firmware image to firmware directory
     * @param {string} firmwareId 
     * @param {File} firmwareFile 
     */
    async saveFirmware(firmwareId, firmwareFile) {

        // Validate

        if (firmwareFile.mimetype !== "application/octet-stream") {

            throw new InvalidInputError("The firmware file is not valid");
        }

        const maxFirmwareSizeB = firmwareSizeLimit["32MB"];

        if (firmwareFile.size > maxFirmwareSizeB) {

            throw new InvalidInputError(`Firmware exceeds the maximum size of ${(maxFirmwareSizeB / (1024 * 1024)).toFixed(2)}MiB`);
        }

        // Move from tmp directory to firmware directory

        const newPath = this.getFirmwarePath(firmwareId);

        await fs.copyFile(firmwareFile.path, newPath);
        await fs.unlink(firmwareFile.path);
    }
    
    /**
     * Stores configuration file to firmware directory
     * @param {string} firmwareId 
     * @param {File} configFormFile 
     */
    async saveConfigForm(firmwareId, configFormFile) {

        // Validate

        let configFormAsObject;
        const configForm = await fs.readFile(configFormFile.path, "utf8");

        try {
            
            configFormAsObject = JSON.parse(configForm);
        }

        catch(e) {

            throw new InvalidInputError("The configuration file is not a valid JSON");
        }

        if (!this._validateConfigForm(configFormAsObject)) {

            throw new InvalidInputError("The configuration file does not conform to the schema");
        }

        // Move from tmp directory to firmware directory

        const newPath = this.getConfigFormPath(firmwareId);
 
       await fs.copyFile(configFormFile.path, newPath);
       await fs.unlink(configFormFile.path);
    }

    /**
     * 
     * @param {string} boardId 
     */
    async createBoardDir(boardId) {

        await fs.mkdir(path.join(this._boardsDir, boardId));
    }

    /**
     * 
     * @param {string} firmwareId 
     */
    async createFirmwareDir(firmwareId) {

        await fs.mkdir(path.join(this._firmwaresDir, firmwareId));
    }

    /**
     * 
     * @param {string} boardId 
     */
    async tryDeleteBoardDir(boardId) {

        try {

            await fs.rm(this._getBoardDir(boardId), { recursive: true, force: true });
        }

        catch {}
    }

    /**
     * 
     * @param {string} firmwareId 
     */
    async tryDeleteFirmwareDir(firmwareId) {

        try {

            await fs.rm(this._getFirmwareDir(firmwareId), { recursive: true, force: true });
        }

        catch {}
    }

    /**
     * Generates NVS image
     * @param {object} configData 
     * @param {string} firmwareId 
     * @param {string} boardId 
     */
    async createNVS(configData, firmwareId, boardId) {

        const configFormPath = this.getConfigFormPath(firmwareId);

        const configForm = await FileService._loadConfigForm(configFormPath);

        const csvPath = path.join(this._getBoardDir(boardId), FileService._NVS_CSV);
        const binPath = path.join(this._getBoardDir(boardId), FileService._NVS_BIN);

        await FileService._saveConfigDataAsCSV(configData, configForm, csvPath);

        await this._createNVS(csvPath, binPath, FileService._NVS_SIZE);        
    }

    /**
     * Generates NVS image with ESP Manager data
     * @param {object} configData 
     * @param {object} board 
     */
    async createDefaultNVS(configData, board) {

        const defaultConfigForm = await FileService._loadConfigForm(path.join(this._defaultDir, FileService._CONFIG_FORM));

        // Add ESP Manager configuration which is not part of default config form

        configData.id = board.id;
        defaultConfigForm.push({ key: "id", type: "data", encoding: "string" });

        configData.http_password = board.httpPassword;
        defaultConfigForm.push({ key: "http_password", type: "data", encoding: "string" });

        configData.mqtt_password = board.mqttPassword;
        defaultConfigForm.push({ key: "mqtt_password", type: "data", encoding: "string" });

        configData.mqtt_broker_uri = this._brokerUrl;
        defaultConfigForm.push({ key: "mqtt_broker_uri", type: "data", encoding: "string" });

        configData.ca_bundle = this._caBundlePath;
        defaultConfigForm.push({ key: "ca_bundle", type: "file", encoding: "string" });

        configData.firmware_id = "default";
        defaultConfigForm.push({ key: "firmware_id", type: "data", encoding: "string" });

        configData.version = -1;
        defaultConfigForm.push({ key: "version", type: "data", encoding: "i16" });

        const csvPath = path.join(this._getBoardDir(board.id), FileService._DEFAULT_NVS_CSV);
        const binPath = path.join(this._getBoardDir(board.id), FileService._DEFAULT_NVS_BIN);

        await FileService._saveConfigDataAsCSV(configData, defaultConfigForm, csvPath);

        await this._createNVS(csvPath, binPath, FileService._DEFAULT_NVS_SIZE);
    }

    get _boardsDir() {

        return path.join(this._dataDirectoryPath, "boards");
    }

    get _firmwaresDir() {

        return path.join(this._dataDirectoryPath, "firmwares");
    }

    get _defaultDir() {

        return path.join(this._dataDirectoryPath, "default");
    }

    get _targetsDir() {

        return path.join(this._defaultDir, "targets");
    }

    get _partitionTablesDir() {

        return path.join(this._defaultDir, "partition_tables");
    }

    _getTargetDir(target) {

        return path.join(this._targetsDir, target);
    }

    _getBootloadersDir(target) {

        return path.join(this._getTargetDir(target), "bootloaders");
    }

    _getBoardDir(boardId) {

        return path.join(this._boardsDir, boardId);
    }

    _getFirmwareDir(firmwareId) {

        return path.join(this._firmwaresDir, firmwareId);
    }

    /**
     * Loads configuration form from firmware directory
     * @param {string} configFormPath 
     * @returns {object} Configuration form object
     */
    static async _loadConfigForm(configFormPath) {

        const buffer = await fs.readFile(configFormPath);

        return JSON.parse(buffer);
    }

    /**
     * Generates NVS description using configData and configForm
     * @param {object} configData 
     * @param {object} configForm 
     * @param {string} outputPath 
     */
    static async _saveConfigDataAsCSV(configData, configForm, outputPath) {

        let content = "";

        // Define header

        content += "key,type,encoding,value\n";

        // Define namespace
        
        content += "esp_manager,namespace,,\n";

        // Define other key-value pairs

        configForm.forEach(entry => {

            if (entry.isRequired && typeof configData[entry.key] === "undefined") {

                throw new InvalidInputError(`${entry.label} must be defined`);
            }

            if (typeof configData[entry.key] !== "undefined") {

                const value = entry.encoding === "string" && entry.type === "data" ? FileService._escapeCSVString(configData[entry.key]) : configData[entry.key];

                content += `${entry.key},${entry.type},${entry.encoding},${value}\n`;
            }
        });

        await fs.writeFile(outputPath, content);
    }

    /**
     * 
     * @param {string} value Value to escape 
     * @returns {string} Escaped value
     */
    static _escapeCSVString(value) {

        if (value.includes(",") || value.includes('"') || value.includes("\n")) {

            value = value.replace(/"/g, '""');

            return '"' + value + '"';
        }

        return value;
    }

    /***
     * Generates NVS image from CSV
     */
    async _createNVS(inputPath, outputPath, nvsSize) {
     
        const process = spawn("python3", [ "-m", "esp_idf_nvs_partition_gen", "generate", inputPath, outputPath, nvsSize ]);

        const result = await once(process, "exit");
        const exitCode = result[0];

        if (exitCode !== 0) {

            throw new InvalidInputError("Configuration is not valid");
        }
    }
}