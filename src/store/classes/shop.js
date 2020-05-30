// Shop data

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
    // for (let prop in this) {
    //   this[prop] = data[prop] || this[prop];
    // }
  }

  compare(shop) {
    if (this.isStay && !shop.isStay) {
      return -1;
    } else if (!this.isStay && shop.isStay) {
      return 1;
    } else {
      return this.checkInTime - shop.checkInTime;
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
  }

  checkOut() {
    this.checkOutTime = new Date();
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
