<template>
  <div class="loading-icon-animation">
    <lottie :options="animationOptions" class="loader-animation"></lottie>
  </div>
</template>

<script>
import loader from '../../../../public/animations/loader-dark.json';
import Lottie from 'vue-lottie';
export default {
  name: 'LoadingToastIcon',
  components: { Lottie },
  data() {
    return {
      animationOptions: { animationData: loader, loop: true, autoplay: true },
    };
  },
};
</script>

<style scoped lang="scss">
@import '../../../assets/variable';
.loading-icon-animation {
  background: $grey-200;
  border-radius: 100px;
  .loader-animation {
    height: 40px;
    width: 40px;
  }
}
</style>
