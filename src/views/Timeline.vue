<template>
  <v-container>
    <v-timeline v-for="(event, index) in timeline" :key="index" align-top dense>
      <v-timeline-item
        class="mb-4"
        color="indigo darken-4"
        icon-color="white"
        icon="mdi-calendar-month"
        fill-dot
        v-if="isDate(event)"
      >
        <p class="font-weight-black">{{ event | formatDateOnly }}</p>
      </v-timeline-item>
      <v-timeline-item
        class="mb-4"
        color="success"
        icon-color="white"
        icon="mdi-map-marker"
        fill-dot
        small
        v-if="!isDate(event)"
      >
        <v-row justify="space-between">
          <v-col cols="10"
            ><div>{{ event.shop.info.shopName }}</div>
            <div v-if="event.checkOutTime">
              <p class="text--disabled">
                <v-icon small>mdi-home-export-outline</v-icon>
                {{ event.checkOutTime | formatShortTime }}
              </p>
            </div></v-col
          >
          <v-col class="text-right" cols="2">{{
            event.checkInTime | formatTimeOnly
          }}</v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
// @ is an alias to /src
const moment = require("moment");

export default {
  name: "Timeline",
  data: function() {
    return {};
  },
  components: {},
  computed: {
    // timeline for display
    // return:
    //  timeline: [ [Date], {shop, checkInTime, checkOutTime}, {shop, checkInTime, checkOutTime}, ..., [Date], {shop, checkInTime, checkOutTime}, ...  ]
    timeline() {
      let timelineArray = this.$store.getters.timeline;
      // generate date entity for grouping events in the same date when display
      let dateArray = timelineArray.reduce((total, value) => {
        let result = total;

        // find current value's check-in date is already in total (duplicated) or not?
        let matched = total.find(v => {
          return moment(value.checkInTime).isSame(v, "day");
        });

        // if this check-in date is not duplicate, put in the result list
        if (!matched) {
          result.push(new Date(value.checkInTime));
        }
        //console.log(result);
        return result;
      }, []);

      // now timeline array has event and date
      timelineArray = timelineArray.concat(dateArray);

      // sort by date and event's check-in date
      // sorting:
      //  1) lastest date first
      //  2) events in lastest date (lastest event first)
      timelineArray.sort((a, b) => {
        if (a instanceof Date && b instanceof Date) {
          return b - a;
        } else if (a instanceof Date) {
          return moment(a).isBefore(b.checkInTime, "day") ? 1 : -1;
        } else if (b instanceof Date) {
          return moment(a.checkInTime).isBefore(b, "day") ? 1 : -1;
        } else {
          return b.checkInTime - a.checkInTime;
        }
      });

      return timelineArray;
    }
  },
  methods: {
    isDate(event) {
      return event instanceof Date;
    }
  },
  created: function() {},
  mounted: function() {}
};
</script>
