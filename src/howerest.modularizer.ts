/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

    Implements basic functionality to declare js modules for the
    most popular module systems.

 --------------------------------------------------------------------------- */

declare var angular:any;
declare var window:Window;
declare var process : () => void;
declare var global : () => void;
declare var define : {};

export class Modularizer {
  public static defineModule(moduleName:string, fromModule:any) {

    if (typeof angular !== 'undefined' && typeof angular.module !== 'undefined')
      angular.module(moduleName, []).factory([function () {
        return fromModule;
      }]);
    else {
        const isBrowser = typeof window !== 'undefined';
        const isNode = (typeof(process) !== 'undefined' && typeof(process['env']) !== 'undefined' && typeof(global) !== 'undefined') ? true : false;

        if (isBrowser) {
          // RequireJS loaded?
          if (typeof(define) === 'function' && define['amd']) {
            // TODO: Implement
          } else if (typeof(window) !== 'undefined') {
            window[moduleName] = fromModule;
          }
        } else if (isNode) {
            global[moduleName] = fromModule;
        }
    }
  }
}
