<template>
  <div class="input-pair-wrapper">
    <input :class="{ yellow: isYellow }" type="text" />
    <p class="label">{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'InputPair',
  props: {
    label: {
      type: String,
      required: true,
      default: 'Input label',
    },
    isYellow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/variable';

.input-pair-wrapper {
  display: flex;
  align-items: center;
  column-gap: 16px;

  input {
    padding: 10px 10px 8px;
    width: 188px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #dfdfdf;
    border-radius: 8px;
    color: $green-500;
    text-align: right;
    outline: none;

    @media screen and (min-width: 1440px) {
      width: 244px;
    }
  }

  .label {
    white-space: nowrap;
  }

  .yellow {
    color: $yellow-500;
  }
}
</style>
