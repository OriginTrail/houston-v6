<template>
  <div class="copy-button-wrapper">
    <el-tooltip
      @mouseleave="copyStatus = false"
      @mouseout="copyStatus = false"
      :content="getTooltipText"
      placement="top"
      effect="light"
    >
      <img src="/images/icons/copy-icon.svg" @click="clickedButton" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'copyButton',
  data() {
    return {
      copyStatus: false,
    };
  },
  computed: {
    getTooltipText() {
      return this.copyStatus ? 'copied!' : 'copy';
    },
  },
  methods: {
    clickedButton() {
      this.copyStatus = true;
      this.$emit('click');
      setTimeout(() => {
        this.copyStatus = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.copy-button-wrapper {
  &:hover {
    cursor: pointer;
  }
}
</style>
