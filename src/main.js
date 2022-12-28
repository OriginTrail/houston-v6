import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import httpService from './service/http';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.prototype.$http = httpService;
Vue.use(ElementUI, { locale });
Vue.use(Toast, {});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
