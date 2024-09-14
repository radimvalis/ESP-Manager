
import fs from "fs/promises";
import { spawn } from "child_process";
import { once } from "events";
import { NVSGenerationError } from "../../utils/errors.js";

export default class FileService {

    static _NVS_CSV = "nvs.csv";
    static _NVS_BIN = "nvs.bin";
    static _DEFAULT_NVS_CSV = "default-nvs.csv";
    static _DEFAULT_NVS_BIN = "default-nvs.bin";

    static _FIRMWARE = "firmware.bin";
    static _CONFIG_FORM = "config-form.json";

    constructor(config) {

        this._dataDirectoryPath = config.path.dataDirectoryPath;
        this._serverCrtPath = config.path.serverCrtPath;

        this._brokerUrl = config.url.broker;
    }

    getDefaultPath(filename) {

        const fileExtension = filename === "config-form" ? ".json" : ".bin";

        return this._dataDirectoryPath + "/default/" + filename + fileExtension;
    }

    getDefaultNVSPath(boardId) {

        return this._getBoardDir(boardId) + FileService._DEFAULT_NVS_BIN;
    }

    getNVSPath(boardId) {

        return this._getBoardDir(boardId) + FileService._NVS_BIN;
    }

    getFirmwarePath(firmwareId) {

        return this._getFirmwareDir(firmwareId) + FileService._FIRMWARE;
    }

    getConfigFormPath(firmwareId) {

        return this._getFirmwareDir(firmwareId) + FileService._CONFIG_FORM;
    }

    async moveFirmwareToDedicatedDir(firmwareId, oldFirmwarePath) {

        const newFirmwarePath = this.getFirmwarePath(firmwareId);

        await fs.copyFile(oldFirmwarePath, newFirmwarePath);
    }

    async moveConfigFormToDedicatedDir(firmwareId, oldConfigFormPath) {

        const newConfigFormPath = this.getConfigFormPath(firmwareId);

        await fs.copyFile(oldConfigFormPath, newConfigFormPath);
    }

    async createBoardDir(boardId) {

        await fs.mkdir(this._boardsDir + boardId);
    }

    async createFirmwareDir(firmwareId) {

        await fs.mkdir(this._firmwaresDir + firmwareId);
    }

    async deleteBoardDir(boardId) {

        await fs.rm(this._getBoardDir(boardId), { recursive: true, force: true });
    }

    async deleteFirmwareDir(firmwareId) {

        await fs.rm(this._getFirmwareDir(firmwareId), { recursive: true, force: true });
    }

    async createNVS(configData, firmwareId, boardId) {

        const configFormPath = this.getConfigFormPath(firmwareId);

        const configForm = await FileService._loadConfigForm(configFormPath);

        const csvPath = this._getBoardDir(boardId) + FileService._NVS_CSV;
        const binPath = this._getBoardDir(boardId) + FileService._NVS_BIN;

        await FileService._saveConfigDataAsCSV(configData, configForm, csvPath);

        await this._createNVS(csvPath, binPath, 0x8000);        
    }

    async createDefaultNVS(configData, board) {

        const defaultConfigFormPath = this.getDefaultPath("config-form");

        const defaultConfigForm = await FileService._loadConfigForm(defaultConfigFormPath);

        // Add config which is not part of default config form

        configData.mqtt_username = board.id;
        defaultConfigForm.push({ key: "mqtt_username", type: "data", encoding: "string" });

        configData.mqtt_password = board.mqttPassword;
        defaultConfigForm.push({ key: "mqtt_password", type: "data", encoding: "string" });

        configData.mqtt_broker_uri = this._brokerUrl;
        defaultConfigForm.push({ key: "mqtt_broker_uri", type: "data", encoding: "string" });

        configData.server_crt = this._serverCrtPath;
        defaultConfigForm.push({ key: "server_crt", type: "file", encoding: "string" });

        configData.firmware_id = "default";
        defaultConfigForm.push({ key: "firmware_id", type: "data", encoding: "string" });

        configData.version = -1;
        defaultConfigForm.push({ key: "version", type: "data", encoding: "i16" });

        const csvPath = this._getBoardDir(board.id) + FileService._DEFAULT_NVS_CSV;
        const binPath = this._getBoardDir(board.id) + FileService._DEFAULT_NVS_BIN;

        await FileService._saveConfigDataAsCSV(configData, defaultConfigForm, csvPath);

        await this._createNVS(csvPath, binPath, 0x5000);
    }

    get _boardsDir() {

        return this._dataDirectoryPath + "/boards/";
    }

    get _firmwaresDir() {

        return this._dataDirectoryPath + "/firmwares/";
    }

    _getBoardDir(boardId) {

        return this._boardsDir + boardId + "/";
    }

    _getFirmwareDir(firmwareId) {

        return this._firmwaresDir + firmwareId + "/";
    }

    static async _loadConfigForm(configFormPath) {

        const buffer = await fs.readFile(configFormPath);

        return JSON.parse(buffer);
    }

    static async _saveConfigDataAsCSV(configData, configForm, outputPath) {

        let content = "";

        // Define header

        content += "key,type,encoding,value\n";

        // Define namespace
        
        content += "esp_manager,namespace,,\n";

        // Define other key-value pairs

        configForm.forEach(entry => {

            const value = entry.encoding === "string" && entry.type === "data" ? FileService._escapeCSVString(configData[entry.key]) : configData[entry.key];

            content += `${entry.key},${entry.type},${entry.encoding},${value}\n`;
        });

        await fs.writeFile(outputPath, content);
    }

    static _escapeCSVString(value) {

        if (value.includes(",") || value.includes('"') || value.includes("\n")) {

            value = value.replace(/"/g, '""');

            return '"' + value + '"';
        }

        return value;
    }

    async _createNVS(inputPath, outputPath, nvsSize) {
     
        const process = spawn("python3", [ "-m", "esp_idf_nvs_partition_gen", "generate", inputPath, outputPath, nvsSize ]);

        const result = await once(process, "exit");
        const exitCode = result[0];

        if (exitCode !== 0) {

            throw new NVSGenerationError();
        }
    }
}