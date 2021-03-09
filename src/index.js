/* eslint no-console: 0 */

'use strict';

console.clear();

const rgb2hex = rgb => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  const hex = x => {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  };
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

const debounce = function (func, wait, immediate) {
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

const settingsMenuInit = () => {
  const settingsMenuTriggers = document.querySelectorAll('.ph.js-settings-menu');

  const removePreviouslySelectedMenuItem = el => {
    const selected = el.querySelectorAll('.is-focused');
    selected.forEach(li => {
      li.classList.remove('is-focused');
      li.setAttribute('aria-selected', false);
    });
  };

  settingsMenuTriggers.forEach(settingsMenuTrigger => {
    const adjustMenuPlacement = debounce(function () {
      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenu = settingsMenuHolder.querySelector('.ph.menu');
      const settingsMenuTriggerRect = settingsMenuTrigger.getBoundingClientRect();
      const settingsMenuHolderRect = settingsMenuHolder.getBoundingClientRect();
      settingsMenu.style.top =
        settingsMenuHolderRect.top - settingsMenuTriggerRect.top + settingsMenuTriggerRect.height + 'px';
    }, 300);

    adjustMenuPlacement();

    const handleClickOutsideOverflowMenu = e => {
      if (e.target == settingsMenuTrigger) return;

      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenu = settingsMenuHolder.querySelector('.ph.menu');
      const settingsMenuList = settingsMenuHolder.querySelector('.ph.menu > ul.ph');

      if (settingsMenu.classList.contains('is-open')) {
        if (!settingsMenuList.contains(e.target)) {
          closeMenu();
        }
      }
    };
    const closeMenu = () => {
      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenu = settingsMenuHolder.querySelector('.ph.menu');
      const settingsMenuList = settingsMenuHolder.querySelector('.ph.menu > ul.ph');
      resetIndexOfOptions();
      removePreviouslySelectedMenuItem(settingsMenuList);
      settingsMenu.classList.remove('is-open');
      settingsMenuList.classList.remove('is-open');
      settingsMenuTrigger.setAttribute('aria-expanded', false);
      window.removeEventListener('resize', adjustMenuPlacement);
      document.removeEventListener('click', handleClickOutsideOverflowMenu);
    };

    const openMenu = () => {
      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenu = settingsMenuHolder.querySelector('.ph.menu');
      const settingsMenuList = settingsMenuHolder.querySelector('.ph.menu > ul.ph');
      updateAllOptions(settingsMenuList.querySelectorAll('li:not(.separator)'));
      settingsMenu.classList.add('is-open');
      settingsMenuList.classList.add('is-open');
      settingsMenuTrigger.setAttribute('aria-expanded', true);
      document.removeEventListener('click', handleClickOutsideOverflowMenu);
      document.addEventListener('click', handleClickOutsideOverflowMenu);
      window.removeEventListener('resize', adjustMenuPlacement);
      window.addEventListener('resize', adjustMenuPlacement);
    };
    const handleOverflowMenuClick = e => {
      const settingsMenuTrigger = e.target;
      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenu = settingsMenuHolder.querySelector('.ph.menu');

      if (settingsMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    const updateAllOptions = nodes => {
      allOptions = Array.prototype.slice.call(nodes).filter(node => !node.querySelector('[disabled]'));
    };
    const resetIndexOfOptions = () => {
      indexOfOptions = 0;
    };
    let indexOfOptions = 0;
    let allOptions = null;

    const handleOverflowMenuKeypress = e => {
      const settingsMenuTrigger = e.target;
      const settingsMenuHolder = settingsMenuTrigger.parentElement;
      const settingsMenuList = settingsMenuHolder.querySelector('.ph.menu > ul.ph');

      if (e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();

        const selected = settingsMenuList.querySelector('li.is-focused');
        if (settingsMenuList.classList.contains('is-open') && selected) {
          resetIndexOfOptions();
          closeMenu();
        }
        return false;
      }

      if (settingsMenuList.classList.contains('is-open')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          return false;
        }

        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
          let nextElement;
          e.preventDefault();
          if (e.key == 'ArrowUp') {
            nextElement = allOptions[--indexOfOptions];
            if (!nextElement) {
              indexOfOptions = allOptions.length - 1;
              nextElement = allOptions[indexOfOptions];
            }

            removePreviouslySelectedMenuItem(settingsMenuList);
            nextElement.classList.add('is-focused');
            nextElement.setAttribute('aria-selected', true);
          } else if (e.key == 'ArrowDown') {
            nextElement = allOptions[++indexOfOptions];
            if (!nextElement) {
              indexOfOptions = 0;
              nextElement = allOptions[indexOfOptions];
            }
            removePreviouslySelectedMenuItem(settingsMenuList);
            nextElement.classList.add('is-focused');
            nextElement.setAttribute('aria-selected', true);
          }
        }
      }
    };

    settingsMenuTrigger.removeEventListener('click', handleOverflowMenuClick);
    settingsMenuTrigger.removeEventListener('keyup', handleOverflowMenuKeypress);
    settingsMenuTrigger.addEventListener('click', handleOverflowMenuClick);
    settingsMenuTrigger.addEventListener('keyup', handleOverflowMenuKeypress);
  });
};

// MIT © Sindre Sorhus
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

const humanizeString = input => {
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

/***

MIT License

Copyright (c) 2018 Alexander Vassbotn Røyne-Helgesen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


**/

document.querySelector('html').classList.add('ph');
document.querySelector('body').classList.add('ph');
//
// const TEST_CONFIG = {
//   preset: true,
//   ui: false,
//   position: 'center',
//   name: 'Button',
//   // Markup could be a file or a raw markup string
//   markup: '<button type="button" class="if button">Sjekk din pris</button>',
//   backgrounds: [
//     {
//       name: 'BE 5',
//       color: '#faf9f7'
//     }
//   ],
//   variants: [
//     {
//       name: 'Primary button',
//       classNames: 'primary'
//     }
//   ]
// };

const TEST_CONFIG = {
  position: 'center',
  name: 'Button',
  html: true,
  label: 'Click me',
  css: 'https://if-vid-brand-cdn.azureedge.net/ifdesignsystem.min.css',
  js: 'https://unpkg.com/what-input@5.2.10/dist/what-input.js',
  // Markup could be a file or a raw markup string
  markup: '<button type="button" class="if button"></button>',
  backgrounds: [
    {
      name: 'BE 5',
      color: '#faf9f7'
    },
    {
      name: 'BE 4',
      color: '#f6f3f0'
    },
    {
      name: 'BE 3',
      color: '#f1ece8'
    },
    {
      name: 'BE 2',
      color: '#ede6e1'
    },
    {
      name: 'BE 1',
      color: '#e8e0d9'
    }
  ],
  variants: [
    {
      name: 'Primary button',
      classNames: 'primary',
      modifiers: [
        {
          name: 'Large',
          classNames: 'large',
          group: 'size'
        },
        {
          name: 'With icon left',
          markup: '<span aria-hidden="true" class="if icon ui trashcan white"></span>',
          position: 'before',
          group: 'markup'
        },
        {
          name: 'With icon right',
          markup:
            '<span aria-hidden="true" class="if icon ui arrow-right white" style="margin-right: 0;margin-left: 16px;"></span>',
          position: 'after',
          group: 'markup'
        }
      ]
    },
    {
      name: 'Secondary button',
      classNames: 'secondary',
      modifiers: [
        {
          name: 'With icon',
          markup: '<span aria-hidden="true" class="if icon ui trashcan blue"></span>',
          position: 'before',
          group: 'markup'
        }
      ]
    },
    {
      name: 'Tertiary button',
      classNames: 'tertiary',
      modifiers: [
        {
          name: 'With icon',
          markup: '<span aria-hidden="true" class="if icon ui trashcan blue"></span>',
          position: 'before',
          group: 'markup'
        }
      ]
    },
    {
      name: 'Info button',
      classNames: 'info',
      modifiers: [
        {
          name: 'With icon',
          markup: '<span aria-hidden="true" class="if icon ui trashcan white"></span>',
          position: 'before',
          group: 'markup'
        }
      ]
    }
  ],
  states: [
    {
      name: 'Disabled',
      attributes: {
        disabled: 'disabled'
      }
    }
  ],
  interactions: [
    {
      name: 'Hovered',
      classNames: 'is-hovered'
    },
    {
      name: 'Focused',
      classNames: 'is-focused',
      previewAttributes: {
        'data-whatinput': 'keyboard'
      }
    },
    {
      name: 'Active',
      classNames: 'is-active'
    }
  ]
};
// const TEST_CONFIG = {
//   position: 'center',
//   name: 'Avatar',
//   // Markup could be a file or a raw markup string
//   markup: '<span class="if avatar"></span>',
//   backgrounds: [
//     {
//       name: 'BE 5',
//       color: '#faf9f7'
//     },
//     {
//       name: 'BE 4',
//       color: '#f6f3f0'
//     },
//     {
//       name: 'BE 3',
//       color: '#f1ece8'
//     },
//     {
//       name: 'BE 2',
//       color: '#ede6e1'
//     },
//     {
//       name: 'BE 1',
//       color: '#e8e0d9'
//     }
//   ],
//   variants: [
//     {
//       name: 'Default',
//       classNames: 'default'
//     },
//     {
//       name: 'Image',
//       classNames: 'noop',
//       styles: [
//         {
//           key: 'backgroundImage',
//           value: 'url(https://thispersondoesnotexist.com/image)'
//         }
//       ]
//     },
//     {
//       name: 'Initials',
//       attributes: [
//         {
//           key: 'data-initials',
//           value: 'AVR'
//         }
//       ],
//       modifiers: [
//         { name: 'Default', classNames: 'noop', group: 'color' },
//         { name: 'darkRed', classNames: 'darkRed', group: 'color' },
//         { name: 'red', classNames: 'red', group: 'color' },
//         { name: 'lightRed', classNames: 'lightRed', group: 'color' },
//         { name: 'darkYellow', classNames: 'darkYellow', group: 'color' },
//         { name: 'yellow', classNames: 'yellow', group: 'color' },
//         { name: 'lightYellow', classNames: 'lightYellow', group: 'color' },
//         { name: 'darkGreen', classNames: 'darkGreen', group: 'color' },
//         { name: 'green', classNames: 'green', group: 'color' },
//         { name: 'lightGreen', classNames: 'lightGreen', group: 'color' },
//         { name: 'darkBlue', classNames: 'darkBlue', group: 'color' },
//         { name: 'blue', classNames: 'blue', group: 'color' },
//         { name: 'lightBlue', classNames: 'lightBlue', group: 'color' }
//       ]
//     }
//   ],
//   modifiers: [
//     {
//       name: 'Default',
//       classNames: 'noop',
//       group: 'size'
//     },
//     {
//       name: 'Small',
//       classNames: 'small',
//       group: 'size'
//     },
//     {
//       name: 'Large',
//       classNames: 'large',
//       group: 'size'
//     },
//     {
//       name: 'Larger',
//       classNames: 'larger',
//       group: 'size'
//     },
//     {
//       name: 'Largest',
//       classNames: 'largest',
//       group: 'size'
//     }
//   ]
// };

const setDefaultOpts = opts => {
  let defaultOpts = {
    position: 'center',
    preset: false,
    ui: true,
    variants: [],
    modifiers: [],
    backgrounds: [],
    interactions: []
  };
  opts.modifiers =
    opts.modifiers && opts.modifiers.length !== 0
      ? opts.modifiers.map(mod => (mod.group && mod.group !== '' ? mod : { ...mod, ...{ group: 'global' } }))
      : [];

  opts.variants = opts.variants.map(variant => {
    if (variant.modifiers) {
      variant.modifiers = variant.modifiers.map(mod =>
        mod.group && mod.group !== '' ? mod : { ...mod, ...{ group: `${variant.name.replace(/\s/g, '-')}-modifiers` } }
      );
    }
    return variant;
  });

  return { ...defaultOpts, ...opts };
};

const getInteraction = (opts, interaction) => opts.interactions.find(i => i.name == interaction);
const getState = (opts, state) => opts.states.find(i => i.name == state);
const getModifier = (modifiers, modifier) => modifiers.find(i => i.name == modifier);
const getVariant = (opts, variant) => opts.variants.find(i => i.name == variant);

const demo = document.querySelector('.demo');

const clear = el => {
  const cNode = el.cloneNode(false);
  el.parentNode.replaceChild(cNode, el);
  return cNode;
};

const getDefaultClassNames = opts => {
  const { variants } = opts;
  if (isArrayUsable(variants)) {
    return variants[0].classNames;
  }
  return '';
};

const setDefaultClassNames = (component, opts) => {
  const cls = getDefaultClassNames(opts);
  setClassNames(component, cls);
};

const setClassNames = (component, classNames) => {
  if (!component) return;
  if (!classNames || (classNames && classNames.length === 0)) return;
  classNames.split(' ').forEach(cl => component.classList.add(cl));
};

const setAttributes = (component, attrs) => {
  if (!component) return;
  if (!attrs || (attrs && attrs.length === 0)) return;
  Object.keys(attrs).forEach(key => component.setAttribute(key, attrs[key]));
};

const setPreviewAttributes = (component, attrs) => {
  if (!component) return;
  if (!attrs || (attrs && attrs.length === 0)) return;
  const preview = component.closest('.ph.preview');
  Object.keys(attrs).forEach(key => preview.setAttribute(key, attrs[key]));
};

const getDefaultModifier = opts => {
  const { modifiers } = opts;
  if (isArrayUsable(modifiers)) {
    return modifiers[0];
  }
  return '';
};

const isArrayUsable = arr => arr && Array.isArray(arr) && arr.length !== 0;

// @todo set defaults when preset is used
const setDefaultModifier = (component, opts) => {
  const modifier = getDefaultModifier(opts);
  setClassNames(component, modifier.classNames);
};

const getDefaultInteraction = opts => {
  const { interactions } = opts;
  if (isArrayUsable(interactions)) {
    return interactions[0].classNames;
  }
  return '';
};

const getDefaultInteractionPreviewAttributes = opts => {
  const { interactions } = opts;
  if (isArrayUsable(interactions)) {
    return interactions[0].previewAttributes;
  }
  return '';
};

const setDefaultInteraction = (component, opts) => {
  const cls = getDefaultInteraction(opts);
  const previewAttrs = getDefaultInteractionPreviewAttributes(opts);
  setClassNames(component, cls);
  setPreviewAttributes(component, previewAttrs);
};

const getDefaultStateClassNames = opts => {
  const { states } = opts;
  if (isArrayUsable(states)) {
    return states[0].classNames;
  }
  return '';
};

const getDefaultStateAttrs = opts => {
  const { states } = opts;
  if (isArrayUsable(states)) {
    return states[0].attributes;
  }
  return '';
};
const setDefaultState = (component, opts) => {
  const cls = getDefaultStateClassNames(opts);
  const attrs = getDefaultStateAttrs(opts);
  setClassNames(component, cls);
  setAttributes(component, attrs);
};

const setDefaultLabel = (component, opts) => {
  const { label } = opts;
  if (label && label.length !== 0 && label !== '') {
    component.textContent = label;
  }
};

const setDefaultBackground = (component, opts) => {
  if (!component) return;
  const preview = component.closest('.ph.preview');
  if (!preview) return;
  const { backgrounds } = opts;
  if (isArrayUsable(backgrounds)) {
    preview.style.backgroundColor = backgrounds[0].color;
  }
};

const setPresetDefaults = (component, opts) => {
  setDefaultBackground(component, opts);
  setDefaultClassNames(component, opts);
  setDefaultModifier(component, opts);
  setDefaultInteraction(component, opts);
  setDefaultState(component, opts);
  setDefaultLabel(component, opts);
};
const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

const removeInteraction = (el, component, opts) => {
  const currentInteraction = el.getAttribute('data-interaction');
  const interaction = getInteraction(opts, currentInteraction);
  if (interaction['classNames']) {
    interaction['classNames'].split(' ').forEach(cl => component.classList.remove(cl));
  }
  if (interaction['previewAttributes']) {
    const preview = component.closest('.ph.preview');
    Object.keys(interaction['previewAttributes']).forEach(pA => {
      preview.removeAttribute(pA);
    });
  }
};

const initStateOnChange = (input, component, opts) => {
  input.addEventListener('change', e => {
    const chosenState = e.target.getAttribute('data-state');
    const state = getState(opts, chosenState);
    if (state['classNames']) {
      state['classNames'].split(' ').forEach(cl => component.classList.toggle(cl));
    }
    if (state['attributes']) {
      Object.keys(state['attributes']).forEach(a => {
        if (component.getAttribute(a) === state['attributes'][a]) {
          component.removeAttribute(a);
          if (a === 'disabled') {
            input
              .closest('.ph.configuration')
              .querySelector('.interactions')
              .querySelectorAll('input[type=checkbox]')
              .forEach(el => el.removeAttribute('disabled'));
          }
        } else {
          component.setAttribute(a, state['attributes'][a]);
          input
            .closest('.ph.configuration')
            .querySelector('.interactions')
            .querySelectorAll('input[type=checkbox]')
            .forEach(el => {
              el.setAttribute('disabled', 'disabled');
              removeInteraction(el, component, opts);
              el.checked = false;
            });
        }
      });
    }
    if (state['previewAttributes']) {
      const preview = component.closest('.ph.preview');
      Object.keys(state['previewAttributes']).forEach(pA => {
        if (preview.getAttribute(pA) === state['previewAttributes'][pA]) {
          preview.removeAttribute(pA);
        } else {
          preview.setAttribute(pA, state['previewAttributes'][pA]);
        }
      });
    }
    updateHTML();
  });
};

const initInteractionOnChange = (input, component, opts) => {
  input.addEventListener('change', e => {
    const chosenInteraction = e.target.getAttribute('data-interaction');
    const interaction = getInteraction(opts, chosenInteraction);
    if (interaction['classNames']) {
      interaction['classNames'].split(' ').forEach(cl => component.classList.toggle(cl));
    }
    if (interaction['attributes']) {
      Object.keys(interaction['attributes']).forEach(a => {
        if (component.getAttribute(a) === interaction['attributes'][a]) {
          component.removeAttribute(a);
        } else {
          component.setAttribute(a, interaction['attributes'][a]);
        }
      });
    }
    if (interaction['previewAttributes']) {
      const preview = component.closest('.ph.preview');
      Object.keys(interaction['previewAttributes']).forEach(pA => {
        if (preview.getAttribute(pA) === interaction['previewAttributes'][pA]) {
          preview.removeAttribute(pA);
        } else {
          preview.setAttribute(pA, interaction['previewAttributes'][pA]);
        }
      });
    }
  });
};

const removeVariantAttributes = (variant, opts, component) => {
  const removeTheseAttributes = opts.variants.reduce((result, variant) => {
    if (variant.attributes && Array.isArray(variant.attributes) && variant.attributes.length !== 0) {
      const a = variant.attributes.map(v => {
        ////console.log(v.key);
        return v.key;
      });

      a.forEach(b => result.push(b));
    }
    return result;
  }, []);
  //console.log(removeTheseAttributes);
  removeTheseAttributes.forEach(key => component.removeAttribute(key));
};
const removeVariantStyles = (variant, opts, component) => {
  const removeTheseStyles = opts.variants.reduce((result, variant) => {
    if (variant.styles && Array.isArray(variant.styles) && variant.styles.length !== 0) {
      const a = variant.styles.map(v => {
        //console.log(v.key);
        return v.key;
      });

      a.forEach(b => result.push(b));
    }
    return result;
  }, []);
  //console.log(removeTheseStyles);
  removeTheseStyles.forEach(key => (component.style[key] = ''));
};
const addVariantStyles = (variant, component) => {
  if (variant['styles']) {
    variant['styles'].forEach(style => (component.style[style.key] = style.value));
  }
};
const addVariantAttributes = (variant, component) => {
  if (variant['attributes']) {
    variant['attributes'].forEach(({ key, value }) => component.setAttribute(key, value));
  }
};
const removeClassNamesFromComponent = (component, cls) =>
  cls.forEach(cl => cl.split(' ').forEach(cl => component.classList.remove(cl)));

const removeVariantClassNames = (opts, component) => {
  const removeTheseClasses = opts.variants.filter(e => e.classNames).map(e => e.classNames);
  removeClassNamesFromComponent(component, removeTheseClasses);
  const removeTheseModifiers = opts.variants
    .filter(e => {
      if (e.modifiers && e.modifiers.length !== 0) return e.modifiers;
    })
    .reduce((result, e) => {
      e.modifiers.forEach(m => {
        result.push(m);
      });
      return result;
    }, []);

  if (removeTheseModifiers && removeTheseModifiers.length !== 0) {
    const groups = groupBy(removeTheseModifiers, 'group');
    Object.keys(groups).forEach(groupName => {
      const modifierGroup = document.querySelector(`.configuration form.modifiers .${groupName}`);
      if (modifierGroup) modifierGroup.remove();
      groups[groupName].forEach(modifier => {
        if (modifier.classNames) {
          modifier.classNames.split(' ').forEach(cl => {
            if (cl !== 'noop' && component.classList.contains(cl)) {
              console.info(`Removing class \`${cl}\` modifier \`${modifier.name}\` from current variant\``);
              component.classList.remove(cl);
            }
          });
        } else if (modifier.markup) {
          if (component.innerHTML.indexOf(modifier.markup) !== -1) {
            component.innerHTML = '';
            component.textContent = component.getAttribute('data-textContent');
          }
        } else {
          console.info(`No classNames found for modifier \`${modifier.name}\``);
        }
      });
    });

    updateHTML();
  }
};

const addVariantClassNames = (variant, component, opts) => {
  const modifierForm = component.closest('.demo').querySelector('form.modifiers');
  setClassNames(component, variant.classNames);
  if (variant.modifiers) {
    const cmOpts = {
      form: modifierForm,
      modifiers: variant.modifiers,
      component,
      opts,
      variant
    };
    createModifiers(cmOpts);
  } else {
    if (opts.modifiers) {
      if (opts.variants) {
        opts.variants.forEach(variant => {
          //console.log(variant);
          if (variant.modifiers) {
            //console.log('got variant modifiers in variant', variant.modifiers);
            variant.modifiers.forEach(mod => {
              const modEl = document.querySelector(
                `input[data-modifier="${mod.name}"][data-modifier-group="${mod.group}"]`
              );
              if (modEl) {
                console.log(
                  `Removing modifier ${mod.name}, el: input[data-modifier="${mod.name}"][data-modifier-group="${mod.group}"]`
                );
                const modElId = modEl.getAttribute('id');
                const labelForModEl = document.querySelector(`label[for="${modElId}"]`);

                modEl.remove();
                labelForModEl.remove();
              }
            });
          }
        });
      }
    }
  }
};
//
// const initVariantOnChange2 = ({ component, opts, variant }) => e => {
//   const chosenModifier = e.target.value;
//   console.log('[modifierOnSelectChangeFactory]:', { modifier: false, variant, opts, chosenModifier });
//   const modifier = getCurrentModifier({ modifier: false, variant, opts, chosenModifier });
//   const group = getCurrentGroup({ modifier: chosenModifier, modifiers: variant ? variant.modifiers : opts.modifiers });
//   const groups = variant ? getGroups(variant.modifiers) : getGroups(opts.modifiers);
//   // If the modifier change is from a variant,
//   // only remove the modifier for the relevant variant group
//   if (variant) {
//     console.log('********************************');
//     console.log('********************************');
//     console.log({ group, groups, modifier });
//     console.log('********************************');
//     console.log('********************************');
//     console.log('********************************');
//     if (modifier.classNames) {
//       toggleModifierClassNames({ modifier, groups, group, component, variantName: variant.name });
//     }
//   } else {
//     toggleModifierClassNames({ modifier, groups, group, component });
//     toggleModifierAttributes({ modifier, component });
//     toggleModifierPreviewAttributes({ modifier, component });
//   }
// };
const initVariantOnChange = (select, component, opts) => {
  select.addEventListener('change', e => {
    const chosenVariant = e.target.value;
    const variant = getVariant(opts, chosenVariant);

    removeVariantStyles(variant, opts, component);
    removeVariantAttributes(variant, opts, component);
    removeVariantClassNames(opts, component);
    addVariantStyles(variant, component);
    addVariantAttributes(variant, component);
    addVariantClassNames(variant, component, opts);
    updateHTML();
  });
};

const getCurrentModifier = ({ modifier, variant, opts, chosenModifier }) => {
  if (modifier) {
    return modifier;
  }
  if (variant) {
    console.log('[getCurrentModifier]:', variant.modifiers, chosenModifier);
    return getModifier(variant.modifiers, chosenModifier);
  }
  return getModifier(opts.modifiers, chosenModifier);
};

const removeModifierClassNamesInGroup = ({ modifier, groups, group, component, variantName }) => {
  group = group || modifier.group;
  if (modifier.classNames) {
    // Remove classNames for given modifier group
    Object.keys(groups)
      .filter(g => g === group)
      .forEach(g =>
        groups[g].forEach(g => {
          if (g.classNames) {
            g.classNames.split(' ').forEach(cl => {
              if (cl !== 'noop' && component.classList.contains(cl)) {
                console.info(
                  variantName
                    ? `Removing class \`${cl}\` modifier \`${modifier.name}\` from component variant \`${variantName}\``
                    : `Removing class \`${cl}\` modifier \`${modifier.name}\` from current variant\``,
                  component
                );
                component.classList.remove(cl);
              }
            });
          } else {
            console.info(`No classNames found for modifier \`${modifier.name}\``);
          }
        })
      );
  }
};

const removeModifierAttributes = ({ modifier, component }) => {
  if (modifier.attributes) {
    Object.keys(modifier.attributes).forEach(a => {
      if (component.getAttribute(a) === modifier.attributes[a]) {
        component.removeAttribute(a);
      }
    });
  }
};

const addModifierAttributes = ({ modifier, component }) => {
  if (modifier.attributes) {
    Object.keys(modifier.attributes).forEach(a => {
      if (component.getAttribute(a) !== modifier.attributes[a]) {
        component.setAttribute(a, modifier.attributes[a]);
      }
    });
  }
};
const toggleModifierAttributes = ({ modifier, component }) => {
  if (modifier.attributes) {
    Object.keys(modifier.attributes).forEach(a => {
      if (component.getAttribute(a) === modifier.attributes[a]) {
        component.removeAttribute(a);
      } else {
        component.setAttribute(a, modifier.attributes[a]);
      }
    });
  }
};

const toggleModifierClassNames = ({ modifier, groups, group, component, variantName }) => {
  removeModifierClassNamesInGroup({ modifier, groups, group, component, variantName });
  setClassNames(component, modifier.classNames);
};

const removeModifierPreviewAttributes = ({ modifier, component }) => {
  if (modifier.previewAttributes) {
    const preview = component.closest('.ph.preview');
    Object.keys(modifier.previewAttributes).forEach(pA => {
      if (preview.getAttribute(pA) === modifier.previewAttributes[pA]) {
        preview.removeAttribute(pA);
      }
    });
  }
};

const addModifierPreviewAttributes = ({ modifier, component }) => {
  if (modifier.previewAttributes) {
    const preview = component.closest('.ph.preview');
    Object.keys(modifier.previewAttributes).forEach(pA => {
      if (preview.getAttribute(pA) !== modifier.previewAttributes[pA]) {
        preview.setAttribute(pA, modifier.previewAttributes[pA]);
      }
    });
  }
};
const toggleModifierPreviewAttributes = ({ modifier, component }) => {
  if (modifier.previewAttributes) {
    const preview = component.closest('.ph.preview');
    Object.keys(modifier.previewAttributes).forEach(pA => {
      if (preview.getAttribute(pA) === modifier.previewAttributes[pA]) {
        preview.removeAttribute(pA);
      } else {
        preview.setAttribute(pA, modifier.previewAttributes[pA]);
      }
    });
  }
};

const modifierOnChangeFactory = ({ input, component, opts, modifier, variant }) => e => {
  console.log({ input, component, opts, modifier, variant });
  let chosenModifier;
  const group = e.target.getAttribute('data-modifier-group');

  // Most likely from a select box
  if (input && input.nodeName === 'SELECT') {
    chosenModifier = e.target.value;
  } else {
    chosenModifier = e.target.getAttribute('data-modifier');
  }
  modifier = getCurrentModifier({ modifier, variant, opts, chosenModifier });

  let groups;
  // If the modifier change is from a variant,
  // only remove the modifier for the relevant variant group
  if (variant) {
    groups = getGroups(variant.modifiers);
    console.log('********************************');
    console.log('¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤');
    console.log({ groups, modifier });
    console.log('¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤');
    console.log('********************************');
    console.log('¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤');
    if (modifier.classNames) {
      toggleModifierClassNames({ modifier, groups, group, component, variantName: variant.name });
    }
  } else {
    groups = getGroups(opts.modifiers);
    toggleModifierClassNames({ modifier, groups, group, component });
    toggleModifierAttributes({ modifier, component });
    toggleModifierPreviewAttributes({ modifier, component });
  }
};

const modifierOnChangeToggleFactory = ({ input, component, opts, modifier, variant }) => e => {
  console.log({ input, component, opts, modifier, variant });
  let chosenModifier;
  const group = e.target.getAttribute('data-modifier-group');

  chosenModifier = e.target.getAttribute('data-modifier');

  modifier = getCurrentModifier({ modifier, variant, opts, chosenModifier });

  let groups;
  // If the modifier change is from a variant,
  // only remove the modifier for the relevant variant group
  if (variant) {
    groups = getGroups(variant.modifiers);
    if (modifier.classNames) {
      if (!input.checked) {
        removeModifierClassNamesInGroup({ modifier, groups, group, component, variantName: variant.name });
      } else {
        setClassNames(component, modifier.classNames);
      }
    }
  } else {
    groups = getGroups(opts.modifiers);
    if (modifier.classNames) {
      if (!input.checked) {
        removeModifierClassNamesInGroup({ modifier, groups, group, component, variantName: variant.name });
        removeModifierAttributes({ modifier, component });
        removeModifierPreviewAttributes({ modifier, component });
      } else {
        setClassNames(component, modifier.classNames);
        addModifierAttributes({ modifier, component });
        addModifierPreviewAttributes({ modifier, component });
      }
    }
  }
  if (modifier.markup) {
    const { markup, position } = modifier;
    if (component.innerHTML.indexOf(markup) === -1) {
      component.setAttribute('data-textContent', component.textContent);
      if (position === 'before') {
        component.innerHTML = markup + component.textContent;
      } else {
        component.innerHTML = component.textContent + markup;
      }
    } else {
      component.innerHTML = '';
      component.textContent = component.getAttribute('data-textContent');
    }
  }
  updateHTML();
};
const getCurrentGroup = ({ modifier, modifiers }) => modifiers.filter(m => m.name === modifier).map(m => m.group)[0];
const modifierOnSelectChangeFactory = ({ component, opts, variant }) => e => {
  const chosenModifier = e.target.value;
  console.log('[modifierOnSelectChangeFactory]:', { modifier: false, variant, opts, chosenModifier });
  const modifier = getCurrentModifier({ modifier: false, variant, opts, chosenModifier });
  const group = getCurrentGroup({ modifier: chosenModifier, modifiers: variant ? variant.modifiers : opts.modifiers });
  const groups = variant ? getGroups(variant.modifiers) : getGroups(opts.modifiers);
  // If the modifier change is from a variant,
  // only remove the modifier for the relevant variant group
  if (variant) {
    console.log('********************************');
    console.log('********************************');
    console.log({ group, groups, modifier });
    console.log('********************************');
    console.log('********************************');
    console.log('********************************');
    if (modifier.classNames) {
      toggleModifierClassNames({ modifier, groups, group, component, variantName: variant.name });
    }
  } else {
    toggleModifierClassNames({ modifier, groups, group, component });
    toggleModifierAttributes({ modifier, component });
    toggleModifierPreviewAttributes({ modifier, component });
  }
};

const initModifierOnChange = ({ select, input, component, opts, modifier, variant }) => {
  if (select) {
    select.addEventListener('change', modifierOnSelectChangeFactory({ component, opts, variant }));
  } else if (input.classList.contains('toggle')) {
    input.addEventListener('change', modifierOnChangeToggleFactory({ input, component, opts, modifier, variant }));
  } else {
    input.addEventListener('change', modifierOnChangeFactory({ input, component, opts, modifier, variant }));
  }
};

const initForm = name => {
  const fragment = document.createDocumentFragment();

  const form = document.createElement('form');
  form.classList.add('ph');
  form.classList.add(name);

  fragment.appendChild(form);

  return fragment;
};
const initModifiersForm = () => initForm('modifiers');

const initStatesForm = () => initForm('states');

const initInteractionsForm = () => initForm('interactions');
const initVariantsForm = () => initForm('variants');

const groupBy = (list, key) =>
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

const getGroups = modifier => groupBy(modifier, 'group');
const getGroupNames = modifier => Object.keys(getGroups(modifier));

const createModifierRadioFactory = ({ component, opts, selectionControls, variant }) => (modifier, index) => {
  const { name, group } = modifier;
  const _id = ID();
  const label = document.createElement('label');
  label.classList.add('ph');
  label.setAttribute('for', _id);
  label.textContent = humanizeString(name);

  const input = document.createElement('input');

  input.setAttribute('id', _id);
  input.setAttribute('data-modifier', name);
  input.classList.add('ph');
  if (group && group !== '') {
    input.classList.add('selection-control');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', `radio-modifiers-${group}`);
    input.setAttribute('data-modifier-group', group);
    if (index === 0) {
      input.checked = true;
    }
  } else {
    input.classList.add('toggle');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('data-size', 'large');
    input.setAttribute('name', _id);
  }

  initModifierOnChange({ input, component, opts, modifier, variant });

  selectionControls.classList.add('ph');
  selectionControls.classList.add('selection-controls');
  selectionControls.appendChild(input);
  selectionControls.appendChild(label);
};

const createModifierToggleFactory = ({ component, opts, selectionControls, variant }) => (modifier, index) => {
  const { name, group } = modifier;
  const _id = ID();
  const label = document.createElement('label');
  label.classList.add('ph');
  label.setAttribute('for', _id);
  label.textContent = humanizeString(name);

  const input = document.createElement('input');

  input.setAttribute('id', _id);
  input.setAttribute('data-modifier', name);
  input.setAttribute('data-variant', variant.name);
  input.setAttribute('data-modifier-group', group);
  input.classList.add('ph');

  input.classList.add('toggle');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('data-size', 'large');
  input.setAttribute('name', _id);

  initModifierOnChange({ input, component, opts, modifier, variant });

  selectionControls.classList.add('ph');
  selectionControls.classList.add('selection-controls');
  selectionControls.appendChild(input);
  selectionControls.appendChild(label);
};

const createModifiersSelectBox = ({ fragment, component, opts, variant }) => {
  const groups = variant ? getGroups(variant.modifiers) : getGroups(opts.modifiers);
  Object.keys(groups).forEach(groupName => {
    const group = groups[groupName];

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add(groupName);
    inputWrapper.classList.add('ph');
    inputWrapper.classList.add('input-wrapper');
    const label = document.createElement('label');
    label.classList.add('ph');
    const _id = ID();
    label.setAttribute('for', _id);
    label.textContent = humanizeString(groupName);

    const select = document.createElement('select');
    select.setAttribute('data-modifier-group', groupName);

    select.setAttribute('id', _id);
    select.classList.add('ph');
    select.setAttribute('data-size', 'medium');
    select.setAttribute('name', _id);
    group.forEach((modifier, index) => {
      const { name } = modifier;
      const option = document.createElement('option');
      option.setAttribute('data-modifier', name);
      option.setAttribute('value', name);
      option.textContent = name;
      if (index === 0) {
        option.setAttribute('selected', '');
      }

      select.appendChild(option);
    });

    initModifierOnChange({ select, modifiers: group, component, opts, variant });

    inputWrapper.appendChild(select);
    inputWrapper.appendChild(label);
    fragment.appendChild(inputWrapper);
  });
};
const createModifiers = ({ form, modifiers, component, opts, variant }) => {
  const fragment = document.createDocumentFragment();

  const groupNames = getGroupNames(modifiers);
  console.log({ groupNames });
  if (modifiers.length > 7) {
    createModifiersSelectBox({ fragment, component, opts, variant });
  } else if (modifiers.length > 1 && groupNames.length <= 1) {
    const selectionControls = document.createElement('div');
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('ph');

    const legend = document.createElement('legend');
    legend.classList.add('ph');
    const inputWrapper = document.createElement('div');
    if (groupNames && groupNames.length) {
      console.log({ groupNames });
      legend.textContent = humanizeString(groupNames[0]);
      inputWrapper.classList.add(groupNames[0]);
    } else {
      inputWrapper.classList.add('modifiers');
      legend.textContent = 'Modifiers';
    }
    modifiers.forEach(createModifierRadioFactory({ component, opts, selectionControls, variant }));
    inputWrapper.classList.add('ph');
    inputWrapper.classList.add('input-wrapper');
    inputWrapper.appendChild(fieldset);
    fieldset.appendChild(legend);
    fieldset.appendChild(selectionControls);

    fragment.appendChild(inputWrapper);
  } else {
    // Create separate fieldsets per group
    const groups = getGroups(modifiers);
    Object.keys(groups).forEach(groupName => {
      const modifiers = groups[groupName];
      const selectionControls = document.createElement('div');
      const fieldset = document.createElement('fieldset');
      fieldset.classList.add('ph');

      const legend = document.createElement('legend');
      legend.classList.add('ph');
      const inputWrapper = document.createElement('div');

      inputWrapper.classList.add(groupName);
      legend.textContent = humanizeString(groupName);
      modifiers.forEach(createModifierToggleFactory({ component, opts, selectionControls, variant }));
      inputWrapper.classList.add('ph');
      inputWrapper.classList.add('input-wrapper');
      inputWrapper.appendChild(fieldset);
      fieldset.appendChild(legend);
      fieldset.appendChild(selectionControls);

      fragment.appendChild(inputWrapper);
    });
  }

  form.appendChild(fragment);
};
const createStates = ({ form, states, component, opts }) => {
  const fragment = document.createDocumentFragment();

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('ph');
  inputWrapper.classList.add('input-wrapper');

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('ph');

  const legend = document.createElement('legend');
  legend.classList.add('ph');
  legend.textContent = 'States';

  const selectionControls = document.createElement('div');

  selectionControls.classList.add('ph');
  selectionControls.classList.add('selection-controls');
  states.forEach((state, index) => {
    const _id = ID();
    const label = document.createElement('label');
    label.classList.add('ph');
    label.setAttribute('for', _id);
    label.textContent = state.name;

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', _id);
    input.setAttribute('id', _id);
    input.setAttribute('data-state', state.name);
    input.classList.add('ph');
    input.classList.add('selection-control');

    initStateOnChange(input, component, opts);

    selectionControls.appendChild(input);
    selectionControls.appendChild(label);
  });

  fieldset.appendChild(legend);
  fieldset.appendChild(selectionControls);
  inputWrapper.appendChild(fieldset);
  form.appendChild(inputWrapper);

  form.appendChild(fragment);
};
const createInteractions = ({ form, interactions, component, opts }) => {
  const fragment = document.createDocumentFragment();

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('ph');
  inputWrapper.classList.add('input-wrapper');

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('ph');

  const legend = document.createElement('legend');
  legend.classList.add('ph');
  legend.textContent = 'Interactions';

  const selectionControls = document.createElement('div');

  selectionControls.classList.add('ph');
  selectionControls.classList.add('selection-controls');
  interactions.forEach((interaction, index) => {
    const _id = ID();
    const label = document.createElement('label');
    label.classList.add('ph');
    label.setAttribute('for', _id);
    label.textContent = interaction.name;

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', _id);
    input.setAttribute('id', _id);
    input.setAttribute('data-interaction', interaction.name);
    input.classList.add('ph');
    input.classList.add('selection-control');

    initInteractionOnChange(input, component, opts);

    selectionControls.appendChild(input);
    selectionControls.appendChild(label);
  });

  fieldset.appendChild(legend);
  fieldset.appendChild(selectionControls);
  inputWrapper.appendChild(fieldset);
  form.appendChild(inputWrapper);

  form.appendChild(fragment);
};

const createInteraction = (interaction, index) => {
  const fragment = document.createDocumentFragment();
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.setAttribute('type', 'checkbox');

  label.textContent = interaction.name;

  fragment.appendChild(label);
  fragment.appendChild(input);
  return fragment;
};
const setConfigurationDrawer = (component, el, opts) => {
  const title = document.createElement('span');
  el.appendChild(initVariantsForm());
  title.classList.add('ph');
  title.classList.add('title');
  title.textContent = 'Features';
  el.appendChild(title);

  el.appendChild(initInteractionsForm());
  el.appendChild(initStatesForm());
  el.appendChild(initModifiersForm());
  const variantsForm = el.querySelector('.ph.configuration form.variants');
  const modifiersForm = el.querySelector('.ph.configuration form.modifiers');
  const interactionsForm = el.querySelector('.ph.configuration form.interactions');
  const statesForm = el.querySelector('.ph.configuration form.states');

  if (opts && component) {
    const { variants } = opts;
    if (isArrayUsable(variants)) {
      console.info('[setConfigurationDrawer]: Creating variants');
      createVariants(variantsForm, variants, component, opts);
    }
  }
  if (opts && component) {
    const { interactions, states, modifiers } = opts;

    if (isArrayUsable(interactions)) {
      console.info('[setConfigurationDrawer]: Creating interractions');
      createInteractions({ form: interactionsForm, interactions, component, opts });
    }
    if (isArrayUsable(states)) {
      console.info('[setConfigurationDrawer]: Creating states');
      createStates({ form: statesForm, states, component, opts });
    }
    if (modifiers && Array.isArray(modifiers) && modifiers.length !== 0) {
      console.info('[setConfigurationDrawer]: Creating modifiers');
      createModifiers({ form: modifiersForm, modifiers, component, opts });
    }
  }
};

const createVariants = (form, variants, component, opts) => {
  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('ph');
  inputWrapper.classList.add('input-wrapper');

  const title = document.createElement('span');
  title.classList.add('ph');
  title.classList.add('title');
  title.textContent = 'Variants';
  const _id = ID();
  const select = document.createElement('select');

  select.setAttribute('id', _id);
  select.classList.add('ph');
  select.setAttribute('data-size', 'medium');
  select.setAttribute('name', _id);
  variants.forEach((variant, index) => {
    const { name } = variant;
    const option = document.createElement('option');
    option.setAttribute('data-variant', name);
    option.setAttribute('value', name);
    option.textContent = name;
    if (index === 0) {
      option.setAttribute('selected', '');
      if (variant.modifiers) {
        const modifierForm = form.closest('.demo').querySelector('form.modifiers');

        const cmOpts = {
          form: modifierForm,
          modifiers: variant.modifiers,
          component,
          opts,
          variant
        };
        console.info('[createVariants]: Creating variant modifiers');
        createModifiers(cmOpts);
      }
    }

    select.appendChild(option);

    initVariantOnChange(select, component, opts);
  });

  form.appendChild(title);
  form.appendChild(select);
};

const createBackgrounds = (el, backgrounds) => {
  if (backgrounds && Array.isArray(backgrounds) && backgrounds.length !== 0) {
    console.log('got backgrounds');
    const fragment = document.createDocumentFragment();
    const container = document.createElement('div');
    container.classList.add('ph');
    container.classList.add('menu-container');
    container.classList.add('backgrounds');

    const _id = ID();
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('id', _id);
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-controls', `menu-${_id}`);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Backgrounds');

    button.classList.add('ph');
    button.classList.add('button');
    button.classList.add('backgrounds');
    button.classList.add('js-settings-menu');
    button.classList.add('icon');

    container.appendChild(button);

    const nav = document.createElement('nav');
    nav.style.top = '48px';
    button.setAttribute('tabindex', '-1');
    nav.setAttribute('id', `menu-${_id}`);
    nav.setAttribute('role', 'menu');
    nav.setAttribute('aria-labelledby', _id);

    nav.classList.add('ph');
    nav.classList.add('menu');
    nav.classList.add('right');

    const ul = document.createElement('ul');
    ul.classList.add('ph');

    backgrounds.forEach(background => {
      const li = document.createElement('li');
      li.classList.add('ph');
      const action = document.createElement('button');
      action.setAttribute('type', 'button');
      action.setAttribute('role', 'menuitem');
      action.setAttribute('tabindex', '-1');
      action.classList.add('ph');
      const { name, color } = background;
      action.setAttribute('data-name', name);
      action.setAttribute('data-color', color);
      action.innerHTML = `<span class="if" style="border: 1pt solid #dddddd;display:inline-block;height: 28px; width: 28px; border-radius: 100%;margin-right: $spacing-size-4; background-clip: padding-box;background-color: ${color};margin-right: 8px;"></span> ${name}`;
      li.appendChild(action);
      ul.appendChild(li);
      action.addEventListener('click', e => {
        const preview = el.closest('.demo').querySelector('.ph.preview');
        const actionButton = e.target;
        const color = actionButton.getAttribute('data-color');
        console.log(preview.style.backgroundColor, color);
        const currentBackgroundColor =
          preview.style.backgroundColor !== '' ? rgb2hex(preview.style.backgroundColor) : '';
        if (currentBackgroundColor === color) {
          preview.style.backgroundColor = '';
        } else {
          preview.style.backgroundColor = color;
        }
      });
    });

    nav.appendChild(ul);
    container.appendChild(nav);
    fragment.appendChild(container);
    el.appendChild(fragment);
  }
};

const setHeader = (component, el, opts) => {
  if (opts && component) {
    const { backgrounds } = opts;
    if (backgrounds) {
      createBackgrounds(el, backgrounds);
    }
  }
};
const updateHTML = () => {
  initHtml();
};
const initHtml = () => {
  const html = document.querySelector('.ph.html');
  const preview = document.querySelector('.ph.preview');

  if (!html || !preview) return;

  const _html = clear(html);

  const code = preview.innerHTML;

  if (!code || (code && code.length === '')) return;

  const preTag = document.createElement('pre');
  preTag.classList.add('language-html');

  const codeTag = document.createElement('code');
  codeTag.innerHTML = code
    .replace(/( data-textcontent=['"])([^'"]+['"])/, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  preTag.appendChild(codeTag);
  _html.appendChild(preTag);
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

const setDefaultUI = opts => {
  const el = document.querySelector('.ph.demo');

  if (!el) {
    const demo = document.createElement('div');
    demo.classList.add('ph');
    demo.classList.add('demo');
  }

  const container = document.createElement('div');
  container.classList.add('ph');
  container.classList.add('container');

  const preview = document.createElement('div');
  preview.classList.add('ph');
  preview.classList.add('preview');
  preview.classList.add('is-active');
  if (!opts.ui) {
    preview.classList.add('no-ui');
  }
  if (opts.ui) {
    const configuration = document.createElement('div');
    configuration.classList.add('ph');
    configuration.classList.add('configuration');

    const header = document.createElement('div');
    header.classList.add('ph');
    header.classList.add('header');
    if (opts.html) {
      const html = document.createElement('div');
      html.classList.add('ph');
      html.classList.add('html');
      container.appendChild(html);

      const htmlButton = document.createElement('button');
      const previewButton = document.createElement('button');
      htmlButton.classList.add('ph');
      htmlButton.classList.add('button');
      htmlButton.classList.add('text');
      htmlButton.textContent = 'html';
      htmlButton.addEventListener('click', e => {
        const button = e.target;
        const html = document.querySelector('.ph.html');
        if (!html.classList.contains('is-active')) {
          html.classList.add('is-active');
          button.classList.add('is-active');
          preview.classList.remove('is-active');
          previewButton.classList.remove('is-active');
          initHtml();
        }
      });
      previewButton.classList.add('ph');
      previewButton.classList.add('button');
      previewButton.classList.add('text');
      previewButton.classList.add('is-active');
      previewButton.textContent = 'preview';
      previewButton.addEventListener('click', e => {
        const button = e.target;
        if (!preview.classList.contains('is-active')) {
          const html = document.querySelector('.ph.html');
          preview.classList.add('is-active');
          button.classList.add('is-active');
          html.classList.remove('is-active');
          htmlButton.classList.remove('is-active');
        }
      });

      header.appendChild(previewButton);
      header.appendChild(htmlButton);
    }
    container.appendChild(configuration);
    container.appendChild(header);
  }

  container.appendChild(preview);

  if (!el) {
    const df = document.createDocumentFragment();
    df.appendChild(demo);
    document.appendChild(df);
    return df;
  }
  el.appendChild(container);
  return el;
};
const loadFonts = () => {
  const preconnect = document.createElement('link');
  const font = document.createElement('link');

  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';

  font.href =
    'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap';
  font.rel = 'stylesheet';
  font.type = 'text/css';

  // append link element to html
  document.body.appendChild(preconnect);
  document.body.appendChild(font);
};
const loadCSSFile = opts => {
  if (opts.css && opts.css !== '') {
    const link = document.createElement('link');

    // set properties of link tag
    link.href = opts.css;
    link.rel = 'stylesheet';
    link.type = 'text/css';

    // append link element to html
    document.body.appendChild(link);
  }
};

const loadJSFile = opts => {
  if (opts.js && opts.js !== '') {
    const script = document.createElement('script');

    script.src = opts.js;

    document.head.appendChild(script);
  }
};
const init = cfg => {
  const options = setDefaultOpts(cfg);
  const el = setDefaultUI(options);
  loadFonts();
  loadCSSFile(options);
  loadJSFile(options);

  const preview = el.querySelector('.ph.preview');

  const { markup } = options;
  if (markup && markup !== '') {
    const fragment = document.createRange().createContextualFragment(markup);
    const component = fragment.firstChild;
    preview.appendChild(fragment);
    if (options.preset) {
      setPresetDefaults(component, options);
    } else {
      setDefaultClassNames(component, options);
      setDefaultLabel(component, options);
      if (options.ui) {
        const configuration = el.querySelector('.ph.configuration');
        const header = el.querySelector('.ph.header');
        setHeader(component, header, options);
        setConfigurationDrawer(component, configuration, options);
        settingsMenuInit();
      }
    }
  } else {
    console.info('[init]: No markup found. Please supply markup');
  }
};

init(TEST_CONFIG);
