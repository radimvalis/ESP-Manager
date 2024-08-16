
import fs from "fs/promises";
import { spawn } from "child_process";
import { once } from "events";
import { NVSGenerationError } from "../../utils/errors.js";

export default class FileService {

    static _DEFAULT_NVS_CSV = "default-nvs.csv";
    static _DEFAULT_NVS_BIN = "default-nvs.bin";

    static _FIRMWARE = "firmware.bin";
    static _CONFIG_FORM = "config-form.json";

    constructor(dataDirectoryPath) {

        this._dataDirectoryPath = dataDirectoryPath;
    }

    getDefaultPath(filename) {

        const fileExtension = filename === "config-form" ? ".json" : ".bin";

        return this._dataDirectoryPath + "/default/" + filename + fileExtension;
    }

    getDefaultNVSPath(boardId) {

        return this._getBoardDir(boardId) + FileService._DEFAULT_NVS_BIN;
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

    async createDefaultNVS(configData, boardId) {

        const defaultConfigFormPath = this.getDefaultPath("config-form");

        const defaultConfigForm = await FileService._loadConfigForm(defaultConfigFormPath);

        // Add board ID which is not part of default config form 

        configData.id = boardId;
        defaultConfigForm.push({ key: "id", encoding: "string" });

        const csvPath = this._getBoardDir(boardId) + FileService._DEFAULT_NVS_CSV;
        const binPath = this._getBoardDir(boardId) + FileService._DEFAULT_NVS_BIN;

        await FileService._saveConfigDataAsCSV(configData, defaultConfigForm, csvPath);

        await this._createNVS(csvPath, binPath);
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

            const value = entry.encoding === "string" ? FileService._escapeCSVString(configData[entry.key]) : configData[entry.key];

            content += `${entry.key},data,${entry.encoding},${value}\n`;
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

    async _createNVS(inputPath, outputPath) {
     
        const process = spawn("python3", [ "-m", "esp_idf_nvs_partition_gen", "generate", inputPath, outputPath, 0x3000 ]);

        const result = await once(process, "exit");
        const exitCode = result[0];

        if (exitCode !== 0) {

            throw new NVSGenerationError();
        }
    }
}