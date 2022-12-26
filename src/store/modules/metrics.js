import metamask from '@/service/metamask';
import * as _ from 'lodash';
import { getReadableTokenAmount } from '@/utils/cryptoUtils';

export default {
  state: {
    tracBalance: {
      staked: 0,
      delegated: {
        value: 0,
        share: 0,
      },
      slashed: 0,
      total: 0,
    },
    rewards: {
      locked: 0,
      delegator: 0,
      operatorFee: 0,
    },
    networkMetrics: {
      assetsOnDKG: 0,
      stakedTRAC: 0,
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
        metamask.contractService.getTotalStake(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'tracBalance.staked': getReadableTokenAmount(data, 18, { fixed: 0 }),
            'tracBalance.total': getReadableTokenAmount(data, 18, { fixed: 0 }),
          });
        }),
        metamask.contractService.getAccumulatorOperatorFee(identity).then((data) => {
          store.commit('SAVE_METRICS', {
            'rewards.operatorFee': getReadableTokenAmount(data, 18, { fixed: 0 }),
          });
        }),
        metamask.contractService
          .getAssetsOnDkg()
          .then((data) => {
            store.commit('SAVE_METRICS', { 'networkMetrics.assetsOnDKG': data });
          })
          .catch((err) => {
            console.log(err);
          }),
        metamask.contractService.getStakedTRAC().then((data) => {
          store.commit('SAVE_METRICS', {
            'networkMetrics.stakedTRAC': getReadableTokenAmount(data, 18, { fixed: 0 }),
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
    getTracBalance(state) {
      return state.tracBalance;
    },
    getRewards(state) {
      return state.rewards;
    },
    getNetworkMetrics(state) {
      return state.networkMetrics;
    },
  },
};
