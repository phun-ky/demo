/* eslint no-console:0 */
'use strict';
import { humanize } from './lib/string';
import html from './lib/html';
import form from './lib/form';
import stylesheet from './lib/stylesheet';
import debounce from './lib/debounce';
import script from './lib/script';
import * as classnames from './lib/classnames';
import * as styles from './lib/styles';
import * as markup from './lib/markup';
import * as node from './lib/node';
import * as attributes from './lib/attributes';

import { rgb2hex, isArrayUsable, uniqueID, groupBy } from './lib/helpers';

/* eslint no-console:0 */
('use strict');

import Options from './options';
import SettingsMenu from './menu';
import A11y from './a11y';

function Demo(options, el) {
  this._init(options, el);
}

Demo.prototype._set_initial = function (modifier) {
  if (this.options[modifier]) {
    classnames.set(this.component, this.options[modifier].classNames);
    attributes.set(this.component, this.options[modifier].attributes);
    attributes.set(this.preview_el, this.options[modifier].previewAttributes);
    // markup.set(this.component, this.options.initial_variant.classNames);
  }
};

Demo.prototype._initial = function () {
  this._set_initial('initial_variant');
  this._set_initial('initial_modifier');
  this._set_initial('initial_interaction');
  this._set_initial('initial_state');
};

Demo.prototype._add_styles_to_component = function (styleAttrs) {
  styles.add(this.component, styleAttrs);
};

Demo.prototype._add_attributes_to_component = function (attrs) {
  attributes.set(this.component, attrs);
};

Demo.prototype._remove_styles_by_category = function (category) {
  const styles_to_be_removed = this.options[category].reduce((result, cat) => {
    if (isArrayUsable(cat.styles)) {
      const a = cat.styles.map(v => {
        return v.key;
      });

      a.forEach(b => result.push(b));
    }
    return result;
  }, []);
  styles_to_be_removed.forEach(key => (this.component.style[key] = ''));
};

Demo.prototype._remove_attributes_by_category = function (category) {
  const attributes_to_be_removed = this.options[category].reduce((result, cat) => {
    if (isArrayUsable(cat.attributes)) {
      const a = cat.attributes.map(v => {
        return v.key;
      });

      a.forEach(b => result.push(b));
    }
    return result;
  }, []);
  attributes_to_be_removed.forEach(key => this.component.removeAttribute(key));
};

Demo.prototype._remove_classnames_by_category = function (category) {
  console.info('Demo._remove_classnames_by_category', category);
  const remove_classnames_from_these = this.options[category].filter(e => e.classNames).map(e => e.classNames);

  remove_classnames_from_these.forEach(classname => classnames.remove(this.component, classname));
};

Demo.prototype._get_groups = function (modifiers, group_name = 'group') {
  return groupBy(modifiers, group_name);
};

Demo.prototype._remove_modifiers_by_category = function (category) {
  const modifiers_to_be_removed = this.options[category]
    .filter(e => {
      if (e.modifiers && e.modifiers.length !== 0) return e.modifiers;
    })
    .reduce((result, e) => {
      e.modifiers.forEach(m => {
        result.push(m);
      });
      return result;
    }, []);

  if (isArrayUsable(modifiers_to_be_removed)) {
    const groups = this._get_groups(modifiers_to_be_removed, 'group');
    Object.keys(groups).forEach(group_name => {
      const modifierGroup = document.querySelector(`.configuration form.modifiers .${group_name}`);
      if (modifierGroup) modifierGroup.remove();
      groups[group_name].forEach(modifier => {
        if (modifier.classNames) {
          modifier.classNames.split(' ').forEach(cl => {
            if (cl !== 'noop' && this.component.classList.contains(cl)) {
              console.info(`Removing class \`${cl}\` modifier \`${modifier.name}\` from current variant\``);
              this.component.classList.remove(cl);
            }
          });
        } else if (modifier.markup) {
          if (this.component.innerHTML.indexOf(modifier.markup) !== -1) {
            this.component.innerHTML = '';
            this.component.textContent = this.component.getAttribute('data-textContent');
          }
        } else {
          console.info(`No classNames found for modifier \`${modifier.name}\``);
        }
      });
    });
  }
};

