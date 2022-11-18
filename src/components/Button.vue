<template>
  <button><slot></slot></button>
</template>

<script>
export default {
  name: 'Button',
};
</script>

<style lang="scss" scoped>
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
}
</style>
