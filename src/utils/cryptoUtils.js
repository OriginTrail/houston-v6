import Big from 'big.js';

export const getReadableTokenAmount = (amount, decimals, { fixed } = {}) => {
  if (!amount) return '';
  let parsedAmount = Big(amount).div(Math.pow(10, Number(decimals)));
  if (fixed || fixed === 0) {
    parsedAmount = parsedAmount.toFixed(fixed);
  }
  return parsedAmount.toString();
};
