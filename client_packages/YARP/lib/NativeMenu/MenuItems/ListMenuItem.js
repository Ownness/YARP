'use strict';
/**
 * Implements a list menu item.
 * @class ListMenuItem
 * @extends {NativeMenu.MenuItem}
 */
class ListMenuItem extends NativeMenu.MenuItem {
  /**
   *Creates an instance of ListMenuItem.
   * @param {String} displayText
   * @param {Array<MenuItem>} data
   * @param {Number} [defaultIndex=0]
   * @param {String} [caption='']
   * @param {Number} [badge=NaN]
   * @param {NativeMenu.Color} [textColor=new NativeMenu.Color(255, 255, 255, 240)]
   * @param {NativeMenu.Color} [backgroundColor=new NativeMenu.Color(0, 0, 0, 120)]
   * @param {NativeMenu.Color} [hoverTextColor=new NativeMenu.Color(0, 0, 0, 240)]
   * @param {NativeMenu.Color} [hoverBackgroundColor=new NativeMenu.Color(255, 255, 255, 170)]
   * @memberof ListMenuItem
   */
  constructor(displayText, data, defaultIndex = 0, caption, badge, textColor, backgroundColor, hoverTextColor, hoverBackgroundColor) {
    super(displayText, data, caption, badge, textColor, backgroundColor, hoverTextColor, hoverBackgroundColor);
    this.onChangeEvents = [];
    this.firstRender = true;
    this.defaultIndex = defaultIndex;
  }

  /**
   * Add on change event to item.
   * @param {Function} onChangeEvent
   * @memberof ListMenuItem
   */
  addOnChangeEvent(onChangeEvent) {
    this.onChangeEvents.push(onChangeEvent);
  }

  /**
   * Render the item.
   * @param {Number} x Offset from left 0 to 1.
   * @param {Number} y Offset from top 0 to 1.
   * @param {Number} yCaption
   * @memberof ListMenuItem
   */
  render(x, y, yCaption) {
    if (this.data.length > 0) {
      if (this.firstRender) {
        this.setToItem(this.defaultIndex, false);
        this.firstRender = false;
      }
      if (this._isSelect && Date.now() - NativeMenu.MainMenu.CONTROL_TICK_TIME_MS > NativeMenu.MainMenu.LAST_TICK_TIME) {
        if (mp.game.controls.isControlPressed(0, NativeMenu.Control.INPUT_CELLPHONE_RIGHT)) {
          this.setToItem(this.dataCurrentIndex + 1);
        } else {
          if (mp.game.controls.isControlPressed(0, NativeMenu.Control.INPUT_CELLPHONE_LEFT)) {
            this.setToItem(this.dataCurrentIndex - 1);
          }
        }
      }
    }
    super.render(x, y, yCaption);
  }

  /**
   * Draws the item.
   * @param {Number} x Offset from left 0 to 1.
   * @param {Number} y Offset from top 0 to 1.
   * @param {Number} yCaption
   * @memberof ListMenuItem
   */
  draw(x, y, yCaption) {
    super.draw(x, y, yCaption);
    if (this.data.length > 0) {
      if (!isNaN(this.dataCurrentIndex) && this.data[this.dataCurrentIndex].displayText != null) {
        let xRightArrowPosition = x + NativeMenu.MainMenu.MENU_DRAW_OFFSET_X - (0.015 * NativeMenu.MainMenu.SCREEN_RATIO_WIDTH);
        let xLeftArrowPosition = xRightArrowPosition - yarp.utils.client.getTextWidth(this.data[this.dataCurrentIndex].displayText) - (0.015 * NativeMenu.MainMenu.SCREEN_RATIO_WIDTH);
        NativeMenu.CommonMenuTexture.draw('arrowleft', xLeftArrowPosition, y + NativeMenu.MainMenu.MENU_DRAW_OFFSET_Y, (0.025 * NativeMenu.MainMenu.SCREEN_RATIO_WIDTH), (0.035 * NativeMenu.MainMenu.SCREEN_RATIO_HEIGHT), this.textColor, 0);
        NativeMenu.CommonMenuTexture.draw('arrowright', xRightArrowPosition, y + NativeMenu.MainMenu.MENU_DRAW_OFFSET_Y, (0.025 * NativeMenu.MainMenu.SCREEN_RATIO_WIDTH), (0.035 * NativeMenu.MainMenu.SCREEN_RATIO_HEIGHT), this.textColor, 0);
        yarp.utils.client.drawText(this.data[this.dataCurrentIndex].displayText, [(xLeftArrowPosition + xRightArrowPosition) / 2, y + (0.005 * NativeMenu.MainMenu.SCREEN_RATIO_HEIGHT)], this.textColor, (0.025 * NativeMenu.MainMenu.SCREEN_RATIO_WIDTH), [0.35, 0.35], true);
      }
    }
  }

  /**
   * Sets list item by index.
   * @param {Number} newIndex
   * @param {Boolean} [withSound=true]
   * @memberof ListMenuItem
   */
  setToItem(newIndex, withSound = true) {
    if (newIndex < 0) {
      this.dataCurrentIndex = this.data.length - 1;
    } else {
      this.dataCurrentIndex = newIndex % this.data.length;
    }
    if (withSound) {
      NativeMenu.Sound.SOUND_NAV_LEFT_RIGHT.playSound();
    }
    NativeMenu.MainMenu.LAST_TICK_TIME = Date.now();
    this.onChangeEvents.forEach((value) => {
      value.trigger(this.data[this.dataCurrentIndex]);
    });
  }
}

exports = ListMenuItem;
