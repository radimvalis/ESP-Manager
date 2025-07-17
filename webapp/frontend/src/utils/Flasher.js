
import { ESPLoader, Transport } from "esptool-js";

export default class Flasher {

    _device = null;
    _transport = null;
    _loader = null;

    /**
     * Creates Flasher
     * @param {number} baudRate 
     */
    constructor(baudRate = 921600) {

        this._baudRate = baudRate;
    }

    /**
     * Prompts user to select port their board is connected to
     */
    async requestPort() {

        this._device = await navigator.serial.requestPort();
    }

    /**
     * Establishes serial connection
     */
    async connect() {

        this._transport = new Transport(this._device, false);

        const loaderOptions = {

            transport: this._transport,
            baudrate: this._baudRate
        };

        this._loader = new ESPLoader(loaderOptions);

        await this._loader.main();
    }

    /**
     * Gets chip name of the connected board
     * @returns {string} Chip name
     */
    getChipName() {

        return this._loader.chip.CHIP_NAME.toLowerCase();
    }

    /**
     * Gets flash memory size of the connected board
     * @returns {number} Flash memory size in MB
     */
    async getFlashSizeMB() {

        return await this._loader.getFlashSize() / 1024;
    }

    /**
     * Erases flash memory of the connected board
     */
    async eraseFlash() {

        await this._loader.eraseFlash();
    };

    /**
     * Flashes bootloader, partition table, default firmware and configuration of ESP Manager into board
     * @param {object} defaultApp - Files to flash
     * @param {(progress: number) => void} reportProgressPercentage - Progress CB
     */
    async program(defaultApp, reportProgressPercentage) {

        const fileArray = [

            { data: defaultApp.bootloader, address: this._loader.chip.BOOTLOADER_FLASH_OFFSET },
            { data: defaultApp.partitionTable, address: 0x8000 },
            { data: defaultApp.config, address: 0x9000 },
            { data: defaultApp.firmware, address: 0x10000 }
        ];

        const flashOptions = {

            fileArray: fileArray,
            flashSize: "keep",
            eraseAll: false,
            compress: true,
            reportProgress: (fileIndex, written, total) => {

                if(fileIndex === 3) {

                    reportProgressPercentage(Math.floor((written / total) * 100));
                }
            }
        };

        await this._loader.writeFlash(flashOptions);
        await this._loader.after();
    }

    /**
     * Closes serial connection
     */
    async disconnect() {

        if (this._transport) {

            await this._transport.disconnect();
        }
   }

   /**
    * Cleans up internal references
    */
   cleanUp() {

        this._device = null;
        this._transport = null;
        this._loader = null;
   }
}