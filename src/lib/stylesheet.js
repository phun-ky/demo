/* eslint no-console:0 */
'use strict';

import { uniqueID } from './helpers';

const stylesheet = ({ href, id, type, rel = 'stylesheet' }) => {
  if (id && id !== '') {
    const existingStylsheet = document.getElementById(id);
    if (existingStylsheet) return;
  }

  if (!href || (href && href === '')) return;

  const link = document.createElement('link');
  // set properties of link tag
  link.href = href;
  link.rel = rel;
  if (type) {
    link.type = type;
  }
  link.id = uniqueID();
  document.body.appendChild(link);
};

export default stylesheet;
