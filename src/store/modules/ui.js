export default {
  state: {
    globalLoader: false,
    loaderObject: null,
  },
  mutations: {
    TOGGLE_LOADER(state, { status, text } = {}) {
      state.globalLoader = !!status;
      if (state.globalLoader) {
        if (!state.loaderObject) {
          state.loaderObject = this._vm.$loading({ target: 'body', text: text });
        }
      } else {
        state.loaderObject.close();
        state.loaderObject = null;
      }
    },
  },
  actions: {
    async toggleGlobalLoader(store, { status, text } = {}) {
      store.commit('TOGGLE_LOADER', { status: status, text: text });
    },
  },
  getters: {
    isGlobalLoaderOn(state) {
      return state.globalLoader;
    },
    loaderObject(state) {
      return state.loaderObject;
    },
  },
};
