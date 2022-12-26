/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
export const getAddressShortForm = (address, { rightHandLength, leftHandLength } = {}) => {
  let addrRegEx = new RegExp(
    `^([\\s\\S]{${leftHandLength ?? 8}})([\\s\\S]*?)([\\s\\S]{${rightHandLength ?? 4}})$`,
    'i',
  );
  let value = address?.match(addrRegEx);
  return value[1] + '...' + value[3];
};
