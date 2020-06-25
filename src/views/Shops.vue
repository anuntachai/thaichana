<template>
  <v-container>
    <v-row dense>
      <v-col v-for="shop in shops" :key="shop.id" cols="12">
        <v-card color="light-blue darken-4" dark>
          <v-container>
            <v-row justify="space-between" class="p-0">
              <v-col cols="9" class="p-0">
                <v-card-title
                  class="headline"
                  v-text="shop.info.shopName"
                ></v-card-title>
                <v-card-subtitle v-text="shop.info.businessType">
                </v-card-subtitle>
                <v-card-text>
                  <div v-if="!shop.isStay">
                    <v-icon>mdi-home-export-outline</v-icon>
                    {{ shop.checkOutTime | formatTime }} ({{
                      shop.checkOutTime | formatTimeVisited
                    }})
                  </div>
                  <div v-if="shop.isStay">
                    <v-icon>mdi-clock-time-four-outline</v-icon>
                    {{ shop.checkInTime | formatTimer }}
                  </div>
                </v-card-text>
              </v-col>

              <v-col cols="3" class="text-center p-0">
                <v-row class="flex-column ma-0 fill-height" justify="center">
                  <v-col class="px-0">
                    <v-btn
                      height="70"
                      width="70"
                      color="success"
                      dark
                      x-small
                      v-if="!shop.isStay"
                      @click="checkIn(shop)"
                      >Check-In</v-btn
                    >
                    <v-btn
                      height="70"
                      width="70"
                      color="error"
                      dark
                      x-small
                      v-if="shop.isStay"
                      @click="checkOut(shop)"
                      >Check-Out</v-btn
                    >
                  </v-col>

                  <v-col class="px-0">
                    <v-btn x-large icon @click="showQr(shop)">
                      <v-icon>mdi-qrcode</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <CheckInStatusDialog
        v-if="checkInDialog"
        :visible="checkInDialog"
        :checkInTime="currentShop.checkInTime"
        :place="currentShop.info.shopName"
        @close="checkInDialog = false"
      ></CheckInStatusDialog>
      <QRCodeDialog
        v-if="qrDialog"
        :visible="qrDialog"
        :shop="currentShop"
        @close="qrDialog = false"
      ></QRCodeDialog>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import CheckInStatusDialog from "@/components/CheckInStatusDialog.vue";
import QRCodeDialog from "@/components/QRCodeDialog.vue";

export default {
  name: "Shops",
  data: function() {
    return {
      // show status dialog or not
      // true = show when check-in/check-out complete
      checkInDialog: false,

      qrDialog: false,

      // shop for showing status or do action
      currentShop: null
    };
  },
  components: {
    CheckInStatusDialog,
    QRCodeDialog
  },
  computed: {
    shops() {
      return this.$store.getters.sortedShops;
    },
    stayTime(shop) {
      return Date.now() - shop.checkInTime;
    }
  },
  methods: {
    checkIn(shop) {
      this.$store.dispatch("checkIn", shop);

      // set data for displaying status
      this.currentShop = shop;
      this.checkInDialog = true;
    },
    checkOut(shop) {
      this.$store.dispatch("checkOut", shop);
    },
    showQr(shop) {
      this.currentShop = shop;
      this.qrDialog = true;
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
