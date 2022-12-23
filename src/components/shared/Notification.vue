<template>
  <div class="notification" :class="type">
    <img
      v-if="allowedTypes.includes(type) && showIcon"
      class="icon"
      :src="`/images/icons/${type}.svg`"
      :alt="type"
    />
    <div>
      <div class="title" v-if="title">{{ title }}</div>
      <slot></slot>
    </div>
    <div class="close-icon" v-if="type === 'info-blue'" @click="$emit('close')">
      <img src="/images/icons/close-grey.svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MNotification',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      allowedTypes: ['danger', 'warning', 'info', 'info-blue'],
    };
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable';

.notification {
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Poppins';
  font-size: 14px;
  padding: 12px;

  .icon {
    margin-right: 14px;
    max-width: 16px;
  }

  .title {
    font-weight: 700;
    margin-bottom: 8px;
  }

  &.info {
    color: $blue-accent;
    border: 1px solid $brand-blue;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #0e3fe5;
  }

  &.info-blue {
    color: $black-primary;
    border: 1px solid $brand-blue;
    font-weight: 400;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #0e3fe5;
  }

  &.danger {
    border: 1px solid $red;
    background-color: $red-pale;
  }

  &.warning {
    border: 1px solid $yellow-500;
    background-color: rgba($yellow-500, 0.1);
  }

  .close-icon {
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    width: 40px;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 15px;
    }
  }
}
</style>
