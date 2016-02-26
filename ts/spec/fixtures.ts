/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | Apache 2.0 Licensed
    www.howerest.com

    This sdk entity is being used for unit testing to test communication
    between local entity data and origin data-source

 --------------------------------------------------------------------------- */

var buildSdkzerModelEntity = () => {
  class Item extends Sdkzer {
    public resourceEndpoint() {
      return 'http://api.mydomain.com/v1/items';
    }

    public defaults() {
      return {
        name: "A good choice",
        items: [1, 100, 1, 60]
      };
    }

    public parseOne(data) {
      // Parse record
      var json = {
        id: data.id,
        name: data.name,
        items: data.items
      };

      return json;
    }

    public parse(data) {
      var parsed = [];

      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          parsed.push(this.parseOne(data[i]));
        }
      } else {
        parsed.push(this.parseOne(data.folder));
      }

      return parsed;
    }
  }

  return Item;
}
