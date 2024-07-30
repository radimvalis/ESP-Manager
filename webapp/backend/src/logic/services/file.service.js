
import fs from "fs/promises";
import { spawn } from "child_process";
import { once } from "events";
import { NVSGenerationError } from "../../utils/errors.js";

export default class FileService {

    static _DEFAULT_NVS_CSV = "default-nvs.csv";
    static _DEFAULT_NVS_BIN = "default-nvs.bin";

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

    async createBoardDir(boardId) {

        await fs.mkdir(this._boardsDir + boardId);
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

    _getBoardDir(boardId) {

        return this._boardsDir + boardId + "/";
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