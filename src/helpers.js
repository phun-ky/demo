export const rgb2hex = rgb => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  const hex = x => {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  };
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

export const debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// MIT © Sindre Sorhus
//https://www.npmjs.com/package/humanize-string
const handlePreserveConsecutiveUppercase = (decamelized, separator) => {
  // Lowercase all single uppercase characters. As we
  // want to preserve uppercase sequences, we cannot
  // simply lowercase the separated string at the end.
  // `data_For_USACounties` → `data_for_USACounties`
  decamelized = decamelized.replace(
    /((?<![\p{Uppercase_Letter}\d])[\p{Uppercase_Letter}\d](?![\p{Uppercase_Letter}\d]))/gu,
    $0 => {
      return $0.toLowerCase();
    }
  );

  // Remaining uppercase sequences will be separated from lowercase sequences.
  // `data_For_USACounties` → `data_for_USA_counties`
  return decamelized.replace(/(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu, (_, $1, $2) => {
    return $1 + separator + $2.toLowerCase();
  });
};

const decamelize = (text, { separator = '_', preserveConsecutiveUppercase = false } = {}) => {
  if (!(typeof text === 'string' && typeof separator === 'string')) {
    throw new TypeError('The `text` and `separator` arguments should be of type `string`');
  }

  // Checking the second character is done later on. Therefore process shorter strings here.
  if (text.length < 2) {
    return preserveConsecutiveUppercase ? text : text.toLowerCase();
  }

  const replacement = `$1${separator}$2`;

  // Split lowercase sequences followed by uppercase character.
  // `dataForUSACounties` → `data_For_USACounties`
  // `myURLstring → `my_URLstring`
  const decamelized = text.replace(/([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu, replacement);

  if (preserveConsecutiveUppercase) {
    return handlePreserveConsecutiveUppercase(decamelized, separator);
  }

  // Split multiple uppercase characters followed by one or more lowercase characters.
  // `my_URLstring` → `my_url_string`
  return decamelized
    .replace(/(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu, replacement)
    .toLowerCase();
};

export const humanizeString = input => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = decamelize(input);
  input = input
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  input = input.charAt(0).toUpperCase() + input.slice(1);

  return input;
};
