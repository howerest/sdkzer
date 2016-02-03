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
                if (typeof (define) === 'function' && define.amd) {
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
})();