Demo.prototype._remove_modifier_controls_by_category = function (category) {
  if (isArrayUsable(this.options.modifiers)) {
    if (isArrayUsable(this.options[category])) {
      this.optiions[category].forEach(cat => {
        if (isArrayUsable(cat.modifiers)) {
          cat.modifiers.forEach(mod => {
            const mod_el = document.querySelector(
              `input[data-modifier="${mod.name}"][data-modifier-group="${mod.group}"]`
            );
            if (mod_el) {
              const mod_elId = mod_el.getAttribute('id');
              const labelForModEl = document.querySelector(`label[for="${mod_elId}"]`);

              mod_el.remove();
              labelForModEl.remove();
            }
          });
        }
      });
    }
  }
};

Demo.prototype._add_variant_classnames = function (variant) {
  classnames.set(this.component, variant.classNames);
  if (variant.modifiers) {
    this._create_modifiers({
      el: this.modifiers_form_el,
      modifiers: variant.modifiers,
      variant
    });
  } else {
    this._remove_modifier_controls_by_category('variants');
  }
};

Demo.prototype._interaction_on_change = function (e) {
  const chosen_interaction = e.target.getAttribute('data-interaction');
  const interaction = this.options._get_interaction(chosen_interaction);

  classnames.toggle(this.component, interaction.classNames);
  attributes.toggle(this.component, interaction.attributes);
  attributes.toggle(this.preview_el, interaction.previewAttributes);
};

Demo.prototype._init_remove_interaction = function (el) {
  console.info('Demo._init_remove_interaction', el);
  const current_interaction = el.getAttribute('data-interaction');
  const interaction = this.options._get_interaction(current_interaction);
  classnames.remove(this.component, interaction.classNames);
  attributes.remove(this.preview_el, interaction.previewAttributes);
};

Demo.prototype._set_html = function (no_speccer = false) {
  if (no_speccer) {
    document.querySelectorAll('.speccer').forEach(el => el.remove());
  }
  html(this.html_el, this.preview_el).then(el => (this.html_el = el));
  if (!no_speccer && !this._is_html_pane_active) {
    setTimeout(
      function () {
        this._speccer();
      }.bind(this),
      300
    );
  }
};

Demo.prototype._init_interaction_on_change = function (input) {
  input.removeEventListener('change', this._interaction_on_change.bind(this));
  input.addEventListener('change', this._interaction_on_change.bind(this));
};

Demo.prototype._state_on_change = function (e) {
  console.info('Demo._state_on_change', e);

  const chosen_state = e.target.getAttribute('data-state');
  const state = this.options._get_state(chosen_state);
  const { name } = state;

  /*
  remove all state modifiers,
  add current modifier
  if(modifier IS NOT default) remove interactions
  if(modifiers IS default) do NOT remove interactions
  */

  this.options.states.forEach(state => {
    classnames.remove(this.component, state.classNames);
    attributes.remove(this.component, state.attributes);
    attributes.remove(this.previewEl, state.previewAttributes);
  });

  classnames.set(this.component, state.classNames);
  attributes.set(this.component, state.attributes);
  attributes.set(this.previewEl, state.previewAttributes);

  if (name.toLowerCase() !== 'default') {
    this.configuration_el
      .querySelector('.interactions')
      .querySelectorAll('input[type=checkbox]')
      .forEach(el => {
        el.setAttribute('disabled', 'disabled');
        this._init_remove_interaction(el);
        el.checked = false;
      });
  } else {
    this.configuration_el
      .querySelector('.interactions')
      .querySelectorAll('input[type=checkbox]')
      .forEach(el => el.removeAttribute('disabled'));
  }

  this._set_html();
};

Demo.prototype._init_state_on_change = function (input) {
  input.removeEventListener('change', this._state_on_change.bind(this));
  input.addEventListener('change', this._state_on_change.bind(this));
};

Demo.prototype._variants_on_change = function (e) {
  console.info('Demo._variants_on_change', e);

  const chosen_variant = e.target.value;
  const variant = this.options._get_variant(chosen_variant);

  this._remove_styles_by_category('variants');
  this._remove_attributes_by_category('variants');
  this._remove_classnames_by_category('variants');
  this._remove_modifiers_by_category('variants');

  this._add_styles_to_component(variant.styles);
  this._add_attributes_to_component(variant.attributes);
  this._add_variant_classnames(variant);

  this._set_html();
};

Demo.prototype._init_variants_on_change = function (el) {
  el.removeEventListener('change', this._variants_on_change.bind(this));
  el.addEventListener('change', this._variants_on_change.bind(this));
};

