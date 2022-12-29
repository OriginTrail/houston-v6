<template>
  <button :type="type" @click="onClick" :class="{ 'label-inline-14': true, disabled: disabled }">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'button',
    },
  },

  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  min-width: 113px;
  height: 40px;
  background: #0e3fe5;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: $blue-accent-hover;
  }
  &:active {
    background-color: $blue-accent-focus;
  }

  &.disabled {
    opacity: 0.85;
    img {
      opacity: 0.15;
    }
    background-color: $grey-100;
    &:hover {
      cursor: not-allowed;
      background-color: $grey-100;
    }
    color: $black-primary-disabled;
  }
}
</style>
