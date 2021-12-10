var $9Qgbm$swchelpers = require("@swc/helpers");

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $359dcbe525bf8f2a$exports = {};

$parcel$export($359dcbe525bf8f2a$exports, "__version__", () => $359dcbe525bf8f2a$export$54e61d0ef1bb59e6);
$parcel$export($359dcbe525bf8f2a$exports, "Group", () => $359dcbe525bf8f2a$export$eb2fcfdbd7ba97d4);
$parcel$export($359dcbe525bf8f2a$exports, "Dataset", () => $359dcbe525bf8f2a$export$827063163a0a89f5);
$parcel$export($359dcbe525bf8f2a$exports, "File", () => $359dcbe525bf8f2a$export$b6afa8811b7e644e);
function $a610fe1a81efd230$export$4366ba51fc17f77c(structure, buf, offset = 0) {
    var output = new Map();
    for (let [key, fmt] of structure.entries()){
        let value = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<' + fmt, buf, offset);
        offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize(fmt);
        if (value.length == 1) value = value[0];
        output.set(key, value);
    }
    return output;
}
function $a610fe1a81efd230$export$a7a9523472993e97(thing) {
    if (!thing) thing();
}
function $a610fe1a81efd230$export$3d1b068e9b9d668d(structure) {
    //""" Return the size of a structure in bytes. """
    var fmt = '<' + Array.from(structure.values()).join('');
    return $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize(fmt);
}
function $a610fe1a81efd230$export$5d30a19cbc4b604c(size, padding_multiple = 8) {
    //""" Return the size of a field padded to be a multiple a given value. """
    return Math.ceil(size / padding_multiple) * padding_multiple;
}
var $a610fe1a81efd230$var$dtype_to_format = {
    "u": "Uint",
    "i": "Int",
    "f": "Float"
};
function $a610fe1a81efd230$export$9fc19bf239cc5928(dtype_str) {
    var big_endian = $a610fe1a81efd230$export$8cf3da7c1c9174ea._is_big_endian(dtype_str);
    var getter, nbytes;
    if (/S/.test(dtype_str)) {
        // string type
        getter = "getString";
        nbytes = ((dtype_str.match(/S(\d*)/) || [])[1] || 1) | 0;
    } else {
        let [_, fstr, bytestr] = dtype_str.match(/[<>=!@]?(i|u|f)(\d*)/);
        nbytes = parseInt(bytestr || 4, 10);
        let nbits = nbytes * 8;
        getter = "get" + $a610fe1a81efd230$var$dtype_to_format[fstr] + nbits.toFixed();
    }
    return [
        getter,
        big_endian,
        nbytes
    ];
}
class $a610fe1a81efd230$export$e0be378c32fb70a7 {
    __bool__() {
        return this.address_of_reference != 0;
    }
    /*
  """
  HDF5 Reference.
  """
  */ constructor(address_of_reference){
        this.address_of_reference = address_of_reference;
    }
}
class $a610fe1a81efd230$var$Struct {
    calcsize(fmt) {
        var size = 0;
        var match;
        var regex = new RegExp(this.fmt_size_regex, 'g');
        while((match = regex.exec(fmt)) !== null){
            let n = parseInt(match[1] || 1, 10);
            let f = match[2];
            let subsize = this.byte_lengths[f];
            size += n * subsize;
        }
        return size;
    }
    _is_big_endian(fmt1) {
        var big_endian;
        if (/^</.test(fmt1)) big_endian = false;
        else if (/^(!|>)/.test(fmt1)) big_endian = true;
        else big_endian = this.big_endian;
        return big_endian;
    }
    unpack_from(fmt2, buffer, offset) {
        var offset = Number(offset || 0);
        var view = new $a610fe1a81efd230$export$735c64326b369ff3(buffer, 0);
        var output = [];
        var big_endian = this._is_big_endian(fmt2);
        var match;
        var regex = new RegExp(this.fmt_size_regex, 'g');
        while((match = regex.exec(fmt2)) !== null){
            let n = parseInt(match[1] || 1, 10);
            let f = match[2];
            let getter = this.getters[f];
            let size = this.byte_lengths[f];
            var append_target;
            if (f == 's') {
                var sarray = new Array();
                append_target = sarray;
            } else append_target = output;
            for(var i = 0; i < n; i++){
                append_target.push(view[getter](offset, !big_endian));
                offset += size;
            }
            if (f == 's') output.push(sarray.reduce(function(a, b) {
                return a + String.fromCharCode(b);
            }, ''));
        }
        return output;
    }
    constructor(){
        this.big_endian = $a610fe1a81efd230$var$isBigEndian();
        this.getters = {
            "s": "getUint8",
            "b": "getInt8",
            "B": "getUint8",
            "h": "getInt16",
            "H": "getUint16",
            "i": "getInt32",
            "I": "getUint32",
            "l": "getInt32",
            "L": "getUint32",
            "q": "getInt64",
            "Q": "getUint64",
            "f": "getFloat32",
            "d": "getFloat64"
        };
        this.byte_lengths = {
            "s": 1,
            "b": 1,
            "B": 1,
            "h": 2,
            "H": 2,
            "i": 4,
            "I": 4,
            "l": 4,
            "L": 4,
            "q": 8,
            "Q": 8,
            "f": 4,
            "d": 8
        };
        let all_formats = Object.keys(this.byte_lengths).join('');
        this.fmt_size_regex = '(\\d*)([' + all_formats + '])';
    }
}
const $a610fe1a81efd230$export$8cf3da7c1c9174ea = new $a610fe1a81efd230$var$Struct();
function $a610fe1a81efd230$var$isBigEndian() {
    const array = new Uint8Array(4);
    const view = new Uint32Array(array.buffer);
    return !((view[0] = 1) & array[0]);
}
var $a610fe1a81efd230$var$WARN_OVERFLOW = false;
var $a610fe1a81efd230$var$MAX_INT64 = 1n << 63n - 1n;
var $a610fe1a81efd230$var$MIN_INT64 = -1n << 63n;
var $a610fe1a81efd230$var$MAX_UINT64 = 1n << 64n;
var $a610fe1a81efd230$var$MIN_UINT64 = 0n;
class $a610fe1a81efd230$export$735c64326b369ff3 extends DataView {
    getUint64(byteOffset4, littleEndian4) {
        // split 64-bit number into two 32-bit (4-byte) parts
        const left = BigInt(this.getUint32(byteOffset4, littleEndian4));
        const right = BigInt(this.getUint32(byteOffset4 + 4, littleEndian4));
        // combine the two 32-bit values
        let combined = littleEndian4 ? left + (right << 32n) : (left << 32n) + right;
        if ($a610fe1a81efd230$var$WARN_OVERFLOW && (combined < $a610fe1a81efd230$var$MIN_UINT64 || combined > $a610fe1a81efd230$var$MAX_UINT64)) console.warn(combined, 'exceeds range of 64-bit unsigned int');
        return Number(combined);
    }
    getInt64(byteOffset1, littleEndian1) {
        // split 64-bit number into two 32-bit (4-byte) parts
        // untested!!
        var low, high;
        if (littleEndian1) {
            low = this.getUint32(byteOffset1, true);
            high = this.getInt32(byteOffset1 + 4, true);
        } else {
            high = this.getInt32(byteOffset1, false);
            low = this.getUint32(byteOffset1 + 4, false);
        }
        let combined = BigInt(low) + (BigInt(high) << 32n);
        if ($a610fe1a81efd230$var$WARN_OVERFLOW && (combined < $a610fe1a81efd230$var$MIN_INT64 || combined > $a610fe1a81efd230$var$MAX_INT64)) console.warn(combined, 'exceeds range of 64-bit signed int');
        return Number(combined);
    }
    getString(byteOffset2, littleEndian2, length) {
        var output = "";
        for(var i = 0; i < length; i++){
            let c = this.getUint8(byteOffset2 + i);
            if (c) // filter out zero character codes (padding)
            output += String.fromCharCode(c);
        }
        return decodeURIComponent(escape(output));
    }
    getVLENStruct(byteOffset3, littleEndian3, length1) {
        // get the addressing information for VLEN data
        let item_size = this.getUint32(byteOffset3, littleEndian3);
        let collection_address = this.getUint64(byteOffset3 + 4, littleEndian3);
        let object_index = this.getUint32(byteOffset3 + 12, littleEndian3);
        return [
            item_size,
            collection_address,
            object_index
        ];
    }
}
function $a610fe1a81efd230$export$c69b3bfd2d13c67e(integer) {
    return integer.toString(2).length;
}
function $a610fe1a81efd230$export$915ab53af81886(nbytes, fh, offset = 0, littleEndian = true) {
    //let padded_bytelength = 1 << Math.ceil(Math.log2(nbytes));
    //let format = _int_format(padded_bytelength);
    //let buf = new ArrayBuffer(padded_bytelength); // all zeros to start
    let bytes = new Uint8Array(fh.slice(offset, offset + nbytes));
    if (!littleEndian) bytes.reverse();
    let integer = bytes.reduce((accumulator, currentValue, index)=>accumulator + (currentValue << index * 8)
    , 0);
    return integer;
//new Uint8Array(buf).set(new Uint8Array(fh.slice(offset, offset + nbytes)));
//return struct.unpack_from(format, buf, 0)[0];
}
function $a610fe1a81efd230$var$_int_format(bytelength) {
    $a610fe1a81efd230$export$a7a9523472993e97([
        1,
        2,
        4,
        8
    ].includes(bytelength));
    let index = Math.log2(bytelength);
    return [
        "<B",
        "<H",
        "<I",
        "<Q"
    ][index];
}
function $a610fe1a81efd230$var$getUint64(dataview, byteOffset, littleEndian) {
    // split 64-bit number into two 32-bit (4-byte) parts
    const left = BigInt(this.getUint32(byteOffset, littleEndian));
    const right = BigInt(this.getUint32(byteOffset + 4, littleEndian));
    // combine the two 32-bit values
    return littleEndian ? left + right << 32n : left << 32n + right;
}
var $a610fe1a81efd230$var$VLEN_ADDRESS = new Map([
    [
        'item_size',
        'I'
    ],
    [
        'collection_address',
        'Q'
    ],
    [
        'object_index',
        'I'
    ], 
]);


class $831e918c79298dac$export$2273d44c2fa53571 {
    determine_dtype() {
        //""" Return the dtype (often numpy-like) for the datatype message.  """
        let datatype_msg = $a610fe1a81efd230$export$4366ba51fc17f77c($831e918c79298dac$var$DATATYPE_MSG, this.buf, this.offset);
        this.offset += $831e918c79298dac$var$DATATYPE_MSG_SIZE;
        //# last 4 bits
        let datatype_class = datatype_msg.get('class_and_version') & 15;
        if (datatype_class == $831e918c79298dac$var$DATATYPE_FIXED_POINT) return this._determine_dtype_fixed_point(datatype_msg);
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_FLOATING_POINT) return this._determine_dtype_floating_point(datatype_msg);
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_TIME) throw "Time datatype class not supported.";
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_STRING) return this._determine_dtype_string(datatype_msg);
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_BITFIELD) throw "Bitfield datatype class not supported.";
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_OPAQUE) throw "Opaque datatype class not supported.";
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_COMPOUND) return this._determine_dtype_compound(datatype_msg);
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_REFERENCE) return [
            'REFERENCE',
            datatype_msg.get('size')
        ];
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_ENUMERATED) throw "Enumerated datatype class not supported.";
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_ARRAY) throw "Array datatype class not supported.";
        else if (datatype_class == $831e918c79298dac$var$DATATYPE_VARIABLE_LENGTH) {
            let vlen_type = this._determine_dtype_vlen(datatype_msg);
            if (vlen_type[0] == 'VLEN_SEQUENCE') {
                let base_type = this.determine_dtype();
                vlen_type = [
                    'VLEN_SEQUENCE',
                    base_type
                ];
            }
            return vlen_type;
        } else throw 'Invalid datatype class ' + datatype_class;
    }
    _determine_dtype_fixed_point(datatype_msg) {
        //""" Return the NumPy dtype for a fixed point class. """
        //# fixed-point types are assumed to follow IEEE standard format
        let length_in_bytes = datatype_msg.get('size');
        if (![
            1,
            2,
            4,
            8
        ].includes(length_in_bytes)) throw "Unsupported datatype size";
        let signed = datatype_msg.get('class_bit_field_0') & 8;
        var dtype_char;
        if (signed > 0) dtype_char = 'i';
        else dtype_char = 'u';
        let byte_order = datatype_msg.get('class_bit_field_0') & 1;
        var byte_order_char;
        if (byte_order == 0) byte_order_char = '<'; //# little-endian
        else byte_order_char = '>'; //# big-endian
        //# 4-byte fixed-point property description
        //# not read, assumed to be IEEE standard format
        this.offset += 4;
        return byte_order_char + dtype_char + length_in_bytes.toFixed();
    }
    _determine_dtype_floating_point(datatype_msg1) {
        //""" Return the NumPy dtype for a floating point class. """
        //# Floating point types are assumed to follow IEEE standard formats
        let length_in_bytes = datatype_msg1.get('size');
        if (![
            1,
            2,
            4,
            8
        ].includes(length_in_bytes)) throw "Unsupported datatype size";
        let dtype_char = 'f';
        let byte_order = datatype_msg1.get('class_bit_field_0') & 1;
        var byte_order_char;
        if (byte_order == 0) byte_order_char = '<'; //# little-endian
        else byte_order_char = '>'; //# big-endian
        //# 12-bytes floating-point property description
        //# not read, assumed to be IEEE standard format
        this.offset += 12;
        return byte_order_char + dtype_char + length_in_bytes.toFixed();
    }
    _determine_dtype_string(datatype_msg2) {
        //""" Return the NumPy dtype for a string class. """
        return 'S' + datatype_msg2.get('size').toFixed();
    }
    _determine_dtype_vlen(datatype_msg3) {
        //""" Return the dtype information for a variable length class. """
        let vlen_type = datatype_msg3.get('class_bit_field_0') & 1;
        if (vlen_type != 1) return [
            'VLEN_SEQUENCE',
            0,
            0
        ];
        let padding_type = datatype_msg3.get('class_bit_field_0') >> 4; //# bits 4-7
        let character_set = datatype_msg3.get('class_bit_field_1') & 1;
        return [
            'VLEN_STRING',
            padding_type,
            character_set
        ];
    }
    _determine_dtype_compound(datatype_msg4) {
        throw "not yet implemented!";
    }
    //""" Representation of a HDF5 Datatype Message. """
    //# Contents and layout defined in IV.A.2.d.
    constructor(buf, offset){
        this.buf = buf;
        this.offset = offset;
        this.dtype = this.determine_dtype();
    }
}
var $831e918c79298dac$var$DATATYPE_MSG = new Map([
    [
        'class_and_version',
        'B'
    ],
    [
        'class_bit_field_0',
        'B'
    ],
    [
        'class_bit_field_1',
        'B'
    ],
    [
        'class_bit_field_2',
        'B'
    ],
    [
        'size',
        'I'
    ], 
]);
var $831e918c79298dac$var$DATATYPE_MSG_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($831e918c79298dac$var$DATATYPE_MSG);
var $831e918c79298dac$var$COMPOUND_PROP_DESC_V1 = new Map([
    [
        'offset',
        'I'
    ],
    [
        'dimensionality',
        'B'
    ],
    [
        'reserved_0',
        'B'
    ],
    [
        'reserved_1',
        'B'
    ],
    [
        'reserved_2',
        'B'
    ],
    [
        'permutation',
        'I'
    ],
    [
        'reserved_3',
        'I'
    ],
    [
        'dim_size_1',
        'I'
    ],
    [
        'dim_size_2',
        'I'
    ],
    [
        'dim_size_3',
        'I'
    ],
    [
        'dim_size_4',
        'I'
    ], 
]);
var $831e918c79298dac$var$COMPOUND_PROP_DESC_V1_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($831e918c79298dac$var$COMPOUND_PROP_DESC_V1);
//# Datatype message, datatype classes
var $831e918c79298dac$var$DATATYPE_FIXED_POINT = 0;
var $831e918c79298dac$var$DATATYPE_FLOATING_POINT = 1;
var $831e918c79298dac$var$DATATYPE_TIME = 2;
var $831e918c79298dac$var$DATATYPE_STRING = 3;
var $831e918c79298dac$var$DATATYPE_BITFIELD = 4;
var $831e918c79298dac$var$DATATYPE_OPAQUE = 5;
var $831e918c79298dac$var$DATATYPE_COMPOUND = 6;
var $831e918c79298dac$var$DATATYPE_REFERENCE = 7;
var $831e918c79298dac$var$DATATYPE_ENUMERATED = 8;
var $831e918c79298dac$var$DATATYPE_VARIABLE_LENGTH = 9;
var $831e918c79298dac$var$DATATYPE_ARRAY = 10;





var $aaa7795d9087eacf$var$TYPED_OK = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined';
function $aaa7795d9087eacf$var$_has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function $aaa7795d9087eacf$var$assign(obj /*from1, from2, from3, ...*/ ) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while(sources.length){
        var source = sources.shift();
        if (!source) continue;
        if (typeof source !== 'object') throw new TypeError(source + 'must be non-object');
        for(var p in source)if ($aaa7795d9087eacf$var$_has(source, p)) obj[p] = source[p];
    }
    return obj;
}
// reduce buffer size, avoiding mem copy
function $aaa7795d9087eacf$var$shrinkBuf(buf, size) {
    if (buf.length === size) return buf;
    if (buf.subarray) return buf.subarray(0, size);
    buf.length = size;
    return buf;
}
var $aaa7795d9087eacf$var$fnTyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
            return;
        }
        // Fallback to ordinary array
        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
    },
    // Join array of chunks to single array.
    flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
        // calculate data length
        len = 0;
        for(i = 0, l = chunks.length; i < l; i++)len += chunks[i].length;
        // join chunks
        result = new Uint8Array(len);
        pos = 0;
        for(i = 0, l = chunks.length; i < l; i++){
            chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
        }
        return result;
    }
};
var $aaa7795d9087eacf$var$fnUntyped = {
    arraySet: function(dest, src, src_offs, len, dest_offs) {
        for(var i = 0; i < len; i++)dest[dest_offs + i] = src[src_offs + i];
    },
    // Join array of chunks to single array.
    flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
    }
};
const $aaa7795d9087eacf$var$_exports = {
};
// Enable/Disable typed arrays use, for testing
//
function $aaa7795d9087eacf$var$setTyped(on) {
    if (on) $aaa7795d9087eacf$var$assign($aaa7795d9087eacf$var$_exports, $aaa7795d9087eacf$var$fnTyped, {
        Buf8: Uint8Array,
        Buf16: Uint16Array,
        Buf32: Int32Array
    });
    else $aaa7795d9087eacf$var$assign($aaa7795d9087eacf$var$_exports, $aaa7795d9087eacf$var$fnUntyped, {
        Buf8: Array,
        Buf16: Array,
        Buf32: Array
    });
}
$aaa7795d9087eacf$var$setTyped($aaa7795d9087eacf$var$TYPED_OK);
// assume TYPED_OK
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array#Browser_compatibility
let $aaa7795d9087eacf$var$Buf8 = $aaa7795d9087eacf$var$_exports.Buf8;
let $aaa7795d9087eacf$var$Buf16 = $aaa7795d9087eacf$var$_exports.Buf16;
let $aaa7795d9087eacf$var$Buf32 = $aaa7795d9087eacf$var$_exports.Buf32;
let $aaa7795d9087eacf$var$arraySet = $aaa7795d9087eacf$var$_exports.arraySet;
let $aaa7795d9087eacf$var$flattenChunks = $aaa7795d9087eacf$var$_exports.flattenChunks;
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
/* Public constants ==========================================================*/ /* ===========================================================================*/ //var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var $aaa7795d9087eacf$var$Z_FIXED = 4;
//var Z_DEFAULT_STRATEGY  = 0;
/* Possible values of the data_type field (though see inflate()) */ var $aaa7795d9087eacf$var$Z_BINARY = 0;
var $aaa7795d9087eacf$var$Z_TEXT = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var $aaa7795d9087eacf$var$Z_UNKNOWN = 2;
/*============================================================================*/ function $aaa7795d9087eacf$var$zero(buf) {
    var len = buf.length;
    while(--len >= 0)buf[len] = 0;
}
// From zutil.h
var $aaa7795d9087eacf$var$STORED_BLOCK = 0;
var $aaa7795d9087eacf$var$STATIC_TREES = 1;
var $aaa7795d9087eacf$var$DYN_TREES = 2;
/* The three kinds of block type */ var $aaa7795d9087eacf$var$MIN_MATCH = 3;
var $aaa7795d9087eacf$var$MAX_MATCH = 258;
/* The minimum and maximum match lengths */ // From deflate.h
/* ===========================================================================
 * Internal compression state.
 */ var $aaa7795d9087eacf$var$LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */ var $aaa7795d9087eacf$var$LITERALS = 256;
/* number of literal bytes 0..255 */ var $aaa7795d9087eacf$var$L_CODES = $aaa7795d9087eacf$var$LITERALS + 1 + $aaa7795d9087eacf$var$LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */ var $aaa7795d9087eacf$var$D_CODES = 30;
/* number of distance codes */ var $aaa7795d9087eacf$var$BL_CODES = 19;
/* number of codes used to transfer the bit lengths */ var $aaa7795d9087eacf$var$HEAP_SIZE = 2 * $aaa7795d9087eacf$var$L_CODES + 1;
/* maximum heap size */ var $aaa7795d9087eacf$var$MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */ var $aaa7795d9087eacf$var$Buf_size = 16;
/* size of bit buffer in bi_buf */ /* ===========================================================================
 * Constants
 */ var $aaa7795d9087eacf$var$MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */ var $aaa7795d9087eacf$var$END_BLOCK = 256;
/* end of block literal code */ var $aaa7795d9087eacf$var$REP_3_6 = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */ var $aaa7795d9087eacf$var$REPZ_3_10 = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */ var $aaa7795d9087eacf$var$REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */ /* eslint-disable comma-spacing,array-bracket-spacing */ var $aaa7795d9087eacf$var$extra_lbits = /* extra bits for each length code */ [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0
];
var $aaa7795d9087eacf$var$extra_dbits = /* extra bits for each distance code */ [
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
];
var $aaa7795d9087eacf$var$extra_blbits = /* extra bits for each bit length code */ [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2,
    3,
    7
];
var $aaa7795d9087eacf$var$bl_order = [
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
];
/* eslint-enable comma-spacing,array-bracket-spacing */ /* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */ /* ===========================================================================
 * Local data. These are initialized only once.
 */ // We pre-fill arrays with 0 to avoid uninitialized gaps
