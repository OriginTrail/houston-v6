<template>
  <div class="login-page-wrapper">
    <!--    <LoginView />-->
    <LoginComponent />
  </div>
</template>

<script>
import LoginView from '@/components/sections/LoginView';
import LoginComponent from '@/components/sections/LoginComponent';
export default {
  name: 'LoginPage',
  // eslint-disable-next-line vue/no-unused-components
  components: { LoginComponent, LoginView },
};
</script>

<style scoped lang="scss">
.login-page-wrapper {
  height: 100%;
  width: 100%;
}
</style>