Demo.prototype._get_current_modifier = function ({ modifier, variant, chosen_modifier }) {
  if (modifier) {
    return modifier;
  }
  if (variant) {
    return this.options._get_modifier(chosen_modifier, variant.modifiers);
  }
  return this.options._get_modifier(chosen_modifier);
};

Demo.prototype._modifier_on_change = function ({ e, modifier, variant }) {
  console.info('Demo._modifier_on_change', { e, modifier, variant });
  const input = e.target;
  const group_name = input.getAttribute('data-modifier-group');

  const chosen_modifier = input.getAttribute('data-modifier');
  modifier = this._get_current_modifier({ modifier, variant, chosen_modifier });

  const groups = variant ? this._get_groups(variant.modifiers) : this._get_groups(this.options.modifiers);
  // If the modifier change is from a variant,
  // only remove the modifier for the relevant variant group
  if (variant) {
    if (modifier.classNames) {
      Object.keys(groups)
        .filter(g => g === group_name)
        .forEach(g =>
          groups[g].forEach(group => {
            classnames.remove(this.component, group.classNames);
            attributes.remove(this.component, group.attributes);
            attributes.remove(this.previewEl, group.previewAttributes);
          })
        );
    }

    if (e.target.checked) {
      classnames.set(this.component, modifier.classNames);
      markup.set(this.component, modifier.markup, modifier.position);
    } else {
      classnames.remove(this.component, modifier.classNames);
      markup.remove(this.component, modifier.markup);
    }
  } else {
    Object.keys(groups)
      .filter(g => g === group_name)
      .forEach(g =>
        groups[g].forEach(group => {
          classnames.remove(this.component, group.classNames);
          attributes.remove(this.component, group.attributes);
          attributes.remove(this.previewEl, group.previewAttributes);
        })
      );
    if (e.target.checked) {
      classnames.set(this.component, modifier.classNames);
      markup.set(this.component, modifier.markup, modifier.position);
      attributes.set(this.component, modifier.attributes);
      attributes.set(this.previewEl, modifier.previewAttributes);
      this._set_child_modifiers(modifier, input.closest('fieldset'));
    } else {
      classnames.remove(this.component, modifier.classNames);
      markup.remove(this.component, modifier.markup);
      attributes.remove(this.component, modifier.attributes);
      attributes.remove(this.previewEl, modifier.previewAttributes);
      this._remove_child_modifiers(modifier, input.closest('fieldset'));
    }
  }
  this._set_html();
};

Demo.prototype._set_child_modifiers = function (modifier, el) {
  console.info('Demo._set_child_modifiers', modifier, el);
  if (!isArrayUsable(modifier.modifiers)) return;

  this._create_modifiers({
    el: el,
    modifiers: modifier.modifiers,
    child: true
  });
};

Demo.prototype._remove_child_modifiers = function (modifier, el) {
  console.info('Demo._remove_child_modifiers', modifier, el);
  if (!isArrayUsable(modifier.modifiers)) return;

  modifier.modifiers.forEach(modifier =>
    el.querySelector(`[data-modifier-group=${modifier.group}]`).closest('.selection-controls').remove()
  );
};

Demo.prototype._init_modifier_on_change = function ({ input_el, modifier, variant }) {
  input_el.removeEventListener(
    'change',
    function (e) {
      this._modifier_on_change({ e, modifier, variant });
    }.bind(this)
  );
  input_el.addEventListener(
    'change',
    function (e) {
      this._modifier_on_change({ e, modifier, variant });
    }.bind(this)
  );
};

Demo.prototype._speccer = function () {
  if (this.options.can_use_speccer) {
    if (window.speccer) {
      window.speccer();
    } else {
      this._activate_speccer();
    }
  }
};

Demo.prototype._init_speccer = function () {
  if (this.options.can_use_speccer) {
    stylesheet({ href: 'https://unpkg.com/@phun-ky/speccer@3.3.11/speccer.css', id: 'speccer_css' });

    script({
      id: 'speccer_js',
      src: 'https://unpkg.com/@phun-ky/speccer@3.3.11/speccer.js',
      callback: () => {
        let speccerEventFunc;
        console.info('[@phun-ky/speccer]: Activated speccer ');

        window.speccer();

        speccerEventFunc = debounce(function () {
          console.info('[@phun-ky/speccer]: Event resize triggered');
          window.speccer();
        }, 300);

        setTimeout(function () {
          window.speccer();
        }, 500);

        window.addEventListener('resize', speccerEventFunc);
      },
      attrs: {
        'data-manual': 'data-manual'
      }
    });
  }
};

