<template>
  <div class="test">
    <h1>Testing tools for Developer</h1>
    <div>
      <label for="phoneNumberTxt">Phone Number: </label>
      <input type="text" id="phoneNumberTxt" v-model="phoneNumber" />
      <button @click="auth">auth</button>
      <div>{{ authKey }}</div>
    </div>
    <hr />
    <div>
      <label for="shopIdTxt">shopId: </label>
      <input type="text" id="shopIdTxt" v-model="shopId" />
      <button @click="getShopInfo">Get Info</button>
      <button @click="checkIn" v-if="!isStay">Check-In</button>
      <button @click="checkOut" v-else>Check-out</button>
      <div>{{ shopInfo }}</div>
      <div>{{ status }}</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const axios = require("axios");

export default {
  name: "Test",
  components: {},
  data: function() {
    return {
      phoneNumber: "0888888888",
      authKey: "",
      appId: "0001",
      shopId: "S0000074037",
      shopInfo: "",
      isStay: false,
      status: ""
    };
  },
  computed: {},
  methods: {
    // API endpoint: https://api-scanner.suk-sa-ard.com/register
    auth() {
      console.log("Authicating of mobileNumber: " + this.phoneNumber);

      axios({
        method: "post",
        url: "https://api-scanner.suk-sa-ard.com/register",
        // headers: {
        //   "content-type": "application/json;charset=UTF-8",
        //   referer:
        //     "https://qr.thaichana.com/callback?appId=0001&shopId=S0000074037&type=checkin&token=&mode=line&closeBtn="
        // },
        data: {
          mobileNumber: this.phoneNumber
        }
      })
        .then(response => {
          // response from api
          console.log(response);
          console.log(response.data.token);

          this.authKey = response.data.token;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // API endpoint: https://api-customer.thaichana.com/shop/0001/S0000074037/qr
    getShopInfo() {
      console.log("Get Info of shop: " + this.shopId);

      axios({
        method: "get",
        url: `https://api-customer.thaichana.com/shop/${this.appId}/${this.shopId}/qr`
      })
        .then(response => {
          // response from api
          console.log(response);

          this.shopInfo = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // API endpoing: https://qr.thaichana.com/callback?appId=0001&shopId=S0000074037&type=checkin&token=&mode=line&closeBtn=
    checkIn() {
      console.log("Check-In Shop: " + this.shopId);

      let currentTime = Date.now();

      axios({
        method: "post",
        url: `https://api-customer.thaichana.com/checkin?t=${currentTime}`,
        headers: {
          authorization: this.authKey
        },
        data: {
          appId: this.appId,
          shopId: this.shopId
        }
      })
        .then(response => {
          // response from api
          console.log(response);
          console.log(response.data);

          let checkInStatusMessage = response.data.message;

          if (checkInStatusMessage === "ok") {
            this.isStay = true;
            let checkInDate = new Date(currentTime);
            this.status = "Checked-in: " + checkInDate;
            console.log(this.status);
          } else {
            this.status = "Cannot check-in";
            console.error(this.status);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    // API endpoint: https://api-customer.thaichana.com/checkout?t=1590608566738
    checkOut() {
      console.log("Check-Out Shop: " + this.shopId);

      let currentTime = Date.now();

      axios({
        method: "post",
        url: `https://api-customer.thaichana.com/checkout?t=${currentTime}`,
        headers: {
          authorization: this.authKey
        },
        data: {
          appId: this.appId,
          shopId: this.shopId
        }
      })
        .then(response => {
          // response from api
          console.log(response);
          console.log(response.data);

          let checkOutStatusMessage = response.data.message;

          if (checkOutStatusMessage === "ok") {
            // if authKey was changed, usageTime will be null.
            // thaichana api use authKey as unique key for each user.
            // so, authenticate one time per mobile only
            let usageTime = new Date(parseInt(response.data.usageTime));
            usageTime /= 1000;

            this.status = "Checked-out! usage time: " + usageTime + " sec";

            console.log(this.status);
            this.isStay = false;
          } else {
            this.status = "Check-out error!!!!!!";
            console.error(this.status);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
