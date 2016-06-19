function assert(v, msg) {
    if (!v)
        throw new Error(msg);
}

exports.assert = assert;
