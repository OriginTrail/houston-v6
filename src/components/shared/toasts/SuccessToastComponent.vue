<template>
  <div class="toast-component-wrapper">
    <div class="label-section">
      <div v-if="title" class="title label-inline-16">
        {{ title }}
      </div>
      <div v-if="message" class="message label-body-14">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessToastComponent',
  props: {
    title: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../../assets/variable.scss';

.toast-component-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  height: 100%;
  .label-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    margin: auto 0;
    .title {
      color: $black-primary;
    }
    .message {
      color: $black-secondary;
    }
  }
}
</style>
