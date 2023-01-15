const isNode =
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;


const crossFetch = isNode ? require("node-fetch") : fetch;

export default crossFetch;
