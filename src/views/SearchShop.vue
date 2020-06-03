<template>
<v-container fill-height> 
    <iframe
      frameborder="0"
      style="overflow:hidden;height:100%;width:100%"
      height="100%"
      width="100%"
      src="https://merchant.thaichana.com/search"
    ></iframe>
</v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "SearchShop",
  data: function() {
    return {};
  },
  components: {},
  computed: {},
  methods: {},
  created: function() {},
  mounted: function() {}
};
</script>

<style scoped>
.flexcard {
  display: flex;
  flex-direction: column;
}
.flexcard .v-toolbar {
  flex: 0;
}
</style>
