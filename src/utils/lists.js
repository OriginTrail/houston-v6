import { ethers } from 'ethers';
import { NETWORK_IDS } from '@/utils/constants';
export const FeatureVersions = {
  ASK_AND_STAKE_FEATURES: 'v1',
  OPERATOR_FEES_FEATURES: 'v2',
};

const BLOCKCHAIN_ICONS = {
  GNOSIS: '/images/icons/blockchains/gnosis.svg',
  NEURO: '/images/icons/blockchains/neuroweb.svg',
  BASE: '/images/icons/base-icon.png',
};

const otpGasPrices = {
  high: {
    gasPrice: 16,
    gasLimit: 500000,
  },
  low: {
    gasPrice: 8,
    gasLimit: 120000,
  },
};
const gnosisGasPrices = {
  high: {
    gasPrice: ethers.utils.parseUnits('2', 'gwei'),
    gasLimit: 2000000,
  },
  low: {
    gasPrice: ethers.utils.parseUnits('1.5', 'gwei'),
    gasLimit: 2000000,
  },
};

export const networkList = [
  {
    label: 'OriginTrail DKG Mainnet',
    hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
    internalId: '1',
    rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
    bcNetworkName: 'NeuroWeb mainnet',
    subNetworks: [
      {
        label: 'NeuroWeb Mainnet',
        hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
        chainId: `0x${Number('2043').toString(16)}`,
        rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
        bcNetworkName: 'NeuroWeb mainnet',
        coinTicker: 'NEURO',
        gasInfo: otpGasPrices,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
      {
        label: 'Gnosis Mainnet',
        hubContract: '0xbEF14fc04F870c2dD65c13Df4faB6ba01A9c746b',
        chainId: `0x${Number('100').toString(16)}`,
        rpc: 'https://rpc.gnosis.gateway.fm',
        bcNetworkName: 'Gnosis Mainnet',
        coinTicker: 'xDai',
        gasInfo: gnosisGasPrices,
        disabled: false,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
      {
        label: 'Base Mainnet',
        hubContract: '0xaBfcf2ad1718828E7D3ec20435b0d0b5EAfbDf2c',
        chainId: NETWORK_IDS.BASE_MAINNET,
        rpc: 'https://base.gateway.tenderly.co',
        bcNetworkName: 'Base Mainnet',
        coinTicker: 'ETH',
        coinIcon: BLOCKCHAIN_ICONS.BASE,
        disabled: false,
        gasInfo: gnosisGasPrices,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
    ],
  },
  {
    label: 'OriginTrail DKG Testnet',
    hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
    internalId: '2',
    rpc: 'https://lofar-testnet.origin-trail.network/',
    bcNetworkName: 'NeuroWeb testnet',
    subNetworks: [
      {
        label: 'NeuroWeb Testnet',
        hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
        chainId: `0x${Number('20430').toString(16)}`,
        rpc: 'https://lofar-testnet.origin-trail.network/',
        bcNetworkName: 'NeuroWeb testnet',
        coinTicker: 'NEURO',
        gasInfo: otpGasPrices,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
      {
        label: 'Gnosis Chiado Testnet',
        hubContract: '0xC06210312C9217A0EdF67453618F5eB96668679A',
        chainId: `0x${Number('10200').toString(16)}`,
        rpc: 'https://rpc.chiado.gnosis.gateway.fm',
        bcNetworkName: 'Gnosis Chiado testnet',
        coinTicker: 'xDai',
        gasInfo: gnosisGasPrices,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
      {
        label: 'Base Sepolia Testnet',
        hubContract: '0x144eDa5cbf8926327cb2cceef168A121F0E4A299',
        chainId: NETWORK_IDS.BASE_TESTNET,
        rpc: 'https://base-sepolia-rpc.publicnode.com',
        bcNetworkName: 'Base Sepolia Testnet',
        coinTicker: 'ETH',
        coinIcon: BLOCKCHAIN_ICONS.BASE,
        gasInfo: gnosisGasPrices,
        featureList: [
          FeatureVersions.ASK_AND_STAKE_FEATURES,
          FeatureVersions.OPERATOR_FEES_FEATURES,
        ],
      },
    ],
  },
];

export const purposeList = [
  {
    label: 'Admin key',
    value: 1,
  },
  {
    label: 'Operational key',
    value: 2,
  },
];
export const keyTypeList = [
  {
    label: 'ECDSA',
    value: 1,
  },
  {
    label: 'RSA',
    value: 2,
    disabled: true,
  },
];
