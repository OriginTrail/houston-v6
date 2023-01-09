export const networkList = [
  {
    label: 'OriginTrail DKG Mainnet',
    hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
    chainId: `0x${Number('2043').toString(16)}`,
    rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
    bcNetworkName: 'OTP Parachain mainnet',
    contentAssetStorageContractAddress: '0x5cAC41237127F94c2D21dAe0b14bFeFa99880630',
  },
  {
    label: 'OriginTrail DKG Testnet',
    hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
    chainId: `0x${Number('20430').toString(16)}`,
    rpc: 'https://lofar-testnet.origin-trail.network/',
    bcNetworkName: 'OTP Parachain testnet',
    contentAssetStorageContractAddress: '0x1A061136Ed9f5eD69395f18961a0a535EF4B3E5f',
  },
];

export const getTestingNetwork = () => {
  return process.env.NODE_ENV === 'test'
    ? [
        {
          label: process.env.VUE_APP_TEST_NETWORK_NAME,
          hubContract: process.env.VUE_APP_TEST_NETWORK_HUB_CONTRACT,
          chainId: process.env.VUE_APP_TEST_CHAIN_ID,
          rpc: process.env.VUE_APP_RPC_URL,
          bcNetworkName: process.env.VUE_APP_BC_NETWORK_NAME,
          contentAssetStorageContractAddress: process.env.VUE_APP_CONTENT_ASSET_STORAGE_ADDRESS,
        },
      ]
    : [];
};

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
