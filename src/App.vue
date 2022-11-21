<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './views/MainLayout';

export default {
  name: 'App',
  components: {
    MainLayout,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
@import './assets/variable';

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
    margin-bottom: 10px;
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
</style>
