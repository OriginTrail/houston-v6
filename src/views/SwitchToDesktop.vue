<template>
  <div class="switch-to-desktop-wrapper">
    <div class="header">
      <img class="logo" src="../../public/images/logo.svg" alt="Houston application logo" />
    </div>
    <div class="body">
      <h2 class="title">Switch to desktop</h2>
      <p class="description">
        At the moment, you can interact with this interface only via desktop devices.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchToDesktop',
};
</script>

<style lang="scss" scoped>
@import '../assets/variable';

.switch-to-desktop-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0 8px;

  @media screen and (min-width: 768px) {
    margin: 0 40px;
  }

  .header {
    margin-top: 26px;
  }

  .body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      @media screen and (min-width: 768px) {
        font-size: 40px !important;
        line-height: 64px !important;
      }
    }

    .description {
      color: #404040;
      max-width: 344px;

      @media screen and (min-width: 768px) {
        max-width: 405px;
      }
    }
  }
}
</style>