var $aaa7795d9087eacf$var$DIST_CODE_LEN = 512; /* see definition of array dist_code below */ 
// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
var $aaa7795d9087eacf$var$static_ltree = new Array(($aaa7795d9087eacf$var$L_CODES + 2) * 2);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */ var $aaa7795d9087eacf$var$static_dtree = new Array($aaa7795d9087eacf$var$D_CODES * 2);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */ var $aaa7795d9087eacf$var$_dist_code = new Array($aaa7795d9087eacf$var$DIST_CODE_LEN);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */ var $aaa7795d9087eacf$var$_length_code = new Array($aaa7795d9087eacf$var$MAX_MATCH - $aaa7795d9087eacf$var$MIN_MATCH + 1);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */ var $aaa7795d9087eacf$var$base_length = new Array($aaa7795d9087eacf$var$LENGTH_CODES);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$base_length);
/* First normalized length for each code (0 = MIN_MATCH) */ var $aaa7795d9087eacf$var$base_dist = new Array($aaa7795d9087eacf$var$D_CODES);
$aaa7795d9087eacf$var$zero($aaa7795d9087eacf$var$base_dist);
/* First normalized distance for each code (0 = distance of 1) */ function $aaa7795d9087eacf$var$StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree; /* static tree or NULL */ 
    this.extra_bits = extra_bits; /* extra bits for each code or NULL */ 
    this.extra_base = extra_base; /* base index for extra_bits */ 
    this.elems = elems; /* max number of elements in the tree */ 
    this.max_length = max_length; /* max bit length for the codes */ 
    // show if `static_tree` has data or dummy - needed for monomorphic objects
    this.has_stree = static_tree && static_tree.length;
}
var $aaa7795d9087eacf$var$static_l_desc;
var $aaa7795d9087eacf$var$static_d_desc;
var $aaa7795d9087eacf$var$static_bl_desc;
function $aaa7795d9087eacf$var$TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree; /* the dynamic tree */ 
    this.max_code = 0; /* largest code with non zero frequency */ 
    this.stat_desc = stat_desc; /* the corresponding static tree */ 
}
function $aaa7795d9087eacf$var$d_code(dist) {
    return dist < 256 ? $aaa7795d9087eacf$var$_dist_code[dist] : $aaa7795d9087eacf$var$_dist_code[256 + (dist >>> 7)];
}
/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */ function $aaa7795d9087eacf$var$put_short(s, w) {
    //    put_byte(s, (uch)((w) & 0xff));
    //    put_byte(s, (uch)((ush)(w) >> 8));
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
}
/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */ function $aaa7795d9087eacf$var$send_bits(s, value, length) {
    if (s.bi_valid > $aaa7795d9087eacf$var$Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        $aaa7795d9087eacf$var$put_short(s, s.bi_buf);
        s.bi_buf = value >> $aaa7795d9087eacf$var$Buf_size - s.bi_valid;
        s.bi_valid += length - $aaa7795d9087eacf$var$Buf_size;
    } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
    }
}
function $aaa7795d9087eacf$var$send_code(s, c, tree) {
    $aaa7795d9087eacf$var$send_bits(s, tree[c * 2], tree[c * 2 + 1]);
}
/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */ function $aaa7795d9087eacf$var$bi_reverse(code, len) {
    var res = 0;
    do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
    }while (--len > 0)
    return res >>> 1;
}
/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */ function $aaa7795d9087eacf$var$bi_flush(s) {
    if (s.bi_valid === 16) {
        $aaa7795d9087eacf$var$put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
    }
}
/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */ function $aaa7795d9087eacf$var$gen_bitlen(s, desc) //    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var extra = desc.stat_desc.extra_bits;
    var base = desc.stat_desc.extra_base;
    var max_length = desc.stat_desc.max_length;
    var h; /* heap index */ 
    var n, m; /* iterate over the tree elements */ 
    var bits; /* bit length */ 
    var xbits; /* extra bits */ 
    var f; /* frequency */ 
    var overflow = 0; /* number of elements with bit length too large */ 
    for(bits = 0; bits <= $aaa7795d9087eacf$var$MAX_BITS; bits++)s.bl_count[bits] = 0;
    /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */ tree[s.heap[s.heap_max] * 2 + 1] = 0; /* root of the heap */ 
    for(h = s.heap_max + 1; h < $aaa7795d9087eacf$var$HEAP_SIZE; h++){
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
            bits = max_length;
            overflow++;
        }
        tree[n * 2 + 1] = bits;
        /* We overwrite tree[n].Dad which is no longer needed */ if (n > max_code) continue;
         /* not a leaf node */ 
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) xbits = extra[n - base];
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
    }
    if (overflow === 0) return;
    // Trace((stderr,"\nbit length overflow\n"));
    /* This happens for example on obj2 and pic of the Calgary corpus */ /* Find the first bit length which could increase: */ do {
        bits = max_length - 1;
        while(s.bl_count[bits] === 0)bits--;
        s.bl_count[bits]--; /* move one leaf down the tree */ 
        s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */ 
        s.bl_count[max_length]--;
        /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */ overflow -= 2;
    }while (overflow > 0)
    /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */ for(bits = max_length; bits !== 0; bits--){
        n = s.bl_count[bits];
        while(n !== 0){
            m = s.heap[--h];
            if (m > max_code) continue;
            if (tree[m * 2 + 1] !== bits) {
                // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
                s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
                tree[m * 2 + 1] = bits;
            }
            n--;
        }
    }
}
/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */ function $aaa7795d9087eacf$var$gen_codes(tree, max_code, bl_count) //    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
    var next_code = new Array($aaa7795d9087eacf$var$MAX_BITS + 1); /* next code value for each bit length */ 
    var code = 0; /* running code value */ 
    var bits; /* bit index */ 
    var n; /* code index */ 
    /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */ for(bits = 1; bits <= $aaa7795d9087eacf$var$MAX_BITS; bits++)next_code[bits] = code = code + bl_count[bits - 1] << 1;
    /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */ //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
    //        "inconsistent bit counts");
    //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
    for(n = 0; n <= max_code; n++){
        var len = tree[n * 2 + 1];
        if (len === 0) continue;
        /* Now reverse the bits */ tree[n * 2] = $aaa7795d9087eacf$var$bi_reverse(next_code[len]++, len);
    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
    }
}
/* ===========================================================================
 * Initialize the various 'constant' tables.
 */ function $aaa7795d9087eacf$var$tr_static_init() {
    var n; /* iterates over tree elements */ 
    var bits; /* bit counter */ 
    var length; /* length value */ 
    var code; /* code value */ 
    var dist; /* distance index */ 
    var bl_count = new Array($aaa7795d9087eacf$var$MAX_BITS + 1);
    /* number of codes at each bit length for an optimal tree */ // do check in _tr_init()
    //if (static_init_done) return;
    /* For some embedded targets, global variables are not initialized: */ /*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/ /* Initialize the mapping length (0..255) -> length code (0..28) */ length = 0;
    for(code = 0; code < $aaa7795d9087eacf$var$LENGTH_CODES - 1; code++){
        $aaa7795d9087eacf$var$base_length[code] = length;
        for(n = 0; n < 1 << $aaa7795d9087eacf$var$extra_lbits[code]; n++)$aaa7795d9087eacf$var$_length_code[length++] = code;
    }
    //Assert (length == 256, "tr_static_init: length != 256");
    /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */ $aaa7795d9087eacf$var$_length_code[length - 1] = code;
    /* Initialize the mapping dist (0..32K) -> dist code (0..29) */ dist = 0;
    for(code = 0; code < 16; code++){
        $aaa7795d9087eacf$var$base_dist[code] = dist;
        for(n = 0; n < 1 << $aaa7795d9087eacf$var$extra_dbits[code]; n++)$aaa7795d9087eacf$var$_dist_code[dist++] = code;
    }
    //Assert (dist == 256, "tr_static_init: dist != 256");
    dist >>= 7; /* from now on, all distances are divided by 128 */ 
    for(; code < $aaa7795d9087eacf$var$D_CODES; code++){
        $aaa7795d9087eacf$var$base_dist[code] = dist << 7;
        for(n = 0; n < 1 << $aaa7795d9087eacf$var$extra_dbits[code] - 7; n++)$aaa7795d9087eacf$var$_dist_code[256 + dist++] = code;
    }
    //Assert (dist == 256, "tr_static_init: 256+dist != 512");
    /* Construct the codes of the static literal tree */ for(bits = 0; bits <= $aaa7795d9087eacf$var$MAX_BITS; bits++)bl_count[bits] = 0;
    n = 0;
    while(n <= 143){
        $aaa7795d9087eacf$var$static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    while(n <= 255){
        $aaa7795d9087eacf$var$static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
    }
    while(n <= 279){
        $aaa7795d9087eacf$var$static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
    }
    while(n <= 287){
        $aaa7795d9087eacf$var$static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
    }
    /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */ $aaa7795d9087eacf$var$gen_codes($aaa7795d9087eacf$var$static_ltree, $aaa7795d9087eacf$var$L_CODES + 1, bl_count);
    /* The static distance tree is trivial: */ for(n = 0; n < $aaa7795d9087eacf$var$D_CODES; n++){
        $aaa7795d9087eacf$var$static_dtree[n * 2 + 1] = 5;
        $aaa7795d9087eacf$var$static_dtree[n * 2] = $aaa7795d9087eacf$var$bi_reverse(n, 5);
    }
    // Now data ready and we can init static trees
    $aaa7795d9087eacf$var$static_l_desc = new $aaa7795d9087eacf$var$StaticTreeDesc($aaa7795d9087eacf$var$static_ltree, $aaa7795d9087eacf$var$extra_lbits, $aaa7795d9087eacf$var$LITERALS + 1, $aaa7795d9087eacf$var$L_CODES, $aaa7795d9087eacf$var$MAX_BITS);
    $aaa7795d9087eacf$var$static_d_desc = new $aaa7795d9087eacf$var$StaticTreeDesc($aaa7795d9087eacf$var$static_dtree, $aaa7795d9087eacf$var$extra_dbits, 0, $aaa7795d9087eacf$var$D_CODES, $aaa7795d9087eacf$var$MAX_BITS);
    $aaa7795d9087eacf$var$static_bl_desc = new $aaa7795d9087eacf$var$StaticTreeDesc(new Array(0), $aaa7795d9087eacf$var$extra_blbits, 0, $aaa7795d9087eacf$var$BL_CODES, $aaa7795d9087eacf$var$MAX_BL_BITS);
//static_init_done = true;
}
/* ===========================================================================
 * Initialize a new block.
 */ function $aaa7795d9087eacf$var$init_block(s) {
    var n; /* iterates over tree elements */ 
    /* Initialize the trees. */ for(n = 0; n < $aaa7795d9087eacf$var$L_CODES; n++)s.dyn_ltree[n * 2] = 0;
    for(n = 0; n < $aaa7795d9087eacf$var$D_CODES; n++)s.dyn_dtree[n * 2] = 0;
    for(n = 0; n < $aaa7795d9087eacf$var$BL_CODES; n++)s.bl_tree[n * 2] = 0;
    s.dyn_ltree[$aaa7795d9087eacf$var$END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.last_lit = s.matches = 0;
}
/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */ function $aaa7795d9087eacf$var$bi_windup(s) {
    if (s.bi_valid > 8) $aaa7795d9087eacf$var$put_short(s, s.bi_buf);
    else if (s.bi_valid > 0) //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
    s.bi_buf = 0;
    s.bi_valid = 0;
}
/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */ function $aaa7795d9087eacf$var$copy_block(s, buf, len, header) //DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
    $aaa7795d9087eacf$var$bi_windup(s); /* align on byte boundary */ 
    if (header) {
        $aaa7795d9087eacf$var$put_short(s, len);
        $aaa7795d9087eacf$var$put_short(s, ~len);
    }
    //  while (len--) {
    //    put_byte(s, *buf++);
    //  }
    $aaa7795d9087eacf$var$arraySet(s.pending_buf, s.window, buf, len, s.pending);
    s.pending += len;
}
/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */ function $aaa7795d9087eacf$var$smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
}
/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */ function $aaa7795d9087eacf$var$pqdownheap(s, tree, k) //    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
    var v = s.heap[k];
    var j = k << 1; /* left son of k */ 
    while(j <= s.heap_len){
        /* Set j to the smallest of the two sons: */ if (j < s.heap_len && $aaa7795d9087eacf$var$smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) j++;
        /* Exit if v is smaller than both sons */ if ($aaa7795d9087eacf$var$smaller(tree, v, s.heap[j], s.depth)) break;
        /* Exchange v with the smallest son */ s.heap[k] = s.heap[j];
        k = j;
        /* And continue down the tree, setting j to the left son of k */ j <<= 1;
    }
    s.heap[k] = v;
}
// inlined manually
// var SMALLEST = 1;
/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */ function $aaa7795d9087eacf$var$compress_block(s, ltree, dtree) //    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
    var dist; /* distance of matched string */ 
    var lc; /* match length or unmatched char (if dist == 0) */ 
    var lx = 0; /* running index in l_buf */ 
    var code; /* the code to send */ 
    var extra; /* number of extra bits to send */ 
    if (s.last_lit !== 0) do {
        dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
        lc = s.pending_buf[s.l_buf + lx];
        lx++;
        if (dist === 0) $aaa7795d9087eacf$var$send_code(s, lc, ltree); /* send a literal byte */ 
        else {
            /* Here, lc is the match length - MIN_MATCH */ code = $aaa7795d9087eacf$var$_length_code[lc];
            $aaa7795d9087eacf$var$send_code(s, code + $aaa7795d9087eacf$var$LITERALS + 1, ltree); /* send the length code */ 
            extra = $aaa7795d9087eacf$var$extra_lbits[code];
            if (extra !== 0) {
                lc -= $aaa7795d9087eacf$var$base_length[code];
                $aaa7795d9087eacf$var$send_bits(s, lc, extra); /* send the extra length bits */ 
            }
            dist--; /* dist is now the match distance - 1 */ 
            code = $aaa7795d9087eacf$var$d_code(dist);
            //Assert (code < D_CODES, "bad d_code");
            $aaa7795d9087eacf$var$send_code(s, code, dtree); /* send the distance code */ 
            extra = $aaa7795d9087eacf$var$extra_dbits[code];
            if (extra !== 0) {
                dist -= $aaa7795d9087eacf$var$base_dist[code];
                $aaa7795d9087eacf$var$send_bits(s, dist, extra); /* send the extra distance bits */ 
            }
        } /* literal or match pair ? */ 
    /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */ //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
    //       "pendingBuf overflow");
    }while (lx < s.last_lit)
    $aaa7795d9087eacf$var$send_code(s, $aaa7795d9087eacf$var$END_BLOCK, ltree);
}
/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */ function $aaa7795d9087eacf$var$build_tree(s, desc) //    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
    var tree = desc.dyn_tree;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var elems = desc.stat_desc.elems;
    var n, m; /* iterate over heap elements */ 
    var max_code = -1; /* largest code with non zero frequency */ 
    var node; /* new node being created */ 
    /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */ s.heap_len = 0;
    s.heap_max = $aaa7795d9087eacf$var$HEAP_SIZE;
    for(n = 0; n < elems; n++)if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
    } else tree[n * 2 + 1] = 0;
    /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */ while(s.heap_len < 2){
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) s.static_len -= stree[node * 2 + 1];
    /* node is 0 or 1 so it does not have extra bits */ }
    desc.max_code = max_code;
    /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */ for(n = s.heap_len >> 1 /*int /2*/ ; n >= 1; n--)$aaa7795d9087eacf$var$pqdownheap(s, tree, n);
    /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */ node = elems; /* next internal node of the tree */ 
    do {
        //pqremove(s, tree, n);  /* n = node of least frequency */
        /*** pqremove ***/ n = s.heap[1 /*SMALLEST*/ ];
        s.heap[1 /*SMALLEST*/ ] = s.heap[s.heap_len--];
        $aaa7795d9087eacf$var$pqdownheap(s, tree, 1 /*SMALLEST*/ );
        /***/ m = s.heap[1 /*SMALLEST*/ ]; /* m = node of next least frequency */ 
        s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */ 
        s.heap[--s.heap_max] = m;
        /* Create a new node father of n and m */ tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        /* and insert the new node in the heap */ s.heap[1 /*SMALLEST*/ ] = node++;
        $aaa7795d9087eacf$var$pqdownheap(s, tree, 1 /*SMALLEST*/ );
    }while (s.heap_len >= 2)
    s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/ ];
    /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */ $aaa7795d9087eacf$var$gen_bitlen(s, desc);
    /* The field len is now set, we can generate the bit codes */ $aaa7795d9087eacf$var$gen_codes(tree, max_code, s.bl_count);
}
/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */ function $aaa7795d9087eacf$var$scan_tree(s, tree, max_code) //    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
    var n; /* iterates over all tree elements */ 
    var prevlen = -1; /* last emitted length */ 
    var curlen; /* length of current code */ 
    var nextlen = tree[1]; /* length of next code */ 
    var count = 0; /* repeat count of the current code */ 
    var max_count = 7; /* max repeat count */ 
    var min_count = 4; /* min repeat count */ 
    if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535; /* guard */ 
    for(n = 0; n <= max_code; n++){
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) continue;
        else if (count < min_count) s.bl_tree[curlen * 2] += count;
        else if (curlen !== 0) {
            if (curlen !== prevlen) s.bl_tree[curlen * 2]++;
            s.bl_tree[$aaa7795d9087eacf$var$REP_3_6 * 2]++;
        } else if (count <= 10) s.bl_tree[$aaa7795d9087eacf$var$REPZ_3_10 * 2]++;
        else s.bl_tree[$aaa7795d9087eacf$var$REPZ_11_138 * 2]++;
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        } else {
            max_count = 7;
            min_count = 4;
        }
    }
}
/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */ function $aaa7795d9087eacf$var$send_tree(s, tree, max_code) //    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
    var n; /* iterates over all tree elements */ 
    var prevlen = -1; /* last emitted length */ 
    var curlen; /* length of current code */ 
    var nextlen = tree[1]; /* length of next code */ 
    var count = 0; /* repeat count of the current code */ 
    var max_count = 7; /* max repeat count */ 
    var min_count = 4; /* min repeat count */ 
    /* tree[max_code+1].Len = -1; */ /* guard already set */ if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
    }
    for(n = 0; n <= max_code; n++){
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) continue;
        else if (count < min_count) do $aaa7795d9087eacf$var$send_code(s, curlen, s.bl_tree);
        while (--count !== 0)
        else if (curlen !== 0) {
            if (curlen !== prevlen) {
                $aaa7795d9087eacf$var$send_code(s, curlen, s.bl_tree);
                count--;
            }
            //Assert(count >= 3 && count <= 6, " 3_6?");
            $aaa7795d9087eacf$var$send_code(s, $aaa7795d9087eacf$var$REP_3_6, s.bl_tree);
            $aaa7795d9087eacf$var$send_bits(s, count - 3, 2);
        } else if (count <= 10) {
            $aaa7795d9087eacf$var$send_code(s, $aaa7795d9087eacf$var$REPZ_3_10, s.bl_tree);
            $aaa7795d9087eacf$var$send_bits(s, count - 3, 3);
        } else {
            $aaa7795d9087eacf$var$send_code(s, $aaa7795d9087eacf$var$REPZ_11_138, s.bl_tree);
            $aaa7795d9087eacf$var$send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
        } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
        } else {
            max_count = 7;
            min_count = 4;
        }
    }
}
/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */ function $aaa7795d9087eacf$var$build_bl_tree(s) {
    var max_blindex; /* index of last bit length code of non zero freq */ 
    /* Determine the bit length frequencies for literal and distance trees */ $aaa7795d9087eacf$var$scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    $aaa7795d9087eacf$var$scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    /* Build the bit length tree: */ $aaa7795d9087eacf$var$build_tree(s, s.bl_desc);
    /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */ /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */ for(max_blindex = $aaa7795d9087eacf$var$BL_CODES - 1; max_blindex >= 3; max_blindex--){
        if (s.bl_tree[$aaa7795d9087eacf$var$bl_order[max_blindex] * 2 + 1] !== 0) break;
    }
    /* Update opt_len to include the bit length tree and counts */ s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
    //        s->opt_len, s->static_len));
    return max_blindex;
}
/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */ function $aaa7795d9087eacf$var$send_all_trees(s, lcodes, dcodes, blcodes) //    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
    var rank; /* index in bl_order */ 
    //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
    //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
    //        "too many codes");
    //Tracev((stderr, "\nbl counts: "));
    $aaa7795d9087eacf$var$send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */ 
    $aaa7795d9087eacf$var$send_bits(s, dcodes - 1, 5);
    $aaa7795d9087eacf$var$send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */ 
    for(rank = 0; rank < blcodes; rank++)//Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    $aaa7795d9087eacf$var$send_bits(s, s.bl_tree[$aaa7795d9087eacf$var$bl_order[rank] * 2 + 1], 3);
    //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
    $aaa7795d9087eacf$var$send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */ 
    //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
    $aaa7795d9087eacf$var$send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */ 
//Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}
/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */ function $aaa7795d9087eacf$var$detect_data_type(s) {
    /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */ var black_mask = 4093624447;
    var n;
    /* Check for non-textual ("black-listed") bytes. */ for(n = 0; n <= 31; n++, black_mask >>>= 1){
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) return $aaa7795d9087eacf$var$Z_BINARY;
    }
    /* Check for textual ("white-listed") bytes. */ if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return $aaa7795d9087eacf$var$Z_TEXT;
    for(n = 32; n < $aaa7795d9087eacf$var$LITERALS; n++){
        if (s.dyn_ltree[n * 2] !== 0) return $aaa7795d9087eacf$var$Z_TEXT;
    }
    /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */ return $aaa7795d9087eacf$var$Z_BINARY;
}
var $aaa7795d9087eacf$var$static_init_done = false;
/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */ function $aaa7795d9087eacf$var$_tr_init(s) {
    if (!$aaa7795d9087eacf$var$static_init_done) {
        $aaa7795d9087eacf$var$tr_static_init();
        $aaa7795d9087eacf$var$static_init_done = true;
    }
    s.l_desc = new $aaa7795d9087eacf$var$TreeDesc(s.dyn_ltree, $aaa7795d9087eacf$var$static_l_desc);
    s.d_desc = new $aaa7795d9087eacf$var$TreeDesc(s.dyn_dtree, $aaa7795d9087eacf$var$static_d_desc);
    s.bl_desc = new $aaa7795d9087eacf$var$TreeDesc(s.bl_tree, $aaa7795d9087eacf$var$static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    /* Initialize the first block of the first file: */ $aaa7795d9087eacf$var$init_block(s);
}
/* ===========================================================================
 * Send a stored block
 */ function $aaa7795d9087eacf$var$_tr_stored_block(s, buf, stored_len, last) //DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
    $aaa7795d9087eacf$var$send_bits(s, ($aaa7795d9087eacf$var$STORED_BLOCK << 1) + (last ? 1 : 0), 3); /* send block type */ 
    $aaa7795d9087eacf$var$copy_block(s, buf, stored_len, true); /* with header */ 
}
/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */ function $aaa7795d9087eacf$var$_tr_align(s) {
    $aaa7795d9087eacf$var$send_bits(s, $aaa7795d9087eacf$var$STATIC_TREES << 1, 3);
    $aaa7795d9087eacf$var$send_code(s, $aaa7795d9087eacf$var$END_BLOCK, $aaa7795d9087eacf$var$static_ltree);
    $aaa7795d9087eacf$var$bi_flush(s);
}
/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */ function $aaa7795d9087eacf$var$_tr_flush_block(s, buf, stored_len, last) //DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
    var opt_lenb, static_lenb; /* opt_len and static_len in bytes */ 
    var max_blindex = 0; /* index of last bit length code of non zero freq */ 
    /* Build the Huffman trees unless a stored block is forced */ if (s.level > 0) {
        /* Check if the file is binary or text */ if (s.strm.data_type === $aaa7795d9087eacf$var$Z_UNKNOWN) s.strm.data_type = $aaa7795d9087eacf$var$detect_data_type(s);
        /* Construct the literal and distance trees */ $aaa7795d9087eacf$var$build_tree(s, s.l_desc);
        // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
        //        s->static_len));
        $aaa7795d9087eacf$var$build_tree(s, s.d_desc);
        // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
        //        s->static_len));
        /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */ /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */ max_blindex = $aaa7795d9087eacf$var$build_bl_tree(s);
        /* Determine the best encoding. Compute the block lengths in bytes. */ opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
        //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
        //        s->last_lit));
        if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
    } else // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */ 
    if (stored_len + 4 <= opt_lenb && buf !== -1) /* 4: two words for the lengths */ /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */ $aaa7795d9087eacf$var$_tr_stored_block(s, buf, stored_len, last);
    else if (s.strategy === $aaa7795d9087eacf$var$Z_FIXED || static_lenb === opt_lenb) {
        $aaa7795d9087eacf$var$send_bits(s, ($aaa7795d9087eacf$var$STATIC_TREES << 1) + (last ? 1 : 0), 3);
        $aaa7795d9087eacf$var$compress_block(s, $aaa7795d9087eacf$var$static_ltree, $aaa7795d9087eacf$var$static_dtree);
    } else {
        $aaa7795d9087eacf$var$send_bits(s, ($aaa7795d9087eacf$var$DYN_TREES << 1) + (last ? 1 : 0), 3);
        $aaa7795d9087eacf$var$send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        $aaa7795d9087eacf$var$compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
    /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */ $aaa7795d9087eacf$var$init_block(s);
    if (last) $aaa7795d9087eacf$var$bi_windup(s);
// Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
//       s->compressed_len-7*last));
}
/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */ function $aaa7795d9087eacf$var$_tr_tally(s, dist, lc) //    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
    //var out_length, in_length, dcode;
    s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
    s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
    s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
    s.last_lit++;
    if (dist === 0) /* lc is the unmatched char */ s.dyn_ltree[lc * 2]++;
    else {
        s.matches++;
        /* Here, lc is the match length - MIN_MATCH */ dist--; /* dist = match distance - 1 */ 
        //Assert((ush)dist < (ush)MAX_DIST(s) &&
        //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
        //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
        s.dyn_ltree[($aaa7795d9087eacf$var$_length_code[lc] + $aaa7795d9087eacf$var$LITERALS + 1) * 2]++;
        s.dyn_dtree[$aaa7795d9087eacf$var$d_code(dist) * 2]++;
    }
    // (!) This block is disabled in zlib defaults,
    // don't enable it for binary compatibility
    //#ifdef TRUNCATE_BLOCK
    //  /* Try to guess if it is profitable to stop the current block here */
    //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
    //    /* Compute an upper bound for the compressed length */
    //    out_length = s.last_lit*8;
    //    in_length = s.strstart - s.block_start;
    //
    //    for (dcode = 0; dcode < D_CODES; dcode++) {
    //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
    //    }
    //    out_length >>>= 3;
    //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
    //    //       s->last_lit, in_length, out_length,
    //    //       100L - out_length*100L/in_length));
    //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
    //      return true;
    //    }
    //  }
    //#endif
    return s.last_lit === s.lit_bufsize - 1;
/* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */ }
// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function $aaa7795d9087eacf$var$adler32(adler, buf, len, pos) {
    var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while(len !== 0){
        // Set limit ~ twice less than 5552, to keep
        // s2 in 31-bits, because we force signed ints.
        // in other case %= will fail.
        n = len > 2000 ? 2000 : len;
        len -= n;
        do {
            s1 = s1 + buf[pos++] | 0;
            s2 = s2 + s1 | 0;
        }while (--n)
        s1 %= 65521;
        s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
}
// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// Use ordinary array, since untyped makes no boost here
function $aaa7795d9087eacf$var$makeTable() {
    var c, table = [];
    for(var n = 0; n < 256; n++){
        c = n;
        for(var k = 0; k < 8; k++)c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        table[n] = c;
    }
    return table;
}
// Create table on load. Just 255 signed longs. Not a problem.
var $aaa7795d9087eacf$var$crcTable = $aaa7795d9087eacf$var$makeTable();
function $aaa7795d9087eacf$var$crc32(crc, buf, len, pos) {
    var t = $aaa7795d9087eacf$var$crcTable, end = pos + len;
    crc ^= -1;
    for(var i = pos; i < end; i++)crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    return crc ^ -1; // >>> 0;
}
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
var $aaa7795d9087eacf$var$msg = {
    2: 'need dictionary',
    /* Z_NEED_DICT       2  */ 1: 'stream end',
    /* Z_STREAM_END      1  */ 0: '',
    /* Z_OK              0  */ '-1': 'file error',
    /* Z_ERRNO         (-1) */ '-2': 'stream error',
    /* Z_STREAM_ERROR  (-2) */ '-3': 'data error',
    /* Z_DATA_ERROR    (-3) */ '-4': 'insufficient memory',
    /* Z_MEM_ERROR     (-4) */ '-5': 'buffer error',
    /* Z_BUF_ERROR     (-5) */ '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */ 
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
/* Public constants ==========================================================*/ /* ===========================================================================*/ /* Allowed flush values; see deflate() and inflate() below for details */ var $aaa7795d9087eacf$var$Z_NO_FLUSH = 0;
var $aaa7795d9087eacf$var$Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var $aaa7795d9087eacf$var$Z_FULL_FLUSH = 3;
var $aaa7795d9087eacf$var$Z_FINISH = 4;
var $aaa7795d9087eacf$var$Z_BLOCK = 5;
//var Z_TREES         = 6;
/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */ var $aaa7795d9087eacf$var$Z_OK = 0;
var $aaa7795d9087eacf$var$Z_STREAM_END = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var $aaa7795d9087eacf$var$Z_STREAM_ERROR = -2;
var $aaa7795d9087eacf$var$Z_DATA_ERROR = -3;
//var Z_MEM_ERROR     = -4;
var $aaa7795d9087eacf$var$Z_BUF_ERROR = -5;
//var Z_VERSION_ERROR = -6;
/* compression levels */ //var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var $aaa7795d9087eacf$var$Z_DEFAULT_COMPRESSION = -1;
var $aaa7795d9087eacf$var$Z_FILTERED = 1;
var $aaa7795d9087eacf$var$Z_HUFFMAN_ONLY = 2;
var $aaa7795d9087eacf$var$Z_RLE = 3;
var $aaa7795d9087eacf$var$Z_FIXED$1 = 4;
/* Possible values of the data_type field (though see inflate()) */ //var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var $aaa7795d9087eacf$var$Z_UNKNOWN$1 = 2;
/* The deflate compression method */ var $aaa7795d9087eacf$var$Z_DEFLATED = 8;
/*============================================================================*/ var $aaa7795d9087eacf$var$MAX_MEM_LEVEL = 9;
var $aaa7795d9087eacf$var$LENGTH_CODES$1 = 29;
/* number of length codes, not counting the special END_BLOCK code */ var $aaa7795d9087eacf$var$LITERALS$1 = 256;
/* number of literal bytes 0..255 */ var $aaa7795d9087eacf$var$L_CODES$1 = $aaa7795d9087eacf$var$LITERALS$1 + 1 + $aaa7795d9087eacf$var$LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */ var $aaa7795d9087eacf$var$D_CODES$1 = 30;
/* number of distance codes */ var $aaa7795d9087eacf$var$BL_CODES$1 = 19;
/* number of codes used to transfer the bit lengths */ var $aaa7795d9087eacf$var$HEAP_SIZE$1 = 2 * $aaa7795d9087eacf$var$L_CODES$1 + 1;
/* maximum heap size */ var $aaa7795d9087eacf$var$MAX_BITS$1 = 15;
/* All codes must not exceed MAX_BITS bits */ var $aaa7795d9087eacf$var$MIN_MATCH$1 = 3;
var $aaa7795d9087eacf$var$MAX_MATCH$1 = 258;
var $aaa7795d9087eacf$var$MIN_LOOKAHEAD = $aaa7795d9087eacf$var$MAX_MATCH$1 + $aaa7795d9087eacf$var$MIN_MATCH$1 + 1;
var $aaa7795d9087eacf$var$PRESET_DICT = 32;
var $aaa7795d9087eacf$var$INIT_STATE = 42;
var $aaa7795d9087eacf$var$EXTRA_STATE = 69;
var $aaa7795d9087eacf$var$NAME_STATE = 73;
var $aaa7795d9087eacf$var$COMMENT_STATE = 91;
var $aaa7795d9087eacf$var$HCRC_STATE = 103;
var $aaa7795d9087eacf$var$BUSY_STATE = 113;
var $aaa7795d9087eacf$var$FINISH_STATE = 666;
var $aaa7795d9087eacf$var$BS_NEED_MORE = 1; /* block not completed, need more input or more output */ 
var $aaa7795d9087eacf$var$BS_BLOCK_DONE = 2; /* block flush performed */ 
var $aaa7795d9087eacf$var$BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */ 
var $aaa7795d9087eacf$var$BS_FINISH_DONE = 4; /* finish done, accept no more input or output */ 
var $aaa7795d9087eacf$var$OS_CODE = 3; // Unix :) . Don't detect, use this default.
function $aaa7795d9087eacf$var$err(strm, errorCode) {
    strm.msg = $aaa7795d9087eacf$var$msg[errorCode];
    return errorCode;
}
function $aaa7795d9087eacf$var$rank(f) {
    return (f << 1) - (f > 4 ? 9 : 0);
}
function $aaa7795d9087eacf$var$zero$1(buf) {
    var len = buf.length;
    while(--len >= 0)buf[len] = 0;
}
/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */ function $aaa7795d9087eacf$var$flush_pending(strm) {
    var s = strm.state;
    //_tr_flush_bits(s);
    var len = s.pending;
    if (len > strm.avail_out) len = strm.avail_out;
    if (len === 0) return;
    $aaa7795d9087eacf$var$arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) s.pending_out = 0;
}
function $aaa7795d9087eacf$var$flush_block_only(s, last) {
    $aaa7795d9087eacf$var$_tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    $aaa7795d9087eacf$var$flush_pending(s.strm);
}
function $aaa7795d9087eacf$var$put_byte(s, b) {
    s.pending_buf[s.pending++] = b;
}
/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */ function $aaa7795d9087eacf$var$putShortMSB(s, b) {
    //  put_byte(s, (Byte)(b >> 8));
    //  put_byte(s, (Byte)(b & 0xff));
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
}
/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */ function $aaa7795d9087eacf$var$read_buf(strm, buf, start, size) {
    var len = strm.avail_in;
    if (len > size) len = size;
    if (len === 0) return 0;
    strm.avail_in -= len;
    // zmemcpy(buf, strm->next_in, len);
    $aaa7795d9087eacf$var$arraySet(buf, strm.input, strm.next_in, len, start);
    if (strm.state.wrap === 1) strm.adler = $aaa7795d9087eacf$var$adler32(strm.adler, buf, len, start);
    else if (strm.state.wrap === 2) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, buf, len, start);
    strm.next_in += len;
    strm.total_in += len;
    return len;
}
/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */ function $aaa7795d9087eacf$var$longest_match(s, cur_match) {
    var chain_length = s.max_chain_length; /* max hash chain length */ 
    var scan = s.strstart; /* current string */ 
    var match; /* matched string */ 
    var len; /* length of current match */ 
    var best_len = s.prev_length; /* best match length so far */ 
    var nice_match = s.nice_match; /* stop if match long enough */ 
    var limit = s.strstart > s.w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD ? s.strstart - (s.w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD) : 0 /*NIL*/ ;
    var _win = s.window; // shortcut
    var wmask = s.w_mask;
    var prev = s.prev;
    /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */ var strend = s.strstart + $aaa7795d9087eacf$var$MAX_MATCH$1;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];
    /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */ // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");
    /* Do not waste too much time if we already have a good match: */ if (s.prev_length >= s.good_match) chain_length >>= 2;
    /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */ if (nice_match > s.lookahead) nice_match = s.lookahead;
    // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
    do {
        // Assert(cur_match < s->strstart, "no future");
        match = cur_match;
        /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */ if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) continue;
        /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */ scan += 2;
        match++;
        // Assert(*scan == *match, "match[2]?");
        /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */ do ;
        while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend)
        // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
        len = $aaa7795d9087eacf$var$MAX_MATCH$1 - (strend - scan);
        scan = strend - $aaa7795d9087eacf$var$MAX_MATCH$1;
        if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) break;
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
        }
    }while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0)
    if (best_len <= s.lookahead) return best_len;
    return s.lookahead;
}
/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */ function $aaa7795d9087eacf$var$fill_window(s) {
    var _w_size = s.w_size;
    var p, n, m, more, str;
    //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
    do {
        more = s.window_size - s.lookahead - s.strstart;
        // JS ints have 32 bit, block below not needed
        /* Deal with !@#$% 64K limit: */ //if (sizeof(int) <= 2) {
        //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
        //        more = wsize;
        //
        //  } else if (more == (unsigned)(-1)) {
        //        /* Very unlikely, but possible on 16 bit machine if
        //         * strstart == 0 && lookahead == 1 (input done a byte at time)
        //         */
        //        more--;
        //    }
        //}
        /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */ if (s.strstart >= _w_size + (_w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD)) {
            $aaa7795d9087eacf$var$arraySet(s.window, s.window, _w_size, _w_size, 0);
            s.match_start -= _w_size;
            s.strstart -= _w_size;
            /* we now have strstart >= MAX_DIST */ s.block_start -= _w_size;
            /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */ n = s.hash_size;
            p = n;
            do {
                m = s.head[--p];
                s.head[p] = m >= _w_size ? m - _w_size : 0;
            }while (--n)
            n = _w_size;
            p = n;
            do {
                m = s.prev[--p];
                s.prev[p] = m >= _w_size ? m - _w_size : 0;
            /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */ }while (--n)
            more += _w_size;
        }
        if (s.strm.avail_in === 0) break;
        /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */ //Assert(more >= 2, "more < 2");
        n = $aaa7795d9087eacf$var$read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        /* Initialize the hash value now that we have some input: */ if (s.lookahead + s.insert >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
            str = s.strstart - s.insert;
            s.ins_h = s.window[str];
            /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
            //#if MIN_MATCH != 3
            //        Call update_hash() MIN_MATCH-3 more times
            //#endif
            while(s.insert){
                /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
                s.prev[str & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = str;
                str++;
                s.insert--;
                if (s.lookahead + s.insert < $aaa7795d9087eacf$var$MIN_MATCH$1) break;
            }
        }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */ }while (s.lookahead < $aaa7795d9087eacf$var$MIN_LOOKAHEAD && s.strm.avail_in !== 0)
/* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */ //  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}
/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */ function $aaa7795d9087eacf$var$deflate_stored(s, flush) {
    /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */ var max_block_size = 65535;
    if (max_block_size > s.pending_buf_size - 5) max_block_size = s.pending_buf_size - 5;
    /* Copy as much as possible from input to output: */ for(;;){
        /* Fill the window as much as possible: */ if (s.lookahead <= 1) {
            //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
            //  s->block_start >= (long)s->w_size, "slide too late");
            //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
            //        s.block_start >= s.w_size)) {
            //        throw  new Error("slide too late");
            //      }
            $aaa7795d9087eacf$var$fill_window(s);
            if (s.lookahead === 0 && flush === $aaa7795d9087eacf$var$Z_NO_FLUSH) return $aaa7795d9087eacf$var$BS_NEED_MORE;
            if (s.lookahead === 0) break;
        /* flush the current block */ }
        //Assert(s->block_start >= 0L, "block gone");
        //    if (s.block_start < 0) throw new Error("block gone");
        s.strstart += s.lookahead;
        s.lookahead = 0;
        /* Emit a stored block if pending_buf will be full: */ var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
            /* strstart == 0 is possible when wraparound on 16-bit machine */ s.lookahead = s.strstart - max_start;
            s.strstart = max_start;
            /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        /***/ }
        /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */ if (s.strstart - s.block_start >= s.w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD) {
            /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = 0;
    if (flush === $aaa7795d9087eacf$var$Z_FINISH) {
        /*** FLUSH_BLOCK(s, 1); ***/ $aaa7795d9087eacf$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_FINISH_STARTED;
        /***/ return $aaa7795d9087eacf$var$BS_FINISH_DONE;
    }
    if (s.strstart > s.block_start) {
        /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
    /***/ }
    return $aaa7795d9087eacf$var$BS_NEED_MORE;
}
/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */ function $aaa7795d9087eacf$var$deflate_fast(s, flush) {
    var hash_head; /* head of the hash chain */ 
    var bflush; /* set if current block must be flushed */ 
    for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */ if (s.lookahead < $aaa7795d9087eacf$var$MIN_LOOKAHEAD) {
            $aaa7795d9087eacf$var$fill_window(s);
            if (s.lookahead < $aaa7795d9087eacf$var$MIN_LOOKAHEAD && flush === $aaa7795d9087eacf$var$Z_NO_FLUSH) return $aaa7795d9087eacf$var$BS_NEED_MORE;
            if (s.lookahead === 0) break; /* flush the current block */ 
        }
        /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */ hash_head = 0 /*NIL*/ ;
        if (s.lookahead >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
        /***/ }
        /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */ if (hash_head !== 0 /*NIL*/  && s.strstart - hash_head <= s.w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD) /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */ s.match_length = $aaa7795d9087eacf$var$longest_match(s, hash_head);
        if (s.match_length >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
            // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
            /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, s.strstart - s.match_start, s.match_length - $aaa7795d9087eacf$var$MIN_MATCH$1);
            s.lookahead -= s.match_length;
            /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */ if (s.match_length <= s.max_lazy_match /*max_insert_length*/  && s.lookahead >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
                s.match_length--; /* string at strstart already in table */ 
                do {
                    s.strstart++;
                    /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
                    hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = s.strstart;
                /***/ /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */ }while (--s.match_length !== 0)
                s.strstart++;
            } else {
                s.strstart += s.match_length;
                s.match_length = 0;
                s.ins_h = s.window[s.strstart];
                /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
            //#if MIN_MATCH != 3
            //                Call UPDATE_HASH() MIN_MATCH-3 more times
            //#endif
            /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */ }
        } else {
            /* No match, output a literal byte */ //Tracevv((stderr,"%c", s.window[s.strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
        }
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = s.strstart < $aaa7795d9087eacf$var$MIN_MATCH$1 - 1 ? s.strstart : $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
    if (flush === $aaa7795d9087eacf$var$Z_FINISH) {
        /*** FLUSH_BLOCK(s, 1); ***/ $aaa7795d9087eacf$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_FINISH_STARTED;
        /***/ return $aaa7795d9087eacf$var$BS_FINISH_DONE;
    }
    if (s.last_lit) {
        /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
    /***/ }
    return $aaa7795d9087eacf$var$BS_BLOCK_DONE;
}
/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */ function $aaa7795d9087eacf$var$deflate_slow(s, flush) {
    var hash_head; /* head of hash chain */ 
    var bflush; /* set if current block must be flushed */ 
    var max_insert;
    /* Process the input block. */ for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */ if (s.lookahead < $aaa7795d9087eacf$var$MIN_LOOKAHEAD) {
            $aaa7795d9087eacf$var$fill_window(s);
            if (s.lookahead < $aaa7795d9087eacf$var$MIN_LOOKAHEAD && flush === $aaa7795d9087eacf$var$Z_NO_FLUSH) return $aaa7795d9087eacf$var$BS_NEED_MORE;
            if (s.lookahead === 0) break;
             /* flush the current block */ 
        }
        /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */ hash_head = 0 /*NIL*/ ;
        if (s.lookahead >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
        /***/ }
        /* Find the longest match, discarding those <= prev_length.
     */ s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
        if (hash_head !== 0 /*NIL*/  && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - $aaa7795d9087eacf$var$MIN_LOOKAHEAD) {
            /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */ s.match_length = $aaa7795d9087eacf$var$longest_match(s, hash_head);
            /* longest_match() sets match_start */ if (s.match_length <= 5 && (s.strategy === $aaa7795d9087eacf$var$Z_FILTERED || s.match_length === $aaa7795d9087eacf$var$MIN_MATCH$1 && s.strstart - s.match_start > 4096 /*TOO_FAR*/ )) /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */ s.match_length = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
        }
        /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */ if (s.prev_length >= $aaa7795d9087eacf$var$MIN_MATCH$1 && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - $aaa7795d9087eacf$var$MIN_MATCH$1;
            /* Do not insert strings in hash table beyond this. */ //check_match(s, s.strstart-1, s.prev_match, s.prev_length);
            /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - $aaa7795d9087eacf$var$MIN_MATCH$1);
            /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */ s.lookahead -= s.prev_length - 1;
            s.prev_length -= 2;
            do if (++s.strstart <= max_insert) {
                /*** INSERT_STRING(s, s.strstart, hash_head); ***/ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
            /***/ }
            while (--s.prev_length !== 0)
            s.match_available = 0;
            s.match_length = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
            s.strstart++;
            if (bflush) {
                /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
                if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
            /***/ }
        } else if (s.match_available) {
            /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */ //Tracevv((stderr,"%c", s->window[s->strstart-1]));
            /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 0, s.window[s.strstart - 1]);
            if (bflush) /*** FLUSH_BLOCK_ONLY(s, 0) ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            s.strstart++;
            s.lookahead--;
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        } else {
            /* There is no previous match to compare with, wait for
       * the next step to decide.
       */ s.match_available = 1;
            s.strstart++;
            s.lookahead--;
        }
    }
    //Assert (flush != Z_NO_FLUSH, "no flush?");
    if (s.match_available) {
        //Tracevv((stderr,"%c", s->window[s->strstart-1]));
        /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
    }
    s.insert = s.strstart < $aaa7795d9087eacf$var$MIN_MATCH$1 - 1 ? s.strstart : $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
    if (flush === $aaa7795d9087eacf$var$Z_FINISH) {
        /*** FLUSH_BLOCK(s, 1); ***/ $aaa7795d9087eacf$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_FINISH_STARTED;
        /***/ return $aaa7795d9087eacf$var$BS_FINISH_DONE;
    }
    if (s.last_lit) {
        /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
    /***/ }
    return $aaa7795d9087eacf$var$BS_BLOCK_DONE;
}
/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */ function $aaa7795d9087eacf$var$deflate_rle(s, flush) {
    var bflush; /* set if current block must be flushed */ 
    var prev; /* byte at distance one to match */ 
    var scan, strend; /* scan goes up to strend for length of run */ 
    var _win = s.window;
    for(;;){
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */ if (s.lookahead <= $aaa7795d9087eacf$var$MAX_MATCH$1) {
            $aaa7795d9087eacf$var$fill_window(s);
            if (s.lookahead <= $aaa7795d9087eacf$var$MAX_MATCH$1 && flush === $aaa7795d9087eacf$var$Z_NO_FLUSH) return $aaa7795d9087eacf$var$BS_NEED_MORE;
            if (s.lookahead === 0) break;
             /* flush the current block */ 
        }
        /* See how many times the previous byte repeats */ s.match_length = 0;
        if (s.lookahead >= $aaa7795d9087eacf$var$MIN_MATCH$1 && s.strstart > 0) {
            scan = s.strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                strend = s.strstart + $aaa7795d9087eacf$var$MAX_MATCH$1;
                do ;
                while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend)
                s.match_length = $aaa7795d9087eacf$var$MAX_MATCH$1 - (strend - scan);
                if (s.match_length > s.lookahead) s.match_length = s.lookahead;
            }
        //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
        }
        /* Emit match if have run of MIN_MATCH or longer, else emit literal */ if (s.match_length >= $aaa7795d9087eacf$var$MIN_MATCH$1) {
            //check_match(s, s.strstart, s.strstart - 1, s.match_length);
            /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 1, s.match_length - $aaa7795d9087eacf$var$MIN_MATCH$1);
            s.lookahead -= s.match_length;
            s.strstart += s.match_length;
            s.match_length = 0;
        } else {
            /* No match, output a literal byte */ //Tracevv((stderr,"%c", s->window[s->strstart]));
            /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
        }
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = 0;
    if (flush === $aaa7795d9087eacf$var$Z_FINISH) {
        /*** FLUSH_BLOCK(s, 1); ***/ $aaa7795d9087eacf$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_FINISH_STARTED;
        /***/ return $aaa7795d9087eacf$var$BS_FINISH_DONE;
    }
    if (s.last_lit) {
        /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
    /***/ }
    return $aaa7795d9087eacf$var$BS_BLOCK_DONE;
}
/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */ function $aaa7795d9087eacf$var$deflate_huff(s, flush) {
    var bflush; /* set if current block must be flushed */ 
    for(;;){
        /* Make sure that we have a literal to write. */ if (s.lookahead === 0) {
            $aaa7795d9087eacf$var$fill_window(s);
            if (s.lookahead === 0) {
                if (flush === $aaa7795d9087eacf$var$Z_NO_FLUSH) return $aaa7795d9087eacf$var$BS_NEED_MORE;
                break; /* flush the current block */ 
            }
        }
        /* Output a literal byte */ s.match_length = 0;
        //Tracevv((stderr,"%c", s->window[s->strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/ bflush = $aaa7795d9087eacf$var$_tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
            /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
            if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
        /***/ }
    }
    s.insert = 0;
    if (flush === $aaa7795d9087eacf$var$Z_FINISH) {
        /*** FLUSH_BLOCK(s, 1); ***/ $aaa7795d9087eacf$var$flush_block_only(s, true);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_FINISH_STARTED;
        /***/ return $aaa7795d9087eacf$var$BS_FINISH_DONE;
    }
    if (s.last_lit) {
        /*** FLUSH_BLOCK(s, 0); ***/ $aaa7795d9087eacf$var$flush_block_only(s, false);
        if (s.strm.avail_out === 0) return $aaa7795d9087eacf$var$BS_NEED_MORE;
    /***/ }
    return $aaa7795d9087eacf$var$BS_BLOCK_DONE;
}
/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */ function $aaa7795d9087eacf$var$Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
}
var $aaa7795d9087eacf$var$configuration_table;
$aaa7795d9087eacf$var$configuration_table = [
    /*      good lazy nice chain */ new $aaa7795d9087eacf$var$Config(0, 0, 0, 0, $aaa7795d9087eacf$var$deflate_stored),
    /* 0 store only */ new $aaa7795d9087eacf$var$Config(4, 4, 8, 4, $aaa7795d9087eacf$var$deflate_fast),
    /* 1 max speed, no lazy matches */ new $aaa7795d9087eacf$var$Config(4, 5, 16, 8, $aaa7795d9087eacf$var$deflate_fast),
    /* 2 */ new $aaa7795d9087eacf$var$Config(4, 6, 32, 32, $aaa7795d9087eacf$var$deflate_fast),
    /* 3 */ new $aaa7795d9087eacf$var$Config(4, 4, 16, 16, $aaa7795d9087eacf$var$deflate_slow),
    /* 4 lazy matches */ new $aaa7795d9087eacf$var$Config(8, 16, 32, 32, $aaa7795d9087eacf$var$deflate_slow),
    /* 5 */ new $aaa7795d9087eacf$var$Config(8, 16, 128, 128, $aaa7795d9087eacf$var$deflate_slow),
    /* 6 */ new $aaa7795d9087eacf$var$Config(8, 32, 128, 256, $aaa7795d9087eacf$var$deflate_slow),
    /* 7 */ new $aaa7795d9087eacf$var$Config(32, 128, 258, 1024, $aaa7795d9087eacf$var$deflate_slow),
    /* 8 */ new $aaa7795d9087eacf$var$Config(32, 258, 258, 4096, $aaa7795d9087eacf$var$deflate_slow)
];
/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */ function $aaa7795d9087eacf$var$lm_init(s) {
    s.window_size = 2 * s.w_size;
    /*** CLEAR_HASH(s); ***/ $aaa7795d9087eacf$var$zero$1(s.head); // Fill with NIL (= 0);
    /* Set the default configuration parameters:
   */ s.max_lazy_match = $aaa7795d9087eacf$var$configuration_table[s.level].max_lazy;
    s.good_match = $aaa7795d9087eacf$var$configuration_table[s.level].good_length;
    s.nice_match = $aaa7795d9087eacf$var$configuration_table[s.level].nice_length;
    s.max_chain_length = $aaa7795d9087eacf$var$configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
    s.match_available = 0;
    s.ins_h = 0;
}
function $aaa7795d9087eacf$var$DeflateState() {
    this.strm = null; /* pointer back to this zlib stream */ 
    this.status = 0; /* as the name implies */ 
    this.pending_buf = null; /* output still pending */ 
    this.pending_buf_size = 0; /* size of pending_buf */ 
    this.pending_out = 0; /* next pending byte to output to the stream */ 
    this.pending = 0; /* nb of bytes in the pending buffer */ 
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */ 
    this.gzhead = null; /* gzip header information to write */ 
    this.gzindex = 0; /* where in extra, name, or comment */ 
    this.method = $aaa7795d9087eacf$var$Z_DEFLATED; /* can only be DEFLATED */ 
    this.last_flush = -1; /* value of flush param for previous deflate call */ 
    this.w_size = 0; /* LZ77 window size (32K by default) */ 
    this.w_bits = 0; /* log2(w_size)  (8..16) */ 
    this.w_mask = 0; /* w_size - 1 */ 
    this.window = null;
    /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */ this.window_size = 0;
    /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */ this.prev = null;
    /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */ this.head = null; /* Heads of the hash chains or NIL. */ 
    this.ins_h = 0; /* hash index of string to be inserted */ 
    this.hash_size = 0; /* number of elements in hash table */ 
    this.hash_bits = 0; /* log2(hash_size) */ 
    this.hash_mask = 0; /* hash_size-1 */ 
    this.hash_shift = 0;
    /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */ this.block_start = 0;
    /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */ this.match_length = 0; /* length of best match */ 
    this.prev_match = 0; /* previous match */ 
    this.match_available = 0; /* set if previous match exists */ 
    this.strstart = 0; /* start of string to insert */ 
    this.match_start = 0; /* start of matching string */ 
    this.lookahead = 0; /* number of valid bytes ahead in window */ 
    this.prev_length = 0;
    /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */ this.max_chain_length = 0;
    /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */ this.max_lazy_match = 0;
    /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */ // That's alias to max_lazy_match, don't use directly
    //this.max_insert_length = 0;
    /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */ this.level = 0; /* compression level (1..9) */ 
    this.strategy = 0; /* favor or force Huffman coding*/ 
    this.good_match = 0;
    /* Use a faster search when the previous match is longer than this */ this.nice_match = 0; /* Stop searching when current match exceeds this */ 
    /* used by trees.c: */ /* Didn't use ct_data typedef below to suppress compiler warning */ // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
    // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
    // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
    // Use flat array of DOUBLE size, with interleaved fata,
    // because JS does not support effective
    this.dyn_ltree = new $aaa7795d9087eacf$var$Buf16($aaa7795d9087eacf$var$HEAP_SIZE$1 * 2);
    this.dyn_dtree = new $aaa7795d9087eacf$var$Buf16((2 * $aaa7795d9087eacf$var$D_CODES$1 + 1) * 2);
    this.bl_tree = new $aaa7795d9087eacf$var$Buf16((2 * $aaa7795d9087eacf$var$BL_CODES$1 + 1) * 2);
    $aaa7795d9087eacf$var$zero$1(this.dyn_ltree);
    $aaa7795d9087eacf$var$zero$1(this.dyn_dtree);
    $aaa7795d9087eacf$var$zero$1(this.bl_tree);
    this.l_desc = null; /* desc. for literal tree */ 
    this.d_desc = null; /* desc. for distance tree */ 
    this.bl_desc = null; /* desc. for bit length tree */ 
    //ush bl_count[MAX_BITS+1];
    this.bl_count = new $aaa7795d9087eacf$var$Buf16($aaa7795d9087eacf$var$MAX_BITS$1 + 1);
    /* number of codes at each bit length for an optimal tree */ //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
    this.heap = new $aaa7795d9087eacf$var$Buf16(2 * $aaa7795d9087eacf$var$L_CODES$1 + 1); /* heap used to build the Huffman trees */ 
    $aaa7795d9087eacf$var$zero$1(this.heap);
    this.heap_len = 0; /* number of elements in the heap */ 
    this.heap_max = 0; /* element of largest frequency */ 
    /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */ this.depth = new $aaa7795d9087eacf$var$Buf16(2 * $aaa7795d9087eacf$var$L_CODES$1 + 1); //uch depth[2*L_CODES+1];
    $aaa7795d9087eacf$var$zero$1(this.depth);
    /* Depth of each subtree used as tie breaker for trees of equal frequency
   */ this.l_buf = 0; /* buffer index for literals or lengths */ 
    this.lit_bufsize = 0;
    /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */ this.last_lit = 0; /* running index in l_buf */ 
    this.d_buf = 0;
    /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */ this.opt_len = 0; /* bit length of current block with optimal trees */ 
    this.static_len = 0; /* bit length of current block with static trees */ 
    this.matches = 0; /* number of string matches in current block */ 
    this.insert = 0; /* bytes at end of window left to insert */ 
    this.bi_buf = 0;
    /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */ this.bi_valid = 0;
/* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */ // Used for window memory init. We safely ignore it for JS. That makes
// sense only for pointers and memory check tools.
//this.high_water = 0;
/* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */ }
function $aaa7795d9087eacf$var$deflateResetKeep(strm) {
    var s;
    if (!strm || !strm.state) return $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_STREAM_ERROR);
    strm.total_in = strm.total_out = 0;
    strm.data_type = $aaa7795d9087eacf$var$Z_UNKNOWN$1;
    s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) s.wrap = -s.wrap;
    s.status = s.wrap ? $aaa7795d9087eacf$var$INIT_STATE : $aaa7795d9087eacf$var$BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)
     : 1; // adler32(0, Z_NULL, 0)
    s.last_flush = $aaa7795d9087eacf$var$Z_NO_FLUSH;
    $aaa7795d9087eacf$var$_tr_init(s);
    return $aaa7795d9087eacf$var$Z_OK;
}
function $aaa7795d9087eacf$var$deflateReset(strm) {
    var ret = $aaa7795d9087eacf$var$deflateResetKeep(strm);
    if (ret === $aaa7795d9087eacf$var$Z_OK) $aaa7795d9087eacf$var$lm_init(strm.state);
    return ret;
}
function $aaa7795d9087eacf$var$deflateSetHeader(strm, head) {
    if (!strm || !strm.state) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    if (strm.state.wrap !== 2) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    strm.state.gzhead = head;
    return $aaa7795d9087eacf$var$Z_OK;
}
function $aaa7795d9087eacf$var$deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
    if (!strm) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    var wrap = 1;
    if (level === $aaa7795d9087eacf$var$Z_DEFAULT_COMPRESSION) level = 6;
    if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
    } else if (windowBits > 15) {
        wrap = 2; /* write gzip wrapper instead */ 
        windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > $aaa7795d9087eacf$var$MAX_MEM_LEVEL || method !== $aaa7795d9087eacf$var$Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > $aaa7795d9087eacf$var$Z_FIXED$1) return $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_STREAM_ERROR);
    if (windowBits === 8) windowBits = 9;
    /* until 256-byte window bug fixed */ var s = new $aaa7795d9087eacf$var$DeflateState();
    strm.state = s;
    s.strm = strm;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1) / $aaa7795d9087eacf$var$MIN_MATCH$1);
    s.window = new $aaa7795d9087eacf$var$Buf8(s.w_size * 2);
    s.head = new $aaa7795d9087eacf$var$Buf16(s.hash_size);
    s.prev = new $aaa7795d9087eacf$var$Buf16(s.w_size);
    // Don't need mem init magic for JS.
    //s.high_water = 0;  /* nothing written to s->window yet */
    s.lit_bufsize = 1 << memLevel + 6; /* 16K elements by default */ 
    s.pending_buf_size = s.lit_bufsize * 4;
    //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
    //s->pending_buf = (uchf *) overlay;
    s.pending_buf = new $aaa7795d9087eacf$var$Buf8(s.pending_buf_size);
    // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
    //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
    s.d_buf = 1 * s.lit_bufsize;
    //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
    s.l_buf = 3 * s.lit_bufsize;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return $aaa7795d9087eacf$var$deflateReset(strm);
}
function $aaa7795d9087eacf$var$deflate(strm, flush) {
    var old_flush, s;
    var beg, val; // for gzip header write only
    if (!strm || !strm.state || flush > $aaa7795d9087eacf$var$Z_BLOCK || flush < 0) return strm ? $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_STREAM_ERROR) : $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    s = strm.state;
    if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === $aaa7795d9087eacf$var$FINISH_STATE && flush !== $aaa7795d9087eacf$var$Z_FINISH) return $aaa7795d9087eacf$var$err(strm, strm.avail_out === 0 ? $aaa7795d9087eacf$var$Z_BUF_ERROR : $aaa7795d9087eacf$var$Z_STREAM_ERROR);
    s.strm = strm; /* just in case */ 
    old_flush = s.last_flush;
    s.last_flush = flush;
    /* Write the header */ if (s.status === $aaa7795d9087eacf$var$INIT_STATE) {
        if (s.wrap === 2) {
            strm.adler = 0; //crc32(0L, Z_NULL, 0);
            $aaa7795d9087eacf$var$put_byte(s, 31);
            $aaa7795d9087eacf$var$put_byte(s, 139);
            $aaa7795d9087eacf$var$put_byte(s, 8);
            if (!s.gzhead) {
                $aaa7795d9087eacf$var$put_byte(s, 0);
                $aaa7795d9087eacf$var$put_byte(s, 0);
                $aaa7795d9087eacf$var$put_byte(s, 0);
                $aaa7795d9087eacf$var$put_byte(s, 0);
                $aaa7795d9087eacf$var$put_byte(s, 0);
                $aaa7795d9087eacf$var$put_byte(s, s.level === 9 ? 2 : s.strategy >= $aaa7795d9087eacf$var$Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                $aaa7795d9087eacf$var$put_byte(s, $aaa7795d9087eacf$var$OS_CODE);
                s.status = $aaa7795d9087eacf$var$BUSY_STATE;
            } else {
                $aaa7795d9087eacf$var$put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.time & 255);
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.time >> 8 & 255);
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.time >> 16 & 255);
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.time >> 24 & 255);
                $aaa7795d9087eacf$var$put_byte(s, s.level === 9 ? 2 : s.strategy >= $aaa7795d9087eacf$var$Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.os & 255);
                if (s.gzhead.extra && s.gzhead.extra.length) {
                    $aaa7795d9087eacf$var$put_byte(s, s.gzhead.extra.length & 255);
                    $aaa7795d9087eacf$var$put_byte(s, s.gzhead.extra.length >> 8 & 255);
                }
                if (s.gzhead.hcrc) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending, 0);
                s.gzindex = 0;
                s.status = $aaa7795d9087eacf$var$EXTRA_STATE;
            }
        } else {
            var header = $aaa7795d9087eacf$var$Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
            var level_flags = -1;
            if (s.strategy >= $aaa7795d9087eacf$var$Z_HUFFMAN_ONLY || s.level < 2) level_flags = 0;
            else if (s.level < 6) level_flags = 1;
            else if (s.level === 6) level_flags = 2;
            else level_flags = 3;
            header |= level_flags << 6;
            if (s.strstart !== 0) header |= $aaa7795d9087eacf$var$PRESET_DICT;
            header += 31 - header % 31;
            s.status = $aaa7795d9087eacf$var$BUSY_STATE;
            $aaa7795d9087eacf$var$putShortMSB(s, header);
            /* Save the adler32 of the preset dictionary: */ if (s.strstart !== 0) {
                $aaa7795d9087eacf$var$putShortMSB(s, strm.adler >>> 16);
                $aaa7795d9087eacf$var$putShortMSB(s, strm.adler & 65535);
            }
            strm.adler = 1; // adler32(0L, Z_NULL, 0);
        }
    }
    //#ifdef GZIP
    if (s.status === $aaa7795d9087eacf$var$EXTRA_STATE) {
        if (s.gzhead.extra /* != Z_NULL*/ ) {
            beg = s.pending; /* start of bytes to update crc */ 
            while(s.gzindex < (s.gzhead.extra.length & 65535)){
                if (s.pending === s.pending_buf_size) {
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                    $aaa7795d9087eacf$var$flush_pending(strm);
                    beg = s.pending;
                    if (s.pending === s.pending_buf_size) break;
                }
                $aaa7795d9087eacf$var$put_byte(s, s.gzhead.extra[s.gzindex] & 255);
                s.gzindex++;
            }
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            if (s.gzindex === s.gzhead.extra.length) {
                s.gzindex = 0;
                s.status = $aaa7795d9087eacf$var$NAME_STATE;
            }
        } else s.status = $aaa7795d9087eacf$var$NAME_STATE;
    }
    if (s.status === $aaa7795d9087eacf$var$NAME_STATE) {
        if (s.gzhead.name /* != Z_NULL*/ ) {
            beg = s.pending; /* start of bytes to update crc */ 
            //int val;
            do {
                if (s.pending === s.pending_buf_size) {
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                    $aaa7795d9087eacf$var$flush_pending(strm);
                    beg = s.pending;
                    if (s.pending === s.pending_buf_size) {
                        val = 1;
                        break;
                    }
                }
                // JS specific: little magic to add zero terminator to end of string
                if (s.gzindex < s.gzhead.name.length) val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
                else val = 0;
                $aaa7795d9087eacf$var$put_byte(s, val);
            }while (val !== 0)
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            if (val === 0) {
                s.gzindex = 0;
                s.status = $aaa7795d9087eacf$var$COMMENT_STATE;
            }
        } else s.status = $aaa7795d9087eacf$var$COMMENT_STATE;
    }
    if (s.status === $aaa7795d9087eacf$var$COMMENT_STATE) {
        if (s.gzhead.comment /* != Z_NULL*/ ) {
            beg = s.pending; /* start of bytes to update crc */ 
            //int val;
            do {
                if (s.pending === s.pending_buf_size) {
                    if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
                    $aaa7795d9087eacf$var$flush_pending(strm);
                    beg = s.pending;
                    if (s.pending === s.pending_buf_size) {
                        val = 1;
                        break;
                    }
                }
                // JS specific: little magic to add zero terminator to end of string
                if (s.gzindex < s.gzhead.comment.length) val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
                else val = 0;
                $aaa7795d9087eacf$var$put_byte(s, val);
            }while (val !== 0)
            if (s.gzhead.hcrc && s.pending > beg) strm.adler = $aaa7795d9087eacf$var$crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            if (val === 0) s.status = $aaa7795d9087eacf$var$HCRC_STATE;
        } else s.status = $aaa7795d9087eacf$var$HCRC_STATE;
    }
    if (s.status === $aaa7795d9087eacf$var$HCRC_STATE) {
        if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) $aaa7795d9087eacf$var$flush_pending(strm);
            if (s.pending + 2 <= s.pending_buf_size) {
                $aaa7795d9087eacf$var$put_byte(s, strm.adler & 255);
                $aaa7795d9087eacf$var$put_byte(s, strm.adler >> 8 & 255);
                strm.adler = 0; //crc32(0L, Z_NULL, 0);
                s.status = $aaa7795d9087eacf$var$BUSY_STATE;
            }
        } else s.status = $aaa7795d9087eacf$var$BUSY_STATE;
    }
    //#endif
    /* Flush as much pending output as possible */ if (s.pending !== 0) {
        $aaa7795d9087eacf$var$flush_pending(strm);
        if (strm.avail_out === 0) {
            /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */ s.last_flush = -1;
            return $aaa7795d9087eacf$var$Z_OK;
        }
    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */ } else if (strm.avail_in === 0 && $aaa7795d9087eacf$var$rank(flush) <= $aaa7795d9087eacf$var$rank(old_flush) && flush !== $aaa7795d9087eacf$var$Z_FINISH) return $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_BUF_ERROR);
    /* User must not provide more input after the first FINISH: */ if (s.status === $aaa7795d9087eacf$var$FINISH_STATE && strm.avail_in !== 0) return $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_BUF_ERROR);
    /* Start a new block or continue the current one.
   */ if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== $aaa7795d9087eacf$var$Z_NO_FLUSH && s.status !== $aaa7795d9087eacf$var$FINISH_STATE) {
        var bstate = s.strategy === $aaa7795d9087eacf$var$Z_HUFFMAN_ONLY ? $aaa7795d9087eacf$var$deflate_huff(s, flush) : s.strategy === $aaa7795d9087eacf$var$Z_RLE ? $aaa7795d9087eacf$var$deflate_rle(s, flush) : $aaa7795d9087eacf$var$configuration_table[s.level].func(s, flush);
        if (bstate === $aaa7795d9087eacf$var$BS_FINISH_STARTED || bstate === $aaa7795d9087eacf$var$BS_FINISH_DONE) s.status = $aaa7795d9087eacf$var$FINISH_STATE;
        if (bstate === $aaa7795d9087eacf$var$BS_NEED_MORE || bstate === $aaa7795d9087eacf$var$BS_FINISH_STARTED) {
            if (strm.avail_out === 0) s.last_flush = -1;
            return $aaa7795d9087eacf$var$Z_OK;
        /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */ }
        if (bstate === $aaa7795d9087eacf$var$BS_BLOCK_DONE) {
            if (flush === $aaa7795d9087eacf$var$Z_PARTIAL_FLUSH) $aaa7795d9087eacf$var$_tr_align(s);
            else if (flush !== $aaa7795d9087eacf$var$Z_BLOCK) {
                $aaa7795d9087eacf$var$_tr_stored_block(s, 0, 0, false);
                /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */ if (flush === $aaa7795d9087eacf$var$Z_FULL_FLUSH) {
                    /*** CLEAR_HASH(s); ***/ /* forget history */ $aaa7795d9087eacf$var$zero$1(s.head); // Fill with NIL (= 0);
                    if (s.lookahead === 0) {
                        s.strstart = 0;
                        s.block_start = 0;
                        s.insert = 0;
                    }
                }
            }
            $aaa7795d9087eacf$var$flush_pending(strm);
            if (strm.avail_out === 0) {
                s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */ 
                return $aaa7795d9087eacf$var$Z_OK;
            }
        }
    }
    //Assert(strm->avail_out > 0, "bug2");
    //if (strm.avail_out <= 0) { throw new Error("bug2");}
    if (flush !== $aaa7795d9087eacf$var$Z_FINISH) return $aaa7795d9087eacf$var$Z_OK;
    if (s.wrap <= 0) return $aaa7795d9087eacf$var$Z_STREAM_END;
    /* Write the trailer */ if (s.wrap === 2) {
        $aaa7795d9087eacf$var$put_byte(s, strm.adler & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.adler >> 8 & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.adler >> 16 & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.adler >> 24 & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.total_in & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.total_in >> 8 & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.total_in >> 16 & 255);
        $aaa7795d9087eacf$var$put_byte(s, strm.total_in >> 24 & 255);
    } else {
        $aaa7795d9087eacf$var$putShortMSB(s, strm.adler >>> 16);
        $aaa7795d9087eacf$var$putShortMSB(s, strm.adler & 65535);
    }
    $aaa7795d9087eacf$var$flush_pending(strm);
    /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */ if (s.wrap > 0) s.wrap = -s.wrap;
    /* write the trailer only once! */ return s.pending !== 0 ? $aaa7795d9087eacf$var$Z_OK : $aaa7795d9087eacf$var$Z_STREAM_END;
}
function $aaa7795d9087eacf$var$deflateEnd(strm) {
    var status;
    if (!strm /*== Z_NULL*/  || !strm.state /*== Z_NULL*/ ) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    status = strm.state.status;
    if (status !== $aaa7795d9087eacf$var$INIT_STATE && status !== $aaa7795d9087eacf$var$EXTRA_STATE && status !== $aaa7795d9087eacf$var$NAME_STATE && status !== $aaa7795d9087eacf$var$COMMENT_STATE && status !== $aaa7795d9087eacf$var$HCRC_STATE && status !== $aaa7795d9087eacf$var$BUSY_STATE && status !== $aaa7795d9087eacf$var$FINISH_STATE) return $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_STREAM_ERROR);
    strm.state = null;
    return status === $aaa7795d9087eacf$var$BUSY_STATE ? $aaa7795d9087eacf$var$err(strm, $aaa7795d9087eacf$var$Z_DATA_ERROR) : $aaa7795d9087eacf$var$Z_OK;
}
/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */ function $aaa7795d9087eacf$var$deflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var s;
    var str, n;
    var wrap;
    var avail;
    var next;
    var input;
    var tmpDict;
    if (!strm /*== Z_NULL*/  || !strm.state /*== Z_NULL*/ ) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    s = strm.state;
    wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== $aaa7795d9087eacf$var$INIT_STATE || s.lookahead) return $aaa7795d9087eacf$var$Z_STREAM_ERROR;
    /* when using zlib wrappers, compute Adler-32 for provided dictionary */ if (wrap === 1) /* adler32(strm->adler, dictionary, dictLength); */ strm.adler = $aaa7795d9087eacf$var$adler32(strm.adler, dictionary, dictLength, 0);
    s.wrap = 0; /* avoid computing Adler-32 in read_buf */ 
    /* if dictionary would fill window, just replace the history */ if (dictLength >= s.w_size) {
        if (wrap === 0) {
            /*** CLEAR_HASH(s); ***/ $aaa7795d9087eacf$var$zero$1(s.head); // Fill with NIL (= 0);
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
        }
        /* use the tail */ // dictionary = dictionary.slice(dictLength - s.w_size);
        tmpDict = new $aaa7795d9087eacf$var$Buf8(s.w_size);
        $aaa7795d9087eacf$var$arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
    }
    /* insert dictionary into window and hash */ avail = strm.avail_in;
    next = strm.next_in;
    input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    $aaa7795d9087eacf$var$fill_window(s);
    while(s.lookahead >= $aaa7795d9087eacf$var$MIN_MATCH$1){
        str = s.strstart;
        n = s.lookahead - ($aaa7795d9087eacf$var$MIN_MATCH$1 - 1);
        do {
            /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */ s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + $aaa7795d9087eacf$var$MIN_MATCH$1 - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
        }while (--n)
        s.strstart = str;
        s.lookahead = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
        $aaa7795d9087eacf$var$fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = $aaa7795d9087eacf$var$MIN_MATCH$1 - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return $aaa7795d9087eacf$var$Z_OK;
}
/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/ // String encode/decode helpers
// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
var $aaa7795d9087eacf$var$STR_APPLY_OK = true;
var $aaa7795d9087eacf$var$STR_APPLY_UIA_OK = true;
try {
    String.fromCharCode.apply(null, [
        0
    ]);
} catch (__) {
    $aaa7795d9087eacf$var$STR_APPLY_OK = false;
}
try {
    String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__1) {
    $aaa7795d9087eacf$var$STR_APPLY_UIA_OK = false;
}
// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var $aaa7795d9087eacf$var$_utf8len = new $aaa7795d9087eacf$var$Buf8(256);
for(var $aaa7795d9087eacf$var$q = 0; $aaa7795d9087eacf$var$q < 256; $aaa7795d9087eacf$var$q++)$aaa7795d9087eacf$var$_utf8len[$aaa7795d9087eacf$var$q] = $aaa7795d9087eacf$var$q >= 252 ? 6 : $aaa7795d9087eacf$var$q >= 248 ? 5 : $aaa7795d9087eacf$var$q >= 240 ? 4 : $aaa7795d9087eacf$var$q >= 224 ? 3 : $aaa7795d9087eacf$var$q >= 192 ? 2 : 1;
$aaa7795d9087eacf$var$_utf8len[254] = $aaa7795d9087eacf$var$_utf8len[254] = 1; // Invalid sequence start
// convert string to array (typed, when possible)
function $aaa7795d9087eacf$var$string2buf(str) {
    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    // count binary size
    for(m_pos = 0; m_pos < str_len; m_pos++){
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 64512) === 56320) {
                c = 65536 + (c - 55296 << 10) + (c2 - 56320);
                m_pos++;
            }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    // allocate buffer
    buf = new $aaa7795d9087eacf$var$Buf8(buf_len);
    // convert
    for(i = 0, m_pos = 0; i < buf_len; m_pos++){
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
            c2 = str.charCodeAt(m_pos + 1);
            if ((c2 & 64512) === 56320) {
                c = 65536 + (c - 55296 << 10) + (c2 - 56320);
                m_pos++;
            }
        }
        if (c < 128) /* one byte */ buf[i++] = c;
        else if (c < 2048) {
            /* two bytes */ buf[i++] = 192 | c >>> 6;
            buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
            /* three bytes */ buf[i++] = 224 | c >>> 12;
            buf[i++] = 128 | c >>> 6 & 63;
            buf[i++] = 128 | c & 63;
        } else {
            /* four bytes */ buf[i++] = 240 | c >>> 18;
            buf[i++] = 128 | c >>> 12 & 63;
            buf[i++] = 128 | c >>> 6 & 63;
            buf[i++] = 128 | c & 63;
        }
    }
    return buf;
}
// Helper (used in 2 places)
function $aaa7795d9087eacf$var$_buf2binstring(buf, len) {
    // use fallback for big arrays to avoid stack overflow
    if (len < 65537) {
        if (buf.subarray && $aaa7795d9087eacf$var$STR_APPLY_UIA_OK || !buf.subarray && $aaa7795d9087eacf$var$STR_APPLY_OK) return String.fromCharCode.apply(null, $aaa7795d9087eacf$var$shrinkBuf(buf, len));
    }
    var result = '';
    for(var i = 0; i < len; i++)result += String.fromCharCode(buf[i]);
    return result;
}
// Convert byte array to binary string
function $aaa7795d9087eacf$var$buf2binstring(buf) {
    return $aaa7795d9087eacf$var$_buf2binstring(buf, buf.length);
}
// Convert binary string (typed, when possible)
function $aaa7795d9087eacf$var$binstring2buf(str) {
    var buf = new $aaa7795d9087eacf$var$Buf8(str.length);
    for(var i = 0, len = buf.length; i < len; i++)buf[i] = str.charCodeAt(i);
    return buf;
}
// convert array to string
function $aaa7795d9087eacf$var$buf2string(buf, max) {
    var i, out, c, c_len;
    var len = max || buf.length;
    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    var utf16buf = new Array(len * 2);
    for(out = 0, i = 0; i < len;){
        c = buf[i++];
        // quick process ascii
        if (c < 128) {
            utf16buf[out++] = c;
            continue;
        }
        c_len = $aaa7795d9087eacf$var$_utf8len[c];
        // skip 5 & 6 byte codes
        if (c_len > 4) {
            utf16buf[out++] = 65533;
            i += c_len - 1;
            continue;
        }
        // apply mask on first byte
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        // join the rest
        while(c_len > 1 && i < len){
            c = c << 6 | buf[i++] & 63;
            c_len--;
        }
        // terminated by end of string?
        if (c_len > 1) {
            utf16buf[out++] = 65533;
            continue;
        }
        if (c < 65536) utf16buf[out++] = c;
        else {
            c -= 65536;
            utf16buf[out++] = 55296 | c >> 10 & 1023;
            utf16buf[out++] = 56320 | c & 1023;
        }
    }
    return $aaa7795d9087eacf$var$_buf2binstring(utf16buf, out);
}
// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
function $aaa7795d9087eacf$var$utf8border(buf, max) {
    var pos;
    max = max || buf.length;
    if (max > buf.length) max = buf.length;
    // go back from last position, until start of sequence found
    pos = max - 1;
    while(pos >= 0 && (buf[pos] & 192) === 128)pos--;
    // Very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) return max;
    // If we came to start of buffer - that means buffer is too small,
    // return max too.
    if (pos === 0) return max;
    return pos + $aaa7795d9087eacf$var$_utf8len[buf[pos]] > max ? pos : max;
}
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function $aaa7795d9087eacf$var$ZStream() {
    /* next input byte */ this.input = null; // JS specific, because we have no pointers
    this.next_in = 0;
    /* number of bytes available at input */ this.avail_in = 0;
    /* total number of input bytes read so far */ this.total_in = 0;
    /* next output byte should be put there */ this.output = null; // JS specific, because we have no pointers
    this.next_out = 0;
    /* remaining free space at output */ this.avail_out = 0;
    /* total number of bytes output so far */ this.total_out = 0;
    /* last error message, NULL if no error */ this.msg = '' /*Z_NULL*/ ;
    /* not visible by applications */ this.state = null;
    /* best guess about the data type: binary or text */ this.data_type = 2 /*Z_UNKNOWN*/ ;
    /* adler32 value of the uncompressed data */ this.adler = 0;
}
var $aaa7795d9087eacf$var$toString = Object.prototype.toString;
/* Public constants ==========================================================*/ /* ===========================================================================*/ var $aaa7795d9087eacf$var$Z_NO_FLUSH$1 = 0;
var $aaa7795d9087eacf$var$Z_FINISH$1 = 4;
var $aaa7795d9087eacf$var$Z_OK$1 = 0;
var $aaa7795d9087eacf$var$Z_STREAM_END$1 = 1;
var $aaa7795d9087eacf$var$Z_SYNC_FLUSH = 2;
var $aaa7795d9087eacf$var$Z_DEFAULT_COMPRESSION$1 = -1;
var $aaa7795d9087eacf$var$Z_DEFAULT_STRATEGY = 0;
var $aaa7795d9087eacf$var$Z_DEFLATED$1 = 8;
/* ===========================================================================*/ /**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/ /* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/ /**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/ /**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/ /**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/ /**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/ function $aaa7795d9087eacf$export$ae157b6234afe138(options) {
    if (!(this instanceof $aaa7795d9087eacf$export$ae157b6234afe138)) return new $aaa7795d9087eacf$export$ae157b6234afe138(options);
    this.options = $aaa7795d9087eacf$var$assign({
        level: $aaa7795d9087eacf$var$Z_DEFAULT_COMPRESSION$1,
        method: $aaa7795d9087eacf$var$Z_DEFLATED$1,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: $aaa7795d9087eacf$var$Z_DEFAULT_STRATEGY,
        to: ''
    }, options || {
    });
    var opt = this.options;
    if (opt.raw && opt.windowBits > 0) opt.windowBits = -opt.windowBits;
    else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) opt.windowBits += 16;
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data
    this.strm = new $aaa7795d9087eacf$var$ZStream();
    this.strm.avail_out = 0;
    var status = $aaa7795d9087eacf$var$deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
    if (status !== $aaa7795d9087eacf$var$Z_OK$1) throw new Error($aaa7795d9087eacf$var$msg[status]);
    if (opt.header) $aaa7795d9087eacf$var$deflateSetHeader(this.strm, opt.header);
    if (opt.dictionary) {
        var dict;
        // Convert data if needed
        if (typeof opt.dictionary === 'string') // If we need to compress text, change encoding to utf8.
        dict = $aaa7795d9087eacf$var$string2buf(opt.dictionary);
        else if ($aaa7795d9087eacf$var$toString.call(opt.dictionary) === '[object ArrayBuffer]') dict = new Uint8Array(opt.dictionary);
        else dict = opt.dictionary;
        status = $aaa7795d9087eacf$var$deflateSetDictionary(this.strm, dict);
        if (status !== $aaa7795d9087eacf$var$Z_OK$1) throw new Error($aaa7795d9087eacf$var$msg[status]);
        this._dict_set = true;
    }
}
/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/ $aaa7795d9087eacf$export$ae157b6234afe138.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var status, _mode;
    if (this.ended) return false;
    _mode = mode === ~~mode ? mode : mode === true ? $aaa7795d9087eacf$var$Z_FINISH$1 : $aaa7795d9087eacf$var$Z_NO_FLUSH$1;
    // Convert data if needed
    if (typeof data === 'string') // If we need to compress text, change encoding to utf8.
    strm.input = $aaa7795d9087eacf$var$string2buf(data);
    else if ($aaa7795d9087eacf$var$toString.call(data) === '[object ArrayBuffer]') strm.input = new Uint8Array(data);
    else strm.input = data;
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
        if (strm.avail_out === 0) {
            strm.output = new $aaa7795d9087eacf$var$Buf8(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
        }
        status = $aaa7795d9087eacf$var$deflate(strm, _mode); /* no bad return value */ 
        if (status !== $aaa7795d9087eacf$var$Z_STREAM_END$1 && status !== $aaa7795d9087eacf$var$Z_OK$1) {
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === $aaa7795d9087eacf$var$Z_FINISH$1 || _mode === $aaa7795d9087eacf$var$Z_SYNC_FLUSH)) {
            if (this.options.to === 'string') this.onData($aaa7795d9087eacf$var$buf2binstring($aaa7795d9087eacf$var$shrinkBuf(strm.output, strm.next_out)));
            else this.onData($aaa7795d9087eacf$var$shrinkBuf(strm.output, strm.next_out));
        }
    }while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== $aaa7795d9087eacf$var$Z_STREAM_END$1)
    // Finalize on the last chunk.
    if (_mode === $aaa7795d9087eacf$var$Z_FINISH$1) {
        status = $aaa7795d9087eacf$var$deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === $aaa7795d9087eacf$var$Z_OK$1;
    }
    // callback interim results if Z_SYNC_FLUSH.
    if (_mode === $aaa7795d9087eacf$var$Z_SYNC_FLUSH) {
        this.onEnd($aaa7795d9087eacf$var$Z_OK$1);
        strm.avail_out = 0;
        return true;
    }
    return true;
};
/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/ $aaa7795d9087eacf$export$ae157b6234afe138.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
};
/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/ $aaa7795d9087eacf$export$ae157b6234afe138.prototype.onEnd = function(status) {
    // On success - join
    if (status === $aaa7795d9087eacf$var$Z_OK$1) {
        if (this.options.to === 'string') this.result = this.chunks.join('');
        else this.result = $aaa7795d9087eacf$var$flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
};
/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/ function $aaa7795d9087eacf$export$2316623ecd1285ab(input, options) {
    var deflator = new $aaa7795d9087eacf$export$ae157b6234afe138(options);
    deflator.push(input, true);
    // That will never happens, if you don't cheat with options :)
    if (deflator.err) throw deflator.msg || $aaa7795d9087eacf$var$msg[deflator.err];
    return deflator.result;
}
/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/ function $aaa7795d9087eacf$export$e95d6a8f69fb340a(input, options) {
    options = options || {
    };
    options.raw = true;
    return $aaa7795d9087eacf$export$2316623ecd1285ab(input, options);
}
/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/ function $aaa7795d9087eacf$export$69f0ea7cf3a331a8(input, options) {
    options = options || {
    };
    options.gzip = true;
    return $aaa7795d9087eacf$export$2316623ecd1285ab(input, options);
}
var $aaa7795d9087eacf$var$deflate$2 = /*#__PURE__*/ Object.freeze({
    Deflate: $aaa7795d9087eacf$export$ae157b6234afe138,
    deflate: $aaa7795d9087eacf$export$2316623ecd1285ab,
    deflateRaw: $aaa7795d9087eacf$export$e95d6a8f69fb340a,
    gzip: $aaa7795d9087eacf$export$69f0ea7cf3a331a8
});
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// See state defs from inflate.js
var $aaa7795d9087eacf$var$BAD = 30; /* got a data error -- remain here until reset */ 
var $aaa7795d9087eacf$var$TYPE = 12; /* i: waiting for type bits, including last-flag bit */ 
/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */ function $aaa7795d9087eacf$var$inflate_fast(strm, start) {
    var state;
    var _in; /* local strm.input */ 
    var last; /* have enough input while in < last */ 
    var _out; /* local strm.output */ 
    var beg; /* inflate()'s initial strm.output */ 
    var end; /* while out < end, enough space available */ 
    //#ifdef INFLATE_STRICT
    var dmax; /* maximum distance from zlib header */ 
    //#endif
    var wsize; /* window size or zero if not using window */ 
    var whave; /* valid bytes in the window */ 
    var wnext; /* window write index */ 
    // Use `s_window` instead `window`, avoid conflict with instrumentation tools
    var s_window; /* allocated sliding window, if wsize != 0 */ 
    var hold; /* local strm.hold */ 
    var bits; /* local strm.bits */ 
    var lcode; /* local strm.lencode */ 
    var dcode; /* local strm.distcode */ 
    var lmask; /* mask for first level of length codes */ 
    var dmask; /* mask for first level of distance codes */ 
    var here; /* retrieved table entry */ 
    var op; /* code bits, operation, extra bits, or */ 
    /*  window position, window bytes to copy */ var len; /* match length, unused bytes */ 
    var dist; /* match distance */ 
    var from; /* where to copy match from */ 
    var from_source;
    var input, output; // JS specific, because we have no pointers
    /* copy state to local variables */ state = strm.state;
    //here = state.here;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    //#ifdef INFLATE_STRICT
    dmax = state.dmax;
    //#endif
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    /* decode literals and length/distances until end-of-block or not enough
     input data or output space */ top: do {
        if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
        }
        here = lcode[hold & lmask];
        dolen: for(;;){
            op = here >>> 24 /*here.bits*/ ;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255 /*here.op*/ ;
            if (op === 0) //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            output[_out++] = here & 65535 /*here.val*/ ;
            else if (op & 16) {
                len = here & 65535 /*here.val*/ ;
                op &= 15; /* number of extra bits */ 
                if (op) {
                    if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    len += hold & (1 << op) - 1;
                    hold >>>= op;
                    bits -= op;
                }
                //Tracevv((stderr, "inflate:         length %u\n", len));
                if (bits < 15) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    hold += input[_in++] << bits;
                    bits += 8;
                }
                here = dcode[hold & dmask];
                dodist: for(;;){
                    op = here >>> 24 /*here.bits*/ ;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255 /*here.op*/ ;
                    if (op & 16) {
                        dist = here & 65535 /*here.val*/ ;
                        op &= 15; /* number of extra bits */ 
                        if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                            if (bits < op) {
                                hold += input[_in++] << bits;
                                bits += 8;
                            }
                        }
                        dist += hold & (1 << op) - 1;
                        //#ifdef INFLATE_STRICT
                        if (dist > dmax) {
                            strm.msg = 'invalid distance too far back';
                            state.mode = $aaa7795d9087eacf$var$BAD;
                            break top;
                        }
                        //#endif
                        hold >>>= op;
                        bits -= op;
                        //Tracevv((stderr, "inflate:         distance %u\n", dist));
                        op = _out - beg; /* max distance in output */ 
                        if (dist > op) {
                            op = dist - op; /* distance back in window */ 
                            if (op > whave) {
                                if (state.sane) {
                                    strm.msg = 'invalid distance too far back';
                                    state.mode = $aaa7795d9087eacf$var$BAD;
                                    break top;
                                }
                            }
                            from = 0; // window index
                            from_source = s_window;
                            if (wnext === 0) {
                                from += wsize - op;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op)
                                    from = _out - dist; /* rest from output */ 
                                    from_source = output;
                                }
                            } else if (wnext < op) {
                                from += wsize + wnext - op;
                                op -= wnext;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op)
                                    from = 0;
                                    if (wnext < len) {
                                        op = wnext;
                                        len -= op;
                                        do output[_out++] = s_window[from++];
                                        while (--op)
                                        from = _out - dist; /* rest from output */ 
                                        from_source = output;
                                    }
                                }
                            } else {
                                from += wnext - op;
                                if (op < len) {
                                    len -= op;
                                    do output[_out++] = s_window[from++];
                                    while (--op)
                                    from = _out - dist; /* rest from output */ 
                                    from_source = output;
                                }
                            }
                            while(len > 2){
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                output[_out++] = from_source[from++];
                                len -= 3;
                            }
                            if (len) {
                                output[_out++] = from_source[from++];
                                if (len > 1) output[_out++] = from_source[from++];
                            }
                        } else {
                            from = _out - dist; /* copy direct from output */ 
                            do {
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                output[_out++] = output[from++];
                                len -= 3;
                            }while (len > 2)
                            if (len) {
                                output[_out++] = output[from++];
                                if (len > 1) output[_out++] = output[from++];
                            }
                        }
                    } else if ((op & 64) === 0) {
                        here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                        continue dodist;
                    } else {
                        strm.msg = 'invalid distance code';
                        state.mode = $aaa7795d9087eacf$var$BAD;
                        break top;
                    }
                    break; // need to emulate goto via "continue"
                }
            } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
            } else if (op & 32) {
                //Tracevv((stderr, "inflate:         end of block\n"));
                state.mode = $aaa7795d9087eacf$var$TYPE;
                break top;
            } else {
                strm.msg = 'invalid literal/length code';
                state.mode = $aaa7795d9087eacf$var$BAD;
                break top;
            }
            break; // need to emulate goto via "continue"
        }
    }while (_in < last && _out < end)
    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */ len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    /* update state and return */ strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
}
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
var $aaa7795d9087eacf$var$MAXBITS = 15;
var $aaa7795d9087eacf$var$ENOUGH_LENS = 852;
var $aaa7795d9087eacf$var$ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);
var $aaa7795d9087eacf$var$CODES = 0;
var $aaa7795d9087eacf$var$LENS = 1;
var $aaa7795d9087eacf$var$DISTS = 2;
var $aaa7795d9087eacf$var$lbase = [
    /* Length codes 257..285 base */ 3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
];
var $aaa7795d9087eacf$var$lext = [
    /* Length codes 257..285 extra */ 16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
];
var $aaa7795d9087eacf$var$dbase = [
    /* Distance codes 0..29 base */ 1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
];
var $aaa7795d9087eacf$var$dext = [
    /* Distance codes 0..29 extra */ 16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
];
function $aaa7795d9087eacf$var$inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    //here = opts.here; /* table entry for duplication */
    var len = 0; /* a code's length in bits */ 
    var sym = 0; /* index of code symbols */ 
    var min = 0, max = 0; /* minimum and maximum code lengths */ 
    var root = 0; /* number of index bits for root table */ 
    var curr = 0; /* number of index bits for current table */ 
    var drop = 0; /* code bits to drop for sub-table */ 
    var left = 0; /* number of prefix codes available */ 
    var used = 0; /* code entries in table used */ 
    var huff = 0; /* Huffman code */ 
    var incr; /* for incrementing code, index */ 
    var fill; /* index for replicating entries */ 
    var low; /* low bits for current root entry */ 
    var mask; /* mask for low root bits */ 
    var next; /* next available space in table */ 
    var base = null; /* base value table to use */ 
    var base_index = 0;
    //  var shoextra;    /* extra bits table to use */
    var end; /* use base and extra for symbol > end */ 
    var count = new $aaa7795d9087eacf$var$Buf16($aaa7795d9087eacf$var$MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
    var offs = new $aaa7795d9087eacf$var$Buf16($aaa7795d9087eacf$var$MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
    var extra = null;
    var extra_index = 0;
    var here_bits, here_op, here_val;
    /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */ /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */ for(len = 0; len <= $aaa7795d9087eacf$var$MAXBITS; len++)count[len] = 0;
    for(sym = 0; sym < codes; sym++)count[lens[lens_index + sym]]++;
    /* bound code lengths, force root to be within code lengths */ root = bits;
    for(max = $aaa7795d9087eacf$var$MAXBITS; max >= 1; max--){
        if (count[max] !== 0) break;
    }
    if (root > max) root = max;
    if (max === 0) {
        //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
        //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
        //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
        table[table_index++] = 20971520;
        //table.op[opts.table_index] = 64;
        //table.bits[opts.table_index] = 1;
        //table.val[opts.table_index++] = 0;
        table[table_index++] = 20971520;
        opts.bits = 1;
        return 0; /* no symbols, but wait for decoding to report error */ 
    }
    for(min = 1; min < max; min++){
        if (count[min] !== 0) break;
    }
    if (root < min) root = min;
    /* check for an over-subscribed or incomplete set of lengths */ left = 1;
    for(len = 1; len <= $aaa7795d9087eacf$var$MAXBITS; len++){
        left <<= 1;
        left -= count[len];
        if (left < 0) return -1;
         /* over-subscribed */ 
    }
    if (left > 0 && (type === $aaa7795d9087eacf$var$CODES || max !== 1)) return -1; /* incomplete set */ 
    /* generate offsets into symbol table for each length for sorting */ offs[1] = 0;
    for(len = 1; len < $aaa7795d9087eacf$var$MAXBITS; len++)offs[len + 1] = offs[len] + count[len];
    /* sort symbols by length, by symbol order within each length */ for(sym = 0; sym < codes; sym++)if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;
    /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */ /* set up for code type */ // poor man optimization - use if-else instead of switch,
    // to avoid deopts in old v8
    if (type === $aaa7795d9087eacf$var$CODES) {
        base = extra = work; /* dummy value--not used */ 
        end = 19;
    } else if (type === $aaa7795d9087eacf$var$LENS) {
        base = $aaa7795d9087eacf$var$lbase;
        base_index -= 257;
        extra = $aaa7795d9087eacf$var$lext;
        extra_index -= 257;
        end = 256;
    } else {
        base = $aaa7795d9087eacf$var$dbase;
        extra = $aaa7795d9087eacf$var$dext;
        end = -1;
    }
    /* initialize opts for loop */ huff = 0; /* starting code */ 
    sym = 0; /* starting code symbol */ 
    len = min; /* starting code length */ 
    next = table_index; /* current table to fill in */ 
    curr = root; /* current table index bits */ 
    drop = 0; /* current bits to drop from code for index */ 
    low = -1; /* trigger new sub-table when len > root */ 
    used = 1 << root; /* use root table entries */ 
    mask = used - 1; /* mask for comparing low */ 
    /* check available table space */ if (type === $aaa7795d9087eacf$var$LENS && used > $aaa7795d9087eacf$var$ENOUGH_LENS || type === $aaa7795d9087eacf$var$DISTS && used > $aaa7795d9087eacf$var$ENOUGH_DISTS) return 1;
    /* process all codes and make table entries */ for(;;){
        /* create table entry */ here_bits = len - drop;
        if (work[sym] < end) {
            here_op = 0;
            here_val = work[sym];
        } else if (work[sym] > end) {
            here_op = extra[extra_index + work[sym]];
            here_val = base[base_index + work[sym]];
        } else {
            here_op = 96; /* end of block */ 
            here_val = 0;
        }
        /* replicate for those indices with low len bits equal to huff */ incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill; /* save offset to next table */ 
        do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        }while (fill !== 0)
        /* backwards increment the len-bit code huff */ incr = 1 << len - 1;
        while(huff & incr)incr >>= 1;
        if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
        } else huff = 0;
        /* go to next symbol, update count, len */ sym++;
        if (--count[len] === 0) {
            if (len === max) break;
            len = lens[lens_index + work[sym]];
        }
        /* create new sub-table if needed */ if (len > root && (huff & mask) !== low) {
            /* if first time, transition to sub-tables */ if (drop === 0) drop = root;
            /* increment past last table */ next += min; /* here min is 1 << curr */ 
            /* determine length of next table */ curr = len - drop;
            left = 1 << curr;
            while(curr + drop < max){
                left -= count[curr + drop];
                if (left <= 0) break;
                curr++;
                left <<= 1;
            }
            /* check for enough space */ used += 1 << curr;
            if (type === $aaa7795d9087eacf$var$LENS && used > $aaa7795d9087eacf$var$ENOUGH_LENS || type === $aaa7795d9087eacf$var$DISTS && used > $aaa7795d9087eacf$var$ENOUGH_DISTS) return 1;
            /* point entry in root table to sub-table */ low = huff & mask;
            /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/ table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
    }
    /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */ if (huff !== 0) //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = len - drop << 24 | 4194304;
    /* set return parameters */ //opts.table_index += used;
    opts.bits = root;
    return 0;
}
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
var $aaa7795d9087eacf$var$CODES$1 = 0;
var $aaa7795d9087eacf$var$LENS$1 = 1;
var $aaa7795d9087eacf$var$DISTS$1 = 2;
/* Public constants ==========================================================*/ /* ===========================================================================*/ /* Allowed flush values; see deflate() and inflate() below for details */ //var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var $aaa7795d9087eacf$var$Z_FINISH$2 = 4;
var $aaa7795d9087eacf$var$Z_BLOCK$1 = 5;
var $aaa7795d9087eacf$var$Z_TREES = 6;
/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */ var $aaa7795d9087eacf$var$Z_OK$2 = 0;
var $aaa7795d9087eacf$var$Z_STREAM_END$2 = 1;
var $aaa7795d9087eacf$var$Z_NEED_DICT = 2;
//var Z_ERRNO         = -1;
var $aaa7795d9087eacf$var$Z_STREAM_ERROR$1 = -2;
var $aaa7795d9087eacf$var$Z_DATA_ERROR$1 = -3;
var $aaa7795d9087eacf$var$Z_MEM_ERROR = -4;
var $aaa7795d9087eacf$var$Z_BUF_ERROR$1 = -5;
//var Z_VERSION_ERROR = -6;
/* The deflate compression method */ var $aaa7795d9087eacf$var$Z_DEFLATED$2 = 8;
/* STATES ====================================================================*/ /* ===========================================================================*/ var $aaa7795d9087eacf$var$HEAD = 1; /* i: waiting for magic header */ 
var $aaa7795d9087eacf$var$FLAGS = 2; /* i: waiting for method and flags (gzip) */ 
var $aaa7795d9087eacf$var$TIME = 3; /* i: waiting for modification time (gzip) */ 
var $aaa7795d9087eacf$var$OS = 4; /* i: waiting for extra flags and operating system (gzip) */ 
var $aaa7795d9087eacf$var$EXLEN = 5; /* i: waiting for extra length (gzip) */ 
var $aaa7795d9087eacf$var$EXTRA = 6; /* i: waiting for extra bytes (gzip) */ 
var $aaa7795d9087eacf$var$NAME = 7; /* i: waiting for end of file name (gzip) */ 
var $aaa7795d9087eacf$var$COMMENT = 8; /* i: waiting for end of comment (gzip) */ 
var $aaa7795d9087eacf$var$HCRC = 9; /* i: waiting for header crc (gzip) */ 
var $aaa7795d9087eacf$var$DICTID = 10; /* i: waiting for dictionary check value */ 
var $aaa7795d9087eacf$var$DICT = 11; /* waiting for inflateSetDictionary() call */ 
var $aaa7795d9087eacf$var$TYPE$1 = 12; /* i: waiting for type bits, including last-flag bit */ 
var $aaa7795d9087eacf$var$TYPEDO = 13; /* i: same, but skip check to exit inflate on new block */ 
var $aaa7795d9087eacf$var$STORED = 14; /* i: waiting for stored size (length and complement) */ 
var $aaa7795d9087eacf$var$COPY_ = 15; /* i/o: same as COPY below, but only first time in */ 
var $aaa7795d9087eacf$var$COPY = 16; /* i/o: waiting for input or output to copy stored block */ 
var $aaa7795d9087eacf$var$TABLE = 17; /* i: waiting for dynamic block table lengths */ 
var $aaa7795d9087eacf$var$LENLENS = 18; /* i: waiting for code length code lengths */ 
var $aaa7795d9087eacf$var$CODELENS = 19; /* i: waiting for length/lit and distance code lengths */ 
var $aaa7795d9087eacf$var$LEN_ = 20; /* i: same as LEN below, but only first time in */ 
var $aaa7795d9087eacf$var$LEN = 21; /* i: waiting for length/lit/eob code */ 
var $aaa7795d9087eacf$var$LENEXT = 22; /* i: waiting for length extra bits */ 
var $aaa7795d9087eacf$var$DIST = 23; /* i: waiting for distance code */ 
var $aaa7795d9087eacf$var$DISTEXT = 24; /* i: waiting for distance extra bits */ 
var $aaa7795d9087eacf$var$MATCH = 25; /* o: waiting for output space to copy string */ 
var $aaa7795d9087eacf$var$LIT = 26; /* o: waiting for output space to write literal */ 
var $aaa7795d9087eacf$var$CHECK = 27; /* i: waiting for 32-bit check value */ 
var $aaa7795d9087eacf$var$LENGTH = 28; /* i: waiting for 32-bit length (gzip) */ 
var $aaa7795d9087eacf$var$DONE = 29; /* finished check, done -- remain here until reset */ 
var $aaa7795d9087eacf$var$BAD$1 = 30; /* got a data error -- remain here until reset */ 
var $aaa7795d9087eacf$var$MEM = 31; /* got an inflate() memory error -- remain here until reset */ 
var $aaa7795d9087eacf$var$SYNC = 32; /* looking for synchronization bytes to restart inflate() */ 
/* ===========================================================================*/ var $aaa7795d9087eacf$var$ENOUGH_LENS$1 = 852;
var $aaa7795d9087eacf$var$ENOUGH_DISTS$1 = 592;
function $aaa7795d9087eacf$var$zswap32(q) {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
}
function $aaa7795d9087eacf$var$InflateState() {
    this.mode = 0; /* current inflate mode */ 
    this.last = false; /* true if processing last block */ 
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */ 
    this.havedict = false; /* true if dictionary provided */ 
    this.flags = 0; /* gzip header method and flags (0 if zlib) */ 
    this.dmax = 0; /* zlib header max distance (INFLATE_STRICT) */ 
    this.check = 0; /* protected copy of check value */ 
    this.total = 0; /* protected copy of output count */ 
    // TODO: may be {}
    this.head = null; /* where to save gzip header information */ 
    /* sliding window */ this.wbits = 0; /* log base 2 of requested window size */ 
    this.wsize = 0; /* window size or zero if not using window */ 
    this.whave = 0; /* valid bytes in the window */ 
    this.wnext = 0; /* window write index */ 
    this.window = null; /* allocated sliding window, if needed */ 
    /* bit accumulator */ this.hold = 0; /* input bit accumulator */ 
    this.bits = 0; /* number of bits in "in" */ 
    /* for string and stored block copying */ this.length = 0; /* literal or length of data to copy */ 
    this.offset = 0; /* distance back to copy string from */ 
    /* for table and code decoding */ this.extra = 0; /* extra bits needed */ 
    /* fixed and dynamic code tables */ this.lencode = null; /* starting table for length/literal codes */ 
    this.distcode = null; /* starting table for distance codes */ 
    this.lenbits = 0; /* index bits for lencode */ 
    this.distbits = 0; /* index bits for distcode */ 
    /* dynamic table building */ this.ncode = 0; /* number of code length code lengths */ 
    this.nlen = 0; /* number of length code lengths */ 
    this.ndist = 0; /* number of distance code lengths */ 
    this.have = 0; /* number of code lengths in lens[] */ 
    this.next = null; /* next available space in codes[] */ 
    this.lens = new $aaa7795d9087eacf$var$Buf16(320); /* temporary storage for code lengths */ 
    this.work = new $aaa7795d9087eacf$var$Buf16(288); /* work area for code table building */ 
    /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */ //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
    this.lendyn = null; /* dynamic table for length/literal codes (JS specific) */ 
    this.distdyn = null; /* dynamic table for distance codes (JS specific) */ 
    this.sane = 0; /* if false, allow invalid distance too far */ 
    this.back = 0; /* bits back of last unprocessed length/lit */ 
    this.was = 0; /* initial length of match */ 
}
function $aaa7795d9087eacf$var$inflateResetKeep(strm) {
    var state;
    if (!strm || !strm.state) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = ''; /*Z_NULL*/ 
    if (state.wrap) strm.adler = state.wrap & 1;
    state.mode = $aaa7795d9087eacf$var$HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    //state.lencode = state.distcode = state.next = state.codes;
    state.lencode = state.lendyn = new $aaa7795d9087eacf$var$Buf32($aaa7795d9087eacf$var$ENOUGH_LENS$1);
    state.distcode = state.distdyn = new $aaa7795d9087eacf$var$Buf32($aaa7795d9087eacf$var$ENOUGH_DISTS$1);
    state.sane = 1;
    state.back = -1;
    //Tracev((stderr, "inflate: reset\n"));
    return $aaa7795d9087eacf$var$Z_OK$2;
}
function $aaa7795d9087eacf$var$inflateReset(strm) {
    var state;
    if (!strm || !strm.state) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return $aaa7795d9087eacf$var$inflateResetKeep(strm);
}
function $aaa7795d9087eacf$var$inflateReset2(strm, windowBits) {
    var wrap;
    var state;
    /* get the state */ if (!strm || !strm.state) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    /* extract wrap request from windowBits parameter */ if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
    } else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) windowBits &= 15;
    }
    /* set number of window bits, free window if different */ if (windowBits && (windowBits < 8 || windowBits > 15)) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    if (state.window !== null && state.wbits !== windowBits) state.window = null;
    /* update state and reset the rest of it */ state.wrap = wrap;
    state.wbits = windowBits;
    return $aaa7795d9087eacf$var$inflateReset(strm);
}
function $aaa7795d9087eacf$var$inflateInit2(strm, windowBits) {
    var ret;
    var state;
    if (!strm) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    //strm.msg = Z_NULL;                 /* in case we return an error */
    state = new $aaa7795d9087eacf$var$InflateState();
    //if (state === Z_NULL) return Z_MEM_ERROR;
    //Tracev((stderr, "inflate: allocated\n"));
    strm.state = state;
    state.window = null;
    ret = $aaa7795d9087eacf$var$inflateReset2(strm, windowBits);
    if (ret !== $aaa7795d9087eacf$var$Z_OK$2) strm.state = null;
    return ret;
}
/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */ var $aaa7795d9087eacf$var$virgin = true;
var $aaa7795d9087eacf$var$lenfix, $aaa7795d9087eacf$var$distfix; // We have no pointers in JS, so keep tables separate
function $aaa7795d9087eacf$var$fixedtables(state) {
    /* build fixed huffman tables if first call (may not be thread safe) */ if ($aaa7795d9087eacf$var$virgin) {
        var sym;
        $aaa7795d9087eacf$var$lenfix = new $aaa7795d9087eacf$var$Buf32(512);
        $aaa7795d9087eacf$var$distfix = new $aaa7795d9087eacf$var$Buf32(32);
        /* literal/length table */ sym = 0;
        while(sym < 144)state.lens[sym++] = 8;
        while(sym < 256)state.lens[sym++] = 9;
        while(sym < 280)state.lens[sym++] = 7;
        while(sym < 288)state.lens[sym++] = 8;
        $aaa7795d9087eacf$var$inflate_table($aaa7795d9087eacf$var$LENS$1, state.lens, 0, 288, $aaa7795d9087eacf$var$lenfix, 0, state.work, {
            bits: 9
        });
        /* distance table */ sym = 0;
        while(sym < 32)state.lens[sym++] = 5;
        $aaa7795d9087eacf$var$inflate_table($aaa7795d9087eacf$var$DISTS$1, state.lens, 0, 32, $aaa7795d9087eacf$var$distfix, 0, state.work, {
            bits: 5
        });
        /* do this just once */ $aaa7795d9087eacf$var$virgin = false;
    }
    state.lencode = $aaa7795d9087eacf$var$lenfix;
    state.lenbits = 9;
    state.distcode = $aaa7795d9087eacf$var$distfix;
    state.distbits = 5;
}
/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */ function $aaa7795d9087eacf$var$updatewindow(strm, src, end, copy) {
    var dist;
    var state = strm.state;
    /* if it hasn't been done already, allocate space for the window */ if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new $aaa7795d9087eacf$var$Buf8(state.wsize);
    }
    /* copy state->wsize or less output bytes into the circular window */ if (copy >= state.wsize) {
        $aaa7795d9087eacf$var$arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
    } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) dist = copy;
        //zmemcpy(state->window + state->wnext, end - copy, dist);
        $aaa7795d9087eacf$var$arraySet(state.window, src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
            //zmemcpy(state->window, end - copy, copy);
            $aaa7795d9087eacf$var$arraySet(state.window, src, end - copy, copy, 0);
            state.wnext = copy;
            state.whave = state.wsize;
        } else {
            state.wnext += dist;
            if (state.wnext === state.wsize) state.wnext = 0;
            if (state.whave < state.wsize) state.whave += dist;
        }
    }
    return 0;
}
function $aaa7795d9087eacf$var$inflate(strm, flush) {
    var state;
    var input, output; // input/output buffers
    var next; /* next input INDEX */ 
    var put; /* next output INDEX */ 
    var have, left; /* available input and output */ 
    var hold; /* bit buffer */ 
    var bits; /* bits in bit buffer */ 
    var _in, _out; /* save starting available input and output */ 
    var copy; /* number of stored or match bytes to copy */ 
    var from; /* where to copy match bytes from */ 
    var from_source;
    var here = 0; /* current decoding table entry */ 
    var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
    //var last;                   /* parent table entry */
    var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
    var len; /* length to copy for repeats, bits to drop */ 
    var ret; /* return code */ 
    var hbuf = new $aaa7795d9087eacf$var$Buf8(4); /* buffer for gzip header crc calculation */ 
    var opts;
    var n; // temporary var for NEED_BITS
    var order = /* permutation of code lengths */ [
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
    ];
    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    if (state.mode === $aaa7795d9087eacf$var$TYPE$1) state.mode = $aaa7795d9087eacf$var$TYPEDO;
     /* skip check */ 
    //--- LOAD() ---
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    //---
    _in = have;
    _out = left;
    ret = $aaa7795d9087eacf$var$Z_OK$2;
    inf_leave: for(;;)switch(state.mode){
        case $aaa7795d9087eacf$var$HEAD:
            if (state.wrap === 0) {
                state.mode = $aaa7795d9087eacf$var$TYPEDO;
                break;
            }
            //=== NEEDBITS(16);
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.wrap & 2 && hold === 35615) {
                state.check = 0 /*crc32(0L, Z_NULL, 0)*/ ;
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = $aaa7795d9087eacf$var$crc32(state.check, hbuf, 2, 0);
                //===//
                //=== INITBITS();
                hold = 0;
                bits = 0;
                //===//
                state.mode = $aaa7795d9087eacf$var$FLAGS;
                break;
            }
            state.flags = 0; /* expect zlib header */ 
            if (state.head) state.head.done = false;
            if (!(state.wrap & 1) || /* check if zlib header allowed */ (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = 'incorrect header check';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            if ((hold & 15) !== $aaa7795d9087eacf$var$Z_DEFLATED$2) {
                strm.msg = 'unknown compression method';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            //--- DROPBITS(4) ---//
            hold >>>= 4;
            bits -= 4;
            //---//
            len = (hold & 15) + 8;
            if (state.wbits === 0) state.wbits = len;
            else if (len > state.wbits) {
                strm.msg = 'invalid window size';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            state.dmax = 1 << len;
            //Tracev((stderr, "inflate:   zlib header ok\n"));
            strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
            state.mode = hold & 512 ? $aaa7795d9087eacf$var$DICTID : $aaa7795d9087eacf$var$TYPE$1;
            //=== INITBITS();
            hold = 0;
            bits = 0;
            break;
        case $aaa7795d9087eacf$var$FLAGS:
            //=== NEEDBITS(16); */
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.flags = hold;
            if ((state.flags & 255) !== $aaa7795d9087eacf$var$Z_DEFLATED$2) {
                strm.msg = 'unknown compression method';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            if (state.flags & 57344) {
                strm.msg = 'unknown header flags set';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            if (state.head) state.head.text = hold >> 8 & 1;
            if (state.flags & 512) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = $aaa7795d9087eacf$var$crc32(state.check, hbuf, 2, 0);
            //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $aaa7795d9087eacf$var$TIME;
        /* falls through */ case $aaa7795d9087eacf$var$TIME:
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.head) state.head.time = hold;
            if (state.flags & 512) {
                //=== CRC4(state.check, hold)
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = $aaa7795d9087eacf$var$crc32(state.check, hbuf, 4, 0);
            //===
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $aaa7795d9087eacf$var$OS;
        /* falls through */ case $aaa7795d9087eacf$var$OS:
            //=== NEEDBITS(16); */
            while(bits < 16){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
            }
            if (state.flags & 512) {
                //=== CRC2(state.check, hold);
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = $aaa7795d9087eacf$var$crc32(state.check, hbuf, 2, 0);
            //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $aaa7795d9087eacf$var$EXLEN;
        /* falls through */ case $aaa7795d9087eacf$var$EXLEN:
            if (state.flags & 1024) {
                //=== NEEDBITS(16); */
                while(bits < 16){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.length = hold;
                if (state.head) state.head.extra_len = hold;
                if (state.flags & 512) {
                    //=== CRC2(state.check, hold);
                    hbuf[0] = hold & 255;
                    hbuf[1] = hold >>> 8 & 255;
                    state.check = $aaa7795d9087eacf$var$crc32(state.check, hbuf, 2, 0);
                //===//
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            } else if (state.head) state.head.extra = null;
            state.mode = $aaa7795d9087eacf$var$EXTRA;
        /* falls through */ case $aaa7795d9087eacf$var$EXTRA:
            if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) copy = have;
                if (copy) {
                    if (state.head) {
                        len = state.head.extra_len - state.length;
                        if (!state.head.extra) // Use untyped array for more convenient processing later
                        state.head.extra = new Array(state.head.extra_len);
                        $aaa7795d9087eacf$var$arraySet(state.head.extra, input, next, // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        copy, /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/ len);
                    //zmemcpy(state.head.extra + len, next,
                    //        len + copy > state.head.extra_max ?
                    //        state.head.extra_max - len : copy);
                    }
                    if (state.flags & 512) state.check = $aaa7795d9087eacf$var$crc32(state.check, input, copy, next);
                    have -= copy;
                    next += copy;
                    state.length -= copy;
                }
                if (state.length) break inf_leave;
            }
            state.length = 0;
            state.mode = $aaa7795d9087eacf$var$NAME;
        /* falls through */ case $aaa7795d9087eacf$var$NAME:
            if (state.flags & 2048) {
                if (have === 0) break inf_leave;
                copy = 0;
                do {
                    // TODO: 2 or 1 bytes?
                    len = input[next + copy++];
                    /* use constant limit because in js we should not preallocate memory */ if (state.head && len && state.length < 65536 /*state.head.name_max*/ ) state.head.name += String.fromCharCode(len);
                }while (len && copy < have)
                if (state.flags & 512) state.check = $aaa7795d9087eacf$var$crc32(state.check, input, copy, next);
                have -= copy;
                next += copy;
                if (len) break inf_leave;
            } else if (state.head) state.head.name = null;
            state.length = 0;
            state.mode = $aaa7795d9087eacf$var$COMMENT;
        /* falls through */ case $aaa7795d9087eacf$var$COMMENT:
            if (state.flags & 4096) {
                if (have === 0) break inf_leave;
                copy = 0;
                do {
                    len = input[next + copy++];
                    /* use constant limit because in js we should not preallocate memory */ if (state.head && len && state.length < 65536 /*state.head.comm_max*/ ) state.head.comment += String.fromCharCode(len);
                }while (len && copy < have)
                if (state.flags & 512) state.check = $aaa7795d9087eacf$var$crc32(state.check, input, copy, next);
                have -= copy;
                next += copy;
                if (len) break inf_leave;
            } else if (state.head) state.head.comment = null;
            state.mode = $aaa7795d9087eacf$var$HCRC;
        /* falls through */ case $aaa7795d9087eacf$var$HCRC:
            if (state.flags & 512) {
                //=== NEEDBITS(16); */
                while(bits < 16){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                if (hold !== (state.check & 65535)) {
                    strm.msg = 'header crc mismatch';
                    state.mode = $aaa7795d9087eacf$var$BAD$1;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            }
            if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = $aaa7795d9087eacf$var$TYPE$1;
            break;
        case $aaa7795d9087eacf$var$DICTID:
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            strm.adler = state.check = $aaa7795d9087eacf$var$zswap32(hold);
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $aaa7795d9087eacf$var$DICT;
        /* falls through */ case $aaa7795d9087eacf$var$DICT:
            if (state.havedict === 0) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                return $aaa7795d9087eacf$var$Z_NEED_DICT;
            }
            strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/ ;
            state.mode = $aaa7795d9087eacf$var$TYPE$1;
        /* falls through */ case $aaa7795d9087eacf$var$TYPE$1:
            if (flush === $aaa7795d9087eacf$var$Z_BLOCK$1 || flush === $aaa7795d9087eacf$var$Z_TREES) break inf_leave;
        /* falls through */ case $aaa7795d9087eacf$var$TYPEDO:
            if (state.last) {
                //--- BYTEBITS() ---//
                hold >>>= bits & 7;
                bits -= bits & 7;
                //---//
                state.mode = $aaa7795d9087eacf$var$CHECK;
                break;
            }
            //=== NEEDBITS(3); */
            while(bits < 3){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.last = hold & 1;
            //--- DROPBITS(1) ---//
            hold >>>= 1;
            bits -= 1;
            //---//
            switch(hold & 3){
                case 0:
                    /* stored block */ //Tracev((stderr, "inflate:     stored block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $aaa7795d9087eacf$var$STORED;
                    break;
                case 1:
                    /* fixed block */ $aaa7795d9087eacf$var$fixedtables(state);
                    //Tracev((stderr, "inflate:     fixed codes block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $aaa7795d9087eacf$var$LEN_; /* decode codes */ 
                    if (flush === $aaa7795d9087eacf$var$Z_TREES) {
                        //--- DROPBITS(2) ---//
                        hold >>>= 2;
                        bits -= 2;
                        break inf_leave;
                    }
                    break;
                case 2:
                    /* dynamic block */ //Tracev((stderr, "inflate:     dynamic codes block%s\n",
                    //        state.last ? " (last)" : ""));
                    state.mode = $aaa7795d9087eacf$var$TABLE;
                    break;
                case 3:
                    strm.msg = 'invalid block type';
                    state.mode = $aaa7795d9087eacf$var$BAD$1;
            }
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            break;
        case $aaa7795d9087eacf$var$STORED:
            //--- BYTEBITS() ---// /* go to byte boundary */
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            //=== NEEDBITS(32); */
            while(bits < 32){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = 'invalid stored block lengths';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            state.length = hold & 65535;
            //Tracev((stderr, "inflate:       stored length %u\n",
            //        state.length));
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = $aaa7795d9087eacf$var$COPY_;
            if (flush === $aaa7795d9087eacf$var$Z_TREES) break inf_leave;
        /* falls through */ case $aaa7795d9087eacf$var$COPY_:
            state.mode = $aaa7795d9087eacf$var$COPY;
        /* falls through */ case $aaa7795d9087eacf$var$COPY:
            copy = state.length;
            if (copy) {
                if (copy > have) copy = have;
                if (copy > left) copy = left;
                if (copy === 0) break inf_leave;
                //--- zmemcpy(put, next, copy); ---
                $aaa7795d9087eacf$var$arraySet(output, input, next, copy, put);
                //---//
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
            }
            //Tracev((stderr, "inflate:       stored end\n"));
            state.mode = $aaa7795d9087eacf$var$TYPE$1;
            break;
        case $aaa7795d9087eacf$var$TABLE:
            //=== NEEDBITS(14); */
            while(bits < 14){
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            }
            //===//
            state.nlen = (hold & 31) + 257;
            //--- DROPBITS(5) ---//
            hold >>>= 5;
            bits -= 5;
            //---//
            state.ndist = (hold & 31) + 1;
            //--- DROPBITS(5) ---//
            hold >>>= 5;
            bits -= 5;
            //---//
            state.ncode = (hold & 15) + 4;
            //--- DROPBITS(4) ---//
            hold >>>= 4;
            bits -= 4;
            //---//
            //#ifndef PKZIP_BUG_WORKAROUND
            if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = 'too many length or distance symbols';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            //#endif
            //Tracev((stderr, "inflate:       table sizes ok\n"));
            state.have = 0;
            state.mode = $aaa7795d9087eacf$var$LENLENS;
        /* falls through */ case $aaa7795d9087eacf$var$LENLENS:
            while(state.have < state.ncode){
                //=== NEEDBITS(3);
                while(bits < 3){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.lens[order[state.have++]] = hold & 7; //BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
            //---//
            }
            while(state.have < 19)state.lens[order[state.have++]] = 0;
            // We have separate tables & no pointers. 2 commented lines below not needed.
            //state.next = state.codes;
            //state.lencode = state.next;
            // Switch to use dynamic table
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = {
                bits: state.lenbits
            };
            ret = $aaa7795d9087eacf$var$inflate_table($aaa7795d9087eacf$var$CODES$1, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
                strm.msg = 'invalid code lengths set';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            //Tracev((stderr, "inflate:       code lengths ok\n"));
            state.have = 0;
            state.mode = $aaa7795d9087eacf$var$CODELENS;
        /* falls through */ case $aaa7795d9087eacf$var$CODELENS:
            while(state.have < state.nlen + state.ndist){
                for(;;){
                    here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/ 
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                if (here_val < 16) {
                    //--- DROPBITS(here.bits) ---//
                    hold >>>= here_bits;
                    bits -= here_bits;
                    //---//
                    state.lens[state.have++] = here_val;
                } else {
                    if (here_val === 16) {
                        //=== NEEDBITS(here.bits + 2);
                        n = here_bits + 2;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        if (state.have === 0) {
                            strm.msg = 'invalid bit length repeat';
                            state.mode = $aaa7795d9087eacf$var$BAD$1;
                            break;
                        }
                        len = state.lens[state.have - 1];
                        copy = 3 + (hold & 3); //BITS(2);
                        //--- DROPBITS(2) ---//
                        hold >>>= 2;
                        bits -= 2;
                    //---//
                    } else if (here_val === 17) {
                        //=== NEEDBITS(here.bits + 3);
                        n = here_bits + 3;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        len = 0;
                        copy = 3 + (hold & 7); //BITS(3);
                        //--- DROPBITS(3) ---//
                        hold >>>= 3;
                        bits -= 3;
                    //---//
                    } else {
                        //=== NEEDBITS(here.bits + 7);
                        n = here_bits + 7;
                        while(bits < n){
                            if (have === 0) break inf_leave;
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        //===//
                        //--- DROPBITS(here.bits) ---//
                        hold >>>= here_bits;
                        bits -= here_bits;
                        //---//
                        len = 0;
                        copy = 11 + (hold & 127); //BITS(7);
                        //--- DROPBITS(7) ---//
                        hold >>>= 7;
                        bits -= 7;
                    //---//
                    }
                    if (state.have + copy > state.nlen + state.ndist) {
                        strm.msg = 'invalid bit length repeat';
                        state.mode = $aaa7795d9087eacf$var$BAD$1;
                        break;
                    }
                    while(copy--)state.lens[state.have++] = len;
                }
            }
            /* handle error breaks in while */ if (state.mode === $aaa7795d9087eacf$var$BAD$1) break;
            /* check for end-of-block code (better have one) */ if (state.lens[256] === 0) {
                strm.msg = 'invalid code -- missing end-of-block';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */ state.lenbits = 9;
            opts = {
                bits: state.lenbits
            };
            ret = $aaa7795d9087eacf$var$inflate_table($aaa7795d9087eacf$var$LENS$1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            // We have separate tables & no pointers. 2 commented lines below not needed.
            // state.next_index = opts.table_index;
            state.lenbits = opts.bits;
            // state.lencode = state.next;
            if (ret) {
                strm.msg = 'invalid literal/lengths set';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            state.distbits = 6;
            //state.distcode.copy(state.codes);
            // Switch to use dynamic table
            state.distcode = state.distdyn;
            opts = {
                bits: state.distbits
            };
            ret = $aaa7795d9087eacf$var$inflate_table($aaa7795d9087eacf$var$DISTS$1, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            // We have separate tables & no pointers. 2 commented lines below not needed.
            // state.next_index = opts.table_index;
            state.distbits = opts.bits;
            // state.distcode = state.next;
            if (ret) {
                strm.msg = 'invalid distances set';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            //Tracev((stderr, 'inflate:       codes ok\n'));
            state.mode = $aaa7795d9087eacf$var$LEN_;
            if (flush === $aaa7795d9087eacf$var$Z_TREES) break inf_leave;
        /* falls through */ case $aaa7795d9087eacf$var$LEN_:
            state.mode = $aaa7795d9087eacf$var$LEN;
        /* falls through */ case $aaa7795d9087eacf$var$LEN:
            if (have >= 6 && left >= 258) {
                //--- RESTORE() ---
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                //---
                $aaa7795d9087eacf$var$inflate_fast(strm, _out);
                //--- LOAD() ---
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                //---
                if (state.mode === $aaa7795d9087eacf$var$TYPE$1) state.back = -1;
                break;
            }
            state.back = 0;
            for(;;){
                here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/ 
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) break;
                //--- PULLBYTE() ---//
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            //---//
            }
            if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for(;;){
                    here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (last_bits + here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
            }
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
                //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
                //        "inflate:         literal '%c'\n" :
                //        "inflate:         literal 0x%02x\n", here.val));
                state.mode = $aaa7795d9087eacf$var$LIT;
                break;
            }
            if (here_op & 32) {
                //Tracevv((stderr, "inflate:         end of block\n"));
                state.back = -1;
                state.mode = $aaa7795d9087eacf$var$TYPE$1;
                break;
            }
            if (here_op & 64) {
                strm.msg = 'invalid literal/length code';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            state.extra = here_op & 15;
            state.mode = $aaa7795d9087eacf$var$LENEXT;
        /* falls through */ case $aaa7795d9087eacf$var$LENEXT:
            if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while(bits < n){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.length += hold & (1 << state.extra) - 1;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
            }
            //Tracevv((stderr, "inflate:         length %u\n", state.length));
            state.was = state.length;
            state.mode = $aaa7795d9087eacf$var$DIST;
        /* falls through */ case $aaa7795d9087eacf$var$DIST:
            for(;;){
                here = state.distcode[hold & (1 << state.distbits) - 1]; /*BITS(state.distbits)*/ 
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) break;
                //--- PULLBYTE() ---//
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
            //---//
            }
            if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for(;;){
                    here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                    here_bits = here >>> 24;
                    here_op = here >>> 16 & 255;
                    here_val = here & 65535;
                    if (last_bits + here_bits <= bits) break;
                    //--- PULLBYTE() ---//
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                //---//
                }
                //--- DROPBITS(last.bits) ---//
                hold >>>= last_bits;
                bits -= last_bits;
                //---//
                state.back += last_bits;
            }
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.back += here_bits;
            if (here_op & 64) {
                strm.msg = 'invalid distance code';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = $aaa7795d9087eacf$var$DISTEXT;
        /* falls through */ case $aaa7795d9087eacf$var$DISTEXT:
            if (state.extra) {
                //=== NEEDBITS(state.extra);
                n = state.extra;
                while(bits < n){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                state.offset += hold & (1 << state.extra) - 1;
                //--- DROPBITS(state.extra) ---//
                hold >>>= state.extra;
                bits -= state.extra;
                //---//
                state.back += state.extra;
            }
            //#ifdef INFLATE_STRICT
            if (state.offset > state.dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = $aaa7795d9087eacf$var$BAD$1;
                break;
            }
            //#endif
            //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
            state.mode = $aaa7795d9087eacf$var$MATCH;
        /* falls through */ case $aaa7795d9087eacf$var$MATCH:
            if (left === 0) break inf_leave;
            copy = _out - left;
            if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                    if (state.sane) {
                        strm.msg = 'invalid distance too far back';
                        state.mode = $aaa7795d9087eacf$var$BAD$1;
                        break;
                    }
                }
                if (copy > state.wnext) {
                    copy -= state.wnext;
                    from = state.wsize - copy;
                } else from = state.wnext - copy;
                if (copy > state.length) copy = state.length;
                from_source = state.window;
            } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
            }
            if (copy > left) copy = left;
            left -= copy;
            state.length -= copy;
            do output[put++] = from_source[from++];
            while (--copy)
            if (state.length === 0) state.mode = $aaa7795d9087eacf$var$LEN;
            break;
        case $aaa7795d9087eacf$var$LIT:
            if (left === 0) break inf_leave;
            output[put++] = state.length;
            left--;
            state.mode = $aaa7795d9087eacf$var$LEN;
            break;
        case $aaa7795d9087eacf$var$CHECK:
            if (state.wrap) {
                //=== NEEDBITS(32);
                while(bits < 32){
                    if (have === 0) break inf_leave;
                    have--;
                    // Use '|' instead of '+' to make sure that result is signed
                    hold |= input[next++] << bits;
                    bits += 8;
                }
                //===//
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) strm.adler = state.check = state.flags ? $aaa7795d9087eacf$var$crc32(state.check, output, _out, put - _out) : $aaa7795d9087eacf$var$adler32(state.check, output, _out, put - _out);
                _out = left;
                // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
                if ((state.flags ? hold : $aaa7795d9087eacf$var$zswap32(hold)) !== state.check) {
                    strm.msg = 'incorrect data check';
                    state.mode = $aaa7795d9087eacf$var$BAD$1;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
            }
            state.mode = $aaa7795d9087eacf$var$LENGTH;
        /* falls through */ case $aaa7795d9087eacf$var$LENGTH:
            if (state.wrap && state.flags) {
                //=== NEEDBITS(32);
                while(bits < 32){
                    if (have === 0) break inf_leave;
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                }
                //===//
                if (hold !== (state.total & 4294967295)) {
                    strm.msg = 'incorrect length check';
                    state.mode = $aaa7795d9087eacf$var$BAD$1;
                    break;
                }
                //=== INITBITS();
                hold = 0;
                bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
            }
            state.mode = $aaa7795d9087eacf$var$DONE;
        /* falls through */ case $aaa7795d9087eacf$var$DONE:
            ret = $aaa7795d9087eacf$var$Z_STREAM_END$2;
            break inf_leave;
        case $aaa7795d9087eacf$var$BAD$1:
            ret = $aaa7795d9087eacf$var$Z_DATA_ERROR$1;
            break inf_leave;
        case $aaa7795d9087eacf$var$MEM:
            return $aaa7795d9087eacf$var$Z_MEM_ERROR;
        case $aaa7795d9087eacf$var$SYNC:
        /* falls through */ default:
            return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    }
    // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
    /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */ //--- RESTORE() ---
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    //---
    if (state.wsize || _out !== strm.avail_out && state.mode < $aaa7795d9087eacf$var$BAD$1 && (state.mode < $aaa7795d9087eacf$var$CHECK || flush !== $aaa7795d9087eacf$var$Z_FINISH$2)) $aaa7795d9087eacf$var$updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out);
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) strm.adler = state.check = state.flags ? $aaa7795d9087eacf$var$crc32(state.check, output, _out, strm.next_out - _out) : $aaa7795d9087eacf$var$adler32(state.check, output, _out, strm.next_out - _out);
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === $aaa7795d9087eacf$var$TYPE$1 ? 128 : 0) + (state.mode === $aaa7795d9087eacf$var$LEN_ || state.mode === $aaa7795d9087eacf$var$COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === $aaa7795d9087eacf$var$Z_FINISH$2) && ret === $aaa7795d9087eacf$var$Z_OK$2) ret = $aaa7795d9087eacf$var$Z_BUF_ERROR$1;
    return ret;
}
function $aaa7795d9087eacf$var$inflateEnd(strm) {
    if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/ ) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    var state = strm.state;
    if (state.window) state.window = null;
    strm.state = null;
    return $aaa7795d9087eacf$var$Z_OK$2;
}
function $aaa7795d9087eacf$var$inflateGetHeader(strm, head) {
    var state;
    /* check state */ if (!strm || !strm.state) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    if ((state.wrap & 2) === 0) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    /* save header structure */ state.head = head;
    head.done = false;
    return $aaa7795d9087eacf$var$Z_OK$2;
}
function $aaa7795d9087eacf$var$inflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var state;
    var dictid;
    var ret;
    /* check state */ if (!strm /* == Z_NULL */  || !strm.state /* == Z_NULL */ ) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== $aaa7795d9087eacf$var$DICT) return $aaa7795d9087eacf$var$Z_STREAM_ERROR$1;
    /* check for correct dictionary identifier */ if (state.mode === $aaa7795d9087eacf$var$DICT) {
        dictid = 1; /* adler32(0, null, 0)*/ 
        /* dictid = adler32(dictid, dictionary, dictLength); */ dictid = $aaa7795d9087eacf$var$adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) return $aaa7795d9087eacf$var$Z_DATA_ERROR$1;
    }
    /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */ ret = $aaa7795d9087eacf$var$updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
        state.mode = $aaa7795d9087eacf$var$MEM;
        return $aaa7795d9087eacf$var$Z_MEM_ERROR;
    }
    state.havedict = 1;
    // Tracev((stderr, "inflate:   dictionary set\n"));
    return $aaa7795d9087eacf$var$Z_OK$2;
}
/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/ // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
var $aaa7795d9087eacf$var$constants = {
    /* Allowed flush values; see deflate() and inflate() below for details */ Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */ Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    //Z_MEM_ERROR:     -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */ Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */ Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */ Z_DEFLATED: 8
};
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
function $aaa7795d9087eacf$var$GZheader() {
    /* true if compressed data believed to be text */ this.text = 0;
    /* modification time */ this.time = 0;
    /* extra flags (not used when writing a gzip file) */ this.xflags = 0;
    /* operating system */ this.os = 0;
    /* pointer to extra field or Z_NULL if none */ this.extra = null;
    /* extra field length (valid if extra != Z_NULL) */ this.extra_len = 0; // Actually, we don't need it in JS,
    // but leave for few code modifications
    //
    // Setup limits is not necessary because in js we should not preallocate memory
    // for inflate use constant limit in 65536 bytes
    //
    /* space at extra (only when reading header) */ // this.extra_max  = 0;
    /* pointer to zero-terminated file name or Z_NULL */ this.name = '';
    /* space at name (only when reading header) */ // this.name_max   = 0;
    /* pointer to zero-terminated comment or Z_NULL */ this.comment = '';
    /* space at comment (only when reading header) */ // this.comm_max   = 0;
    /* true if there was or will be a header crc */ this.hcrc = 0;
    /* true when done reading gzip header (not used when writing a gzip file) */ this.done = false;
}
var $aaa7795d9087eacf$var$toString$1 = Object.prototype.toString;
/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/ /* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/ /**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/ /**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/ /**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/ /**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/ function $aaa7795d9087eacf$export$d1de70a877d6e43c(options) {
    if (!(this instanceof $aaa7795d9087eacf$export$d1de70a877d6e43c)) return new $aaa7795d9087eacf$export$d1de70a877d6e43c(options);
    this.options = $aaa7795d9087eacf$var$assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ''
    }, options || {
    });
    var opt = this.options;
    // Force window size for `raw` data, if not set directly,
    // because we have no header for autodetect.
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) opt.windowBits = -15;
    }
    // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) opt.windowBits += 32;
    // Gzip header has no info about windows size, we can do autodetect only
    // for deflate. So, if window size not set, force it to max when gzip possible
    if (opt.windowBits > 15 && opt.windowBits < 48) // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    {
        if ((opt.windowBits & 15) === 0) opt.windowBits |= 15;
    }
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data
    this.strm = new $aaa7795d9087eacf$var$ZStream();
    this.strm.avail_out = 0;
    var status = $aaa7795d9087eacf$var$inflateInit2(this.strm, opt.windowBits);
    if (status !== $aaa7795d9087eacf$var$constants.Z_OK) throw new Error($aaa7795d9087eacf$var$msg[status]);
    this.header = new $aaa7795d9087eacf$var$GZheader();
    $aaa7795d9087eacf$var$inflateGetHeader(this.strm, this.header);
}
/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/ $aaa7795d9087eacf$export$d1de70a877d6e43c.prototype.push = function(data, mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var dictionary = this.options.dictionary;
    var status, _mode;
    var next_out_utf8, tail, utf8str;
    var dict;
    // Flag to properly process Z_BUF_ERROR on testing inflate call
    // when we check that all output data was flushed.
    var allowBufError = false;
    if (this.ended) return false;
    _mode = mode === ~~mode ? mode : mode === true ? $aaa7795d9087eacf$var$constants.Z_FINISH : $aaa7795d9087eacf$var$constants.Z_NO_FLUSH;
    // Convert data if needed
    if (typeof data === 'string') // Only binary strings can be decompressed on practice
    strm.input = $aaa7795d9087eacf$var$binstring2buf(data);
    else if ($aaa7795d9087eacf$var$toString$1.call(data) === '[object ArrayBuffer]') strm.input = new Uint8Array(data);
    else strm.input = data;
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    do {
        if (strm.avail_out === 0) {
            strm.output = new $aaa7795d9087eacf$var$Buf8(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
        }
        status = $aaa7795d9087eacf$var$inflate(strm, $aaa7795d9087eacf$var$constants.Z_NO_FLUSH); /* no bad return value */ 
        if (status === $aaa7795d9087eacf$var$constants.Z_NEED_DICT && dictionary) {
            // Convert data if needed
            if (typeof dictionary === 'string') dict = $aaa7795d9087eacf$var$string2buf(dictionary);
            else if ($aaa7795d9087eacf$var$toString$1.call(dictionary) === '[object ArrayBuffer]') dict = new Uint8Array(dictionary);
            else dict = dictionary;
            status = $aaa7795d9087eacf$var$inflateSetDictionary(this.strm, dict);
        }
        if (status === $aaa7795d9087eacf$var$constants.Z_BUF_ERROR && allowBufError === true) {
            status = $aaa7795d9087eacf$var$constants.Z_OK;
            allowBufError = false;
        }
        if (status !== $aaa7795d9087eacf$var$constants.Z_STREAM_END && status !== $aaa7795d9087eacf$var$constants.Z_OK) {
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        if (strm.next_out) {
            if (strm.avail_out === 0 || status === $aaa7795d9087eacf$var$constants.Z_STREAM_END || strm.avail_in === 0 && (_mode === $aaa7795d9087eacf$var$constants.Z_FINISH || _mode === $aaa7795d9087eacf$var$constants.Z_SYNC_FLUSH)) {
                if (this.options.to === 'string') {
                    next_out_utf8 = $aaa7795d9087eacf$var$utf8border(strm.output, strm.next_out);
                    tail = strm.next_out - next_out_utf8;
                    utf8str = $aaa7795d9087eacf$var$buf2string(strm.output, next_out_utf8);
                    // move tail
                    strm.next_out = tail;
                    strm.avail_out = chunkSize - tail;
                    if (tail) $aaa7795d9087eacf$var$arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
                    this.onData(utf8str);
                } else this.onData($aaa7795d9087eacf$var$shrinkBuf(strm.output, strm.next_out));
            }
        }
        // When no more input data, we should check that internal inflate buffers
        // are flushed. The only way to do it when avail_out = 0 - run one more
        // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
        // Here we set flag to process this error properly.
        //
        // NOTE. Deflate does not return error in this case and does not needs such
        // logic.
        if (strm.avail_in === 0 && strm.avail_out === 0) allowBufError = true;
    }while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== $aaa7795d9087eacf$var$constants.Z_STREAM_END)
    if (status === $aaa7795d9087eacf$var$constants.Z_STREAM_END) _mode = $aaa7795d9087eacf$var$constants.Z_FINISH;
    // Finalize on the last chunk.
    if (_mode === $aaa7795d9087eacf$var$constants.Z_FINISH) {
        status = $aaa7795d9087eacf$var$inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === $aaa7795d9087eacf$var$constants.Z_OK;
    }
    // callback interim results if Z_SYNC_FLUSH.
    if (_mode === $aaa7795d9087eacf$var$constants.Z_SYNC_FLUSH) {
        this.onEnd($aaa7795d9087eacf$var$constants.Z_OK);
        strm.avail_out = 0;
        return true;
    }
    return true;
};
/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/ $aaa7795d9087eacf$export$d1de70a877d6e43c.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
};
/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/ $aaa7795d9087eacf$export$d1de70a877d6e43c.prototype.onEnd = function(status) {
    // On success - join
    if (status === $aaa7795d9087eacf$var$constants.Z_OK) {
        if (this.options.to === 'string') // Glue & convert here, until we teach pako to send
        // utf8 aligned strings to onData
        this.result = this.chunks.join('');
        else this.result = $aaa7795d9087eacf$var$flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
};
/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/ function $aaa7795d9087eacf$export$cae1ce83fe4a1782(input, options) {
    var inflator = new $aaa7795d9087eacf$export$d1de70a877d6e43c(options);
    inflator.push(input, true);
    // That will never happens, if you don't cheat with options :)
    if (inflator.err) throw inflator.msg || $aaa7795d9087eacf$var$msg[inflator.err];
    return inflator.result;
}
/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/ function $aaa7795d9087eacf$export$d0f0aa2d05c905c5(input, options) {
    options = options || {
    };
    options.raw = true;
    return $aaa7795d9087eacf$export$cae1ce83fe4a1782(input, options);
}
var $aaa7795d9087eacf$var$inflate$2 = /*#__PURE__*/ Object.freeze({
    Inflate: $aaa7795d9087eacf$export$d1de70a877d6e43c,
    inflate: $aaa7795d9087eacf$export$cae1ce83fe4a1782,
    inflateRaw: $aaa7795d9087eacf$export$d0f0aa2d05c905c5,
    ungzip: $aaa7795d9087eacf$export$cae1ce83fe4a1782
});
// Top level file is just a mixin of submodules & constants
const $aaa7795d9087eacf$var$pako = {
};
$aaa7795d9087eacf$var$assign($aaa7795d9087eacf$var$pako, $aaa7795d9087eacf$var$deflate$2, $aaa7795d9087eacf$var$inflate$2, $aaa7795d9087eacf$var$constants);
var $aaa7795d9087eacf$export$2e2bcd8739ae039 = $aaa7795d9087eacf$var$pako;


const $5ca17479ed366a65$var$zlib = {
    decompress: function(buf) {
        let input_array = new Uint8Array(buf);
        return $aaa7795d9087eacf$export$2e2bcd8739ae039.inflate(input_array).buffer;
    }
};
class $5ca17479ed366a65$var$AbstractBTree {
    init() {
        this.all_nodes = new Map();
        this._read_root_node();
        this._read_children();
    }
    _read_children() {
        // # Leaf nodes: level 0
        // # Root node: level "depth"
        let node_level = this.depth;
        while(node_level > 0){
            for (var parent_node of this.all_nodes.get(node_level))for (var child_addr of parent_node.get('addresses'))this._add_node(this._read_node(child_addr, node_level - 1));
            node_level--;
        }
    }
    _read_root_node() {
        let root_node = this._read_node(this.offset, null);
        this._add_node(root_node);
        this.depth = root_node.get('node_level');
    }
    _add_node(node1) {
        let node_level = node1.get('node_level');
        if (this.all_nodes.has(node_level)) this.all_nodes.get(node_level).push(node1);
        else this.all_nodes.set(node_level, [
            node1
        ]);
    }
    _read_node(offset13, node_level) {
        // """ Return a single node in the B-Tree located at a given offset. """
        node = this._read_node_header(offset13, node_level);
        node.set('keys', []);
        node.set('addresses', []);
        return node;
    }
    _read_node_header(offset1) {
        //""" Return a single node header in the b-tree located at a give offset. """
        throw "NotImplementedError: must define _read_node_header in implementation class";
    }
    //B_LINK_NODE = null;
    //NODE_TYPE = null;
    constructor(fh, offset2){
        //""" initalize. """
        this.fh = fh;
        this.offset = offset2;
        this.depth = null;
    }
}
class $5ca17479ed366a65$export$448d813b4585d391 extends $5ca17479ed366a65$var$AbstractBTree {
    _read_node_header(offset3, node_level1) {
        // """ Return a single node header in the b-tree located at a give offset. """
        let node = $a610fe1a81efd230$export$4366ba51fc17f77c(this.B_LINK_NODE, this.fh, offset3);
        //assert node['signature'] == b'TREE'
        //assert node['node_type'] == this.NODE_TYPE
        if (node_level1 != null) {
            if (node.get("node_level") != node_level1) throw "node level does not match";
        }
        return node;
    }
    constructor(...args){
        super(...args);
        $9Qgbm$swchelpers.defineProperty(this, /*
  """
  HDF5 version 1 B-Tree.
  """
  */ "B_LINK_NODE", new Map([
            [
                'signature',
                '4s'
            ],
            [
                'node_type',
                'B'
            ],
            [
                'node_level',
                'B'
            ],
            [
                'entries_used',
                'H'
            ],
            [
                'left_sibling',
                'Q'
            ],
            [
                'right_sibling',
                'Q'
            ] // 8 byte addressing
        ]));
    }
}
class $5ca17479ed366a65$export$2b84cb98dbbb4f99 extends $5ca17479ed366a65$export$448d813b4585d391 {
    _read_node(offset4, node_level2) {
        // """ Return a single node in the B-Tree located at a given offset. """
        let node = this._read_node_header(offset4, node_level2);
        offset4 += $a610fe1a81efd230$export$3d1b068e9b9d668d(this.B_LINK_NODE);
        let keys = [];
        let addresses = [];
        let entries_used = node.get('entries_used');
        for(var i = 0; i < entries_used; i++){
            let key = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, offset4)[0];
            offset4 += 8;
            let address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, offset4)[0];
            offset4 += 8;
            keys.push(key);
            addresses.push(address);
        }
        //# N+1 key
        keys.push($a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, offset4)[0]);
        node.set('keys', keys);
        node.set('addresses', addresses);
        return node;
    }
    symbol_table_addresses() {
        //""" Return a list of all symbol table address. """
        var all_address = [];
        var root_nodes = this.all_nodes.get(0);
        for (var node of root_nodes)all_address = all_address.concat(node.get('addresses'));
        return all_address;
    }
    constructor(fh1, offset5){
        super(fh1, offset5);
        $9Qgbm$swchelpers.defineProperty(this, /*
  """
  HDF5 version 1 B-Tree storing group nodes (type 0).
  """
  */ "NODE_TYPE", 0);
        this.init();
    }
}
class $5ca17479ed366a65$export$9a219750c72cfcbd extends $5ca17479ed366a65$export$448d813b4585d391 {
    _read_node(offset6, node_level3) {
        //""" Return a single node in the b-tree located at a give offset. """
        //this.fh.seek(offset)
        let node = this._read_node_header(offset6, node_level3);
        offset6 += $a610fe1a81efd230$export$3d1b068e9b9d668d(this.B_LINK_NODE);
        //assert node['signature'] == b'TREE'
        //assert node['node_type'] == 1
        var keys = [];
        var addresses = [];
        let entries_used = node.get('entries_used');
        for(var i = 0; i < entries_used; i++){
            let [chunk_size, filter_mask] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<II', this.fh, offset6);
            offset6 += 8;
            let fmt = '<' + this.dims.toFixed() + 'Q';
            let fmt_size = $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize(fmt);
            let chunk_offset = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, this.fh, offset6);
            //console.log(struct.unpack_from('<8B', this.fh, offset));
            offset6 += fmt_size;
            let chunk_address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, offset6)[0];
            offset6 += 8;
            keys.push(new Map([
                [
                    'chunk_size',
                    chunk_size
                ],
                [
                    'filter_mask',
                    filter_mask
                ],
                [
                    'chunk_offset',
                    chunk_offset
                ]
            ]));
            addresses.push(chunk_address);
        }
        node.set('keys', keys);
        node.set('addresses', addresses);
        return node;
    }
    construct_data_from_chunks(chunk_shape, data_shape, dtype, filter_pipeline) {
        //""" Build a complete data array from chunks. """
        var true_dtype;
        var item_getter, item_big_endian, item_size;
        if (dtype instanceof Array) {
            true_dtype = dtype;
            let dtype_class = dtype[0];
            if (dtype_class == 'REFERENCE') {
                let size = dtype[1];
                if (size != 8) throw "NotImplementedError('Unsupported Reference type')";
                var dtype = '<u8';
                item_getter = 'getUint64';
                item_big_endian = false;
                item_size = 8;
            } else if (dtype_class == 'VLEN_STRING' || dtype_class == 'VLEN_SEQUENCE') {
                item_getter = 'getVLENStruct';
                item_big_endian = false;
                item_size = 16;
            } else throw "NotImplementedError('datatype not implemented')";
        } else {
            true_dtype = null;
            [item_getter, item_big_endian, item_size] = $a610fe1a81efd230$export$9fc19bf239cc5928(dtype);
        }
        //# create array to store data
        var data_size = data_shape.reduce(function(a, b) {
            return a * b;
        }, 1);
        var chunk_size = chunk_shape.reduce(function(a, b) {
            return a * b;
        }, 1);
        let dims = data_shape.length;
        var current_stride = 1;
        var chunk_strides = chunk_shape.slice().map(function(d) {
            let s = current_stride;
            current_stride *= d;
            return s;
        });
        var current_stride = 1;
        var data_strides = data_shape.slice().reverse().map(function(d) {
            let s = current_stride;
            current_stride *= d;
            return s;
        }).reverse();
        var data = new Array(data_size);
        let chunk_buffer_size = chunk_size * item_size;
        for (var node of this.all_nodes.get(0)){
            //console.log(node);
            let node_keys = node.get('keys');
            let node_addresses = node.get('addresses');
            let nkeys = node_keys.length;
            for(var ik = 0; ik < nkeys; ik++){
                let node_key = node_keys[ik];
                let addr = node_addresses[ik];
                var chunk_buffer;
                if (filter_pipeline == null) chunk_buffer = this.fh.slice(addr, addr + chunk_buffer_size);
                else {
                    chunk_buffer = this.fh.slice(addr, addr + node_key.get('chunk_size'));
                    let filter_mask = node_key.get('filter_mask');
                    chunk_buffer = this._filter_chunk(chunk_buffer, filter_mask, filter_pipeline, item_size);
                }
                var chunk_offset = node_key.get('chunk_offset').slice(); //(0, -1);
                var apos = chunk_offset.slice();
                var cpos = apos.map(function() {
                    return 0;
                }); // start chunk pos at 0,0,0...
                var cview = new $a610fe1a81efd230$export$735c64326b369ff3(chunk_buffer);
                for(var ci = 0; ci < chunk_size; ci++){
                    for(var d1 = dims - 1; d1 >= 0; d1--){
                        if (cpos[d1] >= chunk_shape[d1]) {
                            cpos[d1] = 0;
                            apos[d1] = chunk_offset[d1];
                            if (d1 > 0) {
                                cpos[d1 - 1] += 1;
                                apos[d1 - 1] += 1;
                            }
                        } else break;
                    }
                    let inbounds = apos.slice(0, -1).every(function(p, d) {
                        return p < data_shape[d];
                    });
                    if (inbounds) {
                        let cb_offset = ci * item_size;
                        let datum = cview[item_getter](cb_offset, !item_big_endian, item_size);
                        let ai = apos.slice(0, -1).reduce(function(prev, curr, index) {
                            return curr * data_strides[index] + prev;
                        }, 0);
                        data[ai] = datum;
                    }
                    cpos[dims - 1] += 1;
                    apos[dims - 1] += 1;
                }
            }
        }
        return data;
    }
    _filter_chunk(chunk_buffer1, filter_mask, filter_pipeline1, itemsize) {
        //""" Apply decompression filters to a chunk of data. """
        let num_filters = filter_pipeline1.length;
        var chunk_buffer_out = chunk_buffer1.slice();
        for(var filter_index = num_filters - 1; filter_index >= 0; filter_index--){
            //for i, pipeline_entry in enumerate(filter_pipeline[::-1]):
            //# A filter is skipped is the bit corresponding to its index in the
            //# pipeline is set in filter_mask
            if (filter_mask & 1 << filter_index) continue;
            let pipeline_entry = filter_pipeline1[filter_index];
            let filter_id = pipeline_entry.get('filter_id');
            if (filter_id == $5ca17479ed366a65$export$723f823c694fcf2b) chunk_buffer_out = $5ca17479ed366a65$var$zlib.decompress(chunk_buffer_out);
            else if (filter_id == $5ca17479ed366a65$export$515196ee40088a20) {
                let buffer_size = chunk_buffer_out.byteLength;
                var unshuffled_view = new Uint8Array(buffer_size);
                let step = Math.floor(buffer_size / itemsize);
                let shuffled_view = new DataView(chunk_buffer_out);
                for(var j = 0; j < itemsize; j++)for(var i = 0; i < step; i++)unshuffled_view[j + i * itemsize] = shuffled_view.getUint8(j * step + i);
                chunk_buffer_out = unshuffled_view.buffer;
            } else if (filter_id == $5ca17479ed366a65$export$360aec9d37483b78) {
                $5ca17479ed366a65$var$_verify_fletcher32(chunk_buffer_out);
                //# strip off 4-byte checksum from end of buffer
                chunk_buffer_out = chunk_buffer_out.slice(0, -4);
            } else throw 'NotImplementedError("Filter with id:' + filter_id.toFixed() + ' not supported")';
        }
        return chunk_buffer_out;
    }
    constructor(fh2, offset7, dims){
        //""" initalize. """
        super(fh2, offset7);
        $9Qgbm$swchelpers.defineProperty(this, /*
  HDF5 version 1 B-Tree storing raw data chunk nodes (type 1).
  */ "NODE_TYPE", 1);
        this.dims = dims;
        this.init();
    }
}
class $5ca17479ed366a65$export$ffb73e0614523060 extends $5ca17479ed366a65$var$AbstractBTree {
    _read_root_node() {
        let h = this._read_tree_header(this.offset);
        this.address_formats = this._calculate_address_formats(h);
        this.header = h;
        this.depth = h.get("depth");
        let address = [
            h.get("root_address"),
            h.get("root_nrecords"),
            h.get("total_nrecords")
        ];
        let root_node = this._read_node(address, this.depth);
        this._add_node(root_node);
    }
    _read_tree_header(offset8) {
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c(this.B_TREE_HEADER, this.fh, this.offset);
        //assert header['signature'] == b'BTHD'
        //assert header['node_type'] == this.NODE_TYPE
        return header;
    }
    _calculate_address_formats(header) {
        let node_size = header.get("node_size");
        let record_size = header.get("record_size");
        let nrecords_max = 0;
        let ntotalrecords_max = 0;
        let address_formats = new Map();
        let max_depth = header.get("depth");
        for(var node_level = 0; node_level <= max_depth; node_level++){
            let offset_fmt = "";
            let num1_fmt = "";
            let num2_fmt = "";
            let offset_size, num1_size, num2_size;
            if (node_level == 0) {
                offset_size = 0;
                num1_size = 0;
                num2_size = 0;
            } else if (node_level == 1) {
                offset_size = 8;
                offset_fmt = "<Q";
                num1_size = this._required_bytes(nrecords_max);
                num1_fmt = this._int_format(num1_size);
                num2_size = 0;
            } else {
                offset_size = 8;
                offset_fmt = "<Q";
                num1_size = this._required_bytes(nrecords_max);
                num1_fmt = this._int_format(num1_size);
                num2_size = this._required_bytes(ntotalrecords_max);
                num2_fmt = this._int_format(num2_size);
            }
            address_formats.set(node_level, [
                offset_size,
                num1_size,
                num2_size,
                offset_fmt,
                num1_fmt,
                num2_fmt
            ]);
            if (node_level < max_depth) {
                let addr_size = offset_size + num1_size + num2_size;
                nrecords_max = this._nrecords_max(node_size, record_size, addr_size);
                if (ntotalrecords_max > 0) ntotalrecords_max *= nrecords_max;
                else ntotalrecords_max = nrecords_max;
            }
        }
        return address_formats;
    }
    _nrecords_max(node_size, record_size, addr_size) {
        // """ Calculate the maximal records a node can contain. """
        // node_size = overhead + nrecords_max*record_size + (nrecords_max+1)*addr_size
        //
        // overhead = size(B_LINK_NODE) + 4 (checksum)
        //
        // Leaf node (node_level = 0)
        //   addr_size = 0
        // Internal node (node_level = 1)
        //   addr_size = offset_size + num1_size
        // Internal node (node_level > 1)
        //   addr_size = offset_size + num1_size + num2_size
        return Math.floor((node_size - 10 - addr_size) / (record_size + addr_size));
    }
    _required_bytes(integer) {
        // """ Calculate the minimal required bytes to contain an integer. """
        return Math.ceil($a610fe1a81efd230$export$c69b3bfd2d13c67e(integer) / 8);
    }
    _int_format(bytelength) {
        return [
            "<B",
            "<H",
            "<I",
            "<Q"
        ][bytelength - 1];
    }
    _read_node(address, node_level4) {
        // """ Return a single node in the B-Tree located at a given offset. """
        let [offset, nrecords, ntotalrecords] = address;
        let node = this._read_node_header(offset, node_level4);
        offset += $a610fe1a81efd230$export$3d1b068e9b9d668d(this.B_LINK_NODE);
        let record_size = this.header.get('record_size');
        let keys = [];
        for(let i = 0; i < nrecords; i++){
            let record = this._parse_record(this.fh, offset, record_size);
            offset += record_size;
            keys.push(record);
        }
        let addresses = [];
        let fmts = this.address_formats.get(node_level4);
        if (node_level4 != 0) {
            let [offset_size, num1_size, num2_size, offset_fmt, num1_fmt, num2_fmt] = fmts;
            for(let j = 0; j <= nrecords; j++){
                let address_offset = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(offset_fmt, this.fh, offset)[0];
                offset += offset_size;
                let num1 = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(num1_fmt, this.fh, offset)[0];
                offset += num1_size;
                let num2 = num1;
                if (num2_size > 0) num2 = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(num2_fmt, this.fh, offset)[0];
                addresses.push([
                    address_offset,
                    num1,
                    num2
                ]);
            }
        }
        node.set('keys', keys);
        node.set('addresses', addresses);
        return node;
    }
    _read_node_header(offset9, node_level5) {
        // """ Return a single node header in the b-tree located at a give offset. """
        let node = $a610fe1a81efd230$export$4366ba51fc17f77c(this.B_LINK_NODE, this.fh, offset9);
        node.set("node_level", node_level5);
        return node;
    }
    *iter_records() {
        // """ Iterate over all records. """
        for (let nodelist of this.all_nodes.values()){
            for (let node of nodelist)for (let key of node.get('keys'))yield key;
        }
    }
    _parse_record(record) {
        throw "NotImplementedError";
    }
    constructor(fh3, offset10){
        super(fh3, offset10);
        $9Qgbm$swchelpers.defineProperty(this, /*
  HDF5 version 2 B-Tree.
  */ // III.A.2. Disk Format: Level 1A2 - Version 2 B-trees
        "B_TREE_HEADER", new Map([
            [
                'signature',
                '4s'
            ],
            [
                'version',
                'B'
            ],
            [
                'node_type',
                'B'
            ],
            [
                'node_size',
                'I'
            ],
            [
                'record_size',
                'H'
            ],
            [
                'depth',
                'H'
            ],
            [
                'split_percent',
                'B'
            ],
            [
                'merge_percent',
                'B'
            ],
            [
                'root_address',
                'Q'
            ],
            [
                'root_nrecords',
                'H'
            ],
            [
                'total_nrecords',
                'Q'
            ]
        ]));
        $9Qgbm$swchelpers.defineProperty(this, "B_LINK_NODE", new Map([
            [
                'signature',
                '4s'
            ],
            [
                'version',
                'B'
            ],
            [
                'node_type',
                'B'
            ], 
        ]));
        this.init();
    }
}
class $5ca17479ed366a65$export$45d2dfd125274a16 extends $5ca17479ed366a65$export$ffb73e0614523060 {
    _parse_record(buf, offset11, size) {
        let namehash = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from("<I", buf, offset11)[0];
        offset11 += 4;
        return new Map([
            [
                'namehash',
                namehash
            ],
            [
                'heapid',
                buf.slice(offset11, offset11 + 7)
            ]
        ]);
    }
    constructor(...args){
        super(...args);
        $9Qgbm$swchelpers.defineProperty(this, /*
  HDF5 version 2 B-Tree storing group names (type 5).
  */ "NODE_TYPE", 5);
    }
}
class $5ca17479ed366a65$export$80daade6be1e5496 extends $5ca17479ed366a65$export$ffb73e0614523060 {
    _parse_record(buf1, offset12, size1) {
        let creationorder = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from("<Q", buf1, offset12)[0];
        offset12 += 8;
        return new Map([
            [
                'creationorder',
                creationorder
            ],
            [
                'heapid',
                buf1.slice(offset12, offset12 + 7)
            ]
        ]);
    }
    constructor(...args){
        super(...args);
        $9Qgbm$swchelpers.defineProperty(this, /*
  HDF5 version 2 B-Tree storing group creation orders (type 6).
  */ "NODE_TYPE", 6);
    }
}
function $5ca17479ed366a65$var$_verify_fletcher32(chunk_buffer) {
    //""" Verify a chunk with a fletcher32 checksum. """
    //# calculate checksums
    var odd_chunk_buffer = chunk_buffer.byteLength % 2 != 0;
    var data_length = chunk_buffer.byteLength - 4;
    var view = new $a610fe1a81efd230$export$735c64326b369ff3(chunk_buffer);
    var sum1 = 0;
    var sum2 = 0;
    for(var offset = 0; offset < data_length - 1; offset += 2){
        let datum = view.getUint16(offset, true); // little-endian
        sum1 = (sum1 + datum) % 65535;
        sum2 = (sum2 + sum1) % 65535;
    }
    if (odd_chunk_buffer) {
        // process the last item:
        let datum = view.getUint8(data_length - 1);
        sum1 = (sum1 + datum) % 65535;
        sum2 = (sum2 + sum1) % 65535;
    }
    //# extract stored checksums
    var [ref_sum1, ref_sum2] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('>HH', chunk_buffer, data_length); // .fromstring(chunk_buffer[-4:], '>u2')
    ref_sum1 = ref_sum1 % 65535;
    ref_sum2 = ref_sum2 % 65535;
    //# compare
    if (sum1 != ref_sum1 || sum2 != ref_sum2) throw 'ValueError("fletcher32 checksum invalid")';
    return true;
}
//# IV.A.2.l The Data Storage - Filter Pipeline message
var $5ca17479ed366a65$var$RESERVED_FILTER = 0;
const $5ca17479ed366a65$export$723f823c694fcf2b = 1;
const $5ca17479ed366a65$export$515196ee40088a20 = 2;
const $5ca17479ed366a65$export$360aec9d37483b78 = 3;
var $5ca17479ed366a65$var$SZIP_FILTER = 4;
var $5ca17479ed366a65$var$NBIT_FILTER = 5;
var $5ca17479ed366a65$var$SCALEOFFSET_FILTER = 6;