Demo.prototype._init = function (options, el) {
  this.options = new Options(options, el);

  this.root_el = this._root(el);

  if (!this.options.markup || (this.options.markup && this.options.markup === '')) {
    throw 'No markup found. Please supply markup';
  }

  this._is_html_pane_active = false;
  this._is_a11y_pane_active = false;

  this._ui();
  this._markup();

  // Set initial background color
  this.preview_el.style.backgroundColor = this.options.background_color;

  // Only display component
  if (this.options.preset) {
    this._initial();
  } else {
    // Set initial classNames
    classnames.set(this.component, this.options.variants[0].classNames);

    if (this.options.ui) {
      this._settings_backgrounds();
      this._drawer();
      const _settings_menu = document.querySelector('.ph.js-settings-menu');
      this.settings_menu = new SettingsMenu(_settings_menu);

      this._init_speccer();
      this._init_a11y();
    }
  }
};

Demo.prototype._create_single_variant_control = function () {
  if (!isArrayUsable(this.options.variants)) return;
  const { name } = this.options.variants[0];

  const title = node.create({ type: 'span', classNames: 'ph component-title', textContent: name });
  this.variants_form_el.appendChild(title);
};

Demo.prototype._create_global_modifiers_controls = function () {
  console.info('Demo._create_global_modifiers_controls', this.options.modifiers);
  if (!isArrayUsable(this.options.modifiers)) return;

  const fragment = document.createDocumentFragment();

  const groups = this._get_modifiers_groups(this.options.modifiers);

  Object.keys(groups).forEach(group_name => {
    fragment.appendChild(this._create_modifier_group({ groups, group_name }));
  });

  this.modifiers_form_el.appendChild(fragment);
};

Demo.prototype._create_states_controls = function () {
  console.info('Demo._create_states_controls', this.options.states);
  if (!isArrayUsable(this.options.states)) return;
  const fragment = document.createDocumentFragment();

  const input_wrapper_el = node.create({ classNames: 'ph input-wrapper' });

  const fieldset_el = node.create({ type: 'fieldset' });
  const legend_el = node.create({ type: 'legend', textContent: 'States' });

  const selection_controls_el = node.create({ classNames: 'ph selection-controls' });

  this.options.states.forEach(state => {
    const { name } = state;
    const _id = uniqueID();
    const label_el = node.create({
      type: 'Label',
      classNames: 'ph',
      attrs: {
        for: _id
      },
      textContent: name
    });

    const input_el = node.create({
      type: 'input',
      classNames: 'ph selection-control',
      attrs: {
        type: 'radio',
        name: 'radio-modifiers-state',
        id: _id,
        'data-state': name
      }
    });
    if (name.toLowerCase() === 'default') {
      input_el.checked = true;
    }

    this._init_state_on_change(input_el);

    selection_controls_el.appendChild(input_el);
    selection_controls_el.appendChild(label_el);
  });

  fieldset_el.appendChild(legend_el);
  fieldset_el.appendChild(selection_controls_el);
  input_wrapper_el.appendChild(fieldset_el);
  this.states_form_el.appendChild(input_wrapper_el);

  this.states_form_el.appendChild(fragment);
};
Demo.prototype._create_interactions_controls = function () {
  if (!isArrayUsable(this.options.interactions)) return;

  const fragment = document.createDocumentFragment();

  const input_wrapper_el = node.create({ classNames: 'ph input-wrapper' });

  const fieldset = node.create({ type: 'fieldset', classNames: 'ph' });
  const legend = node.create({ type: 'legend', classNames: 'ph', textContent: 'Interactions' });

  const selection_controls_el = node.create({ classNames: 'ph selection-controls' });

  this.options.interactions.forEach(interaction => {
    const { name } = interaction;
    const _id = uniqueID();

    const label = node.create({
      type: 'label',
      classNames: 'ph',
      attrs: {
        for: _id
      },
      textContent: name
    });

    const input = node.create({
      type: 'input',
      classNames: 'ph toggle',
      attrs: {
        type: 'checkbox',
        name: _id,
        id: _id,
        'data-interaction': name
      }
    });

    this._init_interaction_on_change(input);

    selection_controls_el.appendChild(input);
    selection_controls_el.appendChild(label);
  });

  fieldset.appendChild(legend);
  fieldset.appendChild(selection_controls_el);
  input_wrapper_el.appendChild(fieldset);
  this.interactions_form_el.appendChild(input_wrapper_el);

  this.interactions_form_el.appendChild(fragment);
};

