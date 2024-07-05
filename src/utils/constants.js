export const ADMIN_KEY_PURPOSE = 1;
/*export const ORACLE_GNOSIS_MAINNET_URL =
  'https://api.gnosisscan.io/api?module=proxy&action=eth_gasPrice';*/
export const ORACLE_GNOSIS_MAINNET_URL =
  'https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle';
export const ORACLE_GNOSIS_TESTNET_URL =
  'https://gnosis-chiado.blockscout.com/api/v1/gas-price-oracle';

export const NETWORK_IDS = {
  GNOSIS_MAINNET: `0x${Number('100').toString(16)}`,
  GNOSIS_TESTNET: `0x${Number('10200').toString(16)}`,
  OTP_TESTNET: `0x${Number('20430').toString(16)}`,
  OTP_MAINNET: `0x${Number('2043').toString(16)}`,
  BASE_MAINNET: `0x${Number('8453').toString(16)}`,
  BASE_TESTNET: `0x${Number('84532').toString(16)}`,
};
