import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import ui from './modules/ui';
import metrics from './modules/metrics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    ui,
    metrics,
  },
});
