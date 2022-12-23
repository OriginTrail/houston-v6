import Vue from 'vue';
import VueRouter from 'vue-router';
import Overview from '../components/sections/Overview';
import Tokenomics from '../components/sections/Tokenomics';
import store from '../store';
import LoginPage from '@/views/LoginPage';
import metamask from '@/service/metamask';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'overview',
    component: Overview,
  },
  {
    path: '/tokenomics',
    name: 'tokenomics',
    component: Tokenomics,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      public: true,
      fullPage: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.public) {
    return next();
  }
  if (!store.getters.isLoggedIn) {
    if (metamask.isSavedConnection()) {
      await store.dispatch('toggleGlobalLoader', { status: true, text: null });
      await store
        .dispatch('connectToMetamask')
        .then(() => {
          next();
        })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          next('/login');
        });
      await store.dispatch('toggleGlobalLoader', { status: false, text: null });
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