Demo.prototype._create_variants_controls = function () {
  console.info('Demo.__create_variants_controls');
  if (!isArrayUsable(this.options.variants)) return;
  if (this.options.variants.length === 1) {
    console.info('Demo.__create_variants_controls:: Creating single variant control');
    this._create_single_variant_control();
  } else {
    console.info('Demo.__create_variants_controls:: Creating variant controls');
    const _id = uniqueID();
    const select = node.create({
      type: 'select',
      classNames: 'ph',
      atts: {
        id: _id,
        name: _id
      }
    });

    this.options.variants.forEach((variant, index) => {
      const { name } = variant;
      const option = node.create({
        type: 'option',
        textContent: name,
        attrs: {
          'data-variant': name,
          value: name
        }
      });

      if (index === 0) {
        option.setAttribute('selected', '');
        if (variant.modifiers) {
          this._create_modifiers({
            el: this.modifiers_form_el,
            modifiers: variant.modifiers,
            variant
          });
        }
      }

      select.appendChild(option);
    });
    this._init_variants_on_change(select);
    this.variants_form_el.appendChild(select);
  }
};

Demo.prototype._get_modifiers_groups = function (modifiers) {
  const a = groupBy(modifiers, 'group');
  console.info('Demo._get_modifiers_groups', modifiers, a);
  return a;
};
Demo.prototype._get_modifiers_group_names = function (modifiers) {
  return Object.keys(this._get_modifiers_groups(modifiers));
};

Demo.prototype._create_modifier_group = function ({ groups, group_name, variant, child = false }) {
  const modifiers = groups[group_name];
  const fieldset_el = node.create({ type: 'fieldset', classNames: 'ph' });

  const legend_el = node.create({ type: 'legend', classNames: 'ph', textContent: humanize(group_name) });
  const input_wrapper_el = node.create({ classNames: `ph input-wrapper ${group_name}` });
  input_wrapper_el.appendChild(fieldset_el);
  fieldset_el.appendChild(legend_el);

  const selection_controls_el = node.create({ classNames: 'ph' });
  selection_controls_el.classList.add('ph');
  selection_controls_el.classList.add('selection-controls');
  // If the group only contains 1 modifier
  // we only produce checkboxes
  modifiers.forEach(modifier => {
    this._create_modifier_group_items({ modifier, selection_controls_el, variant, checkbox: modifiers.length === 1 });
  });

  if (!child) {
    fieldset_el.appendChild(selection_controls_el);
    return input_wrapper_el;
  } else {
    return selection_controls_el;
  }
};

Demo.prototype._create_modifier_group_items = function ({ modifier, selection_controls_el, variant, checkbox }) {
  const { name, group } = modifier;
  const _id = uniqueID();
  const label_el = node.create({
    type: 'label',
    classNames: 'ph',
    textContent: humanize(name),
    attrs: {
      for: _id
    }
  });

  const input_el = node.create({
    type: 'input',
    classNames: 'ph selection-control',
    attrs: {
      id: _id,
      'data-modifier': name,
      'data-modifier-group': group,
      type: checkbox ? 'checkbox' : 'radio',
      name: checkbox ? _id : `radio-modifiers-${group}`
    }
  });

  if (name.toLowerCase() === 'default') {
    input_el.checked = true;
  }

  this._init_modifier_on_change({ input_el, modifier, variant });

  selection_controls_el.appendChild(input_el);
  selection_controls_el.appendChild(label_el);
};

