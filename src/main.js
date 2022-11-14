import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import httpService from './service/http';

Vue.config.productionTip = false;

Vue.prototype.$http = httpService;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
