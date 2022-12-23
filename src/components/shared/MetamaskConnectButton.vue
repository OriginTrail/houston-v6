<template>
  <button
    type="button"
    :class="{ 'metamask-button': true, error: error, disabled: disabled }"
    v-on="$listeners"
  >
    <span class="button-text">{{ buttonText }}</span>
  </button>
</template>

<script>
export default {
  name: 'MetamaskConnectButton',
  props: {
    buttonText: {
      type: String,
      default: 'Connect admin wallet',
    },
    error: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      text: this.buttonText,
    };
  },
  watch: {
    buttonText(n) {
      this.text = n;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../assets/variable.scss';
@import '../../assets/general.scss';
.metamask-button {
  display: flex;
  background-color: $white;
  border: 1px solid $grey-400;
  border-radius: 8px;
  height: 48px;
  color: $grey-400;
  padding: 12px 16px 12px 8px;
  cursor: pointer;
  @extend .label-inline-14-semi-bold;

  &:hover {
    background-color: #f9fafa;
  }
  &:active {
    background-color: $grey-100;
  }

  &.disabled {
    border: none;
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

  .metamask-icon {
    margin: auto 8px auto 0;
  }
  .button-text {
    margin: auto auto;
  }

  &.error {
    border: 1px solid $red-error;
  }
}
</style>
