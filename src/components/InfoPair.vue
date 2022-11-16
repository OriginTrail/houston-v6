<template>
  <div class="info-pair-wrapper">
    <p class="title grey-text">{{ title }}</p>
    <p class="description" v-html="description"></p>
  </div>
</template>
<script>
export default {
  name: 'InfoPair',
  props: {
    title: {
      type: String,
      required: true,
      default: 'title',
    },
    description: {
      type: String,
      required: true,
      default: 'Description',
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/variable';

.info-pair-wrapper {
  display: flex;
  align-items: center;
  column-gap: 8px;
  height: 16px;

  .title {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 16px;
  }

  .description {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 16px;
    color: $black-secondary;
  }
}
</style>
