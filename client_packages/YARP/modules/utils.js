'use strict';
/**
 * Holds utility functions.
 * @module utils
 * @namespace yarp.utils
 */

let utils = {};

/**
 * Gets weapon type from weapon slot.
 * @function getWeaponTypeInSlot
 * @memberof yarp.utils
 * @param {number} weaponSlot - Weapon slot hash.
 * @returns {number} - Weapon type hash.
 */
utils.getWeaponTypeInSlot = (weaponSlot) => {
  return mp.game.invoke('0xBBDDEBFD9564D52C', mp.players.local.handle, weaponSlot);
}

/**
 * Gets weapon ammo.
 * @function getWeaponAmmo
 * @memberof yarp.utils
 * @param {number} weaponhash - Weapon hash.
 * @returns {number} - Weapon ammo.
 */
utils.getWeaponAmmo = (weaponhash) => {
  return mp.game.invoke('0x2406A9C8DA99D3F4', mp.players.local.handle, weaponhash);
}

/**
 * Removes a weapon.
 * @function removeWeapon
 * @memberof yarp.utils
 * @param {number} weaponhash - Weapon hash.
 */
utils.removeWeapon = (weaponhash) => {
  return mp.game.invoke('0xA48F593CC7A71FCC', mp.players.local.handle, weaponhash);
}

/**
 * Sets weapon ammo.
 * @function setWeaponAmmo
 * @memberof yarp.utils
 * @param {number} weaponSlot - Weapon hash.
 * @param {number} ammo - Ammo amount.
 */
utils.setWeaponAmmo = (weaponhash, ammo) => {
  return mp.game.invoke('0xC8207C41C6D1E3CF', mp.players.local.handle, weaponhash, ammo);
}

/**
 * Gets the current weapon.
 * @function getCurrentWeapon
 * @memberof yarp.utils
 * @returns {number} - Weapon hash.
 */
utils.getCurrentWeapon = () => {
  return mp.game.invoke('0x6678C142FAC881BA', mp.players.local.handle)
}

/**
 * Gives a certain weapon component.
 * @function giveWeaponComponent
 * @memberof yarp.utils
 * @param {number} weaponSlot - Weapon hash.
 * @param {number} component - Component hash.
 */
utils.giveWeaponComponent = (weaponhash, component) => {
  return mp.game.invoke('0xAD084726D7F23594', mp.players.local.handle, weaponhash, component);
}

/**
 * Gets the clip size for a specific weapon.
 * @function getWeaponClipSize
 * @memberof yarp.utils
 * @param {number} weaponhash - Weapon hash.
 * @returns {number} - The weapon clip size.
 */
utils.getWeaponClipSize = (weaponhash) => {
  return mp.game.invoke('0xADBCA3534D2F6BEB', weaponhash);
}

/**
 * Verifies if the characer has a weapon.
 * @function gotWeapon
 * @memberof yarp.utils
 * @param {number} weaponhash - Weapon hash.
 * @returns {boolean} - True/false if has or not weapon.
 */
utils.gotWeapon = (weaponhash) => {
  return mp.game.invoke('0xBEF481E5CF03DC93', mp.players.local.handle, weaponhash, false);
}

/**
 * Gets all character weapons and ammo.
 * @function getAllWeapons
 * @memberof yarp.utils
 * @returns {object} - Dictionary weapon > ammo.
 */
utils.getAllWeapons = () => {
  const weapons = {};
  this.weaponSlots.forEach(weaponSlot => {
    const weapon = this.getWeaponTypeInSlot(mp.players.local.handle, weaponSlot);
    if (weapon !== 0 && weapon !== -1569615261) {
        weapons[weapon] = this.getAmmoWeapon(mp.players.local.handle, weapon);
    }
  });
  return weapons;
}

/**
 * Format numbers to contain commas.
 * @function numberWithCommas
 * @memberof yarp.utils
 * @param {number} x - Number to be formatted.
 * @returns {string} - Formatted number.
 */
utils.numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Gets character camera direction.
 * @function getCameraDirection
 * @memberof yarp.utils
 * @returns {Vector3} - The position the camera is poiting.
 */
