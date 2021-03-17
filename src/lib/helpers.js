export const rgb2hex = rgb => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  const hex = x => {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  };
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

export const isArrayUsable = arr => arr && Array.isArray(arr) && arr.length !== 0;

// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.
export const uniqueID = () => '_' + Math.random().toString(36).substr(2, 9);

export const groupBy = (list, key) =>
  [...list].reduce((acc, x) => {
    const group = x[key];
    if (!acc[group]) {
      return {
        ...acc,
        [group]: [x]
      };
    }
    return {
      ...acc,
      [group]: [...acc[group], x]
    };
  }, {});
