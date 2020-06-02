<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Thaichana"
          class="shrink mr-2"
          contain
          src="@/assets/img/logo.png"
          transition="scale-transition"
          width="120"
        />

        <v-img
          alt="Thaichana"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="@/assets/img/logo.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://www.ไทยชนะ.com" target="_blank" text>
        <span class="mr-2">ไทยชนะ</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-bottom-navigation v-model="activeFooterNavBtn" fixed grow color="teal">
      <v-btn value="Scan" @click="changePage('/scan')">
        <span>Scan QR</span>
        <v-icon>mdi-qrcode-scan</v-icon>
      </v-btn>

      <v-btn value="Shops" @click="changePage('/shops')">
        <span>Shops</span>
        <v-badge
          color="success"
          :content="activeCheckIn"
          overlap
          offset-x="2"
          v-if="activeCheckIn"
        >
          <v-icon>mdi-home-city-outline</v-icon>
        </v-badge>
        <v-icon v-if="!activeCheckIn">mdi-home-city-outline</v-icon>
      </v-btn>

      <v-btn value="Timeline" @click="changePage('/timeline')">
        <span>Timeline</span>
        <v-icon>mdi-timeline-clock-outline</v-icon>
      </v-btn>

      <v-btn value="Register" @click="changePage('/register')">
        <span>Register</span>
        <v-icon>mdi-account-edit-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    // footer navigation current button
    activeFooterNavBtn: "Shops"
  }),
  computed: {
    activeCheckIn() {
      return this.$store.getters.activeCheckIn;
    }
  },
  methods: {
    changePage(to) {
      this.$router.push(to);
    }
  }
};
</script>
