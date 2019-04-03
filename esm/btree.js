import {_unpack_struct_from, _structure_size, struct, dtype_getter, DataView64} from './core.js';
import {default as pako} from 'https://www.unpkg.com/pako-es@1.0.9/index.js';

const zlib = {
  decompress: function(buf) {
    let input_array = new Uint8Array(buf);
    return pako.inflate(input_array).buffer;
    }
};

export class BTree {
  /*
  """
  HDF5 version 1 B-Tree.
  """
  */
  constructor(fh, offset) {
    //""" initalize. """
    this.fh = fh;

    //# read in the root node
    let root_node = this._read_node(offset);
    this.root_node = root_node;

    //# read in all nodes
    var all_nodes = new Map();
    var node_level = root_node.get('node_level');
    all_nodes.set(node_level, [root_node]);
    while (node_level != 0) {
      var new_nodes = [];
      for (var parent_node of all_nodes.get(node_level)) {
        for (var addr of parent_node.get('addresses')) {
            new_nodes.push(this._read_node(addr));
        }
      }
      let new_node_level = new_nodes[0].get('node_level');
      all_nodes.set(new_node_level, new_nodes);
      node_level = new_node_level;
    }
    this.all_nodes = all_nodes
  }

  _read_node(offset) {
    //""" Return a single node in the B-Tree located at a given offset. """
    //this.fh.seek(offset);
    let node = _unpack_struct_from(B_LINK_NODE_V1, this.fh, offset);
    offset += _structure_size(B_LINK_NODE_V1);
    //assert node['signature'] == b'TREE'
    var keys = [];
    var addresses = [];
    var entries_used = node.get('entries_used');
    for (var i=0; i<entries_used; i++) {
      let [key, key_higher] = struct.unpack_from('<II', this.fh, offset);
      offset += 8;
      let [address, address_higher] = struct.unpack_from('<II', this.fh, offset);
      offset += 8;
      keys.push(key);
      addresses.push(address);
    }
    //# N+1 key
    keys.push(struct.unpack_from('<I', this.fh, offset)[0]);
    node.set('keys', keys);
    node.set('addresses', addresses);
    return node
  }

  symbol_table_addresses() {
    //""" Return a list of all symbol table address. """
    var all_address = [];
    var root_nodes = this.all_nodes.get(0);
    for (var node of root_nodes) {
      all_address = all_address.concat(node.get('addresses'));
    }
    return all_address
  }
}

export class BTreeRawDataChunks {
  /*
  HDF5 version 1 B-Tree storing raw data chunk nodes (type 1).
  */

  constructor(fh, offset, dims) {
    //""" initalize. """
    this.fh = fh;
    this.dims = dims;

    //# read in the root node
    var root_node = this._read_node(offset);
    this.root_node = root_node;

    //# read in all other nodes
    var all_nodes = {}
    var node_level = root_node.get('node_level');
    all_nodes[node_level] = [root_node];
    while (node_level != 0) {
      let new_nodes = [];
      for (var parent_node of all_nodes[node_level].values()) {
        for (var addr of parent_node.get('addresses')) {
          new_nodes.push(this._read_node(addr));
        }
      }
      let new_node_level = new_nodes[0].get('node_level');
      all_nodes[new_node_level] = new_nodes;
      node_level = new_node_level;
    }

    this.all_nodes = all_nodes;
  }

  _read_node(offset) {
    //""" Return a single node in the b-tree located at a give offset. """
    //self.fh.seek(offset)
    let node = _unpack_struct_from(B_LINK_NODE_V1, this.fh, offset);
    offset += _structure_size(B_LINK_NODE_V1);
    //assert node['signature'] == b'TREE'
    //assert node['node_type'] == 1

    var keys = [];
    var addresses = [];
    let entries_used = node.get('entries_used');
    for (var i=0; i<entries_used; i++) {
      let [chunk_size, filter_mask] = struct.unpack_from('<II', this.fh, offset);
      offset += 8;
      let fmt = '<' + this.dims.toFixed() + 'Q';
      let fmt_size = struct.calcsize(fmt);
      let chunk_offset = struct.unpack_from(fmt, this.fh, offset);
      //console.log(struct.unpack_from('<8B', this.fh, offset));
      offset += fmt_size;
      let chunk_address = struct.unpack_from('<Q', this.fh, offset)[0];
      offset += 8;

      keys.push(new Map([
          ['chunk_size', chunk_size],
          ['filter_mask', filter_mask],
          ['chunk_offset', chunk_offset]
      ]))
      addresses.push(chunk_address);
    }
    node.set('keys', keys);
    node.set('addresses', addresses);
    return node
  }

