<template>
  <a class="link-button" :href="href" target="_blank">
    <span class="link-content">
      <slot>
        {{ text }}
      </slot>
    </span>
  </a>
</template>

<script>
export default {
  name: 'LinkButton',
  props: {
    href: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable';
.link-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 16px 16px;
  height: 56px;
  background: #0e3fe5;
  color: #fff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  .link-content {
    margin: auto;
  }
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
