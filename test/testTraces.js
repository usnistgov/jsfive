import {assert} from 'chai'
import NodeLocalFile from "../esm/io/nodeLocalFile.js"
import {File} from "../esm/high-level.js"
import {AsyncBuffer} from "../esm/io/asyncBuffer.js"
import BufferedFile from "../esm/io/bufferedFile"
import RemoteFile from "../esm/io/remoteFile"

class BufferWrapper {
    constructor(buffer) {
        this.buffer = buffer
    }

    async slice(start, end) {
        console.log(`slice ${start}  ${start - end}`)
        return this.buffer.slice(start, end)
    }

}

suite("test", function () {

    test("cndb ", async function () {

        this.timeout(100000);

        //const localFile = new RemoteFile({url})
        const localFile = new NodeLocalFile({path: "/Users/jrobinso/Downloads/bamsample/spleen_1chr1rep.hdf5"})
        const remoteFile = new RemoteFile({
            url: "https://dl.dropboxusercontent.com/s/4ncekfdrlvkjjj6/spleen_1chr1rep.cndb?dl=0"
        })
        const bufferedFile = new BufferedFile({
            file: localFile,
            //file: remoteFile,
            size: 1000000
        })

        //const buffer = await localFile.read(0, 602012432)
       // const bufferWrapper = new BufferWrapper(buffer)
        const asyncBuffer = new AsyncBuffer(bufferedFile)

        console.log('create file')
        const hdfFile = new File(asyncBuffer, "foo.hdf5")
        await hdfFile.ready
        //console.log(hdfFile.keys)

        console.log('fetch root group')
        const rootGroup = await hdfFile.get('/')
        await rootGroup.ready
        const rootKeys = rootGroup.keys
        assert.equal(rootKeys.length, 2)
        assert.equal(rootKeys[0], 'Header')
        assert.equal(rootKeys[1], 'replica10_chr1')

        console.log('fetch first group')
        const group = await hdfFile.get('/replica10_chr1')

        // Genomic positions dataset
        console.log('fetch genomic positions')
        const genomicPosition = await group.get('genomic_position')

        const shape = await genomicPosition.shape
        assert.equal(shape.length, 2)
        assert.equal(shape[0], 4980)
        assert.equal(shape[1], 2)

        const dtype = await genomicPosition.dtype
        assert.equal(dtype, '<i8')

        const array = await genomicPosition.value
        assert.equal(array.length, 9960)
        assert.equal(array[0], 1)
        assert.equal(array[9959], 249000001)

        console.log('fetch spatial position')
        // Spatial position group
        const spatialPosition = await group.get('spatial_position')

        console.log('keys')
        // Spatial position keys (1 for each dataset)
        const keys = spatialPosition.keys
        assert.equal(keys.length, 9999)

        console.log('first dataset')
        // First positions dataset
        const sp1 = await spatialPosition.get(keys[0])

        console.log('shape')
        const s = await sp1.shape

        console.log('dtype')
        const t = await sp1.dtype

        console.log('value')
        const a1 = await sp1.value

        // const trace_2 = await spatialPosition.get(keys[1])
        //
        // console.log(await trace_2.shape)
        // console.log(await trace_2.dtype)
        // const offset2 = trace_2._dataobjects.offset
        // console.log('trace_2 offset = ' + offset2)
        // const numElements2 = (await sp1.shape)[0] * (await sp1).shape[1]
        // const a2 = await trace_2.value
    })
})
