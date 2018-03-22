'use strict';
/**
 * @file Item class
 */
module.exports = class Transaction{
  constructor(type,value,source,target,date){
    if ((typeof id) === 'object' || (type && value && source) != null) {
      this._id = id._id || id || yarp.transactions.length;
      this._type = id._type || type;
      this._value = id._value || value;
      this._source = id._source || source;
      this._target = id._target || target || source;
      this._date = id._date || date || yarp.utils.getTimestamp(date);
      yarp.dbm.register(this);
      this.makeGetterSetter();
    }
  }

  save(){
    yarp.dbm.save(this);
  }

  remove(){
    yarp.dbm.remove(this);
  }

  makeGetterSetter(){
    for (let key in this){
      if (key[0] == "_"){
        let gsp = key.slice(1, key.length)
        if (!(gsp in this)){
          Object.defineProperty(this, gsp, {
            get: function () {
              return this[key];
            },
            set: function (value) {
              this[key] = value;
            }
          });
        }
      }
    }
  }
}