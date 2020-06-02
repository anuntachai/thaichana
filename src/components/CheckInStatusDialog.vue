<template>
  <v-row justify="center">
    <v-dialog v-model="show">
      <v-card>
        <v-card-text align="center">
          <v-icon color="success" size="80">mdi-map-marker</v-icon>
        </v-card-text>
        <v-card-text align="center">
          <h1>เช็คอินแล้ว</h1>
        </v-card-text>
        <v-card-text align="center">
          {{ checkInTime | formatTime }}
        </v-card-text>
        <v-card-text align="center">
          {{ place }}
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
export default {
  name: "CheckInStatusDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    checkInTime: {
      type: Date,
      default: Date.now()
    },
    place: {
      type: String,
      default: ""
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
