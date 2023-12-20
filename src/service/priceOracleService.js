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
      return await gnosisOracleService.get(ORACLE_GNOSIS_TESTNET_URL).then((data) => {
        return {
          low: {
            ...network.gasInfo.low,
            gasPrice: ethers.utils.parseUnits(data.average?.toString(), 'gwei'),
          },
          high: {
            ...network.gasInfo.high,
            gasPrice: ethers.utils.parseUnits(data.fast?.toString(), 'gwei'),
          },
        };
      });
    }
    case NETWORK_IDS.GNOSIS_MAINNET: {
      return await gnosisOracleService.get(ORACLE_GNOSIS_MAINNET_URL).then((data) => {
        return {
          low: {
            ...network.gasInfo.low,
            gasPrice: ethers.utils.parseUnits(data.average?.toString(), 'gwei'),
          },
          high: {
            ...network.gasInfo.high,
            gasPrice: ethers.utils.parseUnits(data.fast?.toString(), 'gwei'),
          },
        };
      });
    }
    default: {
      return network.gasInfo;
    }
  }
};
