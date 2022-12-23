export const networkList = [
  {
    label: 'OriginTrail DKG Mainnet',
    hubContract: '0x5fA7916c48Fe6D5F1738d12Ad234b78c90B4cAdA',
    chainId: `0x${Number('2043').toString(16)}`,
    rpc: 'https://astrosat-parachain-rpc.origin-trail.network/',
    bcNetworkName: 'OTP Parachain mainnet',
  },
  {
    label: 'OriginTrail DKG Testnet',
    hubContract: '0xBbfF7Ea6b2Addc1f38A0798329e12C08f03750A6',
    chainId: `0x${Number('20430').toString(16)}`,
    rpc: 'https://lofar-testnet.origin-trail.network/',
    bcNetworkName: 'OTP Parachain testnet',
  },
];
