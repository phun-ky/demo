/* eslint no-console:0 */
'use strict';

import { isArrayUsable } from './lib/helpers';

function Options(options, el) {
  this.raw_options = this.ensure(options);
  this.position = this._get_characters('position', 'center');
  this.label = this._get_characters('label', 'Component');
  this.markup = this._get_markup();
  this.can_use_speccer = this._get_speccer();
  this.preset = this._get_boolean('preset', false);
  this.embed = this._get_embed(el);
  this.html = this._get_boolean('html', false);
  this.background_color = this._get_default_background_color();
  this.ui = this._get_boolean('ui', true);
  this.variants = this._get_variants();
  this.modifiers = this._get_modifiers();
  this.backgrounds = this._get_array('backgrounds', []);
  this.interactions = this._get_array('interactions', []);
  this.states = this._get_states();
  this.initial_variant = this._get_initial_variant();
  this.initial_modifier = this._get_initial_modifier();
  this.initial_interaction = this._get_initial_interaction();
  this.initial_state = this._get_initial_state();

  this.css = this._get_characters('css');
  this.js = this._get_characters('js');
  this.wrapper = this.raw_options['wrapper'] || null;
}

Options.prototype._get_embed = function (el) {
  if (!el) return this._get_boolean('embed', true);
  return false;
};

Options.prototype._get_speccer = function () {
  return this._get_markup().indexOf('data-speccer') !== -1;
};

Options.prototype._get_initial_variant = function () {
  const variants = this._get_variants();
  if (isArrayUsable(variants)) {
    return variants[0];
  }
  return null;
};

Options.prototype._get_initial_modifier = function () {
  const modifiers = this._get_modifiers();
  if (isArrayUsable(modifiers)) {
    return modifiers[0];
  }
  return null;
};

Options.prototype._get_initial_interaction = function () {
  const interactions = this._get_interactions();
  if (isArrayUsable(interactions)) {
    return interactions[0];
  }
  return null;
};

Options.prototype._get_initial_state = function () {
  const states = this._get_states();
  if (isArrayUsable(states)) {
    return states[0];
  }
  return null;
};

Options.prototype._get_default_background_color = function () {
  const backgrounds = this._get_backgrounds();

  if (isArrayUsable(backgrounds)) {
    const marked_default = backgrounds.find(b => b.default);
    if (marked_default) {
      return marked_default.color;
    } else {
      return backgrounds[0].color;
    }
  }
  return '#ecf0f3';
};
Options.prototype._get_markup = function () {
  const markup = this._get_characters('markup').trim();

  return markup;
};

Options.prototype._get_modifiers = function () {
  const modifiers = this.raw_options['modifiers'] || this._get_array('modifiers', []);

  return modifiers.map(mod => (mod.group && mod.group !== '' ? mod : { ...mod, ...{ group: 'global' } }));
};

Options.prototype._get_backgrounds = function () {
  const backgrounds = this.raw_options['backgrounds'] || this._get_array('backgrounds', []);
  return backgrounds;
};

Options.prototype._get_states = function () {
  const states = this.raw_options['states'] || this._get_array('states', []);
  if (isArrayUsable(states)) {
    if (!states.find(state => state.name.toLowerCase() === 'default')) {
      return [{ name: 'Default', classNames: 'noop' }, ...states];
    }
  }
  return states;
};

Options.prototype._get_interactions = function () {
  const interactions = this.raw_options['interactions'] || this._get_array('interactions', []);
  return interactions;
};

Options.prototype._get_variant = function (name) {
  return this.variants.find(i => i.name == name);
};

Options.prototype._get_modifier = function (name, modifiers) {
  if (modifiers) return modifiers.find(i => i.name == name);
  return this.modifiers.find(i => i.name == name);
};

Options.prototype._get_interaction = function (name) {
  return this.interactions.find(i => i.name == name);
};

Options.prototype._get_state = function (name) {
  return this.states.find(i => i.name == name);
};

Options.prototype._get_variants = function () {
  const variants = this.raw_options['variants'] || this._get_array('variants', []);

  return variants.map(variant => {
    if (variant.modifiers) {
      variant.modifiers = variant.modifiers.map(mod =>
        mod.group && mod.group !== '' ? mod : { ...mod, ...{ group: `${variant.name.replace(/\s/g, '-')}-modifiers` } }
      );
    }
    return variant;
  });
};

Options.prototype._get_array = function (name, default_value) {
  const option_value = this.raw_options[name];
  let result = default_value || [];
  if (typeof option_value === 'object') {
    if (option_value !== null && typeof option_value.concat === 'function') {
      result = option_value.concat();
    }
  } else if (typeof option_value === 'string') {
    result = option_value.split(/[^a-zA-Z0-9_/-]+/);
  }
  return result;
};

Options.prototype._get_boolean = function (name, default_value) {
  const option_value = this.raw_options[name];
  let result = option_value === undefined ? !!default_value : !!option_value;
  return result;
};

Options.prototype._get_characters = function (name, default_value) {
  const option_value = this.raw_options[name];
  let result = default_value || '';
  if (typeof option_value === 'string') {
    result = option_value.replace(/\\r/, '\r').replace(/\\n/, '\n').replace(/\\t/, '\t');
  }
  return result;
};

Options.prototype.ensure = function (options) {
  if ((options && Object.keys(options).length === 0 && options.constructor === Object) || !options) {
    const jsCfgEl = document.querySelector('script.js-demo-config');
    if (jsCfgEl) return JSON.parse(jsCfgEl.innerHTML);
  } else if (options && Object.keys(options).length !== 0 && options.constructor === Object) {
    return options;
  }
  throw 'No js config element found';
};

export default Options;
