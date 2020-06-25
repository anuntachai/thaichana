<template>
  <v-container fluid>
    <v-row>
      <v-col align="center" justify="center">
        <v-icon x-large>mdi-badge-account-horizontal-outline</v-icon>
      </v-col>
    </v-row>
    <v-card class="mx-auto">
      <v-card-title>REGISTER</v-card-title>
      <v-card-text>
        <v-form ref="registerForm" v-model="valid" lazy-validation>
          <v-text-field
            v-model="mobileNumber"
            :counter="10"
            :rules="mobileNumberRules"
            label="เบอร์มือถือ"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submitMobileNumber()"
        >
          ลงทะเบียน
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mx-auto">
      <v-card-title>เบอร์ที่ลงทะเบียนล่าสุด</v-card-title>

      <v-card-text class="headline font-weight-bold">
        <v-icon>mdi-cellphone-iphone</v-icon>
        {{ currentMobileNumber }}
      </v-card-text>
      <v-card-subtitle
        ><v-icon>mdi-cellphone-key</v-icon> Authentication Key: <br />{{
          authKey
        }}<br /><br />
        <v-icon>mdi-clock-time-four-outline</v-icon> Authenticated Time:
        <br />{{ authTime }}</v-card-subtitle
      >

      <v-card-actions>
        <v-btn text color="deep-purple accent-4" @click="reAuth">
          Re-auth
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Register",
  data: function() {
    return {
      // from validation
      valid: true,
      mobileNumber: "",
      mobileNumberRules: [
        v => !!v || "กรุณาใส่เบอร์โทรศัพท์มือถือ 10 หลัก",
        v =>
          v.match(/^0{1}\d{9}$/) != null ||
          "กรุณาใส่เบอร์โทรศัพท์มือถือ 10 หลัก : 0xxxxxxxxx"
      ]
    };
  },
  components: {},
  computed: {
    currentMobileNumber() {
      return this.$store.getters.mobileNumber;
    },
    authKey() {
      return this.$store.getters.authKey || "";
    },
    authTime() {
      return this.$store.getters.authTime || "";
    }
  },
  methods: {
    validate() {
      this.$refs.registerForm.validate();
    },
    reset() {
      this.$refs.registerForm.reset();
    },
    resetValidation() {
      this.$refs.registerForm.resetValidation();
    },
    async submitMobileNumber() {
      // authenticate by phone number
      await this.$store.dispatch("auth", this.mobileNumber);
    },
    async reAuth() {
      // authenticate by phone number
      await this.$store.dispatch("auth", this.currentMobileNumber);
    }
  },
  mounted: function() {
    this.mobileNumber = this.currentMobileNumber || "";
  }
};
</script>
