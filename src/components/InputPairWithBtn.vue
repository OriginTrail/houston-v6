<template>
  <div class="input-pair-with-btn-wrapper">
    <div class="input-and-btn">
      <input v-model="value" :class="{ yellow: isYellow }" type="text" />
      <Button class="button" @click="onButtonClick">{{ btnLabel }}</Button>
    </div>
    <p class="label">{{ label }}</p>
  </div>
</template>

<script>
import Button from './Button';

export default {
  name: 'InputPairWithBtn',
  components: { Button },
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
    btnLabel: {
      type: String,
      required: true,
      default: 'Button',
    },
    inputValue: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      value: this.inputValue,
    };
  },
  watch: {
    inputValue(n) {
      this.value = n;
    },
  },
  methods: {
    onButtonClick() {
      this.$emit('click', this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/variable';

.input-pair-with-btn-wrapper {
  display: flex;
  align-items: center;
  column-gap: 16px;

  .input-and-btn {
    display: flex;
    flex-direction: column;
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

    .button {
      margin-top: 16px;
      align-self: flex-end;
    }
  }

  .label {
    align-self: flex-start;
    margin-top: 9px !important;
    white-space: nowrap;
  }

  .yellow {
    color: $yellow-500;
  }
}
</style>
