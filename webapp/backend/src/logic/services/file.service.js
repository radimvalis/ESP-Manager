
export default class FileService {

    constructor(dataDirectoryPath) {

        this._dataDirectoryPath = dataDirectoryPath;
    }

    getDefaultPath(filename) {

        return this._dataDirectoryPath + "/default/" + filename + ".bin";
    }
}