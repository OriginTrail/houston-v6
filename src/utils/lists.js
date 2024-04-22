import { ethers } from 'ethers';
export const FeatureVersions = {
  ASK_AND_STAKE_FEATURES: 'v1',
  OPERATOR_FEES_FEATURES: 'v2',
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
    bcNetworkName: 'OTP Parachain mainnet',
    subNetworks: [
      {
        label: 'OTP Parachain Mainnet',
        hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
        chainId: `0x${Number('2043').toString(16)}`,
        rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
        bcNetworkName: 'OTP Parachain mainnet',
        coinTicker: 'MOTP',
        gasInfo: otpGasPrices,
        featureList: [FeatureVersions.ASK_AND_STAKE_FEATURES],
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
    ],
  },
  {
    label: 'OriginTrail DKG Testnet',
    hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
    internalId: '2',
    rpc: 'https://lofar-testnet.origin-trail.network/',
    bcNetworkName: 'OTP Parachain testnet',
    subNetworks: [
      {
        label: 'OTP Parachain Testnet',
        hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
        chainId: `0x${Number('20430').toString(16)}`,
        rpc: 'https://lofar-testnet.origin-trail.network/',
        bcNetworkName: 'OTP Parachain testnet',
        coinTicker: 'MOTP',
        gasInfo: otpGasPrices,
        featureList: [FeatureVersions.ASK_AND_STAKE_FEATURES],
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
