var Util;
(function (Util) {
    var EnvChecker = (function () {
        function EnvChecker() {
        }
        EnvChecker.isBrowser = function () {
            return (typeof window !== 'undefined');
        };
        EnvChecker.isNode = function () {
            return (typeof (process) !== 'undefined' && typeof (process['env']) !== 'undefined' && typeof (global) !== 'undefined') ? true : false;
        };
        EnvChecker.nodeVersion = function () {
        };
        return EnvChecker;
    })();
    Util.EnvChecker = EnvChecker;
    var Cloner = (function () {
        function Cloner() {
        }
        Cloner.obj = function (srcObject) {
            var _this = this;
            return (function (srcObject) {
                if (srcObject === null || typeof srcObject !== 'object') {
                    return (function (srcObject) { return srcObject; })(srcObject);
                }
                var newObject = srcObject.constructor();
                for (var key in srcObject) {
                    if (srcObject.hasOwnProperty(key)) {
                        if (srcObject[key] instanceof Object) {
                            newObject[key] = _this.obj(srcObject[key]);
                        }
                        else {
                            newObject[key] = srcObject[key];
                        }
                    }
                }
                return newObject;
            })(srcObject);
        };
        return Cloner;
    })();
    Util.Cloner = Cloner;
    var Camel = (function () {
        function Camel() {
        }
        Camel.camelize = function (obj) {
            return this.walk(obj);
        };
        Camel.walk = function (obj) {
            var _this = this;
            return this.reduce(Object.keys(obj), function (acc, key) {
                var camel = _this.camelCase(key);
                acc[camel] = _this.walk(obj[key]);
                return acc;
            }, {});
        };
        Camel.camelCase = function (str) {
            return str.replace(/[_.-](\w|$)/g, function (_, x) {
                return x.toUpperCase();
            });
        };
        Camel.reduce = function (xs, f, acc) {
            if (xs.reduce)
                return xs.reduce(f, acc);
            for (var i = 0; i < xs.length; i++) {
                acc = f(acc, xs[i], i);
            }
            return acc;
        };
        Camel.map = function (xs, f) {
            if (xs.map)
                return xs.map(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
                res.push(f(xs[i], i));
            }
            return res;
        };
        return Camel;
    })();
    Util.Camel = Camel;
})(Util || (Util = {}));
