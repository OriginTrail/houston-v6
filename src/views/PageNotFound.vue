<template>
  <div class="page-not-found-wrapper">
    <img class="logo" src="images/logo.svg" alt="Houston application logo" />
    <h1 id="title">404</h1>
    <p id="description">The resource requested could not be found on this server</p>
    <Button id="button">Go back to the overview page</Button>
  </div>
</template>

<script>
import Button from '../components/Button';

export default {
  name: 'PageNotFound',
  components: {
    Button,
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/variable';

.page-not-found-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  #title {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 80px;
    line-height: 120px;
    text-align: center;
    color: $blue-primary;
    margin: 80px 0 0;
  }

  #description {
    width: 414px;
    // height: 60px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    text-align: center;
    color: #404040;
  }

  #button {
    margin-top: 32px;
  }
}
</style>