class $edf3c54d05bb7204$export$ef68f9f44792800e {
    get offset_to_dataobjects() {
        //""" The offset to the data objects collection for the superblock. """
        if (this.version == 0) {
            var sym_table = new $edf3c54d05bb7204$export$777871f1ccd7bbc3(this._fh, this._end_of_sblock, true);
            this._root_symbol_table = sym_table;
            return sym_table.group_offset;
        } else if (this.version == 2 || this.version == 3) return this._contents.get('root_group_address');
        else throw "Not implemented version = " + this.version.toFixed();
    }
    constructor(fh, offset3){
        let version_hint = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', fh, offset3 + 8);
        var contents;
        if (version_hint == 0) {
            contents = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$SUPERBLOCK_V0, fh, offset3);
            this._end_of_sblock = offset3 + $edf3c54d05bb7204$var$SUPERBLOCK_V0_SIZE;
        } else if (version_hint == 2 || version_hint == 3) {
            contents = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$SUPERBLOCK_V2_V3, fh, offset3);
            this._end_of_sblock = offset3 + $edf3c54d05bb7204$var$SUPERBLOCK_V2_V3_SIZE;
        } else throw "unsupported superblock version: " + version_hint.toFixed();
        // verify contents
        if (contents.get('format_signature') != $edf3c54d05bb7204$var$FORMAT_SIGNATURE) throw 'Incorrect file signature: ' + contents.get('format_signature');
        if (contents.get('offset_size') != 8 || contents.get('length_size') != 8) throw 'File uses non-64-bit addressing';
        this.version = contents.get('superblock_version');
        this._contents = contents;
        this._root_symbol_table = null;
        this._fh = fh;
    }
}
class $edf3c54d05bb7204$export$a6c6f5ecea66e31b {
    get_object_name(offset1) {
        //""" Return the name of the object indicated by the given offset. """
        let end = new Uint8Array(this.data).indexOf(0, offset1);
        let name_size = end - offset1;
        let name = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<' + name_size.toFixed() + 's', this.data, offset1)[0];
        return name;
    }
    /*
  """
  HDF5 local heap.
  """
  */ constructor(fh1, offset2){
        //""" initalize. """
        //fh.seek(offset)
        let local_heap = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$LOCAL_HEAP, fh1, offset2);
        $a610fe1a81efd230$export$a7a9523472993e97(local_heap.get('signature') == 'HEAP');
        $a610fe1a81efd230$export$a7a9523472993e97(local_heap.get('version') == 0);
        let data_offset = local_heap.get('address_of_data_segment');
        let heap_data = fh1.slice(data_offset, data_offset + local_heap.get('data_segment_size'));
        local_heap.set('heap_data', heap_data);
        this._contents = local_heap;
        this.data = heap_data;
    }
}
class $edf3c54d05bb7204$export$777871f1ccd7bbc3 {
    assign_name(heap) {
        //""" Assign link names to all entries in the symbol table. """
        this.entries.forEach(function(entry) {
            let offset = entry.get('link_name_offset');
            let link_name = heap.get_object_name(offset);
            entry.set('link_name', link_name);
        });
    }
    get_links(heap1) {
        //""" Return a dictionary of links (dataset/group) and offsets. """
        var links = {
        };
        this.entries.forEach(function(e) {
            let cache_type = e.get('cache_type');
            let link_name = e.get('link_name');
            if (cache_type == 0 || cache_type == 1) links[link_name] = e.get('object_header_address');
            else if (cache_type == 2) {
                let scratch = e.get('scratch');
                let buf = new ArrayBuffer(4);
                let bufView = new Uint8Array(buf);
                for(var i = 0; i < 4; i++)bufView[i] = scratch.charCodeAt(i);
                let offset = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<I', buf, 0)[0];
                links[link_name] = heap1.get_object_name(offset);
            }
        });
        return links;
    }
    /*
  """
  HDF5 Symbol Table.
  """
  */ constructor(fh2, offset, root = false){
        //""" initialize, root=True for the root group, False otherwise. """
        var node;
        if (root) //# The root symbol table has no Symbol table node header
        //# and contains only a single entry
        node = new Map([
            [
                'symbols',
                1
            ]
        ]);
        else {
            node = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$SYMBOL_TABLE_NODE, fh2, offset);
            if (node.get('signature') != 'SNOD') throw "incorrect node type";
            offset += $edf3c54d05bb7204$var$SYMBOL_TABLE_NODE_SIZE;
        }
        var entries = [];
        var n_symbols = node.get('symbols');
        for(var i = 0; i < n_symbols; i++){
            entries.push($a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$SYMBOL_TABLE_ENTRY, fh2, offset));
            offset += $edf3c54d05bb7204$var$SYMBOL_TABLE_ENTRY_SIZE;
        }
        if (root) this.group_offset = entries[0].get('object_header_address');
        this.entries = entries;
        this._contents = node;
    }
}
class $edf3c54d05bb7204$export$6e04a67f2469695d {
    get objects() {
        //""" Dictionary of objects in the heap. """
        if (this._objects == null) {
            this._objects = new Map();
            var offset = 0;
            while(offset <= this.heap_data.byteLength - $edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT_SIZE){
                let info = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT, this.heap_data, offset);
                if (info.get('object_index') == 0) break;
                offset += $edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT_SIZE;
                let obj_data = this.heap_data.slice(offset, offset + info.get('object_size'));
                this._objects.set(info.get('object_index'), obj_data);
                offset += $a610fe1a81efd230$export$5d30a19cbc4b604c(info.get('object_size'));
            }
        }
        return this._objects;
    }
    /*
  HDF5 Global Heap collection.
  */ constructor(fh3, offset4){
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER, fh3, offset4);
        offset4 += $edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER_SIZE;
        //assert(header.get('signature') == 'GCOL');
        //assert(header.get('version') == 1);
        let heap_data_size = header.get('collection_size') - $edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER_SIZE;
        let heap_data = fh3.slice(offset4, offset4 + heap_data_size);
        //assert(heap_data.byteLength == heap_data_size); //# check for early end of file
        this.heap_data = heap_data;
        this._header = header;
        this._objects = null;
    }
}
class $edf3c54d05bb7204$export$4f02c1c73bec0cfd {
    _read_direct_block(fh4, offset5, block_size) {
        let data = fh4.slice(offset5, offset5 + block_size);
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c(this.direct_block_header, data);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get("signature") == "FHDB");
        return data;
    }
    get_data(heapid) {
        let firstbyte = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', heapid, 0)[0];
        let reserved = firstbyte & 15; // bit 0-3
        let idtype = firstbyte >> 4 & 3; // bit 4-5
        let version = firstbyte >> 6 // bit 6-7
        ;
        let data_offset = 1;
        if (idtype == 0) {
            $a610fe1a81efd230$export$a7a9523472993e97(version == 0);
            let nbytes = this._managed_object_offset_size;
            let offset = $a610fe1a81efd230$export$915ab53af81886(nbytes, heapid, data_offset);
            // add heap offset:
            //offset += this.offset;
            data_offset += nbytes;
            nbytes = this._managed_object_length_size;
            let size = $a610fe1a81efd230$export$915ab53af81886(nbytes, heapid, data_offset);
            return this.managed.slice(offset, offset + size);
        } else if (idtype == 1) throw "tiny objectID not supported in FractalHeap";
        else if (idtype == 2) throw "huge objectID not supported in FractalHeap";
        else throw "unknown objectID type in FractalHeap";
    }
    _min_size_integer(integer) {
        // """ Calculate the minimal required bytes to contain an integer. """
        return this._min_size_nbits($a610fe1a81efd230$export$c69b3bfd2d13c67e(integer));
    }
    _min_size_nbits(nbits) {
        //""" Calculate the minimal required bytes to contain a number of bits. """
        return Math.ceil(nbits / 8);
    }
    *_iter_indirect_block(fh5, offset6, nrows) {
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c(this.indirect_block_header, fh5, offset6);
        offset6 += this.indirect_block_header_size;
        $a610fe1a81efd230$export$a7a9523472993e97(header.get("signature") == "FHIB");
        let block_offset_bytes = header.get("block_offset");
        // equivalent to python int.from_bytes with byteorder="little":
        let block_offset = block_offset_bytes.reduce((p, c, i)=>p + (c << i * 8)
        , 0);
        header.set("block_offset", block_offset);
        let [ndirect, nindirect] = this._indirect_info(nrows);
        let direct_blocks = [];
        for(let i2 = 0; i2 < ndirect; i2++){
            let address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', fh5, offset6)[0];
            offset6 += 8;
            if (address == $edf3c54d05bb7204$var$UNDEFINED_ADDRESS) break;
            let block_size = this._calc_block_size(i2);
            direct_blocks.push([
                address,
                block_size
            ]);
        }
        let indirect_blocks = [];
        for(let i1 = ndirect; i1 < ndirect + nindirect; i1++){
            let address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', fh5, offset6)[0];
            offset6 += 8;
            if (address == $edf3c54d05bb7204$var$UNDEFINED_ADDRESS) break;
            let block_size = this._calc_block_size(i1);
            let nrows = this._iblock_nrows_from_block_size(block_size);
            indirect_blocks.push([
                address,
                nrows
            ]);
        }
        for (let [address, block_size] of direct_blocks){
            let obj = this._read_direct_block(fh5, address, block_size);
            yield obj;
        }
        for (let [address1, nrows1] of indirect_blocks)for (let obj of this._iter_indirect_block(fh5, address1, nrows1))yield obj;
    }
    _calc_block_size(iblock) {
        let row = Math.floor(iblock / this.header.get("table_width"));
        return 2 ** Math.max(row - 1, 0) * this.header.get('starting_block_size');
    }
    _iblock_nrows_from_block_size(block_size1) {
        let log2_block_size = Math.floor(Math.log2(block_size1));
        $a610fe1a81efd230$export$a7a9523472993e97(2 ** log2_block_size == block_size1);
        return log2_block_size - this._indirect_nrows_sub;
    }
    _indirect_info(nrows2) {
        let table_width = this.header.get('table_width');
        let nobjects = nrows2 * table_width;
        let ndirect_max = this._max_direct_nrows * table_width;
        let ndirect, nindirect;
        if (nrows2 <= ndirect_max) {
            ndirect = nobjects;
            nindirect = 0;
        } else {
            ndirect = ndirect_max;
            nindirect = nobjects - ndirect_max;
        }
        return [
            ndirect,
            nindirect
        ];
    }
    _int_format(bytelength) {
        return [
            "B",
            "H",
            "I",
            "Q"
        ][bytelength - 1];
    }
    /*
  HDF5 Fractal Heap.
  */ constructor(fh6, offset7){
        this.fh = fh6;
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c($edf3c54d05bb7204$var$FRACTAL_HEAP_HEADER, fh6, offset7);
        offset7 += $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$FRACTAL_HEAP_HEADER);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('signature') == 'FRHP');
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 0);
        if (header.get('filter_info_size') > 0) throw "Filter info size not supported on FractalHeap";
        if (header.get("btree_address_huge_objects") == $edf3c54d05bb7204$var$UNDEFINED_ADDRESS) header.set("btree_address_huge_objects", null);
        else throw "Huge objects not implemented in FractalHeap";
        if (header.get("root_block_address") == $edf3c54d05bb7204$var$UNDEFINED_ADDRESS) header.set("root_block_address", null);
        let nbits = header.get("log2_maximum_heap_size");
        let block_offset_size = this._min_size_nbits(nbits);
        let h = new Map([
            [
                'signature',
                '4s'
            ],
            [
                'version',
                'B'
            ],
            [
                'heap_header_adddress',
                'Q'
            ],
            //['block_offset', `${block_offset_size}s`]
            [
                'block_offset',
                `${block_offset_size}B`
            ]
        ]);
        this.indirect_block_header = new Map(h); // make shallow copy;
        this.indirect_block_header_size = $a610fe1a81efd230$export$3d1b068e9b9d668d(h);
        if ((header.get("flags") & 2) == 2) h.set('checksum', 'I');
        this.direct_block_header = h;
        this.direct_block_header_size = $a610fe1a81efd230$export$3d1b068e9b9d668d(h);
        let maximum_dblock_size = header.get('maximum_direct_block_size');
        this._managed_object_offset_size = this._min_size_nbits(nbits);
        let value = Math.min(maximum_dblock_size, header.get('max_managed_object_size'));
        this._managed_object_length_size = this._min_size_integer(value);
        let start_block_size = header.get('starting_block_size');
        let table_width = header.get('table_width');
        if (!(start_block_size > 0)) throw "Starting block size == 0 not implemented";
        let log2_maximum_dblock_size = Number(Math.floor(Math.log2(maximum_dblock_size)));
        $a610fe1a81efd230$export$a7a9523472993e97(1n << BigInt(log2_maximum_dblock_size) == maximum_dblock_size);
        let log2_start_block_size = Number(Math.floor(Math.log2(start_block_size)));
        $a610fe1a81efd230$export$a7a9523472993e97(1n << BigInt(log2_start_block_size) == start_block_size);
        this._max_direct_nrows = log2_maximum_dblock_size - log2_start_block_size + 2;
        let log2_table_width = Math.floor(Math.log2(table_width)); // regular number (H, not Q format)
        $a610fe1a81efd230$export$a7a9523472993e97(1 << log2_table_width == table_width);
        this._indirect_nrows_sub = log2_table_width + log2_start_block_size - 1;
        this.header = header;
        this.nobjects = header.get("managed_object_count") + header.get("huge_object_count") + header.get("tiny_object_count");
        let managed = [];
        let root_address = header.get("root_block_address");
        let nrows = 0;
        if (root_address != null) nrows = header.get("indirect_current_rows_count");
        if (nrows > 0) for (let data of this._iter_indirect_block(fh6, root_address, nrows))managed.push(data);
        else {
            let data = this._read_direct_block(fh6, root_address, start_block_size);
            managed.push(data);
        }
        let data_size = managed.reduce((p, c)=>p + c.byteLength
        , 0);
        let combined = new Uint8Array(data_size);
        let moffset = 0;
        managed.forEach((m)=>{
            combined.set(new Uint8Array(m), moffset);
            moffset += m.byteLength;
        });
        this.managed = combined.buffer;
    }
}
var $edf3c54d05bb7204$var$FORMAT_SIGNATURE = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('8s', new Uint8Array([
    137,
    72,
    68,
    70,
    13,
    10,
    26,
    10
]).buffer)[0];
var $edf3c54d05bb7204$var$UNDEFINED_ADDRESS = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', new Uint8Array([
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255
]).buffer)[0];
// Version 0 SUPERBLOCK
var $edf3c54d05bb7204$var$SUPERBLOCK_V0 = new Map([
    [
        'format_signature',
        '8s'
    ],
    [
        'superblock_version',
        'B'
    ],
    [
        'free_storage_version',
        'B'
    ],
    [
        'root_group_version',
        'B'
    ],
    [
        'reserved_0',
        'B'
    ],
    [
        'shared_header_version',
        'B'
    ],
    [
        'offset_size',
        'B'
    ],
    [
        'length_size',
        'B'
    ],
    [
        'reserved_1',
        'B'
    ],
    [
        'group_leaf_node_k',
        'H'
    ],
    [
        'group_internal_node_k',
        'H'
    ],
    [
        'file_consistency_flags',
        'L'
    ],
    [
        'base_address_lower',
        'Q'
    ],
    [
        'free_space_address',
        'Q'
    ],
    [
        'end_of_file_address',
        'Q'
    ],
    [
        'driver_information_address',
        'Q'
    ] // assume 8 byte addressing
]);
var $edf3c54d05bb7204$var$SUPERBLOCK_V0_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$SUPERBLOCK_V0);
var $edf3c54d05bb7204$var$SUPERBLOCK_V2_V3 = new Map([
    [
        'format_signature',
        '8s'
    ],
    [
        'superblock_version',
        'B'
    ],
    [
        'offset_size',
        'B'
    ],
    [
        'length_size',
        'B'
    ],
    [
        'file_consistency_flags',
        'B'
    ],
    [
        'base_address',
        'Q'
    ],
    [
        'superblock_extension_address',
        'Q'
    ],
    [
        'end_of_file_address',
        'Q'
    ],
    [
        'root_group_address',
        'Q'
    ],
    [
        'superblock_checksum',
        'I'
    ]
]);
var $edf3c54d05bb7204$var$SUPERBLOCK_V2_V3_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$SUPERBLOCK_V2_V3);
var $edf3c54d05bb7204$var$SYMBOL_TABLE_ENTRY = new Map([
    [
        'link_name_offset',
        'Q'
    ],
    [
        'object_header_address',
        'Q'
    ],
    [
        'cache_type',
        'I'
    ],
    [
        'reserved',
        'I'
    ],
    [
        'scratch',
        '16s'
    ], 
]);
var $edf3c54d05bb7204$var$SYMBOL_TABLE_ENTRY_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$SYMBOL_TABLE_ENTRY);
var $edf3c54d05bb7204$var$SYMBOL_TABLE_NODE = new Map([
    [
        'signature',
        '4s'
    ],
    [
        'version',
        'B'
    ],
    [
        'reserved_0',
        'B'
    ],
    [
        'symbols',
        'H'
    ], 
]);
var $edf3c54d05bb7204$var$SYMBOL_TABLE_NODE_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$SYMBOL_TABLE_NODE);
// III.D Disk Format: Level 1D - Local Heaps
var $edf3c54d05bb7204$var$LOCAL_HEAP = new Map([
    [
        'signature',
        '4s'
    ],
    [
        'version',
        'B'
    ],
    [
        'reserved',
        '3s'
    ],
    [
        'data_segment_size',
        'Q'
    ],
    [
        'offset_to_free_list',
        'Q'
    ],
    [
        'address_of_data_segment',
        'Q'
    ] // 8 byte addressing
]);
// III.E Disk Format: Level 1E - Global Heap
var $edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER = new Map([
    [
        'signature',
        '4s'
    ],
    [
        'version',
        'B'
    ],
    [
        'reserved',
        '3s'
    ],
    [
        'collection_size',
        'Q'
    ]
]);
var $edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$GLOBAL_HEAP_HEADER);
var $edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT = new Map([
    [
        'object_index',
        'H'
    ],
    [
        'reference_count',
        'H'
    ],
    [
        'reserved',
        'I'
    ],
    [
        'object_size',
        'Q'
    ] // 8 byte addressing,
    , 
]);
var $edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($edf3c54d05bb7204$var$GLOBAL_HEAP_OBJECT);
//# III.G. Disk Format: Level 1G - Fractal Heap
var $edf3c54d05bb7204$var$FRACTAL_HEAP_HEADER = new Map([
    [
        'signature',
        '4s'
    ],
    [
        'version',
        'B'
    ],
    [
        'object_index_size',
        'H'
    ],
    [
        'filter_info_size',
        'H'
    ],
    [
        'flags',
        'B'
    ],
    [
        'max_managed_object_size',
        'I'
    ],
    [
        'next_huge_object_index',
        'Q'
    ],
    [
        'btree_address_huge_objects',
        'Q'
    ],
    [
        'managed_freespace_size',
        'Q'
    ],
    [
        'freespace_manager_address',
        'Q'
    ],
    [
        'managed_space_size',
        'Q'
    ],
    [
        'managed_alloc_size',
        'Q'
    ],
    [
        'next_directblock_iterator_address',
        'Q'
    ],
    [
        'managed_object_count',
        'Q'
    ],
    [
        'huge_objects_total_size',
        'Q'
    ],
    [
        'huge_object_count',
        'Q'
    ],
    [
        'tiny_objects_total_size',
        'Q'
    ],
    [
        'tiny_object_count',
        'Q'
    ],
    [
        'table_width',
        'H'
    ],
    [
        'starting_block_size',
        'Q'
    ],
    [
        'maximum_direct_block_size',
        'Q'
    ],
    [
        'log2_maximum_heap_size',
        'H'
    ],
    [
        'indirect_starting_rows_count',
        'H'
    ],
    [
        'root_block_address',
        'Q'
    ],
    [
        'indirect_current_rows_count',
        'H'
    ]
]);


