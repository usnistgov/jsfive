# jsfive: A pure javascript HDF5 file reader

jsfive is a library for reading (not writing) HDF5 files using pure javascript, such as in the browser.  It is based on the [pyfive](https://github.com/jjhelmus/pyfive) pure-python implementation of an HDF5 reader.
Not all features of HDF5 are supported, but some key ones that are:

* data chunking
* data compression, if javascript zlib is provided (like pako)

It is only for reading HDF5 files as an ArrayBuffer representation of the file.

If you need to write HDF5 files in javascript consider using h5wasm ([github](https://github.com/usnistgov/h5wasm), [npm](https://www.npmjs.com/package/h5wasm)) instead (also provides efficient slicing of large datasets, and uses direct filesystem access in nodejs). 

## Dependencies
 * ES6 module support (current versions of Firefox and Chrome work)
 * zlib from https://github.com/nodeca/pako is included in the web_modules directory (via @pika/web)

## Limitations
* not all datatypes that are supported by pyfive (through numpy) are supported (yet), though dtypes like u8, f4, S12, i4 are supported.
* datafiles larger than javascript's Number.MAX_SAFE_INTEGER (in bytes) will result in corrupted reads, as the input ArrayBuffer can't be indexed above that (I'm pretty sure ArrayBuffers larger than that are allowed to exist in Javascript) since no 64-bit integers exist in javascript.  
    * currently this gives an upper limit of 9007199254740991 bytes, which is a lot. (~10<sup>7</sup> GB)
* currently the getitem syntax is not supported, but it will likely be soon, for browsers that support object Proxy (not IE), so you have to do say f.get('entry/dataset') instead of f['entry/dataset']

## Installation/use
### Browser:
Clone this repo to somewhere accessible to your webpage, then in your main module (entrypoint) for your app import it as e.g. 

    import * as hdf5 from './jsfive/index.js';

If you want to use it as an old-style ES5 script, you can use the pre-built library in /dist/hdf5.js e.g.

    <script src="https://cdn.jsdelivr.net/gh/usnistgov/jsfive@master/dist/hdf5.js"></script>
    
Then you can start using it with data from a URL, e.g. 

    fetch(file_url)
      .then(function(response) { 
        return response.arrayBuffer() 
      })
      .then(function(buffer) {
        var f = new hdf5.File(buffer, filename);
        // do something with f;
        // let g = f.get('group');
        // let d = f.get('group/dataset');
        // let v = d.value;
        // let a = d.attrs;
      });

Or if you want to upload a file to work with, into the browser:

    function loadData() {
      var file_input = document.getElementById('datafile');
      var file = file_input.files[0]; // only one file allowed
      let datafilename = file.name;
      let reader = new FileReader();
      reader.onloadend = function(evt) { 
        let barr = evt.target.result;
        var f = new hdf5.File(barr, datafilename);
        // do something with f...
      }
      reader.readAsArrayBuffer(file);
      file_input.value = "";
    }

### nodejs

    npm install git+https://github.com/usnistgov/jsfive.git

Then e.g. in node REPL:
```
$ node
Welcome to Node.js v14.17.4.
Type ".help" for more information.
> const hdf5 = require("jsfive")
undefined
> var fs = require("fs");
undefined
> var ab = fs.readFileSync("/home/brian/Downloads/sans4490.nxs.ngv");
undefined
> var f = new hdf5.File(ab.buffer);
undefined
> f.keys
[ 'entry' ]
> f.get("entry").attrs
{ NX_class: 'NXentry' }
> 
```

### create-react-app
in App.js, import as:
```js
import * as hdf5 from 'jsfive/dist';
```
 (if you don't explicitly import dist or dist/index.js it will get the browser library or the ES6 library, neither of which will work as expected)
