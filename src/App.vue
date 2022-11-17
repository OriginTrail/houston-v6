<template>
  <div id="app">
    <Header></Header>
    <div class="page-body">
      <sidebar-nav></sidebar-nav>
      <overview></overview>
    </div>
  </div>
</template>

<script>
import Header from './components/sections/Header';
import Overview from './components/sections/Overview';
import SidebarNav from './components/sections/SidebarNav';

export default {
  name: 'App',
  components: {
    Header,
    SidebarNav,
    Overview,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
@import './assets/variable';

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  /* Resets*/
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Typography */
  font-family: 'Poppins', sans-serif;

  h1,
  h2,
  h3 {
    color: $black-primary;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .grey-text {
    color: $black-tertiary;
  }

  // h1 {
  //   font-size: 6rem;
  // }

  // h2 {
  //   font-size: 4rem;
  // }

  // h3 {
  //   font-size: 3rem;
  //   font-weight: 500;
  // }

  // p {
  //   margin-top: 0;
  // }

  .page-body {
    display: flex;
    column-gap: 48px;
  }
}
</style>
