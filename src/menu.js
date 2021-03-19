/* eslint no-console:0 */
'use strict';
import debounce from './lib/debounce';
import * as events from './lib/events';
import * as classnames from './lib/classnames';
import * as attributes from './lib/attributes';
import * as styles from './lib/styles';

const SettingsMenu = function (el) {
  this._trigger_el = el;
  this._init();
};

SettingsMenu.prototype._init = function () {
  this._index_of_options = 0;
  this._all_options = null;

  this._settings_menu_holder_el = this._trigger_el.parentElement;
  this._settings_menu_el = this._settings_menu_holder_el.querySelector('.ph.menu');
  this._settings_menu_list_el = this._settings_menu_holder_el.querySelector('.ph.menu > ul.ph');

  events.toggle(this._trigger_el, 'click', this._handle_menu_click.bind(this));
  events.toggle(this._trigger_el, 'keyup', this._handle_menu_keypress.bind(this));

  this._adjust_placement();
};

SettingsMenu.prototype._remove_previously_selected_menu_item = function () {
  const _selected = this._settings_menu_list_el.querySelectorAll('.is-focused, [aria-selected="true"]');
  _selected.forEach(li => {
    classnames.remove(li, 'is-focused');
    attributes.set(li, { 'aria-selected': false });
  });
};

SettingsMenu.prototype._handle_click_outside_menu = function (e) {
  if (e.target == this._trigger_el) return;

  if (this._settings_menu_el.classList.contains('is-open')) {
    if (!this._settings_menu_list_el.contains(e.target)) {
      this._close_menu();
    }
  }
};

SettingsMenu.prototype._close_menu = function () {
  this._reset_index_of_options();
  this._remove_previously_selected_menu_item();
  classnames.remove(this._settings_menu_el, 'is-open');
  classnames.remove(this._settings_menu_list_el, 'is-open');
  attributes.set(this._trigger_el, { 'aria-expanded': false });
  classnames.remove(this._trigger_el, 'is-active');
  events.remove(window, 'resize', this._adjust_placement.bind(this));
  events.remove(document, 'click', this._handle_click_outside_menu.bind(this));
};

SettingsMenu.prototype._adjust_placement = debounce(function () {
  const _trigger_el_rect = this._trigger_el.getBoundingClientRect();
  const _settings_menu_holder_el_rect = this._settings_menu_holder_el.getBoundingClientRect();
  const _bottom = _settings_menu_holder_el_rect.bottom - _trigger_el_rect.bottom + _trigger_el_rect.height + 8 + 'px';

  styles.add(this._settings_menu_el, { bottom: _bottom });
}, 300);

SettingsMenu.prototype._open_menu = function () {
  this._update_all_options(this._settings_menu_list_el.querySelectorAll('li:not(.separator)'));
  classnames.set(this._settings_menu_el, 'is-open');
  classnames.set(this._settings_menu_list_el, 'is-open');
  classnames.set(this._trigger_el, 'is-active');
  attributes.set(this._trigger_el, { 'aria-expanded': true });

  events.toggle(document, 'click', this._handle_click_outside_menu.bind(this));
  events.toggle(window, 'resize', this._adjust_placement.bind(this));
};

SettingsMenu.prototype._handle_menu_click = function () {
  if (this._settings_menu_el.classList.contains('is-open')) {
    const _selected = this._settings_menu_list_el.querySelector('li[aria-selected="true"]');
    if (_selected) {
      _selected.querySelector('a,button').click();
      this._reset_index_of_options();
    }
    this._close_menu();
  } else {
    this._open_menu();
  }
};

SettingsMenu.prototype._update_all_options = function (nodes) {
  this._all_options = Array.prototype.slice.call(nodes).filter(node => !node.querySelector('[disabled]'));
};
SettingsMenu.prototype._reset_index_of_options = function () {
  this._index_of_options = 0;
};

SettingsMenu.prototype._handle_menu_keypress = function (e) {
  // if (e.key === 'Enter') {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   const selected = _settings_menu_list_el.querySelector('li.is-focused');
  //   if (_settings_menu_list_el.classList.contains('is-open') && selected) {
  //     this._reset_index_of_options();
  //     this._close_menu();
  //   }
  //   return false;
  // }

  if (this._settings_menu_list_el.classList.contains('is-open')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      return false;
    }

    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
      let _next_menu_item_el;
      e.preventDefault();
      if (e.key == 'ArrowUp') {
        _next_menu_item_el = this._all_options[--this._index_of_options];
        if (!_next_menu_item_el) {
          this._index_of_options = this._all_options.length - 1;
          _next_menu_item_el = this._all_options[this._index_of_options];
        }

        this._remove_previously_selected_menu_item();
        classnames.set(_next_menu_item_el, 'is-focused');
        attributes.set(_next_menu_item_el, { 'aria-selected': true });
      } else if (e.key == 'ArrowDown') {
        _next_menu_item_el = this._all_options[++this._index_of_options];
        if (!_next_menu_item_el) {
          this._index_of_options = 0;
          _next_menu_item_el = this._all_options[this._index_of_options];
        }
        this._remove_previously_selected_menu_item();
        classnames.set(_next_menu_item_el, 'is-focused');
        attributes.set(_next_menu_item_el, { 'aria-selected': true });
      }
    }
  }
};

export default SettingsMenu;
