/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

    Implements basic functionality to declare js modules for the
    most popular module systems.

 --------------------------------------------------------------------------- */
"use strict";
var Modularizer = (function () {
    function Modularizer() {
    }
    Modularizer.defineModule = function (moduleName, fromModule) {
        if (typeof angular !== 'undefined' && typeof angular.module !== 'undefined')
            angular.module(moduleName, []).factory([function () {
                    return fromModule;
                }]);
        else {
            var isBrowser = typeof window !== 'undefined';
            var isNode = (typeof (process) !== 'undefined' && typeof (process['env']) !== 'undefined' && typeof (global) !== 'undefined') ? true : false;
            if (isBrowser) {
                // RequireJS loaded?
                if (typeof (define) === 'function' && define['amd']) {
                }
                else if (typeof (window) !== 'undefined') {
                    window[moduleName] = fromModule;
                }
            }
            else if (isNode) {
                global[moduleName] = fromModule;
            }
        }
    };
    return Modularizer;
}());
exports.Modularizer = Modularizer;
