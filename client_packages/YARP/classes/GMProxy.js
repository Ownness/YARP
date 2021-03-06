'use strict';
/**
 * Implements a GMProxy.
 */
class GMProxy {
  /**
   * Creates an instance of GMProxy.
   * @param {String} id Tunnel id.
   * @memberof GMProxy
   */
  constructor(id) {
    if (id) {
      let self = this;
      self.id = id;
      self.local = {};
      self.tryJSON = {
        parse: (string) => {
          let result;
          if (string) {
            try {
              result = JSON.parse(string);
            } catch (err) {
              result = string;
            }
          }
          return result;
        },
        stringify: (obj) => {
          let result;
          if (obj) {
            try {
              result = JSON.stringify(obj);
            } catch (err) {
              result = obj;
            }
          }
          return result;
        },
      };
      self.client = new Proxy({}, {
        get: (proxy, name) => {
          return self.local[name];
        },
        set: (proxy, name, value) => {
          self.local[name] = value;
          mp.events.add(`${self.id}:${name}`, async (id, args) => {
            if (!args) args = [];
            let result = await value(...this.tryJSON.parse(args));
            if (result != null) {
              mp.events.callRemote(`${self.id}:${name}:${id}`, this.tryJSON.stringify(result));
            }
          });
          return value;
        },
      });
      self.server = new Proxy({}, {
        get: (proxy, name) => {
          return (...args) => {
            return new Promise((resolve, reject) => {
              try {
                let id = Math.round((new Date()).getTime());
                mp.events.callRemote(`${self.id}:${name}`, `${id}`, this.tryJSON.stringify([...args]));
                mp.events.add(`${self.id}:${name}:${id}`, (result) => {
                  mp.events.remove(`${self.id}:${name}:${id}`);
                  resolve(this.tryJSON.parse(result));
                });
              } catch (err) {
                console.log('[YARP] ' + 'ProxyError: ' + err.message + '\n' + err.stack);
              }
            });
          };
        },
        set: (proxy, name, value) => {
          console.log('[YARP] ' + 'ProxyError: You can\'t set server events on client-side.');
        },
      });
      self.add = new Proxy({}, {
        get: (proxy, name) => {
          if (name == 'add') return self.add;
          return self.local[name];
        },
        set: (proxy, name, value) => {
          if (name == 'add') return self.add;
          mp.events.add(`${self.id}:${name}`, async (id, args) => {
            if (!args) args = [];
            let result = await value(...this.tryJSON.parse(args));
            if (result != null) {
              mp.events.callRemote(`${self.id}:${name}:${id}`, this.tryJSON.stringify(result));
            }
          });
          return value;
        },
      });
    } else {
      throw new TypeError('GMProxy class requires id to be instantiated.');
    }
  }
}

exports = GMProxy;
