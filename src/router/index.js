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
  if (!store.getters.isConnectedToHouston) {
    if (metamask.isSavedConnection()) {
      await store.dispatch('toggleGlobalLoader', { status: true, text: null });
      store
        .dispatch('readAuthInfo')
        .then(async (userData) => {
          await store.dispatch('connectToMetamask');
          await store.dispatch('isAccountSaved', userData);
          return userData;
        })
        .then(async (userData) => {
          await store.dispatch('getIdentityAction', {
            opw: userData.operationalWallet,
            adminw: userData.currentAddress,
          });
          next(to.path);
          return;
        })
        .catch((err) => {
          console.error(err);
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
