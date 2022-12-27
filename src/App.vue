<template>
  <div id="app">
    <MainLayout />
    <!-- <PageNotFound /> -->
    <!-- <SwitchToDesktop /> -->
  </div>
</template>

<script>
import MainLayout from './views/MainLayout';
// import PageNotFound from './views/PageNotFound';
// import SwitchToDesktop from './views/SwitchToDesktop';

export default {
  name: 'App',
  components: {
    MainLayout,
    // PageNotFound,
    // SwitchToDesktop,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Roboto:wght@500&display=swap');
@import './assets/variable';
@import './assets/general';

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}

#app {
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
  }

  h2 {
    font-size: 32px;
    line-height: 44px;
  }

  h3 {
    font-size: 20px;
    line-height: 28px;
  }

  .grey-text {
    color: $black-tertiary;
  }
}
.withdrawal-availability-message {
  color: #0c0c0c;
}
.el-tooltip__popper.is-light {
  border-radius: 8px;
}

.el-notification {
  .el-notification__title {
    @extend .label-inline-14;
  }
}
</style>
