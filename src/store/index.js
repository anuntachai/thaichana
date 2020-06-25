import Vue from "vue";
import Vuex from "vuex";
const axios = require("axios");
const moment = require("moment");

import Shop from "./classes/shop.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {},
  //strict: process.env.NODE_ENV !== "production",
  state: {
    // user's telephone number
    mobileNumber: null,

    // authorization key
    authKey: null,
    authTime: null,
    expiredIn: null,

    // visited shops
    // Data type: Array of Shop
    shops: []
  },
  mutations: {
    checkIn(state, shop) {
      shop.checkIn();

      // sort
      state.shops.sort((a, b) => {
        return a.compare(b);
      });
    },
    checkOut(state, shop) {
      shop.checkOut();

      // sort
      state.shops.sort((a, b) => {
        return a.compare(b);
      });
    },
    // clear timeline (history) for check-in/check-out data that longer than dayAfter
    clearHistory(state, dayAfter) {
      state.shops.forEach(shop => {
        shop.clearHistory(dayAfter);
      });
    },
    setMobileNumber(state, mobileNumber) {
      state.mobileNumber = mobileNumber;
    },
    setAuthValue(state, { authKey, authTime, expiredIn }) {
      state.authKey = authKey;
      state.authTime = authTime;
      state.expiredIn = expiredIn;
    }
  },
  actions: {
    // restore state data from localStorage
    restoreState({ state, commit }) {
      console.log("Restoring state ...");
      state.mobileNumber = localStorage.mobileNumber || null;
      state.authKey = localStorage.authKey || null;
      state.authTime = new Date(localStorage.authTime) || null;
      state.expiredIn = localStorage.expiredIn || null;
      state.shops = [];

      if (localStorage.shops) {
        // parse shops
        let shopsJson = JSON.parse(localStorage.shops);

        for (let index in shopsJson) {
          let shopJson = shopsJson[index];
          let shop = new Shop(shopJson.id, shopJson.appId);
          shop.copy(shopJson);

          state.shops.push(shop);
        }
      }
      console.log("State restored!");
      console.log("Cleaning history longer than 28 days...");

      // clear some check-in history that longer than 28 days
      commit("clearHistory", 14);

      console.log("Cleaned!");
    },
    saveState({ state }) {
      console.log("Saving state ...");
      localStorage.mobileNumber = state.mobileNumber;
      localStorage.authKey = state.authKey;
      localStorage.authTime = state.authTime;
      localStorage.expiredIn = state.expiredIn;
      localStorage.shops = JSON.stringify(state.shops);
      console.log(localStorage.shops);
      console.log("State saved!");
    },
    async auth({ state, commit, dispatch }, mobileNumber) {
      console.log("Authenticating...");
      let authKey = null;
      let authTime = new Date();
      let expiredIn = null;

      try {
        // authenticate and get authKey
        let response = await axios({
          method: "post",
          url: "https://api-scanner.suk-sa-ard.com/register",
          data: {
            mobileNumber: mobileNumber
          }
        });

        // response from api
        console.log(response);

        // get authentication key (token from api)
        authKey = response.data.token;
        expiredIn = parseInt(response.data.expiredIn) * 1000;

        if (authKey) {
          // if mobile number is changed, then clear history of old mobile number
          if (state.mobileNumber !== mobileNumber) {
            commit("clearHistory", 0);
          }
          commit("setMobileNumber", mobileNumber);
          commit("setAuthValue", { authKey, authTime, expiredIn });
          dispatch("saveState");

          console.log("Authenticated!");
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    // if current authKey is valid, do nothing
    // if current authKey is not valid (created time is longer than validate duration), reauthenticate
    async updateAuthKey({ state, dispatch }) {
      console.log("check for update authKey...");

      let validTime = moment(state.authTime);
      validTime.add(state.expiredIn, "milliseconds");

      let now = moment();

      // authKey was expire, reauthenicate
      if (validTime.isBefore(now)) {
        await dispatch("auth", state.mobileNumber);
      } else {
        console.log("authKey is valid. do not update authKey.");
      }
    },
    // get shop from given url (from qr code) and set appId
    // Return:
    //  - Shop
    async extractShopUrl({ state, dispatch }, urlString) {
      // Example URL
      // urlString = "https://qr.thaichana.com/?appId=0001&shopId=S0000074037";
      let shopId = null;
      let appId = null;

      try {
        // extract url
        let url = new URL(urlString);
        let params = new URLSearchParams(url.search);
        appId = params.get("appId");
        shopId = params.get("shopId");
      } catch (error) {
        // cannot extract appId or/and shopId

        console.error("Cannot get shopId from url: " + urlString);
        return null;
      }

      // find this shop in state.shops
      let shop = state.shops.find(s => {
        return s.id === shopId && s.appId === appId;
      });

      // if shop is first time visiting (this shop is not in state.shops), create shop and get info
      if (!shop) {
        // create new Shop object for given shop
        shop = new Shop(shopId, appId);

        console.log("Get Info of shop: " + shopId);

        try {
          // get shop information
          let response = await axios({
            method: "get",
            url: `https://api-customer.thaichana.com/shop/${appId}/${shopId}/qr`
          });

          // response from api
          console.log(response);

          shop.info = response.data;
        } catch (error) {
          console.error(error);
        }

        // push new shop to shops
        state.shops.push(shop);
        dispatch("saveState");
      }

      return shop;
    },
    async checkIn({ state, commit, dispatch }, shop) {
      console.log("Checking-In Shop: " + shop.id);

      // check auth or reauth
      await dispatch("updateAuthKey");

      let currentTime = Date.now();

      try {
        let request = {
          method: "post",
          url: `https://api-customer.thaichana.com/checkin?t=${currentTime}`,
          headers: {
            authorization: state.authKey
          },
          data: {
            appId: shop.appId,
            shopId: shop.id
          }
        };

        // checkin api
        let response = await axios(request);

        // response from api
        console.log(response);

        let checkInStatusMessage = response.data.message;

        if (checkInStatusMessage === "ok") {
          commit("checkIn", shop);
          dispatch("saveState");

          let checkInTime = new Date(currentTime);
          console.log("Checked-in! " + checkInTime);
        } else {
          console.error("Cannot check-in!!!!");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async checkOut({ state, commit, dispatch }, shop) {
      console.log("Checking-Out Shop: " + shop.id);

      // check auth or reauth
      await dispatch("updateAuthKey");

      let currentTime = Date.now();

      try {
        let request = {
          method: "post",
          url: `https://api-customer.thaichana.com/checkout?t=${currentTime}`,
          headers: {
            authorization: state.authKey
          },
          data: {
            appId: shop.appId,
            shopId: shop.id
          }
        };

        // check out api
        let response = await axios(request);

        // response from api
        console.log(response);

        let checkOutStatusMessage = response.data.message;

        if (checkOutStatusMessage === "ok") {
          // if authKey was changed, usageTime will be null.
          // thaichana api use authKey as unique key for each user.
          // so, authenticate one time per mobile number only
          let usageTime = new Date(parseInt(response.data.usageTime));
          usageTime /= 1000;

          commit("checkOut", shop);
          dispatch("saveState");

          console.log("Checked-out! usage time: " + usageTime + " sec");
        } else {
          console.error("Cannot check-out!!!!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  getters: {
    isAuth: function(state) {
      return state.authKey != null;
    },
    authKey: function(state) {
      return state.authKey;
    },
    authTime: function(state) {
      return state.authTime;
    },
    // Get sorted shops list
    // Sort by:
    //  1. Shop that user is staying in first
    //  2. Lastest shop was checked-in first
    // Return:
    //  - array of Shop
    sortedShops: function(state) {
      return state.shops;
    },
    // how many shops that user is staying.
    activeCheckIn: function(state) {
      return state.shops.reduce((counter, shop) => {
        return counter + (shop.isStay ? 1 : 0);
      }, 0);
    },
    mobileNumber: function(state) {
      return state.mobileNumber;
    },
    timeline: function(state) {
      let timelineArray = [];

      // push all history event of all shop to array
      state.shops.forEach(shop => {
        shop.history.forEach(event => {
          timelineArray.push({
            shop: shop,
            checkInTime: event.checkInTime,
            checkOutTime: event.checkOutTime
          });
        });
      });

      // sort by check-in date
      timelineArray.sort((a, b) => {
        return b.checkInTime - a.checkInTime;
      });

      return timelineArray;
    }
  }
});

// early restore before router work because we need information that stored in localStorage to check auth in app
store.dispatch("restoreState");

export default store;
