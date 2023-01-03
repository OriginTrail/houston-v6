import ContractService from '@/service/contractService';
import store from '../store';
import { ethers } from 'ethers';
import { networkList } from '@/utils/lists';
import router from '../router';

class metamaskService {
  networkStatus = false;
  eventsSet = false;
  accountChangedListener = null;
  contractService = null;
  ethersProvider = null;
  ethersSigner = null;
  accounts = [];
  async connectToMetamask() {
    try {
      if (window.ethereum) {
        if (window.ethereum.providers) {
          const metamaskProvider = window.ethereum.providers.find(
            (provider) => provider.isMetaMask,
          );
          this.ethersProvider = new ethers.providers.Web3Provider(metamaskProvider);
          window.ethereum.setSelectedProvider(metamaskProvider);
        } else {
          this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        }
        this.ethersSigner = this.ethersProvider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        await this.checkNetwork().catch(() => {
          return this.switchMetamaskChain().catch((err) => {
            throw err;
          });
        });
        this.setUpEvents();
        this.setNetworkStatus(true);
        localStorage.setItem('refuse_wallet', 'false');
        this.accounts = accounts;
        this.contractService = new ContractService(this.ethersSigner);
        return accounts;
      } else {
        console.warn(
          'Metamask is not found on your browser, ' +
            'To use any wallet features you need to install the official metamask extension',
        );
      }
    } catch (err) {
      console.error(err);
      this.setNetworkStatus(false);
      throw err;
    }
  }

  getChainId = async () => {
    return await window.ethereum.request({ method: 'eth_chainId' });
  };

  isMetaMaskInstalled = () => {
    const { ethereum } = window;
    if (!ethereum) return false;
    this.ethereum = ethereum;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  isSavedConnection() {
    const refuse_wallet = localStorage.getItem('refuse_wallet');
    return refuse_wallet === 'false';
  }

  checkNetwork = async (chainId) => {
    if (!chainId) chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (store.getters.selectedNetwork?.chainId !== chainId) {
      this.setNetworkStatus(false);
      throw new Error('netError');
    }
    return true;
  };

  setNetworkStatus(boolValue) {
    this.networkStatus = boolValue;
  }

  // eslint-disable-next-line no-unused-vars
  async switchMetamaskChain(chainId) {
    await store.dispatch('toggleGlobalLoader', { status: true, text: 'Switching chain...' });
    try {
      const returnedValue = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId ?? store.getters.selectedNetwork?.chainId }],
      });
      await store.dispatch('toggleGlobalLoader', { status: false, text: null });
      return returnedValue;
    } catch (err) {
      await store.dispatch('toggleGlobalLoader', { status: false, text: null });
      throw err;
    }
  }

  async addMetamaskChain(chainData) {
    await store.dispatch('toggleGlobalLoader', { status: true, text: 'Adding chain...' });
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chainData.chainId,
            chainName: chainData.bcNetworkName,
            rpcUrls: [chainData.rpc],
            nativeCurrency: {
              name: 'MOTP',
              symbol: 'MOTP',
              decimals: 18,
            },
          },
        ],
      });
      await store.dispatch('toggleGlobalLoader', { status: false, text: null });
      return;
    } catch (err) {
      await store.dispatch('toggleGlobalLoader', { status: false, text: null });
      throw err;
    }
  }

  setUpEvents() {
    if (window.ethereum && !this.eventsSet) {
      window.ethereum.on('connect', () => {
        this.setNetworkStatus(true);
      });

      window.ethereum.on('disconnect', () => {
        this.disconnectFromMetamask();
      });
      window.ethereum.on('accountsChanged', async (accounts) => {
        console.log('Account Changed');
        if (this.accountChangedListener) {
          this.accountChangedListener(accounts);
        }
        if (accounts?.length === 0) {
          this.disconnectFromMetamask();
        } else {
          if (store.getters.isConnectedToHouston) {
            await store
              .dispatch('metamaskAccountChange', { address: accounts[0] })
              .catch(async () => {
                await store.dispatch('disconnectFromHouston');
                await router.push({
                  name: 'login',
                });
                await store.dispatch('toggleGlobalLoader', { status: false, text: null });
              });
          } else {
            store.commit('LOGIN_METAMASK', { address: accounts[0] });
          }
          this.ethersSigner = this.ethersProvider.getSigner();
          this.accounts = accounts;
        }
      });
      window.ethereum.on('chainChanged', (chainId) => {
        return this.checkNetwork(chainId).catch(() => this.chainUpdateProcess(chainId));
      });

      this.eventsSet = true;
    }
  }

  chainUpdateProcess = (chainId) => {
    return this.switchMetamaskChain(chainId)
      .then(() => store.dispatch('connectToMetamask'))
      .catch((error) => {
        this.disconnectFromMetamask();
        if (error.code === 4902) {
          //network not registered
          const newNetwork = networkList.find((e) => e.chainId === chainId);
          if (newNetwork) {
            this.addMetamaskChain(newNetwork).then(() => {
              return store.dispatch('connectToMetamask');
            });
          }
        }
      });
  };

  disconnectFromMetamask() {
    localStorage.setItem('refuse_wallet', 'true');
    this.setNetworkStatus(false);
    this.eventsSet = false;
    this.unsetEvents();
    store.commit('LOGOUT_METAMASK');
  }

  unsetEvents() {
    window.ethereum.removeAllListeners();
  }

  //util
  signMessage(message) {
    return this.ethersSigner.signMessage(message);
  }

  isAddress(address) {
    return ethers.utils.isAddress(address);
  }
  compareAddresses(addr1, addr2) {
    return ethers.utils.getAddress(addr1) === ethers.utils.getAddress(addr2);
  }
}

export default new metamaskService();
