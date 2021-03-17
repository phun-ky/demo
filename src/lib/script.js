/* eslint no-console:0 */
'use strict';

import { uniqueID } from './helpers';

const script = ({ src, callback, id, attrs }) => {
  if (id && id !== '') {
    const existingScript = document.getElementById(id);
    if (existingScript && callback) {
      callback();
      return;
    }
  }

  if (!src || (src && src === '')) return;

  const script = document.createElement('script');
  script.src = src;
  script.id = id || uniqueID();

  if (attrs) {
    Object.keys(attrs).forEach(key => script.setAttribute(key, attrs[key]));
  }
  document.body.appendChild(script);

  script.onload = () => {
    if (callback) callback();
  };
};

export default script;