class $8a97484f9649b812$export$484cf4e32b93a7f2 {
    get dtype() {
        //""" Datatype of the dataset. """
        let msg = this.find_msg_type($8a97484f9649b812$var$DATATYPE_MSG_TYPE)[0];
        let msg_offset = msg.get('offset_to_message');
        return new $831e918c79298dac$export$2273d44c2fa53571(this.fh, msg_offset).dtype;
    }
    get chunks() {
        //""" Tuple describing the chunk size, None if not chunked. """
        this._get_chunk_params();
        return this._chunks;
    }
    get shape() {
        //""" Shape of the dataset. """
        let msg = this.find_msg_type($8a97484f9649b812$var$DATASPACE_MSG_TYPE)[0];
        let msg_offset = msg.get('offset_to_message');
        return $8a97484f9649b812$var$determine_data_shape(this.fh, msg_offset);
    }
    get filter_pipeline() {
        //""" Dict describing filter pipeline, None if no pipeline. """
        if (this._filter_pipeline != null) return this._filter_pipeline //# use cached value
        ;
        let filter_msgs = this.find_msg_type($8a97484f9649b812$var$DATA_STORAGE_FILTER_PIPELINE_MSG_TYPE);
        if (!filter_msgs.length) {
            this._filter_pipeline = null;
            return this._filter_pipeline;
        }
        var offset = filter_msgs[0].get('offset_to_message');
        let [version, nfilters] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<BB', this.fh, offset);
        offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<BB');
        var filters = [];
        if (version == 1) {
            let [res0, res1] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<HI', this.fh, offset);
            offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<HI');
            for(var _ = 0; _ < nfilters; _++){
                let filter_info = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$FILTER_PIPELINE_DESCR_V1, this.fh, offset);
                offset += $8a97484f9649b812$var$FILTER_PIPELINE_DESCR_V1_SIZE;
                let padded_name_length = $a610fe1a81efd230$export$5d30a19cbc4b604c(filter_info.get('name_length'), 8);
                let fmt = '<' + padded_name_length.toFixed() + 's';
                let filter_name = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, this.fh, offset)[0];
                filter_info.set('filter_name', filter_name);
                offset += padded_name_length;
                fmt = '<' + filter_info.get('client_data_values').toFixed() + 'I';
                let client_data = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, this.fh, offset);
                filter_info.set('client_data', client_data);
                offset += 4 * filter_info.get('client_data_values');
                if (filter_info.get('client_data_values') % 2) offset += 4; //# odd number of client data values padded
                filters.push(filter_info);
            }
        } else if (version == 2) for(let nf = 0; nf < nfilters; nf++){
            let filter_info = new Map();
            let buf = this.fh;
            let filter_id = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<H', buf, offset)[0];
            offset += 2;
            filter_info.set('filter_id', filter_id);
            let name_length = 0;
            if (filter_id > 255) {
                name_length = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<H', buf, offset)[0];
                offset += 2;
            }
            let flags = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<H', buf, offset)[0];
            offset += 2;
            let optional = (flags & 1) > 0;
            filter_info.set('optional', optional);
            let num_client_values = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<H', buf, offset)[0];
            offset += 2;
            let name;
            if (name_length > 0) {
                name = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(`${name_length}s`, buf, offset)[0];
                offset += name_length;
            }
            filter_info.set('name', name);
            let client_values = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(`<${num_client_values}i`, buf, offset);
            offset += 4 * num_client_values;
            filter_info.set('client_data_values', client_values);
            filters.push(filter_info);
        }
        else throw `version ${version} is not supported`;
        this._filter_pipeline = filters;
        return this._filter_pipeline;
    }
    find_msg_type(msg_type) {
        //""" Return a list of all messages of a given type. """
        return this.msgs.filter(function(m) {
            return m.get('type') == msg_type;
        });
    }
    get_attributes() {
        //""" Return a dictionary of all attributes. """
        let attrs = {
        };
        let attr_msgs = this.find_msg_type($8a97484f9649b812$var$ATTRIBUTE_MSG_TYPE);
        for (let msg of attr_msgs){
            let offset = msg.get('offset_to_message');
            let [name, value] = this.unpack_attribute(offset);
            attrs[name] = value;
        }
        //# TODO attributes may also be stored in objects reference in the
        //# Attribute Info Message (0x0015, 21).
        return attrs;
    }
    get fillvalue() {
        /* Fillvalue of the dataset. */ let msg = this.find_msg_type($8a97484f9649b812$var$FILLVALUE_MSG_TYPE)[0];
        var offset = msg.get('offset_to_message');
        var is_defined;
        let version = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', this.fh, offset)[0];
        var info, size, fillvalue;
        if (version == 1 || version == 2) {
            info = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$FILLVAL_MSG_V1V2, this.fh, offset);
            offset += $8a97484f9649b812$var$FILLVAL_MSG_V1V2_SIZE;
            is_defined = info.get('fillvalue_defined');
        } else if (version == 3) {
            info = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$FILLVAL_MSG_V3, this.fh, offset);
            offset += $8a97484f9649b812$var$FILLVAL_MSG_V3_SIZE;
            is_defined = info.get('flags') & 32;
        } else throw 'InvalidHDF5File("Unknown fillvalue msg version: "' + String(version);
        if (is_defined) {
            size = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<I', this.fh, offset)[0];
            offset += 4;
        } else size = 0;
        if (size) {
            let [getter, big_endian, size] = $a610fe1a81efd230$export$9fc19bf239cc5928(this.dtype);
            let payload_view = new $a610fe1a81efd230$export$735c64326b369ff3(this.fh);
            fillvalue = payload_view[getter](offset, !big_endian, size);
        } else fillvalue = 0;
        return fillvalue;
    }
    unpack_attribute(offset11) {
        //""" Return the attribute name and value. """
        //# read in the attribute message header
        //# See section IV.A.2.m. The Attribute Message for details
        let version = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', this.fh, offset11)[0];
        var attr_map, padding_multiple;
        if (version == 1) {
            attr_map = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$ATTR_MSG_HEADER_V1, this.fh, offset11);
            $a610fe1a81efd230$export$a7a9523472993e97(attr_map.get('version') == 1);
            offset11 += $8a97484f9649b812$var$ATTR_MSG_HEADER_V1_SIZE;
            padding_multiple = 8;
        } else if (version == 3) {
            attr_map = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$ATTR_MSG_HEADER_V3, this.fh, offset11);
            $a610fe1a81efd230$export$a7a9523472993e97(attr_map.get('version') == 3);
            offset11 += $8a97484f9649b812$var$ATTR_MSG_HEADER_V3_SIZE;
            padding_multiple = 1 //# no padding
            ;
        } else throw "unsupported attribute message version: " + version;
        //# read in the attribute name
        let name_size = attr_map.get('name_size');
        let name = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<' + name_size.toFixed() + 's', this.fh, offset11)[0];
        name = name.replace(/\x00$/, '');
        //name = name.strip(b'\x00').decode('utf-8')
        offset11 += $a610fe1a81efd230$export$5d30a19cbc4b604c(name_size, padding_multiple);
        //# read in the datatype information
        var dtype;
        try {
            dtype = new $831e918c79298dac$export$2273d44c2fa53571(this.fh, offset11).dtype;
        } catch (e) {
            console.log('Attribute ' + name + ' type not implemented, set to null.');
            return [
                name,
                null
            ];
        }
        offset11 += $a610fe1a81efd230$export$5d30a19cbc4b604c(attr_map.get('datatype_size'), padding_multiple);
        //# read in the dataspace information
        let shape = this.determine_data_shape(this.fh, offset11);
        let items = shape.reduce(function(a, b) {
            return a * b;
        }, 1); // int(np.product(shape))
        offset11 += $a610fe1a81efd230$export$5d30a19cbc4b604c(attr_map.get('dataspace_size'), padding_multiple);
        //# read in the value(s)
        var value = this._attr_value(dtype, this.fh, items, offset11);
        //let value = [42];
        if (shape.length == 0) value = value[0];
        return [
            name,
            value
        ];
    }
    determine_data_shape(buf6, offset1) {
        //""" Return the shape of the dataset pointed to in a Dataspace message. """
        let version = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', buf6, offset1)[0];
        var header;
        if (version == 1) {
            header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1, buf6, offset1);
            $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 1);
            offset1 += $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1_SIZE;
        } else if (version == 2) {
            header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2, buf6, offset1);
            $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 2);
            offset1 += $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2_SIZE;
        } else throw 'unknown dataspace message version';
        let ndims = header.get('dimensionality');
        let dim_sizes = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<' + ndims.toFixed() + 'Q', buf6, offset1);
        //# Dimension maximum size follows if header['flags'] bit 0 set
        //# Permutation index follows if header['flags'] bit 1 set
        return dim_sizes;
    }
    _attr_value(dtype, buf1, count, offset2) {
        //""" Retrieve an HDF5 attribute value from a buffer. """
        var value = new Array(count);
        if (dtype instanceof Array) {
            let dtype_class = dtype[0];
            for(var i = 0; i < count; i++){
                if (dtype_class == 'VLEN_STRING') {
                    let character_set = dtype[2];
                    var [vlen, vlen_data] = this._vlen_size_and_data(buf1, offset2);
                    let fmt = '<' + vlen.toFixed() + 's';
                    let str_data = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, vlen_data, 0)[0];
                    if (character_set == 0) //# ascii character set, return as bytes
                    value[i] = str_data;
                    else value[i] = decodeURIComponent(escape(str_data));
                    offset2 += 16;
                } else if (dtype_class == 'REFERENCE') {
                    var address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', buf1, offset2);
                    value[i] = address;
                    offset2 += 8;
                } else if (dtype_class == "VLEN_SEQUENCE") {
                    let base_dtype = dtype[1];
                    var [vlen, vlen_data] = this._vlen_size_and_data(buf1, offset2);
                    value[i] = this._attr_value(base_dtype, vlen_data, vlen, 0);
                    offset2 += 16;
                } else throw "NotImplementedError";
            }
        } else {
            let [getter, big_endian, size] = $a610fe1a81efd230$export$9fc19bf239cc5928(dtype);
            let view = new $a610fe1a81efd230$export$735c64326b369ff3(buf1, 0);
            for(var i = 0; i < count; i++){
                value[i] = view[getter](offset2, !big_endian, size);
                offset2 += size;
            }
        }
        return value;
    }
    _vlen_size_and_data(buf2, offset3) {
        //""" Extract the length and data of a variables length attr. """
        //# offset should be incremented by 16 after calling this method
        let vlen_size = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<I', buf2, offset3)[0];
        //# section IV.B
        //# Data with a variable-length datatype is stored in the
        //# global heap of the HDF5 file. Global heap identifiers are
        //# stored in the data object storage.
        let gheap_id = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$GLOBAL_HEAP_ID, buf2, offset3 + 4);
        let gheap_address = gheap_id.get('collection_address');
        $a610fe1a81efd230$export$a7a9523472993e97(gheap_id.get("collection_address") < Number.MAX_SAFE_INTEGER);
        var gheap;
        if (!(gheap_address in this._global_heaps)) {
            //# load the global heap and cache the instance
            gheap = new $edf3c54d05bb7204$export$6e04a67f2469695d(this.fh, gheap_address);
            this._global_heaps[gheap_address] = gheap;
        }
        gheap = this._global_heaps[gheap_address];
        let vlen_data = gheap.objects.get(gheap_id.get('object_index'));
        return [
            vlen_size,
            vlen_data
        ];
    }
    _parse_v1_objects(buf3, offset4) {
        //""" Parse a collection of version 1 Data Objects. """
        let header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$OBJECT_HEADER_V1, buf3, offset4);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 1);
        let total_header_messages = header.get('total_header_messages');
        var block_size = header.get('object_header_size');
        var block_offset = offset4 + $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$OBJECT_HEADER_V1);
        var msg_data = buf3.slice(block_offset, block_offset + block_size);
        var object_header_blocks = [
            [
                block_offset,
                block_size
            ]
        ];
        var current_block = 0;
        var local_offset = 0;
        var msgs = new Array(total_header_messages);
        for(var i = 0; i < total_header_messages; i++){
            if (local_offset >= block_size) {
                [block_offset, block_size] = object_header_blocks[++current_block];
                local_offset = 0;
            }
            let msg = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$HEADER_MSG_INFO_V1, buf3, block_offset + local_offset);
            let offset_to_message = block_offset + local_offset + $8a97484f9649b812$var$HEADER_MSG_INFO_V1_SIZE;
            msg.set('offset_to_message', offset_to_message);
            if (msg.get('type') == $8a97484f9649b812$var$OBJECT_CONTINUATION_MSG_TYPE) {
                var [fh_off, size] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<QQ', buf3, offset_to_message);
                object_header_blocks.push([
                    fh_off,
                    size
                ]);
            }
            local_offset += $8a97484f9649b812$var$HEADER_MSG_INFO_V1_SIZE + msg.get('size');
            msgs[i] = msg;
        }
        return [
            msgs,
            msg_data,
            header
        ];
    }
    _parse_v2_objects(buf4, offset5) {
        /* Parse a collection of version 2 Data Objects. */ // NOTE: this is using absolute address even for messages in continuation 
        // blocks, and not keeping a concatenated message block (unlike pyfive)
        var [header, creation_order_size, block_offset] = this._parse_v2_header(buf4, offset5);
        offset5 = block_offset;
        var msgs = [];
        var block_size = header.get('size_of_chunk_0');
        var msg_data = buf4.slice(offset5, offset5 += block_size);
        var object_header_blocks = [
            [
                block_offset,
                block_size
            ]
        ];
        var current_block = 0;
        var local_offset = 0;
        while(true){
            if (local_offset >= block_size - $8a97484f9649b812$var$HEADER_MSG_INFO_V2_SIZE) {
                let next_block = object_header_blocks[++current_block];
                if (next_block == null) break;
                [block_offset, block_size] = next_block;
                local_offset = 0;
            }
            let msg = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$HEADER_MSG_INFO_V2, buf4, block_offset + local_offset);
            let offset_to_message = block_offset + local_offset + $8a97484f9649b812$var$HEADER_MSG_INFO_V2_SIZE + creation_order_size;
            msg.set('offset_to_message', offset_to_message);
            if (msg.get('type') == $8a97484f9649b812$var$OBJECT_CONTINUATION_MSG_TYPE) {
                var [fh_off, size] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<QQ', buf4, offset_to_message);
                // skip the "OFHC" signature in v2 continuation objects:
                object_header_blocks.push([
                    fh_off + 4,
                    size - 4
                ]);
            }
            local_offset += $8a97484f9649b812$var$HEADER_MSG_INFO_V2_SIZE + msg.get('size') + creation_order_size;
            msgs.push(msg);
        }
        return [
            msgs,
            msg_data,
            header
        ];
    }
    _parse_v2_header(buf5, offset6) {
        /* Parse a version 2 data object header. */ let header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$OBJECT_HEADER_V2, buf5, offset6);
        var creation_order_size;
        offset6 += $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$OBJECT_HEADER_V2);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 2);
        if (header.get('flags') & 4) creation_order_size = 2;
        else creation_order_size = 0;
        $a610fe1a81efd230$export$a7a9523472993e97((header.get('flags') & 16) == 0);
        if (header.get('flags') & 32) {
            let times = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<4I', buf5, offset6);
            offset6 += 16;
            header.set('access_time', times[0]);
            header.set('modification_time', times[1]);
            header.set('change_time', times[2]);
            header.set('birth_time', times[3]);
        }
        let chunk_fmt = [
            '<B',
            '<H',
            '<I',
            '<Q'
        ][header.get('flags') & 3];
        header.set('size_of_chunk_0', $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(chunk_fmt, buf5, offset6)[0]);
        offset6 += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize(chunk_fmt);
        return [
            header,
            creation_order_size,
            offset6
        ];
    }
    get_links() {
        //""" Return a dictionary of link_name: offset """
        return Object.fromEntries(this.iter_links());
    }
    *iter_links() {
        for (let msg of this.msgs){
            if (msg.get('type') == $8a97484f9649b812$var$SYMBOL_TABLE_MSG_TYPE) yield* this._iter_links_from_symbol_tables(msg);
            else if (msg.get('type') == $8a97484f9649b812$var$LINK_MSG_TYPE) yield this._get_link_from_link_msg(msg);
            else if (msg.get('type') == $8a97484f9649b812$var$LINK_INFO_MSG_TYPE) yield* this._iter_link_from_link_info_msg(msg);
        }
    }
    *_iter_links_from_symbol_tables(sym_tbl_msg) {
        //""" Return a dict of link_name: offset from a symbol table. """
        $a610fe1a81efd230$export$a7a9523472993e97(sym_tbl_msg.get('size') == 16);
        let data = $a610fe1a81efd230$export$4366ba51fc17f77c(// NOTE: using this.fh instead of this.msg_data - needs to be fixed in py file?
        $8a97484f9649b812$var$SYMBOL_TABLE_MSG, this.fh, sym_tbl_msg.get('offset_to_message'));
        yield* this._iter_links_btree_v1(data.get('btree_address'), data.get('heap_address'));
    }
    *_iter_links_btree_v1(btree_address, heap_address) {
        //""" Retrieve links from symbol table message. """
        let btree = new $5ca17479ed366a65$export$2b84cb98dbbb4f99(this.fh, btree_address);
        let heap = new $edf3c54d05bb7204$export$a6c6f5ecea66e31b(this.fh, heap_address);
        for (let symbol_table_address of btree.symbol_table_addresses()){
            let table = new $edf3c54d05bb7204$export$777871f1ccd7bbc3(this.fh, symbol_table_address);
            table.assign_name(heap);
            //let links = table.get_links(heap);
            //let entries = links.entries();
            yield* Object.entries(table.get_links(heap));
        }
    }
    _get_link_from_link_msg(link_msg) {
        //""" Retrieve link from link message. """
        let offset = link_msg.get('offset_to_message');
        return this._decode_link_msg(this.fh, offset)[1];
    }
    _decode_link_msg(data, offset7) {
        let [version, flags] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<BB', data, offset7);
        offset7 += 2;
        $a610fe1a81efd230$export$a7a9523472993e97(version == 1);
        let size_of_length_of_link_name = 2 ** (flags & 3);
        let link_type_field_present = (flags & 8) > 0;
        let link_name_character_set_field_present = (flags & 16) > 0;
        let ordered = (flags & 4) > 0;
        let link_type;
        if (link_type_field_present) {
            link_type = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', data, offset7)[0];
            offset7 += 1;
        } else link_type = 0;
        $a610fe1a81efd230$export$a7a9523472993e97([
            0,
            1
        ].includes(link_type));
        let creationorder;
        if (ordered) {
            creationorder = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', data, offset7)[0];
            offset7 += 8;
        }
        let link_name_character_set = 0;
        if (link_name_character_set_field_present) {
            link_name_character_set = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', data, offset7)[0];
            offset7 += 1;
        }
        let encoding = link_name_character_set == 0 ? 'ascii' : 'utf-8';
        let name_size_fmt = [
            "<B",
            "<H",
            "<I",
            "<Q"
        ][flags & 3];
        let name_size = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(name_size_fmt, data, offset7)[0];
        offset7 += size_of_length_of_link_name;
        let name = new TextDecoder(encoding).decode(data.slice(offset7, offset7 + name_size));
        offset7 += name_size;
        let address;
        //if (dereference) {
        if (link_type == 0) //# hard link
        address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', data, offset7)[0];
        else if (link_type == 1) {
            //# soft link
            let length_of_soft_link_value = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<H', data, offset7)[0];
            offset7 += 2;
            address = new TextDecoder(encoding).decode(data.slice(offset7, offset7 + length_of_soft_link_value));
        }
        return [
            creationorder,
            [
                name,
                address
            ]
        ];
    }
    *_iter_link_from_link_info_msg(info_msg) {
        //""" Retrieve links from link info message. """
        let offset = info_msg.get('offset_to_message');
        let data = this._decode_link_info_msg(this.fh, offset);
        let heap_address = data.get("heap_address");
        let name_btree_address = data.get("name_btree_address");
        let order_btree_address = data.get("order_btree_address");
        if (name_btree_address != null) yield* this._iter_links_btree_v2(name_btree_address, order_btree_address, heap_address);
    }
    *_iter_links_btree_v2(name_btree_address, order_btree_address, heap_address1) {
        //""" Retrieve links from symbol table message. """
        let heap = new $edf3c54d05bb7204$export$4f02c1c73bec0cfd(this.fh, heap_address1);
        let btree;
        if (order_btree_address != $8a97484f9649b812$var$UNDEFINED_ADDRESS) btree = new $5ca17479ed366a65$export$80daade6be1e5496(this.fh, order_btree_address);
        else btree = new $5ca17479ed366a65$export$45d2dfd125274a16(this.fh, name_btree_address);
        let items = new Map();
        for (let record of btree.iter_records()){
            let data = heap.get_data(record.get("heapid"));
            let [creationorder, item] = this._decode_link_msg(data, 0);
            items.set(creationorder, item);
        }
        let sorted_keys = Array.from(items.keys()).sort();
        for (let key of sorted_keys)yield items.get(key);
    }
    _decode_link_info_msg(data1, offset8) {
        let [version, flags] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<BB', data1, offset8);
        $a610fe1a81efd230$export$a7a9523472993e97(version == 0);
        offset8 += 2;
        if ((flags & 1) > 0) // # creation order present
        offset8 += 8;
        let fmt = (flags & 2) > 0 ? $8a97484f9649b812$var$LINK_INFO_MSG2 : $8a97484f9649b812$var$LINK_INFO_MSG1;
        let link_info = $a610fe1a81efd230$export$4366ba51fc17f77c(fmt, data1, offset8);
        let output = new Map();
        for (let [k, v] of link_info.entries())output.set(k, v == $8a97484f9649b812$var$UNDEFINED_ADDRESS ? null : v);
        return output;
    }
    get is_dataset() {
        //""" True when DataObjects points to a dataset, False for a group. """
        return this.find_msg_type($8a97484f9649b812$var$DATASPACE_MSG_TYPE).length > 0;
    }
    /**
   * Return the data pointed to in the DataObject
   *
   * @returns {Array}
   * @memberof DataObjects
   */ get_data() {
        // offset and size from data storage message:
        let msg = this.find_msg_type($8a97484f9649b812$var$DATA_STORAGE_MSG_TYPE)[0];
        let msg_offset = msg.get('offset_to_message');
        var [version, dims, layout_class, property_offset] = this._get_data_message_properties(msg_offset);
        if (layout_class == 0) throw "Compact storage of DataObject not implemented";
        else if (layout_class == 1) return this._get_contiguous_data(property_offset);
        else if (layout_class == 2) return this._get_chunked_data(msg_offset);
    }
    _get_data_message_properties(msg_offset) {
        // """ Return the message properties of the DataObject. """
        let dims, layout_class, property_offset;
        let [version, arg1, arg2] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<BBB', this.fh, msg_offset);
        if (version == 1 || version == 2) {
            dims = arg1;
            layout_class = arg2;
            property_offset = msg_offset;
            property_offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<BBB');
            //# reserved fields: 1 byte, 1 int
            property_offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<BI');
            //# compact storage (layout class 0) not supported:
            $a610fe1a81efd230$export$a7a9523472993e97(layout_class == 1 || layout_class == 2);
        } else if (version == 3 || version == 4) {
            layout_class = arg1;
            property_offset = msg_offset;
            property_offset += $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<BB');
        }
        $a610fe1a81efd230$export$a7a9523472993e97(version >= 1 && version <= 4);
        return [
            version,
            dims,
            layout_class,
            property_offset
        ];
    }
    _get_contiguous_data(property_offset) {
        let [data_offset] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, property_offset);
        if (data_offset == $8a97484f9649b812$var$UNDEFINED_ADDRESS) {
            //# no storage is backing array, return empty array
            let size = this.shape.reduce(function(a, b) {
                return a * b;
            }, 1); // int(np.product(shape))
            return new Array(size);
        }
        var fullsize = this.shape.reduce(function(a, b) {
            return a * b;
        }, 1);
        if (!(this.dtype instanceof Array)) {
            //# return a memory-map to the stored array with copy-on-write
            //return np.memmap(self.fh, dtype=self.dtype, mode='c',
            //                 offset=data_offset, shape=self.shape, order='C')
            let dtype = this.dtype;
            if (/[<>=!@\|]?(i|u|f|S)(\d*)/.test(dtype)) {
                let [item_getter, item_is_big_endian, item_size] = $a610fe1a81efd230$export$9fc19bf239cc5928(dtype);
                let output = new Array(fullsize);
                let view = new $a610fe1a81efd230$export$735c64326b369ff3(this.fh);
                for(var i = 0; i < fullsize; i++)output[i] = view[item_getter](data_offset + i * item_size, !item_is_big_endian, item_size);
                return output;
            } else throw "not Implemented - no proper dtype defined";
        } else {
            let dtype_class = this.dtype[0];
            if (dtype_class == 'REFERENCE') {
                let size = this.dtype[1];
                if (size != 8) throw "NotImplementedError('Unsupported Reference type')";
                let ref_addresses = this.fh.slice(data_offset, data_offset + fullsize);
                //ref_addresses = np.memmap(
                //    self.fh, dtype=('<u8'), mode='c', offset=data_offset,
                //    shape=self.shape, order='C')
                //return np.array([Reference(addr) for addr in ref_addresses])
                return ref_addresses;
            } else if (dtype_class == 'VLEN_STRING') {
                let character_set = this.dtype[2];
                var value = [];
                for(var i = 0; i < fullsize; i++){
                    var [vlen, vlen_data] = this._vlen_size_and_data(this.fh, data_offset);
                    let fmt = '<' + vlen.toFixed() + 's';
                    let str_data = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, vlen_data, 0)[0];
                    if (character_set == 0) //# ascii character set, return as bytes
                    value[i] = str_data;
                    else value[i] = decodeURIComponent(escape(str_data));
                    data_offset += 16;
                }
                return value;
            } else throw "NotImplementedError('datatype not implemented')";
        }
    }
    _get_chunked_data(offset9) {
        //""" Return data which is chunked. """
        this._get_chunk_params();
        var chunk_btree = new $5ca17479ed366a65$export$9a219750c72cfcbd(this.fh, this._chunk_address, this._chunk_dims);
        let data = chunk_btree.construct_data_from_chunks(this.chunks, this.shape, this.dtype, this.filter_pipeline);
        if (this.dtype instanceof Array && /^VLEN/.test(this.dtype[0])) {
            // VLEN data
            let dtype_class = this.dtype[0];
            for(var i = 0; i < data.length; i++){
                let [item_size, gheap_address, object_index] = data[i];
                var gheap;
                if (!(gheap_address in this._global_heaps)) {
                    //# load the global heap and cache the instance
                    gheap = new $edf3c54d05bb7204$export$6e04a67f2469695d(this.fh, gheap_address);
                    this._global_heaps[gheap_address] = gheap;
                } else gheap = this._global_heaps[gheap_address];
                let vlen_data = gheap.objects.get(object_index);
                if (dtype_class == 'VLEN_STRING') {
                    let character_set = this.dtype[2];
                    let fmt = '<' + item_size.toFixed() + 's';
                    let str_data = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, vlen_data, 0)[0];
                    if (character_set == 0) //# ascii character set, return as bytes
                    data[i] = str_data;
                    else data[i] = decodeURIComponent(escape(str_data));
                }
            }
        }
        return data;
    }
    _get_chunk_params() {
        /*
    Get and cache chunked data storage parameters.
    This method should be called prior to accessing any _chunk_*
    attributes. Calling this method multiple times is fine, it will not
    re-read the parameters.
    */ if (this._chunk_params_set) return;
        this._chunk_params_set = true;
        var msg = this.find_msg_type($8a97484f9649b812$var$DATA_STORAGE_MSG_TYPE)[0];
        var offset = msg.get('offset_to_message');
        var [version, dims, layout_class, property_offset] = this._get_data_message_properties(offset);
        if (layout_class != 2) return;
        var data_offset;
        if (version == 1 || version == 2) {
            var address = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', this.fh, property_offset)[0];
            data_offset = property_offset + $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<Q');
        } else if (version == 3) {
            var [dims, address] = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<BQ', this.fh, property_offset);
            data_offset = property_offset + $a610fe1a81efd230$export$8cf3da7c1c9174ea.calcsize('<BQ');
        }
        $a610fe1a81efd230$export$a7a9523472993e97(version >= 1 && version <= 3);
        var fmt = '<' + (dims - 1).toFixed() + 'I';
        var chunk_shape = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from(fmt, this.fh, data_offset);
        this._chunks = chunk_shape;
        this._chunk_dims = dims;
        this._chunk_address = address;
        return;
    }
    /*
  """
  HDF5 DataObjects.
  """
  */ constructor(fh, offset10){
        //""" initalize. """
        //fh.seek(offset)
        let version_hint = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', fh, offset10)[0];
        //fh.seek(offset)
        if (version_hint == 1) var [msgs, msg_data, header] = this._parse_v1_objects(fh, offset10);
        else if (version_hint == 'O'.charCodeAt(0)) var [msgs, msg_data, header] = this._parse_v2_objects(fh, offset10);
        else throw "InvalidHDF5File('unknown Data Object Header')";
        this.fh = fh;
        this.msgs = msgs;
        this.msg_data = msg_data;
        this.offset = offset10;
        this._global_heaps = {
        };
        this._header = header;
        //# cached attributes
        this._filter_pipeline = null;
        this._chunk_params_set = false;
        this._chunks = null;
        this._chunk_dims = null;
        this._chunk_address = null;
    }
}
function $8a97484f9649b812$var$determine_data_shape(buf, offset) {
    //""" Return the shape of the dataset pointed to in a Dataspace message. """
    let version = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<B', buf, offset)[0];
    var header;
    if (version == 1) {
        header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1, buf, offset);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 1);
        offset += $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1_SIZE;
    } else if (version == 2) {
        header = $a610fe1a81efd230$export$4366ba51fc17f77c($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2, buf, offset);
        $a610fe1a81efd230$export$a7a9523472993e97(header.get('version') == 2);
        offset += $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2_SIZE;
    } else throw "InvalidHDF5File('unknown dataspace message version')";
    let ndims = header.get('dimensionality');
    let dim_sizes = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<' + (ndims * 2).toFixed() + 'I', buf, offset);
    //# Dimension maximum size follows if header['flags'] bit 0 set
    //# Permutation index follows if header['flags'] bit 1 set
    return dim_sizes.filter(function(s, i) {
        return i % 2 == 0;
    });
}
var $8a97484f9649b812$var$UNDEFINED_ADDRESS = $a610fe1a81efd230$export$8cf3da7c1c9174ea.unpack_from('<Q', new Uint8Array([
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255
]).buffer);
var $8a97484f9649b812$var$GLOBAL_HEAP_ID = new Map([
    [
        'collection_address',
        'Q'
    ],
    [
        'object_index',
        'I'
    ], 
]);
var $8a97484f9649b812$var$GLOBAL_HEAP_ID_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$GLOBAL_HEAP_ID);
//# IV.A.2.m The Attribute Message
var $8a97484f9649b812$var$ATTR_MSG_HEADER_V1 = new Map([
    [
        'version',
        'B'
    ],
    [
        'reserved',
        'B'
    ],
    [
        'name_size',
        'H'
    ],
    [
        'datatype_size',
        'H'
    ],
    [
        'dataspace_size',
        'H'
    ], 
]);
var $8a97484f9649b812$var$ATTR_MSG_HEADER_V1_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$ATTR_MSG_HEADER_V1);
var $8a97484f9649b812$var$ATTR_MSG_HEADER_V3 = new Map([
    [
        'version',
        'B'
    ],
    [
        'flags',
        'B'
    ],
    [
        'name_size',
        'H'
    ],
    [
        'datatype_size',
        'H'
    ],
    [
        'dataspace_size',
        'H'
    ],
    [
        'character_set_encoding',
        'B'
    ], 
]);
var $8a97484f9649b812$var$ATTR_MSG_HEADER_V3_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$ATTR_MSG_HEADER_V3);
// IV.A.1.a Version 1 Data Object Header Prefix
var $8a97484f9649b812$var$OBJECT_HEADER_V1 = new Map([
    [
        'version',
        'B'
    ],
    [
        'reserved',
        'B'
    ],
    [
        'total_header_messages',
        'H'
    ],
    [
        'object_reference_count',
        'I'
    ],
    [
        'object_header_size',
        'I'
    ],
    [
        'padding',
        'I'
    ], 
]);
// IV.A.1.b Version 2 Data Object Header Prefix
var $8a97484f9649b812$var$OBJECT_HEADER_V2 = new Map([
    [
        'signature',
        '4s'
    ],
    [
        'version',
        'B'
    ],
    [
        'flags',
        'B'
    ]
]);
// IV.A.2.b The Dataspace Message
var $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1 = new Map([
    [
        'version',
        'B'
    ],
    [
        'dimensionality',
        'B'
    ],
    [
        'flags',
        'B'
    ],
    [
        'reserved_0',
        'B'
    ],
    [
        'reserved_1',
        'I'
    ], 
]);
var $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V1);
var $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2 = new Map([
    [
        'version',
        'B'
    ],
    [
        'dimensionality',
        'B'
    ],
    [
        'flags',
        'B'
    ],
    [
        'type',
        'B'
    ], 
]);
var $8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$DATASPACE_MSG_HEADER_V2);
var $8a97484f9649b812$var$HEADER_MSG_INFO_V1 = new Map([
    [
        'type',
        'H'
    ],
    [
        'size',
        'H'
    ],
    [
        'flags',
        'B'
    ],
    [
        'reserved',
        '3s'
    ]
]);
var $8a97484f9649b812$var$HEADER_MSG_INFO_V1_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$HEADER_MSG_INFO_V1);
var $8a97484f9649b812$var$HEADER_MSG_INFO_V2 = new Map([
    [
        'type',
        'B'
    ],
    [
        'size',
        'H'
    ],
    [
        'flags',
        'B'
    ], 
]);
var $8a97484f9649b812$var$HEADER_MSG_INFO_V2_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$HEADER_MSG_INFO_V2);
var $8a97484f9649b812$var$SYMBOL_TABLE_MSG = new Map([
    [
        'btree_address',
        'Q'
    ],
    [
        'heap_address',
        'Q'
    ]
]);
const $8a97484f9649b812$var$LINK_INFO_MSG1 = new Map([
    [
        'heap_address',
        'Q'
    ],
    [
        'name_btree_address',
        'Q'
    ] // 8 bytes addressing
]);
const $8a97484f9649b812$var$LINK_INFO_MSG2 = new Map([
    [
        'heap_address',
        'Q'
    ],
    [
        'name_btree_address',
        'Q'
    ],
    [
        'order_btree_address',
        'Q'
    ] // 8 bytes addressing
]);
// IV.A.2.f. The Data Storage - Fill Value Message
var $8a97484f9649b812$var$FILLVAL_MSG_V1V2 = new Map([
    [
        'version',
        'B'
    ],
    [
        'space_allocation_time',
        'B'
    ],
    [
        'fillvalue_write_time',
        'B'
    ],
    [
        'fillvalue_defined',
        'B'
    ]
]);
var $8a97484f9649b812$var$FILLVAL_MSG_V1V2_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$FILLVAL_MSG_V1V2);
var $8a97484f9649b812$var$FILLVAL_MSG_V3 = new Map([
    [
        'version',
        'B'
    ],
    [
        'flags',
        'B'
    ]
]);
var $8a97484f9649b812$var$FILLVAL_MSG_V3_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$FILLVAL_MSG_V3);
//# IV.A.2.l The Data Storage - Filter Pipeline message
var $8a97484f9649b812$var$FILTER_PIPELINE_DESCR_V1 = new Map([
    [
        'filter_id',
        'H'
    ],
    [
        'name_length',
        'H'
    ],
    [
        'flags',
        'H'
    ],
    [
        'client_data_values',
        'H'
    ], 
]);
var $8a97484f9649b812$var$FILTER_PIPELINE_DESCR_V1_SIZE = $a610fe1a81efd230$export$3d1b068e9b9d668d($8a97484f9649b812$var$FILTER_PIPELINE_DESCR_V1);
//# Data Object Message types
//# Section IV.A.2.a - IV.A.2.x
var $8a97484f9649b812$var$NIL_MSG_TYPE = 0;
var $8a97484f9649b812$var$DATASPACE_MSG_TYPE = 1;
var $8a97484f9649b812$var$LINK_INFO_MSG_TYPE = 2;
var $8a97484f9649b812$var$DATATYPE_MSG_TYPE = 3;
var $8a97484f9649b812$var$FILLVALUE_OLD_MSG_TYPE = 4;
var $8a97484f9649b812$var$FILLVALUE_MSG_TYPE = 5;
var $8a97484f9649b812$var$LINK_MSG_TYPE = 6;
var $8a97484f9649b812$var$EXTERNAL_DATA_FILES_MSG_TYPE = 7;
var $8a97484f9649b812$var$DATA_STORAGE_MSG_TYPE = 8;
var $8a97484f9649b812$var$BOGUS_MSG_TYPE = 9;
var $8a97484f9649b812$var$GROUP_INFO_MSG_TYPE = 10;
var $8a97484f9649b812$var$DATA_STORAGE_FILTER_PIPELINE_MSG_TYPE = 11;
var $8a97484f9649b812$var$ATTRIBUTE_MSG_TYPE = 12;
var $8a97484f9649b812$var$OBJECT_COMMENT_MSG_TYPE = 13;
var $8a97484f9649b812$var$OBJECT_MODIFICATION_TIME_OLD_MSG_TYPE = 14;
var $8a97484f9649b812$var$SHARED_MSG_TABLE_MSG_TYPE = 15;
var $8a97484f9649b812$var$OBJECT_CONTINUATION_MSG_TYPE = 16;
var $8a97484f9649b812$var$SYMBOL_TABLE_MSG_TYPE = 17;
var $8a97484f9649b812$var$OBJECT_MODIFICATION_TIME_MSG_TYPE = 18;
var $8a97484f9649b812$var$BTREE_K_VALUE_MSG_TYPE = 19;
var $8a97484f9649b812$var$DRIVER_INFO_MSG_TYPE = 20;
var $8a97484f9649b812$var$ATTRIBUTE_INFO_MSG_TYPE = 21;
var $8a97484f9649b812$var$OBJECT_REFERENCE_COUNT_MSG_TYPE = 22;
var $8a97484f9649b812$var$FILE_SPACE_INFO_MSG_TYPE = 24;



