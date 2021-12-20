import {default as pako} from '../web_modules/pako-es.js';

const zlib_decompress = function (buf, itemsize) {
  let input_array = new Uint8Array(buf);
  return pako.inflate(input_array).buffer;
}

const unshuffle = function (buf, itemsize) {
  let buffer_size = buf.byteLength;
  let unshuffled_view = new Uint8Array(buffer_size);
  let step = Math.floor(buffer_size / itemsize);
  let shuffled_view = new DataView(buf);
  for (var j = 0; j < itemsize; j++) {
    for (var i = 0; i < step; i++) {
      unshuffled_view[j + i * itemsize] = shuffled_view.getUint8(j * step + i);
    }
  }
  return unshuffled_view.buffer;
}

const fletch32 = function (buf, itemsize) {
  _verify_fletcher32(buf);
  //# strip off 4-byte checksum from end of buffer
  return buf.slice(0, -4);
}


//# IV.A.2.l The Data Storage - Filter Pipeline message
var RESERVED_FILTER = 0;
const GZIP_DEFLATE_FILTER = 1;
const SHUFFLE_FILTER = 2;
const FLETCH32_FILTER = 3;
var SZIP_FILTER = 4;
var NBIT_FILTER = 5;
var SCALEOFFSET_FILTER = 6;

// To register a new filter, add a function (ArrayBuffer) => ArrayBuffer
// the the following map, using a key that corresponds to filter_id (int)
export const Filters = new Map([
  [GZIP_DEFLATE_FILTER, zlib_decompress],
  [SHUFFLE_FILTER, unshuffle],
  [FLETCH32_FILTER, fletch32]
]);