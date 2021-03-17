/* eslint no-console:0 */
'use strict';

import script from './lib/script';

function A11y() {
  return (async () => {
    // All async code here
    this._runner = await this._init();
    console.log(this._runner);
    return this; // when done
  })();
}

A11y.prototype._init = function () {
  return new Promise(resolve => {
    const callback = function () {
      if (window.axe) {
        resolve(window.axe);
      }
    }.bind(this);

    script({
      id: 'a11y-script',
      src: 'https://unpkg.com/axe-core@4.1.3/axe.min.js',
      callback
    });
  });
};

A11y.prototype.test = async function (el) {
  return await this._runner.run(el);
};

export default A11y;
