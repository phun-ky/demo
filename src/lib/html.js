/* eslint no-console:0 */
'use strict';
import { clear } from './node';

export const sanitize = html =>
  html
    .replace(/( data-textcontent=['"])([^'"]+['"])/, '')
    .replace(/( data-anatomy=['"])([^'"]+['"])/, '')
    .replace(/( data-speccer-measure=['"])([^'"]+['"])/, '')
    .replace(/( data-speccer-typography=['"])([^'"]+['"])/, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const prettify = str =>
  new Promise(resolve => {
    if (!window.prettier) {
      const beautifyScript = document.createElement('script');

      beautifyScript.onload = function () {
        const beautifyHTMLScript = document.createElement('script');
        beautifyHTMLScript.onload = function () {
          resolve(window.prettier.format(str, { parser: 'html', plugins: window.prettierPlugins }));
        };
        beautifyHTMLScript.src = 'https://unpkg.com/prettier@2.2.1/parser-html.js';
        document.head.appendChild(beautifyHTMLScript);
      };

      beautifyScript.src = 'https://unpkg.com/prettier@2.2.1/standalone.js';

      document.head.appendChild(beautifyScript);
    } else {
      resolve(window.prettier.format(str, { parser: 'html', plugins: window.prettierPlugins }));
    }
  });

export const prism = () => {
  if (!window.Prism) {
    const link = document.createElement('link');

    // set properties of link tag
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism-solarizedlight.min.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';

    // append link element to html
    document.body.appendChild(link);
    const script = document.createElement('script');
    script.onload = function () {
      window.Prism.highlightAll();
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/prism.min.js';

    document.head.appendChild(script);
  } else {
    window.Prism.highlightAll();
  }
};

const html = async (target_el, source_el) => {
  if (!target_el || !source_el) return;
  const _html = clear(target_el);

  const code = await prettify(source_el.innerHTML);

  if (!code || (code && code.length === '')) return;

  const preTag = document.createElement('pre');
  preTag.classList.add('language-html');

  const codeTag = document.createElement('code');
  codeTag.innerHTML = sanitize(code);

  preTag.appendChild(codeTag);
  _html.appendChild(preTag);
  prism();
  return _html;
};

export default html;
