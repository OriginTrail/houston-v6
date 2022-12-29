import Big from 'big.js';

export const getReadableTokenAmount = (amount, decimals, { fixed } = {}) => {
  if (!amount) return '';
  let parsedAmount = Big(amount).div(Math.pow(10, Number(decimals)));
  if (fixed || fixed === 0) {
    parsedAmount = parsedAmount.toFixed(fixed);
  }
  return parsedAmount.toString();
};

export const getAmountWithDecimals = (amount, decimals = 18) => {
  if (!amount) return '';
  return Big(amount).mul(Math.pow(10, decimals)).toString();
};
