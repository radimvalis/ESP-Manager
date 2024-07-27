
import fs from "fs/promises";
import uniqueFilename from "unique-filename";
import { spawn } from "child_process";
import { once } from "events";
import { NVSGenerationError } from "../../utils/errors.js";

export default class FileService {

    constructor(dataDirectoryPath) {

        this._dataDirectoryPath = dataDirectoryPath;
    }

    getDefaultPath(filename) {

        const fileExtension = filename === "config-form" ? ".json" : ".bin";

        return this._dataDirectoryPath + "/default/" + filename + fileExtension;
    }

    async generateNVS(data) {

        const filename = uniqueFilename(this._dataDirectoryPath + "/tmp/");

        const csvPath = filename + ".csv";
        const binPath = filename + ".bin";

        await this._saveNVSDataAsCSV(data, csvPath);
        
        const process = spawn("python3", [ "-m", "esp_idf_nvs_partition_gen", "generate", csvPath, binPath, 0x3000 ]);

        const result = await once(process, "exit");
        const exitCode = result[0];

        if (exitCode !== 0) {

            throw new NVSGenerationError();
        }

        return binPath;
    }

    async _saveNVSDataAsCSV(data, outputPath) {

        let content = "";

        // Define header

        content += "key,type,encoding,value\n";

        // Define namespace
        
        content += "esp_manager,namespace,,\n";

        // Define other key-value pairs

        data.forEach(x => {

            const value = x.encoding === "string" ? FileService._escapeCSVString(x.value) : x.value;

            content += `${x.key},${x.type},${x.encoding},${value}\n`;
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
}