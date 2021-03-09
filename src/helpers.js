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
