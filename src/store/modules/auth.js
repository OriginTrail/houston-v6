import metamask from '@/service/metamask';
import { deleteFromStorage, readFromStorage, saveToStorage } from '@/utils/storageUtils';

export default {
  state: {
    authenticated: false,
    selectedNetwork: null,
    currentAddress: null,
    identityId: null,
    operationalWallet: null,
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
    SAVE_OPERATIONAL_WALLET(state, OPW) {
      state.operationalWallet = OPW;
    },
    SAVE_NETWORK_CHOICE(state, network) {
      state.selectedNetwork = network;
    },
    READ_SAVED_STORAGE_DATA(state, newData) {
      Object.keys(newData).forEach((key) => {
        state[key] = newData[key];
      });
    },
  },
  actions: {
    async connectToMetamask(store) {
      return await metamask.connectToMetamask().then((accounts) => {
        store.commit('LOGIN_METAMASK', { address: accounts[0] });
      });
    },
    async disconnectFromMetamask() {
      await metamask.disconnectFromMetamask();
    },

    async disconnectFromHouston() {
      await metamask.disconnectFromMetamask();
      deleteFromStorage('user_id');
    },

    async getIdentityAction(store, wallets) {
      return await metamask.contractService
        .getIdentity(wallets.opw, wallets.adminw)
        .then(async (identity) => {
          if (Number(identity) > 0) {
            store.commit('SAVE_IDENTITY', identity);
            store.commit('SAVE_OPERATIONAL_WALLET', wallets.opw);
            await store.dispatch('saveAuthInfo');
            return identity;
          } else {
            throw 'NOT_CONNECTED_OP_WALLET';
          }
        });
    },

    async saveAuthInfo(store) {
      saveToStorage('user_id', {
        selectedNetwork: store.state.selectedNetwork,
        currentAddress: store.state.currentAddress,
        identityId: store.state.identityId,
        operationalWallet: store.state.operationalWallet,
      });
    },
    async readAuthInfo(store, newData = null) {
      let userData = newData ?? readFromStorage('user_id');
      if (userData) userData = JSON.parse(userData);
      store.commit('READ_SAVED_STORAGE_DATA', userData);
      return userData;
    },

    async isAccountSaved(store) {
      let userData = readFromStorage('user_id');
      if (userData) userData = JSON.parse(userData);
      if (store.state.currentAddress === userData.currentAddress) {
        return userData;
      } else {
        throw 'not saved';
      }
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
    useOperationalWallet(state) {
      return state.operationalWallet;
    },
    isIdentityResolved(state) {
      return state.identityId;
    },
    isConnectedToHouston(state) {
      return state.identityId && state.authenticated;
    },
  },
};