const $359dcbe525bf8f2a$export$54e61d0ef1bb59e6 = '0.4.0.dev';
class $359dcbe525bf8f2a$export$eb2fcfdbd7ba97d4 {
    get keys() {
        if (this._keys == null) this._keys = Object.keys(this._links);
        return this._keys.slice();
    }
    get values() {
        return this.keys.map((k)=>this.get(k)
        );
    }
    length() {
        return this.keys.length;
    }
    _dereference(ref) {
        //""" Deference a Reference object. """
        if (!ref) throw 'cannot deference null reference';
        let obj = this.file._get_object_by_address(ref);
        if (obj == null) throw 'reference not found in file';
        return obj;
    }
    get(y1) {
        //""" x.__getitem__(y) <==> x[y] """
        if (typeof y1 == 'number') return this._dereference(y1);
        var path = $359dcbe525bf8f2a$var$normpath(y1);
        if (path == '/') return this.file;
        if (path == '.') return this;
        if (/^\//.test(path)) return this.file.get(path.slice(1));
        if ($359dcbe525bf8f2a$var$posix_dirname(path) != '') var [next_obj, additional_obj] = path.split(/\/(.*)/);
        else {
            var next_obj = path;
            var additional_obj = '.';
        }
        if (!(next_obj in this._links)) throw next_obj + ' not found in group';
        var obj_name = $359dcbe525bf8f2a$var$normpath(this.name + '/' + next_obj);
        let link_target = this._links[next_obj];
        if (typeof link_target == "string") try {
            return this.get(link_target);
        } catch (error) {
            return null;
        }
        var dataobjs = new $8a97484f9649b812$export$484cf4e32b93a7f2(this.file._fh, link_target);
        if (dataobjs.is_dataset) {
            if (additional_obj != '.') throw obj_name + ' is a dataset, not a group';
            return new $359dcbe525bf8f2a$export$827063163a0a89f5(obj_name, dataobjs, this);
        } else {
            var new_group = new $359dcbe525bf8f2a$export$eb2fcfdbd7ba97d4(obj_name, dataobjs, this);
            return new_group.get(additional_obj);
        }
    }
    visit(func) {
        /*
    Recursively visit all names in the group and subgroups.
    func should be a callable with the signature:
        func(name) -> None or return value
    Returning None continues iteration, return anything else stops and
    return that value from the visit method.
    */ return this.visititems((name, obj)=>func(name)
        );
    }
    visititems(func1) {
        /*
    Recursively visit all objects in this group and subgroups.
    func should be a callable with the signature:
        func(name, object) -> None or return value
    Returning None continues iteration, return anything else stops and
    return that value from the visit method.
    */ var root_name_length = this.name.length;
        if (!/\/$/.test(this.name)) root_name_length += 1;
        //queue = deque(this.values())
        var queue = this.values.slice();
        while(queue){
            let obj = queue.shift();
            if (queue.length == 1) console.log(obj);
            let name = obj.name.slice(root_name_length);
            let ret = func1(name, obj);
            if (ret != null) return ret;
            if (obj instanceof $359dcbe525bf8f2a$export$eb2fcfdbd7ba97d4) queue = queue.concat(obj.values);
        }
        return null;
    }
    get attrs() {
        //""" attrs attribute. """
        if (this._attrs == null) this._attrs = this._dataobjects.get_attributes();
        return this._attrs;
    }
    /*
    An HDF5 Group which may hold attributes, datasets, or other groups.
    Attributes
    ----------
    attrs : dict
        Attributes for this group.
    name : str
        Full path to this group.
    file : File
        File instance where this group resides.
    parent : Group
        Group instance containing this group.
  */ /**
   *
   *
   * @memberof Group
   * @member {Group|File} parent;
   * @member {File} file;
   * @member {string} name;
   * @member {DataObjects} _dataobjects;
   * @member {Object} _attrs;
   * @member {Array<string>} _keys;
   */ // parent;
    // file;
    // name;
    // _links;
    // _dataobjects;
    // _attrs;
    // _keys;
    /**
   * 
   * @param {string} name 
   * @param {DataObjects} dataobjects 
   * @param {Group} [parent] 
   * @param {boolean} [getterProxy=false]
   * @returns {Group}
   */ constructor(name, dataobjects, parent, getterProxy = false){
        if (parent == null) {
            this.parent = this;
            this.file = this;
        } else {
            this.parent = parent;
            this.file = parent.file;
        }
        this.name = name;
        this._links = dataobjects.get_links();
        this._dataobjects = dataobjects;
        this._attrs = null; // cached property
        this._keys = null;
        if (getterProxy) return new Proxy(this, $359dcbe525bf8f2a$var$groupGetHandler);
    }
}
const $359dcbe525bf8f2a$var$groupGetHandler = {
    get: function(target, prop, receiver) {
        if (prop in target) return target[prop];
        return target.get(prop);
    }
};
class $359dcbe525bf8f2a$export$b6afa8811b7e644e extends $359dcbe525bf8f2a$export$eb2fcfdbd7ba97d4 {
    _get_object_by_address(obj_addr) {
        //""" Return the object pointed to by a given address. """
        if (this._dataobjects.offset == obj_addr) return this;
        return this.visititems((y)=>{
            y._dataobjects.offset;
        });
    }
    /*
  Open a HDF5 file.
  Note in addition to having file specific methods the File object also
  inherit the full interface of **Group**.
  File is also a context manager and therefore supports the with statement.
  Files opened by the class will be closed after the with block, file-like
  object are not closed.
  Parameters
  ----------
  filename : str or file-like
      Name of file (string or unicode) or file like object which has read
      and seek methods which behaved like a Python file object.
  Attributes
  ----------
  filename : str
      Name of the file on disk, None if not available.
  mode : str
      String indicating that the file is open readonly ("r").
  userblock_size : int
      Size of the user block in bytes (currently always 0).
  */ constructor(fh, filename){
        //""" initalize. """
        //if hasattr(filename, 'read'):
        //    if not hasattr(filename, 'seek'):
        //        raise ValueError(
        //            'File like object must have a seek method')
        var superblock = new $edf3c54d05bb7204$export$ef68f9f44792800e(fh, 0);
        var offset = superblock.offset_to_dataobjects;
        var dataobjects = new $8a97484f9649b812$export$484cf4e32b93a7f2(fh, offset);
        super('/', dataobjects, null);
        this.parent = this;
        this._fh = fh;
        this.filename = filename || '';
        this.file = this;
        this.mode = 'r';
        this.userblock_size = 0;
    }
}
class $359dcbe525bf8f2a$export$827063163a0a89f5 extends Array {
    get value() {
        var data = this._dataobjects.get_data();
        if (this._astype == null) return data;
        return data.astype(this._astype);
    }
    get shape() {
        return this._dataobjects.shape;
    }
    get attrs() {
        return this._dataobjects.get_attributes();
    }
    get dtype() {
        return this._dataobjects.dtype;
    }
    get fillvalue() {
        return this._dataobjects.fillvalue;
    }
    /*
  A HDF5 Dataset containing an n-dimensional array and meta-data attributes.
  Attributes
  ----------
  shape : tuple
      Dataset dimensions.
  dtype : dtype
      Dataset's type.
  size : int
      Total number of elements in the dataset.
  chunks : tuple or None
      Chunk shape, or NOne is chunked storage not used.
  compression : str or None
      Compression filter used on dataset.  None if compression is not enabled
      for this dataset.
  compression_opts : dict or None
      Options for the compression filter.
  scaleoffset : dict or None
      Setting for the HDF5 scale-offset filter, or None if scale-offset
      compression is not used for this dataset.
  shuffle : bool
      Whether the shuffle filter is applied for this dataset.
  fletcher32 : bool
      Whether the Fletcher32 checksumming is enabled for this dataset.
  fillvalue : float or None
      Value indicating uninitialized portions of the dataset. None is no fill
      values has been defined.
  dim : int
      Number of dimensions.
  dims : None
      Dimension scales.
  attrs : dict
      Attributes for this dataset.
  name : str
      Full path to this dataset.
  file : File
      File instance where this dataset resides.
  parent : Group
      Group instance containing this dataset.
  */ /**
   *
   *
   * @memberof Dataset
   * @member {Group|File} parent;
   * @member {File} file;
   * @member {string} name;
   * @member {DataObjects} _dataobjects;
   * @member {Object} _attrs;
   * @member {string} _astype;
   */ // parent;
    // file;
    // name;
    // _dataobjects;
    // _attrs;
    // _astype;
    constructor(name1, dataobjects1, parent1){
        //""" initalize. """
        super();
        this.parent = parent1;
        this.file = parent1.file;
        this.name = name1;
        this._dataobjects = dataobjects1;
        this._attrs = null;
        this._astype = null;
    }
}
function $359dcbe525bf8f2a$var$posix_dirname(p) {
    let sep = '/';
    let i = p.lastIndexOf(sep) + 1;
    let head = p.slice(0, i);
    let all_sep = new RegExp('^' + sep + '+$');
    let end_sep = new RegExp(sep + '$');
    if (head && !all_sep.test(head)) head = head.replace(end_sep, '');
    return head;
}
function $359dcbe525bf8f2a$var$normpath(path) {
    return path.replace(/\/(\/)+/g, '/');
// path = posixpath.normpath(y)
}


$parcel$exportWildcard(module.exports, $359dcbe525bf8f2a$exports);


//# sourceMappingURL=index.js.map
