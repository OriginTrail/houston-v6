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

  p {
    margin: 0;
    padding: 0;
  }

  /* Typography */
  font-family: 'Poppins', sans-serif;
  font-style: normal;

  h1,
  h2,
  h3 {
    color: $black-primary;
    font-weight: 700;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 32px;
    line-height: 44px;
  }

  h2 {
    font-size: 20px;
    line-height: 28px;
  }

  .grey-text {
    color: $black-tertiary;
  }

  .page-body {
    display: flex;
    column-gap: 48px;
  }
}
</style>
