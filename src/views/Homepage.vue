<template>
  <div class="homepage-wrapper">
    <Header></Header>
    <div class="page-body">
      <sidebar-nav></sidebar-nav>
      <overview></overview>
      <!-- <tokenomics></tokenomics> -->
    </div>
  </div>
</template>

<script>
import Header from '../components/sections/Header';
import SidebarNav from '../components/sections/SidebarNav';
import Overview from '../components/sections/Overview';
// import Tokenomics from '../components/sections/Tokenomics';

export default {
  name: 'Homepage',
  components: {
    Header,
    SidebarNav,
    Overview,
    // Tokenomics,
  },
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
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  .page-body {
    display: flex;
    column-gap: 48px;
    padding: 0 30px;
  }
}
</style>