Demo.prototype._create_modifiers = function ({ el, modifiers, variant, child }) {
  console.info('Demo._create_modifiers', { el, modifiers, variant });
  const fragment = document.createDocumentFragment();

  const groups = this._get_modifiers_groups(modifiers);

  Object.keys(groups).forEach(group_name => {
    fragment.appendChild(this._create_modifier_group({ groups, group_name, variant, child }));
  });

  /*if (modifiers.length > 7) {
    createModifiersSelectBox({ fragment, component, opts, variant });
  } else if (modifiers.length > 1 && group_names.length <= 1) {
    const selection_controls = node.create({});
    const fieldset = node.create({type: 'fieldset', classNames: 'ph'});
    fieldset.classList.add('ph');

    const legend = node.create({type: 'legend', classNames: 'ph'});
    const input_wrapper_el = node.create({classNames: 'ph input-wrapper'});

    if (group_names && group_names.length) {
      legend.textContent = humanize(group_names[0]);
      input_wrapper_el.classList.add(group_names[0]);
    } else {
      input_wrapper_el.classList.add('modifiers');
      legend.textContent = 'Modifiers';
    }
    modifiers.forEach(createModifierRadioFactory({ component, opts, selection_controls, variant }));
    input_wrapper_el.appendChild(fieldset);
    fieldset.appendChild(legend);
    fieldset.appendChild(selection_controls);

    fragment.appendChild(input_wrapper_el);
  } else {
    // Create separate fieldsets per group
    const groups = this._get_modifiers_groups(modifiers);
    Object.keys(groups).forEach(group_name => {
      const modifiers = groups[group_name];
      const selection_controls = node.create({});
      const fieldset = node.create({type: 'fieldset', classNames: 'ph'});

      const legend = node.create({type: 'legend', classNames: 'ph', textContent: humanize(group_name)});
      const input_wrapper_el = node.create({classNames: `ph input-wrapper ${group_name}`});

      modifiers.forEach(createModifierToggleFactory({ component, opts, selection_controls, variant }));
      input_wrapper_el.appendChild(fieldset);
      fieldset.appendChild(legend);
      fieldset.appendChild(selection_controls);

      fragment.appendChild(input_wrapper_el);
    });
  }*/

  el.appendChild(fragment);
};

Demo.prototype._init_a11y = async function () {
  this._ally = await new A11y();
};

Demo.prototype._ally_show_results = function (checks) {
  if (!isArrayUsable(checks)) return;

  checks.forEach((check, index) => {
    const { description, help, helpUrl, id, impact, nodes, tags } = check;
    const _details_el = node.create({
      type: 'details',
      classNames: 'ph detail',
      attrs: {
        id: `${id}-${index}`
      }
    });
    const _summary_el = node.create({ type: 'summary', classNames: 'ph summary', textContent: description });
    const _details_content = `
    ${help}

    <a href="${helpUrl}" rel="noreferrer noopener" target="_blank" class="ph">More information</a>
    `;
    _details_el.innerHTML = _details_content;

    _details_el.appendChild(_summary_el);
    this.a11y_el.appendChild(_details_el);
  });
};

Demo.prototype._a11y_test = async function () {
  this._a11y_result = await this._ally.test(this.preview_el.querySelector('*'));
  console.dir(this._a11y_result);

  const _violations_title_el = node.create({ type: 'h2', classNames: 'ph title', textContent: 'Violations' });

  this.a11y_el.appendChild(_violations_title_el);

  if (!isArrayUsable(this._a11y_result.violations)) {
    const _violations_none_el = node.create({
      type: 'p',
      classNames: 'ph',
      textContent: 'No accessibility violations found'
    });
    this.a11y_el.appendChild(_violations_none_el);
  }

  const _passes_title_el = node.create({ type: 'h2', classNames: 'ph title', textContent: 'Passes' });

  this.a11y_el.appendChild(_passes_title_el);

  if (!isArrayUsable(this._a11y_result.passes)) {
    const _passes_none_el = node.create({ type: 'p', classNames: 'ph', textContent: 'No accessibility checks passed' });
    this.a11y_el.appendChild(_passes_none_el);
  } else {
    this._ally_show_results(this._a11y_result.passes);
  }

  const _incomplete_title_el = node.create({ type: 'h2', classNames: 'ph title', textContent: 'Incomplete' });

  this.a11y_el.appendChild(_incomplete_title_el);

  if (!isArrayUsable(this._a11y_result.incomplete)) {
    const _incomplete_none_el = node.create({
      type: 'p',
      classNames: 'ph',
      textContent: 'No accessibility checks incompete'
    });
    this.a11y_el.appendChild(_incomplete_none_el);
  }
};

Demo.prototype._drawer = function () {
  this.states_form_el = form('states');
  this.interactions_form_el = form('interactions');
  this.modifiers_form_el = form('modifiers');
  this.variants_form_el = form('variants');

  this.configuration_el.appendChild(this.variants_form_el);
  this.configuration_el.appendChild(this.interactions_form_el);
  this.configuration_el.appendChild(this.states_form_el);
  this.configuration_el.appendChild(this.modifiers_form_el);

  this._create_variants_controls();
  this._create_interactions_controls();
  this._create_states_controls();
  this._create_global_modifiers_controls();
};

