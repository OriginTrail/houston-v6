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
      total: 0,
      owned: 0,
      name: '',
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
      console.log(identity);
      await Promise.allSettled([
        metamask.contractService.getAsk(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'ask.currentAsk': data,
          });
        }),
        metamask.contractService.getTotalStake(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'stake.activeStake': getReadableTokenAmount(data, 18, { fixed: 0 }),
          });
        }),
        metamask.contractService
          .getStakeAmountPendingWithdrawal(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', { 'stake.pendingWithdrawal': data });
          }),
        metamask.contractService
          .getSharesContractInfo(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              nodeShareTokens: data,
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
