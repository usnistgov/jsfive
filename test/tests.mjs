import assert from 'node:assert';
import { test } from 'node:test';
import { read, readFileSync } from "node:fs";

import * as hdf5 from "jsfive";

function loadFile(filename) {
    const ab = readFileSync(filename);
    return new hdf5.File(ab.buffer, filename);
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