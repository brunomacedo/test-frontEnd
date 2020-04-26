export const formatCPF = _value => (
  _value
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^0-9]/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
);

export const validateCPF = (strCPF) => {
  const normalizeToString = strCPF.toString().replace(/[^\d]+/g, '');
  let sumNumbers = 0;
  let getLastTwoNumbers;

  const BLACKLIST = [
    '30030030030',
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];

  if (BLACKLIST.indexOf(normalizeToString) !== -1) return false;

  for (let i = 1; i <= 9; i += 1) {
    sumNumbers += parseInt(normalizeToString.substring(i - 1, i), 10) * (11 - i);
  }

  getLastTwoNumbers = (sumNumbers * 10) % 11;

  if ((getLastTwoNumbers === 10) || (getLastTwoNumbers === 11)) getLastTwoNumbers = 0;
  if (getLastTwoNumbers !== parseInt(normalizeToString.substring(9, 10), 10)) return false;
  sumNumbers = 0;

  for (let i = 1; i <= 10; i += 1) {
    sumNumbers += parseInt(normalizeToString.substring(i - 1, i), 10) * (12 - i);
  }

  getLastTwoNumbers = (sumNumbers * 10) % 11;

  if ((getLastTwoNumbers === 10) || (getLastTwoNumbers === 11)) getLastTwoNumbers = 0;
  if (getLastTwoNumbers !== parseInt(normalizeToString.substring(10, 11), 10)) return false;

  return true;
};

export const formatPhone = _value => (
  _value
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
);

export const validateEmail = strEmail => /\S+@\S+\.\S+/.test(strEmail);
