module Util {
  /*
   * Implements environment detection
   */
  export class EnvChecker {
    static isBrowser() {
      return (typeof window !== 'undefined');
    }

    static isNode() {
      return (typeof(process) !== 'undefined' && typeof(process['env']) !== 'undefined' && typeof(global) !== 'undefined') ? true : false;
    }

    static nodeVersion() {

    }
  }

  /*
   * Implements basic functionality to clone objects
   */
  export class Cloner {
    /*
     *  Clones an object
     *  @param {Object} The source object to clone
     */
    public static obj(srcObject: any) {
      return ((srcObject: any) => {
        if (srcObject === null || typeof srcObject !== 'object') {
          return ((srcObject: any) => { return srcObject })(srcObject);
        }

        var newObject = srcObject.constructor();
        for (var key in srcObject) {
           if (srcObject.hasOwnProperty(key)){
             if (srcObject[key] instanceof Object){
               newObject[key] = this.obj(srcObject[key]);
             } else {
               newObject[key] = srcObject[key];
             }
           }
        }
        return newObject;
      })(srcObject);
    }
  }


  /*
   *  Deals with underscore <-> camelCase strings
   */
  export class Camel {

    public static camelize(obj:Object) {
      return this.walk(obj)
    }

    public static walk(obj:any) {
      var _this = this;
      return this.reduce(Object.keys(obj), function (acc, key) {
        var camel = _this.camelCase(key)
        acc[camel] = _this.walk(obj[key])
        return acc;
      }, {})
    }

    public static camelCase(str:string) {
      return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase()
      })
    }

    public static reduce(xs, f, acc) {
      if (xs.reduce) return xs.reduce(f, acc);
      for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i)
      }
      return acc
    }

    public static map(xs:any, f:any) {
      if (xs.map) return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
      }
      return res;
    }
  }
}
