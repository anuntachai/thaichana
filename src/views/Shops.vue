<template>
  <v-container>
    <v-row dense>
      <v-col v-for="shop in shops" :key="shop.id" cols="12">
        <v-card color="light-blue darken-4" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                class="headline"
                v-text="shop.info.shopName"
              ></v-card-title>

              <v-card-subtitle
                v-text="shop.info.businessType"
              ></v-card-subtitle>

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
            </div>
            <v-avatar class="ma-3" size="100" tile>
              <v-btn
                height="100"
                width="100"
                color="success"
                dark
                v-if="!shop.isStay"
                @click="checkIn(shop)"
                >Check-In</v-btn
              >
              <v-btn
                height="100"
                width="100"
                color="error"
                dark
                v-if="shop.isStay"
                @click="checkOut(shop)"
                >Check-Out</v-btn
              >
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <CheckInStatusDialog
        v-if="dialog"
        :visible="dialog"
        :checkInTime="currentShop.checkInTime"
        :place="currentShop.info.shopName"
        @close="dialog = false"
      ></CheckInStatusDialog>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import CheckInStatusDialog from "@/components/CheckInStatusDialog.vue";

export default {
  name: "Shops",
  data: function() {
    return {
      // show status dialog or not
      // true = show when check-in/check-out complete
      dialog: false,

      // shop for showing status
      currentShop: null
    };
  },
  components: {
    CheckInStatusDialog
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
      this.dialog = true;
    },
    checkOut(shop) {
      this.$store.dispatch("checkOut", shop);
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
