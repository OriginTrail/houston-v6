import metamask from '@/service/metamask';
import * as _ from 'lodash';
import { getReadableTokenAmount } from '@/utils/cryptoUtils';
import { FeatureVersions } from '@/utils/lists';

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
    operatorInfo: {
      requestTime: 0,
      currentFee: 0,
      latestFee: 0,
      accumulatedFee: 0,
      accumulatedFeeRequestTime: 0,
      accumulatedFeeWithdrawalAmount: 0,
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
              'stake.pendingWithdrawal': parseFloat(
                getReadableTokenAmount(data, 18, { fixed: 12 }),
              ),
            });
          }),
        metamask.contractService
          .getSharesContractInfo(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              nodeShareTokens: {
                ...data,
                totalSupply: getReadableTokenAmount(data.totalSupply, 18),
                myBalance: getReadableTokenAmount(data.myBalance, 18),
              },
            });
          }),
        metamask.contractService
          .getLastWithdrawalTimestamp(identity, store.getters.connectedAddress)
          .then((data) => {
            store.commit('SAVE_METRICS', {
              'withdrawal.requestTime': data,
            });
          }),
        ...(store.getters.selectedNetwork.featureList.includes(
          FeatureVersions.OPERATOR_FEES_FEATURES,
        )
          ? [
              metamask.contractService.getLastOperatorFeeChangeTimestamp(identity).then((data) => {
                store.commit('SAVE_METRICS', {
                  'operatorInfo.requestTime': data,
                });
              }),
              metamask.contractService
                .getOperatorFee(identity, store.getters.connectedAddress)
                .then((data) => {
                  store.commit('SAVE_METRICS', {
                    'operatorInfo.currentFee': data,
                  });
                }),
              metamask.contractService
                .getLatestOperatorFeePercentage(identity, store.getters.connectedAddress)
                .then((data) => {
                  store.commit('SAVE_METRICS', {
                    'operatorInfo.latestFee': data,
                  });
                }),
              metamask.contractService
                .getAccumulatedOperatorFee(identity, store.getters.connectedAddress)
                .then((data) => {
                  store.commit('SAVE_METRICS', {
                    'operatorInfo.accumulatedFee': getReadableTokenAmount(data),
                  });
                }),
              metamask.contractService
                .getAccumulatedOperatorFeeWithdrawalTimestamp(
                  identity,
                  store.getters.connectedAddress,
                )
                .then((data) => {
                  store.commit('SAVE_METRICS', {
                    'operatorInfo.accumulatedFeeRequestTime': data,
                  });
                }),
              metamask.contractService
                .getAccumulatedOperatorFeeWithdrawalAmount(identity, store.getters.connectedAddress)
                .then((data) => {
                  store.commit('SAVE_METRICS', {
                    'operatorInfo.accumulatedFeeWithdrawalAmount': getReadableTokenAmount(data),
                  });
                }),
            ]
          : []),
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
    getOperationalInfo(state) {
      return state.operatorInfo;
    },
  },
};