Demo.prototype._settings_backgrounds = function () {
  if (isArrayUsable(this.options.backgrounds)) {
    const fragment = document.createDocumentFragment();
    const container = node.create({ classNames: 'ph menu-container backgrounds' });

    const _id = uniqueID();
    const button = node.create({
      type: 'button',
      classNames: 'ph button backgrounds js-settings-menu icon',
      attrs: {
        type: 'button',
        tabindex: 0,
        id: _id,
        'aria-haspopup': true,
        'aria-controls': `menu-${_id}`,
        'aria-expanded': false,
        'aria-label': 'Backgrounds'
      }
    });

    container.appendChild(button);

    const nav = node.create({
      type: 'nav',
      classNames: 'ph menu right',
      attrs: {
        tabindex: '-1',
        id: `menu-${_id}`,
        role: 'menu',
        'aria-labelledby': _id
      }
    });
    nav.style.top = '48px';

    const ul = node.create({ type: 'ul', classNames: 'ph' });

    this.options.backgrounds.forEach((background, index) => {
      const { name, color } = background;

      const classNames = classnames.cx('ph', {
        'is-active': background.default
      });

      const li = node.create({ type: 'li', classNames: 'ph' });
      const action = node.create({
        type: 'button',
        classNames,
        attrs: {
          type: 'button',
          role: 'menuitem',
          tabindex: '-1',
          'data-name': name,
          'data-color': color,
          'aria-selected': background.default || index === 0 ? true : false
        }
      });

      action.innerHTML = `<span class="if" style="border: 1pt solid rgba(209,217,230,.5);display:inline-block;height: 18px; width: 18px; border-radius: 100%; background-clip: padding-box;background-color: ${color};margin-right: 8px;"></span> ${name}`;

      li.appendChild(action);
      ul.appendChild(li);

      const _handle_background_action_event = e => {
        const actionButton = e.target;
        const color = actionButton.getAttribute('data-color');
        actionButton
          .closest('ul')
          .querySelectorAll('button')
          .forEach(button => {
            button.classList.remove('is-active');
            button.setAttribute('aria-expanded', false);
          });
        actionButton.classList.add('is-active');
        const currentBackgroundColor =
          this.preview_el.style.backgroundColor !== '' ? rgb2hex(this.preview_el.style.backgroundColor) : '';
        if (currentBackgroundColor === color) {
          this.preview_el.style.backgroundColor = '';
          actionButton.setAttribute('aria-selected', false);
        } else {
          this.preview_el.style.backgroundColor = color;
          actionButton.setAttribute('aria-selected', true);
        }
      };

      // action.addEventListener('keyup', e => {
      //   if (e.key == 'Enter') {
      //     _handle_background_action_event(e);
      //   }
      // });
      action.addEventListener('click', _handle_background_action_event);
    });

    nav.appendChild(ul);
    container.appendChild(nav);
    fragment.appendChild(container);
    this.header_el.appendChild(fragment);
  }
};

Demo.prototype._root = function (el) {
  let root_el = el;
  console.log(el);
  if (!root_el) {
    root_el = document.createElement('div');

    classnames.set(root_el, 'ph demo is-embedded');
    document.body.appendChild(root_el);
  } else {
    classnames.set(root_el, 'ph demo');
  }
  console.log(root_el);
  return root_el;
};

Demo.prototype._markup = function () {
  const fragment = document.createRange().createContextualFragment(this.options.markup);
  // We assume that if ONE component is given, that is
  // the component we refer to.
  // If more than one component is given, we assume
  // that it is the FIRST component given that is used for modifiers
  this.component = fragment.firstChild;

  this.component.textContent = this.options.label;

  if (this.options.wrapper) {
    const { el, classNames } = this.options.wrapper;
    if (el && el !== '') {
      this.wrapper_el = node.create({ type: el, classNames });
      this.wrapper_el.appendChild(fragment);
      this.preview_el.appendChild(this.wrapper_el);
    } else {
      this.preview_el.appendChild(fragment);
    }
  } else {
    this.preview_el.appendChild(fragment);
  }
};

