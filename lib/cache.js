'use strict';


var Cache = module.exports = function Cache() {
    this._cache = {};
}


Cache.prototype.put = function Cache_put(key, value) {
    this._cache[key] = value;
};


Cache.prototype.get = function Cache_get(key) {
    return this._cache[key];
};