  construct_data_from_chunks(chunk_shape, data_shape, dtype, filter_pipeline) {
    //""" Build a complete data array from chunks. """
    var true_dtype;
    if (dtype instanceof Array) {
      true_dtype = dtype;
      let dtype_class = dtype[0];
      if (dtype_class == 'REFERENCE') {
        let size = dtype[1];
        if (size != 8) {
          throw "NotImplementedError('Unsupported Reference type')";
        }
        var dtype = '<u8'
      }
      else {
        throw "NotImplementedError('datatype not implemented')";
      }
    }
    else {
      true_dtype = null;
    }

    //# create array to store data
    var data_size = data_shape.reduce(function(a,b) { return a * b }, 1);
    var chunk_size = chunk_shape.reduce(function(a,b) { return a * b }, 1);
    let dims = (data_shape.length);
    var current_stride = 1;
    var chunk_strides = chunk_shape.slice().map(function(d) {
      let s = current_stride; 
      current_stride *= d; 
      return s
    });
    var current_stride = 1;
    var data_strides = data_shape.slice().reverse().map(function(d) {
      let s = current_stride; 
      current_stride *= d; 
      return s
    }).reverse();
    var data = new Array(data_size);
    let [item_getter, item_big_endian, item_size] = dtype_getter(dtype);
    let chunk_buffer_size = chunk_size * item_size;
    for (var node of this.all_nodes[0]) {
      //console.log(node);
      let node_keys = node.get('keys');
      let node_addresses = node.get('addresses');
      let nkeys = node_keys.length;
      for (var ik=0; ik<nkeys; ik++) {
        let node_key = node_keys[ik];
        let addr = node_addresses[ik];
        var chunk_buffer;
        if (filter_pipeline == null) {
          chunk_buffer = this.fh.slice(addr, addr + chunk_buffer_size);
        }
        else {
          chunk_buffer = this.fh.slice(addr, addr + node_key.get('chunk_size'));
          let filter_mask = node_key.get('filter_mask');
          chunk_buffer = this._filter_chunk(
              chunk_buffer, filter_mask, filter_pipeline, item_size);
        }

        var chunk_offset = node_key.get('chunk_offset').slice(); //(0, -1);
        var apos = chunk_offset.slice();
        var cpos = apos.map(function() {return 0}); // start chunk pos at 0,0,0...
        var cview = new DataView64(chunk_buffer);

        for (var ci=0; ci<chunk_size; ci++) {
          for (var d=dims-1; d>=0; d--) {
            if (cpos[d] >= chunk_shape[d]) {
              cpos[d] = 0;
              apos[d] = chunk_offset[d];
              if (d > 0) {
                cpos[d-1] += 1;
                apos[d-1] += 1;
              }
            }
            else {
              break;
            }
          }
          let inbounds = apos.slice(0,-1).every(function(p, d) { return p < data_shape[d] });
          if (inbounds) {
            let cb_offset = ci * item_size;
            let datum = cview[item_getter](cb_offset, !item_big_endian, item_size);
            let ai = apos.slice(0,-1).reduce(function(prev, curr, index) { 
              return curr * data_strides[index] + prev }, 0);
            data[ai] = datum;
          }
          cpos[dims-1] += 1;
          apos[dims-1] += 1;
        }
      }
    }
    return data;
  }

  _filter_chunk(chunk_buffer, filter_mask, filter_pipeline, itemsize) {
    //""" Apply decompression filters to a chunk of data. """
    let num_filters = filter_pipeline.length;
    var chunk_buffer_out = chunk_buffer.slice();
    for (var filter_index=num_filters-1; filter_index >=0; filter_index--) {
      //for i, pipeline_entry in enumerate(filter_pipeline[::-1]):

      //# A filter is skipped is the bit corresponding to its index in the
      //# pipeline is set in filter_mask
      if (filter_mask & (1 << filter_index)) {
        continue
      }
      let pipeline_entry = filter_pipeline[filter_index];
      let filter_id = pipeline_entry.get('filter_id');
      if (filter_id == GZIP_DEFLATE_FILTER) {
        chunk_buffer_out = zlib.decompress(chunk_buffer_out);
      }

      else if (filter_id == SHUFFLE_FILTER) {
        let buffer_size = chunk_buffer_out.byteLength;
        var unshuffled_view = new Uint8Array(buffer_size);
        let step = Math.floor(buffer_size / itemsize);
        let shuffled_view = new DataView(chunk_buffer_out);
        for (var j=0; j<itemsize; j++) {
          for (var i=0; i<step; i++) {
            unshuffled_view[j + i*itemsize] = shuffled_view.getUint8(j*step + i);
          }
        }
        chunk_buffer_out = unshuffled_view.buffer;
      }
      else if (filter_id == FLETCH32_FILTER) {
        _verify_fletcher32(chunk_buffer_out);
        //# strip off 4-byte checksum from end of buffer
        chunk_buffer_out = chunk_buffer_out.slice(0, -4);
      }
      else {
          throw 'NotImplementedError("Filter with id:' + filter_id.toFixed() + ' not supported")';
      }
    }
    return chunk_buffer_out;
  }

