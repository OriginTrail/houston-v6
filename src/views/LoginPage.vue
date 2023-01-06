<template>
  <div class="login-page-wrapper">
    <div class="content">
      <LoginComponent />
      <div class="metamask-message label-inline-12">
        In order to use the OriginTrail Houston you need to authenticate first via MetaMask. If you
        don’t have MetaMask installed,
        <a href="https://metamask.io/" target="_blank">click here</a>.
      </div>
    </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/sections/LoginComponent';
export default {
  name: 'LoginPage',
  components: { LoginComponent },
};
</script>

<style scoped lang="scss">
@import '../assets/variable.scss';
.login-page-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .content {
    margin: auto;
    .metamask-message {
      max-width: 415px;
      margin-top: 32px;
      line-height: 150%;
      text-align: center;
      a {
        color: $brand-blue;
      }
    }
  }
}
</style>
