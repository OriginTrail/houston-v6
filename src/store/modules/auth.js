import metamask from '@/service/metamask';

export default {
  state: {
    authenticated: false,
    selectedNetwork: null,
    currentAddress: null,
    identityId: null,
  },
  mutations: {
    LOGIN_METAMASK(state, data) {
      state.authenticated = true;
      state.currentAddress = data.address;
    },
    LOGOUT_METAMASK(state) {
      state.authenticated = false;
      state.currentAddress = null;
      state.identityId = null;
    },
    SAVE_IDENTITY(state, IID) {
      state.identityId = IID;
    },
    SAVE_NETWORK_CHOICE(state, network) {
      state.selectedNetwork = network;
    },
  },
  actions: {
    async connectToMetamask(store) {
      await metamask.connectToMetamask().then((accounts) => {
        store.commit('LOGIN_METAMASK', { address: accounts[0] });
      });
    },
    async disconnectFromMetamask() {
      await metamask.disconnectFromMetamask();
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.authenticated;
    },
    connectedAddress(state) {
      return state.currentAddress;
    },
    selectedNetwork(state) {
      return state.selectedNetwork;
    },
    isIdentityResolved(state) {
      return state.identityId;
    },
    isConnectedToHouston(state) {
      return state.identityId && state.authenticated;
    },
  },
};
