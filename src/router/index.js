import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Homepage.vue';
import Overview from '../components/sections/Overview';
import Tokenomics from '../components/sections/Tokenomics';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Home,
  },
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
  },
  {
    path: '/tokenomics',
    name: 'tokenomics',
    component: Tokenomics,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
