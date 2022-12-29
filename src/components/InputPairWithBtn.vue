<template>
  <div class="input-pair-with-btn-wrapper" :style="computePrefixTextWidth">
    <div class="input-and-btn">
      <el-input
        v-model="cValue"
        @input="$emit('update', value)"
        :class="{ [color]: color }"
        :type="inputType"
        :min="0"
      >
        <div slot="suffix" v-if="inputSuffix" class="suffix-inner" :ref="'suffix' + randomNumber">
          {{ inputSuffix }}
        </div>
        <div slot="prefix" v-if="inputPrefix" class="prefix-inner" :ref="'prefix' + randomNumber">
          <slot name="inputPrefix">
            {{ inputPrefix }}
          </slot>
        </div>
      </el-input>
      <Button v-if="button" class="button" @click="onButtonClick">{{ btnLabel }}</Button>
    </div>
    <p class="label" v-if="label">{{ label }}</p>
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
      default: null,
    },
    isYellow: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: null,
    },
    btnLabel: {
      type: String,
      required: true,
      default: 'Button',
    },
    inputValue: {
      type: [String, Number],
      default: null,
    },
    inputSuffix: {
      type: String,
      default: null,
    },
    inputPrefix: {
      type: String,
      default: null,
    },
    button: {
      type: Boolean,
      default: true,
    },
    inputType: {
      type: String,
      default: 'text',
    },
    inputPattern: {
      type: String,
      default: '[0-9]+([\\.][0-9]+)?',
    },
    max: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      value: this.inputValue,
      isMounted: false,
      randomNumber: Math.round(Math.random() * 100000),
    };
  },
  computed: {
    cValue: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.inputType === 'number') {
          if (!isNaN(val) && Number(val) >= 0) {
            if (this.max) {
              if (Number(this.max) >= Number(val)) {
                this.value = val;
              } else {
                this.value = this.max;
              }
            } else {
              this.value = val;
            }
          }
        } else {
          this.value = val;
        }
      },
    },
    inputSuffixWidth() {
      return this.isMounted
        ? Math.min(this.$refs['suffix' + this.randomNumber]?.clientWidth, 130) ?? 0
        : 0;
    },
    inputPrefixWidth() {
      return this.isMounted ? this.$refs['prefix' + this.randomNumber]?.clientWidth ?? 0 : 0;
    },
    computePrefixTextWidth() {
      return {
        '--input-width': `calc(100% - ${this.inputSuffixWidth}px)`,
        '--input-left-padding': `${this.inputPrefixWidth + 20}px`,
      };
    },
  },
  watch: {
    inputValue(n) {
      this.value = n;
    },
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true;
    }, 70);
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
  flex-direction: column;
  align-items: center;
  column-gap: 16px;

  .input-and-btn {
    display: flex;
    flex-direction: column;
    width: 100%;
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
      align-self: flex-start;
    }

    .el-input {
      width: 100%;
      border: 1px solid $grey-200;
      border-radius: 8px;
      ::v-deep {
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type='number'] {
          -moz-appearance: textfield;
        }
        &.blue {
          input {
            color: $brand-blue;
          }
        }
        &.green {
          input {
            color: $green-500;
          }
        }
        &.red {
          input {
            color: $red-error;
          }
        }
        input {
          width: var(--input-width);
          padding-left: var(--input-left-padding);
          text-align: right;
        }
        .el-input__inner {
          border-radius: 8px;
          border: none;
          padding-right: 12px;
        }
        .el-input__suffix,
        .el-input__prefix {
          display: flex;
          .el-input__suffix-inner {
            padding-top: 1px;
            margin: auto;
          }
          .el-input__prefix-inner {
            margin: auto;
          }
        }
        .el-input__suffix {
          right: 8px;
        }
        .el-input__prefix {
          left: 12px;
        }
      }
    }

    .suffix-inner {
      display: flex;
      margin: auto;
      color: $black-secondary;
    }
    .prefix-inner {
      color: $grey-300;
      display: flex;
      margin: auto;
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
