'use strict';
/**
 * Creates a Door.
 * @namespace yarp.Door
 * @class
 * @extends yarp.GMObject
 * @param {string} id - Door id.
 * @param {string} model - Door model.
 * @param {Vector3} position - Door position.
 * @param {number} [range=0] - Door range.
 * @param {function} [enter=() => {}] - Door enter function.
 * @param {function} [leave=() => {}] - Door leave function.
 * @param {Array<string>} [permissions=[]] - Door permissions.
 * @param {Array<string>} [items=[]] - Door items.
 */

class Door extends yarp.GMObject{
  constructor(
    id,
    model,
    position,
    range = 3,
    enter = () => {},
    leave = () => {},
    permissions = [],
    items = {}
  ){
    super();
    if ((id && model && position) != null){
      this._id = id;
      this._model = model;
      this._position = position;
      this._range = range;
      this._permissions = permissions;
      this._items = items;
      this._enter = enter.toString();
      this._leave = leave.toString();
      this.state = false;
      this.players = [];
      yarp.mng.register(this);
      this.makeGetterSetter();
    }
  }

  /**
   * Broadcast open door event.
   * @instance
   * @function open
   * @memberof yarp.Door
   */
  open(){
    this.state = true;
    mp.players.call('playerOpenDoor',[JSON.stringify(this)]);
  }

  /**
   * Broadcast close door event.
   * @instance
   * @function close
   * @memberof yarp.Door
   */
  close(){
    this.state = false;
    mp.players.call('playerCloseDoor',[JSON.stringify(this)]);
  }

  /**
   * Load from object.
   * @static
   * @function load
   * @memberof yarp.Door
   * @param {object} object - Class object.
   */
  static load(obj){
    return new Door(obj._id,obj._model,obj._position,obj._range,obj._enter,obj._leave,obj._permissions,obj._items);
  }

  /**
   * Load from config.
   * @static
   * @function config
   * @memberof yarp.Door
   * @param {string} file - Config file path.
   */
  static config(file){
    let doors = require(file);
    for (let id in doors){
      let door = doors[id];
      for (let i=0; i < door.positions.length; i++){
        let nid = id + ' ' + (i + 1);
        if (!yarp.doors[nid]) {
          new Door(nid,door.model,door.positions[i],door.range,door.enter,door.leave,door.permissions,door.items);
        }
      }
    }
  }
}

module.exports = Door;
