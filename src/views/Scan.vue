<template>
  <v-container>
    <div class="text-center"><h3>Scan QR</h3></div>

    <div><qrcode-stream @decode="onDecode" v-if="!shop"></qrcode-stream></div>
    <div v-if="shop != null">
      <v-card v-if="shop.info">
        <v-card-title>{{ shop.info.shopName }}</v-card-title>
        <v-card-subtitle
          >{{ shop.id }} | {{ shop.info.businessType }}</v-card-subtitle
        >
        <v-card-text
          >Status: {{ shop.info.status }}<br />CanCheckIn:
          {{ shop.info.canCheckin }}</v-card-text
        >

        <v-card-actions>
          <v-btn
            block
            @click="checkIn(shop)"
            v-if="!shop.isStay"
            color="success"
            >Check-In</v-btn
          >
          <v-btn block @click="checkOut(shop)" v-if="shop.isStay" color="error"
            >Check-Out</v-btn
          >
        </v-card-actions>
      </v-card>
      <CheckInStatusDialog
        v-if="dialog"
        :visible="dialog"
        :checkInTime="shop.checkInTime"
        :place="shop.info.shopName"
        @close="closeDialog()"
      ></CheckInStatusDialog>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import CheckInStatusDialog from "@/components/CheckInStatusDialog.vue";

export default {
  name: "Scan",
  components: {
    CheckInStatusDialog
  },
  data: function() {
    return {
      checkInURL: null,
      shop: null,

      // show status dialog or not
      // true = show when check-in/check-out complete
      dialog: false
    };
  },
  computed: {},
  methods: {
    onDecode(decodeString) {
      console.log("QR decode: " + decodeString);

      if (decodeString.length > 10) {
        this.checkInURL = decodeString;

        this.getShopInfo();
      }
    },
    async getShopInfo() {
      // try to get shop from scaned data
      try {
        let shop = await this.$store.dispatch(
          "extractShopUrl",
          this.checkInURL
        );

        this.shop = shop;

        console.log(this.shop);
      } catch (error) {
        console.error("Cannot get shop from qr data: " + this.checkInURL);
      }
    },
    async checkIn(shop) {
      // check in
      await this.$store.dispatch("checkIn", shop);

      // show dialog
      this.dialog = true;
    },
    async checkOut(shop) {
      // check out
      await this.$store.dispatch("checkOut", shop);

      this.goToShops();
    },
    closeDialog() {
      this.dialog = false;
      this.goToShops();
    },
    goToShops() {
      // go to shops list
      this.$router.push({ name: "Shops" });
    }
  },
  created: function() {
    // // if user is not register number, go to register page
    // if (!this.$store.getters.isAuth) {
    //   // go to shops list
    //   this.$router.push({ name: "Register" });
    // }
  },
  mounted: function() {
    // // if user is not register number, go to register page
    // if (!this.$store.getters.isAuth) {
    //   // go to shops list
    //   this.$router.push({ name: "Register" });
    // }
  }
};
</script>
