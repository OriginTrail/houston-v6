<template>
  <div class="pill-wrapper">
    <p><slot></slot></p>
  </div>
</template>

<script>
export default {
  name: 'Pill',
};
</script>

<style lang="scss" scoped>
.pill-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0px 4px;
  height: 16px;
  background: #ebf9ff;
  border-radius: 100px;

  p {
    height: 16px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 16px;
    color: #023b76;
    white-space: nowrap;
  }
}
</style>
