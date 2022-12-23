<template>
  <button @click="onClick" :class="{ disabled: disabled }"><slot></slot></button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
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
  font-size: 14px;
  padding: 12px 16px;
  min-width: 113px;
  height: 40px;
  background: #0e3fe5;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: $blue-accent-hover;
  }
  &:active {
    background-color: $blue-accent-focus;
  }

  &.disabled {
    opacity: 85%;
    img {
      opacity: 15%;
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