utils.getCameraDirection = () => {
  // Credits to https://github.com/ImagicTheCat/vRP/blob/vrpex/vrp/client/base.lua#L46 - Thank you for teaching me so much.
  const heading = mp.game.cam.getGameplayCamRelativeHeading()+mp.players.local.getHeading();
  const pitch = mp.game.cam.getGameplayCamRot(0).x;
  var x = -Math.sin(heading*Math.PI/180.0);
  var y = Math.cos(heading*Math.PI/180.0);
  var z = Math.sin(pitch*Math.PI/180.0);
  var len = Math.sqrt(x*x+y*y+z*z);
  if (len != 0) {
    x = x/len;
    y = y/len;
    z = z/len;
  }
  return new mp.Vector3(x,y,z);
}

/**
 * Gets a set containing all weapon slots.
 * @function getWeaponTypeInSlot
 * @memberof yarp.utils
 * @returns {Set} - All weapon slots.
 */
utils.getWeaponSlots = () => {
  return new Set([
    1993361168,1277010230,932043479,690654591,1459198205,195782970,-438797331,896793492,
    495159329,-1155528315,-515636489,-871913299,-1352759032,-542958961,1682645887,-859470162,
    -2125426402,2067210266,-538172856,1783244476,439844898,-24829327,1949306232,-1941230881,
    -1033554448,320513715,-695165975,-281028447,-686713772,347509793,1769089473,189935548,
    248801358,386596758,-157212362,436985596,-47957369, 575938238
  ]);
}

/**
 * Gets a set containing all door types.
 * @function getDoorTypes
 * @memberof yarp.utils
 * @returns {Set} - All door types.
 */
utils.getDoorTypes = () => {
  return new Set([0x6b918ea1,0x53a940ab,0x86ef4558,1796834809,96153298,-281080954,183249434,
    758345384,-1069262641,1968521986,-2143706301,-1403421822,-1950137670,1226259807,1090833557,
    897332612,1095946640,801975945,-167996547,-1935818563,1891185217,1236591681,1980808685,
    1352749757,-566554453,1284749450,261851994,217646625,1801139578,-2123275866,1312689981,
    -595055661,-265260897,-1284867488,302307081,-681886015,-2086556500,-1496386696,-2097039789,
    -2127416656,-1986583853,776026812,698422331,535076355,474675599,-1978427516,-1700375831,
    613961892,-272570634,-1040675994,1201219326,1736361794,1113956670,-1361617046,-1871080926,
    1168079979,1206354175,-1038180727,1200466273,1391004277,-459199009,-252283844,-826072862,
    763780711,-874851305,-1480820165,949391213,212192855,-126474752,1765671336,792295685,563273144,
    -726993043,178228075,1852297978,-565026078,1646172266,204467342,2047070410,1417775309,-106474626,
    1840510598,1382825971,232536303,1267246609,-1900237971,2077901353,-2102079126,-1905793212,
    -1797032505,-62235167,-1727188163,-562748873,1976429759,1341041543,-1631467220,-1788473129,
    -1831288286,963876966,1773088812,-1332101528,-1811763714,1608500665,-1456048340,943854909,
    -89065356,-925491840,1999872275,1999872275,1538555582,-961994186,-1772472848,-46374650,-358302761,
    -1237936041,1487374207,-199126299,-897071863,-864465775,-208439480,-1001088805,756894459,476981677,
    2081647379,2081647379,169965357,311232516,-1563127729,759145763,-84399179,-461898059,1259065971,
    -884051216,243782214,714115627,1668106976,1382347031,-966790948,-2068750132,-1716533184,2146505927,
    1874948872,-1965020851,1951546856,-431382051,-293975210,-785215289,-366143778,440819155,-588495243,
    1815504139,1344911780,-320891223,1511747875,-1517722103,-1093199712,1902048492,-444768985,404057594,
    -1417472813,-1376084479,457472151,1071759151,-2119023917,-1488490473,-511187813,-248569395,989443413,
    2022251829,649820567,537455378,1121431731,-1437380438,-946336965,1893144650,435841678,948508314,
    -1796714665,-1155247245,782482084,-1194470801,-2129698061,1071759151,-2119023917,1487704245,1529812051,
    904342475,-795418380,-1502457334,-1994188940,-621770121,1018580481,421926217,-1331552374,-293141277,
    506750037,1496005418,-1863079210,-2018911784,-93934272,667682830,1876735830,-2112857171,2046930518,
    1208502884,1986432421,-722798986,204301578,-320140460,65222916,-920027322,-2007378629,418772613,
    1679064921,412198396,-1053755588,-53446139,1333960556,-41786493,1750120734,1661506222,-2116116146,
    -74083138,-1670085357
  ]);
}