Demo.prototype._preview_button_on_click = function (e) {
  const button = e.target;
  if (!this.preview_el.classList.contains('is-active')) {
    this.preview_el.classList.add('is-active');
    button.classList.add('is-active');
    this.a11y_el.classList.remove('is-active');
    this.a11y_button_el.classList.remove('is-active');
    this.html_el.classList.remove('is-active');
    this.html_button_el.classList.remove('is-active');
    this._is_a11y_pane_active = false;
    this._is_html_pane_active = false;
    this._is_preview_pane_active = true;
    setTimeout(
      function () {
        this._speccer();
      }.bind(this),
      300
    );
  }
};

Demo.prototype._html_button_on_click = function (e) {
  const button = e.target;
  if (!this.html_el.classList.contains('is-active')) {
    this.html_el.classList.add('is-active');
    button.classList.add('is-active');
    this.preview_el.classList.remove('is-active');
    this.preview_button_el.classList.remove('is-active');
    this.a11y_el.classList.remove('is-active');
    this.a11y_button_el.classList.remove('is-active');
    this._is_a11y_pane_active = false;
    this._is_html_pane_active = true;
    this._is_preview_pane_active = false;
    this._set_html(true);
  }
};

Demo.prototype._a11y_button_on_click = function (e) {
  const button = e.target;
  if (!this.a11y_el.classList.contains('is-active')) {
    this.a11y_el.classList.add('is-active');
    button.classList.add('is-active');
    this.preview_el.classList.remove('is-active');
    this.preview_button_el.classList.remove('is-active');
    this.html_el.classList.remove('is-active');
    this.html_button_el.classList.remove('is-active');
    this._is_a11y_pane_active = true;
    this._is_html_pane_active = false;
    this._is_preview_pane_active = false;
  }
  this._a11y_test();
};

Demo.prototype._init_preview_button_click = function () {
  this.preview_button_el.removeEventListener('click', this._preview_button_on_click.bind(this));
  this.preview_button_el.addEventListener('click', this._preview_button_on_click.bind(this));
};

Demo.prototype._init_html_button_click = function () {
  this.html_button_el.removeEventListener('click', this._html_button_on_click.bind(this));
  this.html_button_el.addEventListener('click', this._html_button_on_click.bind(this));
};

Demo.prototype._init_a11y_button_click = function () {
  this.a11y_button_el.removeEventListener('click', this._a11y_button_on_click.bind(this));
  this.a11y_button_el.addEventListener('click', this._a11y_button_on_click.bind(this));
};

Demo.prototype._ui = function () {
  stylesheet({ href: 'https://fonts.gstatic.com', rel: 'preconnect' });
  stylesheet({
    href:
      'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap',
    type: 'text/css'
  });

  if (this.options.js !== '') {
    script({ src: this.options.js });
  }

  if (this.options.css !== '') {
    stylesheet({ href: this.options.css });
  }

  this.container_el = node.create({ classNames: 'ph container' });
  this.preview_el = node.create({ classNames: 'ph preview is-active' });
  this.a11y_el = node.create({ classNames: 'ph a11y' });
  if (this.options.html) {
    this.html_el = node.create({ classNames: 'ph html' });
    this.root_el.appendChild(this.html_el);
  }

  if (this.options.embed) {
    document.querySelector('html').classList.add('ph');
    document.querySelector('body').classList.add('ph');
  }

  if (!this.options.ui) {
    this.preview_el.classList.add('no-ui');
  }

  if (this.options.ui) {
    this.configuration_el = node.create({ classNames: 'ph configuration' });
    this.header_el = node.create({ classNames: 'ph header' });

    if (this.options.html) {
      this.preview_button_el = node.create({
        type: 'button',
        classNames: 'ph button text is-active',
        textContent: 'preview'
      });
      this.html_button_el = node.create({ type: 'button', classNames: 'ph button text', textContent: 'html' });
      this.a11y_button_el = node.create({ type: 'button', classNames: 'ph button text', textContent: 'accessibility' });

      this._init_html_button_click();
      this._init_preview_button_click();
      this._init_a11y_button_click();

      this.header_el.appendChild(this.preview_button_el);
      this.header_el.appendChild(this.html_button_el);
      this.header_el.appendChild(this.a11y_button_el);
    }
    this.container_el.appendChild(this.configuration_el);
    this.container_el.appendChild(this.header_el);
  }

  this.container_el.appendChild(this.preview_el);

  if (this.options.html) {
    this.container_el.appendChild(this.html_el);
    this.container_el.appendChild(this.a11y_el);
  }

  this.root_el.appendChild(this.container_el);
};
export default Demo;
