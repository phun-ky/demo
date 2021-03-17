/* eslint no-console:0 */
'use strict';

export const toggle = (el, name, cb) => {
  el.removeEventListener(name, cb);
  el.addEventListener(name, cb);
};

export const remove = (el, name, cb) => {
  el.removeEventListener(name, cb);
};

export const add = (el, name, cb) => {
  el.addEventListener(name, cb);
};
