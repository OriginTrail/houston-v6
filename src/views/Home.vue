<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <ul>
      <li :key="d" v-for="d in list">{{ d }}</li>
    </ul>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      list: [],
    };
  },
  async created() {
    try {
      this.list = await this.fetchData();
    } catch (e) {
      console.log('ERROR HANDLING');
    }
  },
  methods: {
    async fetchData() {
      return this.$http.get([1, 2, 3, 4, 5], true);
    },
  },
};
</script>
