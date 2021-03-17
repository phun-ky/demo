/* eslint no-console:0 */
'use strict';

export const set = (el, markup, position) => {
  if (!el) return;
  if (!markup || (markup && markup.length === 0)) return;
  if (el.innerHTML.indexOf(markup) === -1) {
    el.setAttribute('data-textContent', el.textContent);
    if (position === 'before') {
      el.innerHTML = markup + el.textContent;
    } else {
      el.innerHTML = el.textContent + markup;
    }
  }
};

export const remove = (el, markup) => {
  if (!el) return;
  if (!markup || (markup && markup.length === 0)) return;
  if (el.innerHTML.indexOf(markup) !== -1) {
    el.innerHTML = '';
    el.textContent = el.getAttribute('data-textContent');
  }
};

export const toggle = (el, markup, position) => {
  if (!el) return;
  if (!markup || (markup && markup.length === 0)) return;
  if (el.innerHTML.indexOf(markup) === -1) {
    el.setAttribute('data-textContent', el.textContent);
    if (position === 'before') {
      el.innerHTML = markup + el.textContent;
    } else {
      el.innerHTML = el.textContent + markup;
    }
  } else {
    el.innerHTML = '';
    el.textContent = el.getAttribute('data-textContent');
  }
};
