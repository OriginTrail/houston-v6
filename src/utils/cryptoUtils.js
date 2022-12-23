import Big from 'big.js';

export const getReadableTokenAmount = (amount, decimals) => {
  return amount
    ? Big(amount)
        .div(Math.pow(10, Number(decimals)))
        .toString()
    : '';
};