/**
 * Gets weapon type from weapon slot.
 * @function getVirtualKeys
 * @memberof yarp.utils
 * @returns {object} - Dictionary of virtual keys
 */
utils.getVirtualKeys = () => {
  return {
    ABNT_C1: 0xC1,ABNT_C2: 0xC2,ADD: 0x6B,ATTN: 0xF6,BACK: 0x08,CANCEL: 0x03,CLEAR: 0x0C,
    CRSEL: 0xF7,DECIMAL: 0x6E,DIVIDE: 0x6F,EREOF: 0xF9,ESCAPE: 0x1B,EXECUTE: 0x2B,EXSEL: 0xF8,
    ICO_CLEAR: 0xE6,ICO_HELP: 0xE3,KEY_0: 0x30,KEY_1: 0x31,KEY_2: 0x32,KEY_3: 0x33,KEY_4: 0x34,
    KEY_5: 0x35,KEY_6: 0x36,KEY_7: 0x37,KEY_8: 0x38,KEY_9: 0x39,KEY_A: 0x41,KEY_B: 0x42,KEY_C: 0x43,
    KEY_D: 0x44,KEY_E: 0x45,KEY_F: 0x46,KEY_G: 0x47,KEY_H: 0x48,KEY_I: 0x49,KEY_J: 0x4A,KEY_K: 0x4B,
    KEY_L: 0x4C,KEY_M: 0x4D,KEY_N: 0x4E,KEY_O: 0x4F,KEY_P: 0x50,KEY_Q: 0x51,KEY_R: 0x52,KEY_S: 0x53,
    KEY_T: 0x54,KEY_U: 0x55,KEY_V: 0x56,KEY_W: 0x57,KEY_X: 0x58,KEY_Y: 0x59,KEY_Z: 0x5A,MULTIPLY: 0x6A,
    NONAME: 0xFC,NUMPAD0: 0x60,NUMPAD1: 0x61,NUMPAD2: 0x62,NUMPAD3: 0x63,NUMPAD4: 0x64,NUMPAD5: 0x65,
    NUMPAD6: 0x66,NUMPAD7: 0x67,NUMPAD8: 0x68,NUMPAD9: 0x69,OEM_1: 0xBA,OEM_102: 0xE2,OEM_2: 0xBF,
    OEM_3: 0xC0,OEM_4: 0xDB,OEM_5: 0xDC,OEM_6:0xDD,OEM_7: 0xDE,OEM_8: 0xDF,OEM_ATTN: 0xF0,OEM_AUTO: 0xF3,
    OEM_AX: 0xE1,OEM_BACKTAB: 0xF5,OEM_CLEAR: 0xFE,OEM_COMMA: 0xBC,OEM_COPY: 0xF2,OEM_CUSEL: 0xEF,OEM_ENLW: 0xF4,
    OEM_FINISH: 0xF1,OEM_FJ_LOYA: 0x95,OEM_FJ_MASSHOU: 0x92,OEM_FJ_ROYA: 0x96,OEM_FJ_TOUROKU: 0x94,OEM_JUMP: 0xEA,
    OEM_MINUS: 0xBD,OEM_PA1: 0xEB,OEM_PA2: 0xEC,OEM_PA3: 0xED,OEM_PERIOD: 0xBE,OEM_PLUS: 0xBB,OEM_RESET: 0xE9,
    OEM_WSCTRL: 0xEE,PA1: 0xFD,PACKET: 0xE7,PLAY: 0xFA,PROCESSKEY: 0xE5,RETURN: 0x0D,SELECT: 0x29,
    SEPARATOR: 0x6C,SPACE: 0x20,SUBTRACT: 0x6D,TAB:0x09,ZOOM: 0xFB,NONE: 0xFF,ACCEPT: 0x1E,APPS: 0x5D,
    BROWSER_BACK: 0xA6,BROWSER_FAVORITES: 0xAB,BROWSER_FORWARD: 0xA7,BROWSER_HOME: 0xAC,BROWSER_REFRESH: 0xA8,
    BROWSER_SEARCH: 0xAA,BROWSER_STOP: 0xA9,CAPITAL: 0x14,CONVERT: 0x1C,DELETE: 0x2E,DOWN: 0x28,END: 0x23,
    F1: 0x70,F10: 0x79,F11: 0x7A,F12: 0x7B,F13: 0x7C,F14: 0x7D,F15: 0x7E,F16: 0x7F,F17: 0x80,F18:0x81,
    F19: 0x82,F2: 0x71,F20: 0x83,F21: 0x84,F22: 0x85,F23: 0x86,F24: 0x87,F3: 0x72,F4: 0x73,F5: 0x74,
    F6: 0x75,F7: 0x76,F8: 0x77,F9: 0x78,FINAL: 0x18,HELP: 0x2F,HOME: 0x24,ICO_00: 0xE4,INSERT: 0x2D,
    JUNJA: 0x17,KANA: 0x15,KANJI: 0x19,LAUNCH_APP1: 0xB6,LAUNCH_APP2: 0xB7,LAUNCH_MAIL: 0xB4,LAUNCH_MEDIA_SELECT: 0xB5,
    LBUTTON: 0x01,LCONTROL: 0xA2,LEFT: 0x25,LMENU: 0xA4,LSHIFT: 0xA0,LWIN: 0x5B,MBUTTON: 0x04,MEDIA_NEXT_TRACK: 0xB0,
    MEDIA_PLAY_PAUSE: 0xB3,MEDIA_PREV_TRACK: 0xB1,MEDIA_STOP: 0xB2,MODECHANGE: 0x1F,NEXT: 0x22,NONCONVERT: 0x1D,NUMLOCK: 0x90,
    OEM_FJ_JISHO: 0x92,PAUSE: 0x13,PRINT: 0x2A,PRIOR: 0x21,RBUTTON: 0x02,RCONTROL: 0xA3,RIGHT: 0x27,RMENU: 0xA5,RSHIFT: 0xA1,
    RWIN: 0x5C,SCROLL: 0x91,SLEEP: 0x5F,SNAPSHOT: 0x2C,UP: 0x26,VOLUME_DOWN: 0xAE,VOLUME_MUTE: 0xAD,VOLUME_UP: 0xAF,XBUTTON1: 0x05,XBUTTON2: 0x06
  }
}

