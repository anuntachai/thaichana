<template>
  <v-row justify="center">
    <v-dialog v-model="show">
      <v-card>
        <v-card-title align="center">
          {{ shop.info.shopName }}
        </v-card-title>
        <v-card-text align="center">
          <qrcode-vue
            :value="qrData"
            level="L"
            size="250"
            renderAs="canvas"
            background="#ffffff"
            foreground="#000000"
          ></qrcode-vue>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" text @click="show = false">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import Shop from "@/store/classes/shop.js";

export default {
  name: "QRCodeDialog",
  components: {
    QrcodeVue
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shop: {
      type: Shop
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    },
    qrData() {
      return `https://qr.thaichana.com/?appId=${this.shop.appId}&shopId=${this.shop.id}`;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
