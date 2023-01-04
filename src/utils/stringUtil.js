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
    ? Number(input).toLocaleString('en', { maximumFractionDigits: 3 }).replace(/,/g, ' ')
    : '';
};

export const formatNumberWithSpacesWithNoPrecision = (input) => {
  return (input && !isNaN(Number(input))) || input === 0
    ? !Number.isInteger(Number(input))
      ? `${Intl.NumberFormat('en-US').format(parseInt(input)).replace(/,/g, ' ')}.${
          (Number(input) % 1).toString().split('.')[1]
        }`
      : Intl.NumberFormat('en-US').format(Number(input)).replace(/,/g, ' ')
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
