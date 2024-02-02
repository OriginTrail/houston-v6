// testnet in Gwei

import {
  NETWORK_IDS,
  ORACLE_GNOSIS_MAINNET_URL,
  ORACLE_GNOSIS_TESTNET_URL,
} from '@/utils/constants';
import { gnosisOracleService } from '@/service/http';
import { ethers } from 'ethers';

export const getOracleGnosisGasPrice = async (network) => {
  switch (network.chainId) {
    case NETWORK_IDS.GNOSIS_TESTNET: {
      return await gnosisOracleService
        .get(ORACLE_GNOSIS_TESTNET_URL)
        .catch((err) => {
          console.warn(err);
          return {};
        })
        .then((data) => {
          return {
            low: {
              ...network.gasInfo.low,
              gasPrice: data.average
                ? ethers.utils.parseUnits(data.average?.toString(), 'gwei')
                : network.gasInfo.low.gasPrice,
            },
            high: {
              ...network.gasInfo.high,
              gasPrice: data.fast
                ? ethers.utils.parseUnits(data.fast?.toString(), 'gwei')
                : network.gasInfo.high.gasPrice,
            },
          };
        });
    }
    case NETWORK_IDS.GNOSIS_MAINNET: {
      return await gnosisOracleService
        .get(ORACLE_GNOSIS_MAINNET_URL)
        .catch((err) => {
          console.warn(err);
          return {};
        })
        .then((data) => {
          return {
            low: {
              ...network.gasInfo.low,
              gasPrice: data.average
                ? ethers.utils.parseUnits(data.average?.toString(), 'gwei')
                : network.gasInfo.low.gasPrice,
            },
            high: {
              ...network.gasInfo.high,
              gasPrice: data.fast
                ? ethers.utils.parseUnits(data.fast?.toString(), 'gwei')
                : network.gasInfo.high.gasPrice,
            },
          };
        });
    }
    default: {
      return network.gasInfo;
    }
  }
};
