/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
export const getAddressShortForm = (address, { rightHandLength, leftHandLength } = {}) => {
  if (!address) return '';
  let addrRegEx = new RegExp(
    `^([\\s\\S]{${leftHandLength ?? 8}})([\\s\\S]*?)([\\s\\S]{${rightHandLength ?? 4}})$`,
    'i',
  );
  let value = address?.match(addrRegEx);
  return value[1] + '...' + value[3];
};

export const formatNumberWithSpaces = (input) => {
  return (input && !isNaN(Number(input))) || input === 0
    ? Number(input).toLocaleString('en').replace(/,/g, ' ')
    : '';
};

export const formatNumbersToShort = (input) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
    .format(Number(input))
    .replace(/,/g, ' ');
};
