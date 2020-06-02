<template>
  <v-container>
    <v-timeline
      v-for="event in timeline"
      :key="event.checkInTime.toString()"
      align-top
      dense
    >
      <v-timeline-item color="success" small>
        <v-row class="pt-1">
          <v-col cols="2">
            <div class="caption">
            {{ event.checkInTime | formatShortTime }}
            </div>
          </v-col>
          <v-col>
            <strong>{{ event.shop.info.shopName }}</strong>
            <div class="caption" v-if="event.checkOutTime">
              Check-out time : {{ event.checkOutTime | formatShortTime }}
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Timeline",
  data: function() {
    return {};
  },
  components: {},
  computed: {
    timeline() {
      return this.$store.getters.timeline;
    }
  },
  methods: {},
  created: function() {},
  mounted: function() {}
};
</script>
