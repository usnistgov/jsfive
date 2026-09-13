import assert from 'node:assert';
import { test } from 'node:test';
import { read, readFileSync } from "node:fs";

import * as hdf5 from "jsfive";

function loadFile(filename) {
    // readFileSync can hand back a view into a shared pool, so .buffer on its own
    // starts at byte 0 of the pool rather than at the start of the file.
    const ab = new Uint8Array(readFileSync(filename)).buffer;
    return new hdf5.File(ab, filename);
}

test('check dtypes', () => {
  const dtypes = ['f2', 'f4', 'f8', 'i1', 'i2', 'i4'];
  const values = [3.0, 4.0, 5.0];
  const f = loadFile("test/test.h5");

  for (const dtype of dtypes) {
    const dset = f.get(dtype);
    assert.strictEqual(dset.dtype, `<${dtype}`);
    assert.deepEqual(dset.value, values);
  }  
});

test('strings', () => {
  const f = loadFile("test/test.h5");
  const dset = f.get('string');

  assert.strictEqual(dset.dtype, 'S5');
  assert.deepEqual(dset.value, ['hello']);

  const vlen_dset = f.get('vlen_string');
  assert.deepEqual(vlen_dset.dtype, ['VLEN_STRING', 0, 1]);
  assert.deepEqual(vlen_dset.value, ['hello']);
});

// A v2 object header whose only message is an object header continuation pointing
// back at the block that message lives in. Before the continuation blocks were
// deduplicated this queued the same block forever and exhausted the heap.
function selfReferentialContinuation() {
  const bytes = new Uint8Array(256);
  const view = new DataView(bytes.buffer);
  bytes.set([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);  // signature
  bytes[8] = 2;   // superblock version
  bytes[9] = 8;   // size of offsets
  bytes[10] = 8;  // size of lengths
  view.setBigUint64(20, 0xffffffffffffffffn, true);  // no superblock extension
  view.setBigUint64(28, 256n, true);                 // end of file address
  view.setBigUint64(36, 48n, true);                  // root group object header
  bytes.set([0x4f, 0x48, 0x44, 0x52], 48);           // OHDR
  bytes[52] = 2;   // object header version
  bytes[54] = 20;  // size of chunk 0
  bytes[55] = 0x10;               // message type: object header continuation
  view.setUint16(56, 16, true);   // message size
  view.setBigUint64(59, 51n, true);  // block address, +4 for OFHC lands back on byte 55
  view.setBigUint64(67, 24n, true);  // block size
  return bytes.buffer;
}

test('self-referential object header continuation terminates', () => {
  const f = new hdf5.File(selfReferentialContinuation(), 'self_continuation');
  assert.deepEqual(f.keys, []);
});
