
import { ESPLoader, Transport } from "esptool-js";

export default class Flasher {

    _device = null;
    _transport = null;
    _loader = null;
    _chip = null;

    constructor(baudRate = 115200) {

        this._baudRate = baudRate;
    }

    async connect() {

        this._device = await navigator.serial.requestPort();
        this._transport = new Transport(this._device, true);

        const loaderOptions = {

            transport: this._transport,
            baudrate: this._baudRate
        };

        try {

            this._loader = new ESPLoader(loaderOptions);
            this._chip = await this._loader.main();

            console.log("Board has been connected.");
        }

        catch {

            console.log("Connection has failed.");
        }
    }
}