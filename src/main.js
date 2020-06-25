import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
// import store before router. because we need to get data from localStorage to store before router use them.
import store from "./store";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VueQrcodeReader from "vue-qrcode-reader";
import vuetify from "./plugins/vuetify";
const moment = require("moment");
moment.locale("TH");

Vue.config.productionTip = false;

Vue.use(VueQrcodeReader);

Vue.filter("formatTimer", function(value) {
  if (value) {
    return moment(String(value)).fromNow(true);
  }
});
Vue.filter("formatTimeVisited", function(value) {
  if (value) {
    return moment(String(value)).fromNow();
  }
});
Vue.filter("formatTime", function(value) {
  if (value) {
    return moment(String(value)).format("llll");
  }
});
Vue.filter("formatShortTime", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY HH:mm");
  }
});
Vue.filter("formatDateOnly", function(value) {
  if (value) {
    return moment(String(value)).format("LL");
  }
});
Vue.filter("formatTimeOnly", function(value) {
  if (value) {
    return moment(String(value)).format("LT");
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,

  beforeCreate() {
    //store.dispatch("restoreState");
    console.log("beforeCreate: mobileNumber = ", store.getters.mobileNumber);
  },

  mounted() {
    console.log("mounted: mobileNumber = ", store.getters.mobileNumber);
    //store.dispatch("restoreState");
  }
}).$mount("#app");
