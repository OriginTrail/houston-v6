<template>
  <div class="card-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card',
};
</script>

<style scoped lang="scss">
.card-wrapper {
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(82, 97, 115, 0.18);
  border-radius: 16px;
}
</style>
