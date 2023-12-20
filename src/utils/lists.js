export const networkList = [
  {
    label: 'OriginTrail DKG Mainnet',
    hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
    internalId: '1',
    rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
    bcNetworkName: 'OTP Parachain mainnet',
    contentAssetStorageContractAddress: '0x5cAC41237127F94c2D21dAe0b14bFeFa99880630',
    subNetworks: [
      {
        label: 'OTP Parachain Mainnet',
        hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
        chainId: `0x${Number('2043').toString(16)}`,
        rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
        bcNetworkName: 'OTP Parachain mainnet',
        contentAssetStorageContractAddress: '0x5cAC41237127F94c2D21dAe0b14bFeFa99880630',
        coinTicker: 'MOTP',
      },
      {
        label: 'Gnosis Mainnet',
        hubContract: '0xbEF14fc04F870c2dD65c13Df4faB6ba01A9c746b',
        chainId: `0x${Number('100').toString(16)}`,
        rpc: 'https://rpc.gnosis.gateway.fm',
        bcNetworkName: 'Gnosis Mainnet',
        contentAssetStorageContractAddress: '0x9157595f26F6069A7c29e988c4249bA98A53c697',
        coinTicker: 'xDai',
      },
    ],
  },
  {
    label: 'OriginTrail DKG Testnet',
    hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
    internalId: '2',
    rpc: 'https://lofar-testnet.origin-trail.network/',
    bcNetworkName: 'OTP Parachain testnet',
    contentAssetStorageContractAddress: '0x1A061136Ed9f5eD69395f18961a0a535EF4B3E5f',
    subNetworks: [
      {
        label: 'OTP Parachain Testnet',
        hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
        chainId: `0x${Number('20430').toString(16)}`,
        rpc: 'https://lofar-testnet.origin-trail.network/',
        bcNetworkName: 'OTP Parachain testnet',
        contentAssetStorageContractAddress: '0x1A061136Ed9f5eD69395f18961a0a535EF4B3E5f',
        coinTicker: 'MOTP',
      },
      {
        label: 'Gnosis Chiado Testnet',
        hubContract: '0xC06210312C9217A0EdF67453618F5eB96668679A',
        chainId: `0x${Number('10200').toString(16)}`,
        rpc: 'https://rpc.chiado.gnosis.gateway.fm',
        bcNetworkName: 'Gnosis Chiado testnet',
        contentAssetStorageContractAddress: '0xeA3423e02c8d231532dab1BCE5D034f3737B3638',
        coinTicker: 'xDai',
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
