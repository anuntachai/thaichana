// Shop data
const moment = require("moment");

class Shop {
  constructor(shopId, appId) {
    // thaichana's shop id
    this.id = shopId;

    // thaichana's appId
    this.appId = appId;

    // shop infomation
    // example data:
    //   {
    //      "shopId": "S0000074037",
    //      "appId": "0001",
    //      "shopName": "องค์การบริหารส่วนจังหวัดลำปาง",
    //      "subcategory": "08_ECONOMICS_G5_04",
    //      "businessType": "หน่วยงานและสถานที่ราชการ",
    //      "status": "VALIDATED",
    //      "canCheckin": true
    //   }
    this.info = null;

    // lastest check-in time
    this.checkInTime = null;

    // lastest check-out time
    this.checkOutTime = null;

    // check-in / check-out history
    // Array of { checkInTime: [Check-In Date], checkOutTime: [Check-out Date] }
    this.history = [];
  }

  toString() {
    return "Shop: " + this.shopId;
  }

  copy(data) {
    this.id = data.id || this.id;
    this.appId = data.appId || this.appId;
    this.info = data.info || this.info;
    if (data.checkInTime) {
      this.checkInTime = new Date(data.checkInTime);
    }
    if (data.checkOutTime) {
      this.checkOutTime = new Date(data.checkOutTime);
    }
    if (data.history) {
      this.history = [];
      data.history.forEach(event => {
        this.history.push({
          checkInTime: new Date(event.checkInTime),
          checkOutTime: event.checkOutTime ? new Date(event.checkOutTime) : null
        });
      });
    }

    // for (let prop in this) {
    //   this[prop] = data[prop] || this[prop];
    // }
  }

  // clear timeline (history) for check-in/check-out data that longer than dayAfter
  clearHistory(dayAfter) {
    let newHistory = [];

    let filterTime = moment();
    filterTime.subtract(dayAfter, "days");

    this.history.forEach(event => {
      // if ( now - event's check-in time ) < dayAfter, then keep this event
      if (filterTime.isBefore(event.checkInTime)) {
        newHistory.push(event);
      }
    });

    this.history = newHistory;
  }

  compare(shop) {
    if (this.isStay && !shop.isStay) {
      return -1;
    } else if (!this.isStay && shop.isStay) {
      return 1;
    } else {
      return shop.checkInTime - this.checkInTime;
    }
  }

  isShop(shop) {
    if (this.id === shop) {
      return true;
    } else if (this.id === shop.id) {
      return true;
    } else {
      return false;
    }
  }

  checkIn() {
    this.checkInTime = new Date();
    this.checkOutTime = null;

    // add current check-in to history (check-out = null)
    this.history.push({
      checkInTime: this.checkInTime,
      checkOutTime: this.checkOutTime
    });
  }

  checkOut() {
    this.checkOutTime = new Date();
    // update check-out time to the lastest event in history
    this.history[this.history.length - 1].checkOutTime = this.checkOutTime;
  }

  // Check user is stay in this shop or not
  // Return:
  //  - boolean:
  //     = true: user is staying in this shop
  //     = false: user is not in this shop
  get isStay() {
    return this.checkInTime && !this.checkOutTime;
  }

  // How many time to stay in this shop
  // Return:
  //  - int: time in milliseconds
  get stayTime() {
    let checkedInTime = this.checkInTime || new Date();
    let lastestTime = this.checkOutTime || new Date();
    return lastestTime - checkedInTime;
  }
}

export default Shop;