/**
 * Returns the time in a set timezone.
 * @function getTimezoneDate
 * @memberof yarp.utils
 * @param {number} timezone - The timezone difference to GMT.
 * @returns {Date} - Timezone date.
 */
utils.getTimezone = (timezone) => {
  let date = new Date();
  let h = date.getUTCHours() + timezone;
  let m = date.getUTCMinutes();
  let s = date.getUTCSeconds();
  let dd = date.getUTCDate();
  let mm = date.getUTCMonth()+1; // January is 0
  let yy = date.getUTCFullYear();
  if (timezone < 0) {
    if (h < 0) {
      h = 24 + h;
      dd--;
    }
    if (dd == 0) {
      mm--;
      if (mm == 0) {
        mm = 12;
        yy--;
      }
      if (mm == 2) {
        if (yy % 100 != 0 && yy % 4 == 0 || yy % 400 == 0) {
          dd = 29;
        } else {
          dd = 28;
        }
      } else if (mm % 2 == 0) {
        dd = 30;
      } else {
        dd = 31;
      }
    }
  } else if (timezone > 0) {
    if (h > 23) {
      h = h - 24;
      dd++;
    }
    if (mm == 2) {
      if (yy % 100 != 0 && yy % 4 == 0 || yy % 400 == 0) {
        if (dd > 29) {
          dd = 1;
          mm++;
        }
      } else {
        if (dd > 28) {
          dd = 1;
          mm++;
        }
      }
    } else if (mm % 2 == 0) {
      if (dd > 30) {
        dd = 1;
        mm++; // ^
      }
    } else {
      if (dd > 31) {
        dd = 1;
        mm++;
      }
    }
    if (mm > 12) {
      mm = 1;
      yy++
    }
  }
  return {h:h,m:m,s:s,dd:dd,mm:mm,yy:yy};
}

exports = utils;