    /*

    var shape = [_padded_size(i, j) for i, j in zip(data_shape, chunk_shape)]
    var data = np.zeros(shape, dtype=dtype)

    //# loop over chunks reading each into the full data array
    var count = chunk_shape.reduce(function(a,b) { return a * b }, 1); // np.prod(chunk_shape)
    itemsize = np.dtype(dtype).itemsize
    chunk_buffer_size = count * itemsize
    for node in this.all_nodes[0]:
        for node_key, addr in zip(node['keys'], node['addresses']):
            self.fh.seek(addr)
            if filter_pipeline is None:
                chunk_buffer = self.fh.read(chunk_buffer_size)
            else:
                chunk_buffer = self.fh.read(node_key['chunk_size'])
                filter_mask = node_key['filter_mask']
                chunk_buffer = self._filter_chunk(
                    chunk_buffer, filter_mask, filter_pipeline, itemsize)

            chunk_data = np.frombuffer(chunk_buffer, dtype=dtype)
            start = node_key['chunk_offset'][:-1]
            region = [slice(i, i+j) for i, j in zip(start, chunk_shape)]
            data[region] = chunk_data.reshape(chunk_shape)

    if isinstance(true_dtype, tuple):
        if dtype_class == 'REFERENCE':
            to_reference = np.vectorize(Reference)
            data = to_reference(data)
        else:
            raise NotImplementedError('datatype not implemented')

    non_padded_region = [slice(i) for i in data_shape]
    return data[non_padded_region]
    */
      
}


function _verify_fletcher32(chunk_buffer) {
  //""" Verify a chunk with a fletcher32 checksum. """
  //# calculate checksums
  var odd_chunk_buffer = ((chunk_buffer.byteLength % 2) != 0);
  var data_length = chunk_buffer.byteLength - 4;
  var view = new DataView64(chunk_buffer);

  var sum1 = 0;
  var sum2 = 0;
  for (var offset=0; offset<(data_length-1); offset+=2) {
    let datum = view.getUint16(offset, true); // little-endian
    sum1 = (sum1 + datum) % 65535
    sum2 = (sum2 + sum1) % 65535
  }
  if (odd_chunk_buffer) {
    // process the last item:
    let datum = view.getUint8(data_length-1);
    sum1 = (sum1 + datum) % 65535
    sum2 = (sum2 + sum1) % 65535
  }

  //# extract stored checksums
  var [ref_sum1, ref_sum2] = struct.unpack_from('>HH', chunk_buffer, data_length); // .fromstring(chunk_buffer[-4:], '>u2')
  ref_sum1 = ref_sum1 % 65535
  ref_sum2 = ref_sum2 % 65535

  //# compare
  if (sum1 != ref_sum1 || sum2 != ref_sum2) {
    throw 'ValueError("fletcher32 checksum invalid")';
  }
  return true
}


var B_LINK_NODE_V1 = new Map([
  ['signature', '4s'],

  ['node_type', 'B'],
  ['node_level', 'B'],
  ['entries_used', 'H'],

  ['left_sibling', 'Q'],     // 8 byte addressing
  ['right_sibling', 'Q']    // 8 byte addressing

  /*
  ['left_sibling', 'I'],     //# 8 byte addressing
  ['left_sibling_higher', 'I'],    // # 8 byte addressing
  ['right_sibling', 'I'],    //# 8 byte addressing
  ['right_sibling_higher', 'I']    //# 8 byte addressing
  */
])

//# IV.A.2.l The Data Storage - Filter Pipeline message
var RESERVED_FILTER = 0;
export const GZIP_DEFLATE_FILTER = 1;
export const SHUFFLE_FILTER = 2;
export const FLETCH32_FILTER = 3;
var SZIP_FILTER = 4;
var NBIT_FILTER = 5;
var SCALEOFFSET_FILTER = 6;