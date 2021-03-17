/* eslint no-console:0 */
'use strict';

const form = name => {
  const form = document.createElement('form');
  form.classList.add('ph');
  form.classList.add(name);

  return form;
};

export default form;
