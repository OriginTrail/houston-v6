<template>
  <div class="homepage-wrapper"></div>
</template>

<script>
export default {
  name: 'Homepage',
  components: {},
  data() {
    return {
      list: [],
    };
  },
  async created() {
    try {
      this.list = await this.fetchData();
    } catch (e) {
      console.log('ERROR HANDLING');
    }
  },
  methods: {
    async fetchData() {
      return this.$http.get([1, 2, 3, 4, 5], true);
    },
  },
};
</script>

<style lang="scss" scoped>
.homepage-wrapper {
}
</style>
