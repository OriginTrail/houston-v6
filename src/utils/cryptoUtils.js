import { BigNumber, ethers } from 'ethers';

export const getReadableTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '';
  return ethers.utils.formatUnits(BigNumber.from(amount), decimals);
};

export const getAmountWithDecimals = (amount, decimals = 18) => {
  if (!amount) return '';
  return ethers.utils.parseUnits(amount, decimals);
};
