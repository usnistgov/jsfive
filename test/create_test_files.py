import h5py
import numpy as np

with h5py.File('test.h5', 'w') as f:
    # create datasets with different dtypes: f2, f4, f8, i1, i2, i4
    data = [3.0, 4.0, 5.0]
    dtypes = ['f2', 'f4', 'f8', 'i1', 'i2', 'i4']
    for dtype in dtypes:
        f.create_dataset(dtype, data=data, dtype=dtype)

    # create a dataset with a string dtype
    f.create_dataset('string', data='hello', dtype='S5')

    # create a dataset with a vlen string dtype
    f.create_dataset('vlen_string', data='hello')

