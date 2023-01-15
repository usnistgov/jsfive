



class AsyncBuffer {

    constructor(fileReader) {
        this.fileReader = fileReader
    }

    async slice(start, end) {

        return this.fileReader.read(start, end - start)
    }

}


export {AsyncBuffer}