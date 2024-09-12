
import { ESPLoader, Transport } from "esptool-js";

export default class Flasher {

    _device = null;
    _transport = null;
    _loader = null;
    _chip = null;

    constructor(baudRate = 115200) {

        this._baudRate = baudRate;
    }

    async requestPort() {

        this._device = await navigator.serial.requestPort();
    }

    async connect() {

        this._transport = new Transport(this._device, true);

        const loaderOptions = {

            transport: this._transport,
            baudrate: this._baudRate
        };

        this._loader = new ESPLoader(loaderOptions);
        this._chip = await this._loader.main();
    }

    async eraseFlash() {

        await this._loader.eraseFlash();
    };

    async program(defaultApp, reportProgressPercentage) {

        const fileArray = [

            { data: defaultApp.bootloader, address: 0x1000 },
            { data: defaultApp.partitionTable, address: 0x8000 },
            { data: defaultApp.config, address: 0x9000 },
            { data: defaultApp.firmware, address: 0x10000 }
        ];

        const flashOptions = {

            fileArray: fileArray,
            flashSize: "8MB",
            eraseAll: false,
            compress: true,
            reportProgress: (fileIndex, written, total) => {

                if(fileIndex === 3) {

                    reportProgressPercentage(Math.floor((written / total) * 100));
                }
            }
        };

        await this._loader.writeFlash(flashOptions);
    }

    async close() {

        await this._device.close();
    }
}