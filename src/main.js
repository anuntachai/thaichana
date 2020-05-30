import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
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

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,

  mounted() {
    store.dispatch("restoreState");
  }
}).$mount("#app");
