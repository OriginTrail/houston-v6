<template>
  <div class="main-layout-wrapper">
    <Header></Header>
    <div class="page-body">
      <sidebar-nav></sidebar-nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from '../components/sections/Header';
import SidebarNav from '../components/sections/SidebarNav';

export default {
  name: 'MainLayout',
  components: {
    Header,
    SidebarNav,
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
.main-layout-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  .page-body {
    display: flex;
    column-gap: 24px;
    padding: 0 30px;

    @media screen and (min-width: 1440px) {
      column-gap: 48px;
    }
  }
}
</style>
