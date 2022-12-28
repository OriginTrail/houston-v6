import metamask from '@/service/metamask';
import * as _ from 'lodash';
import { getReadableTokenAmount } from '@/utils/cryptoUtils';

export default {
  state: {
    ask: {
      currentAsk: 0,
    },
    stake: {
      totalStake: 0,
      activeStake: 0,
      pendingWithdrawal: 0,
    },
    nodeShareTokens: {
      totalSupply: 0,
      myBalance: 0,
      name: '',
      symbol: '',
      address: '',
    },
    withdrawal: {
      requestTime: 0,
    },
  },
  mutations: {
    SAVE_METRICS(state, newData = {}) {
      Object.keys(newData).forEach((key) => {
        _.set(state, key, newData[key]);
      });
    },
  },
  actions: {
    async getOverviewData(store, identity) {
      await Promise.allSettled([
        metamask.contractService.getAsk(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'ask.currentAsk': parseFloat(getReadableTokenAmount(data, 18, { fixed: 12 })),
          });
        }),
        metamask.contractService.getTotalStake(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'stake.activeStake': parseFloat(getReadableTokenAmount(data, 18, { fixed: 12 })),
          });
        }),
        metamask.contractService
          .getStakeAmountPendingWithdrawal(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              'stake.pendingWithdrawal': getReadableTokenAmount(data, 18, { fixed: 12 }),
            });
          }),
        metamask.contractService
          .getSharesContractInfo(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              nodeShareTokens: data,
            });
          }),
        metamask.contractService
          .getLastWithdrawalTimestamp(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              'withdrawal.requestTime': data,
            });
          }),
      ]).then((data) => {
        return data
          .map((e) => {
            if (e.reason) {
              console.log(e);
            }
            return e.value;
          })
          .filter((e) => !!e);
      });
    },
  },
  getters: {
    getAsk(state) {
      return state.ask;
    },
    getStake(state) {
      return state.stake;
    },
    getNodeSharesToken(state) {
      return state.nodeShareTokens;
    },
    getWithdrawalInfo(state) {
      return state.withdrawal;
    },
  },
};
