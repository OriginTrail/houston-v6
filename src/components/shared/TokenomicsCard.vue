<template>
  <div class="tokenomics-card-wrapper">
    <div class="title label-plat-h4" v-if="title">
      {{ title }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TokenomicsCard',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable.scss';
.tokenomics-card-wrapper {
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
  border-radius: 16px;
  padding: 32px 40px;
  .title {
    color: $black-primary;
    margin-bottom: 8px;
  }
}
</style>
