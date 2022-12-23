<template>
  <div class="property-wrapper">
    <p class="title"></p>
    <p class="value"></p>
  </div>
</template>

<script>
export default {
  name: 'Property',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Title',
    },
    value: {
      type: String,
    },
  },
};
</script>
