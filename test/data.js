export const button = {
  position: 'center',
  name: 'Button',
  html: true,
  label: 'Button',
  css: 'https://if-vid-brand-cdn.azureedge.net/ifdesignsystem.min.css',
  js: 'https://unpkg.com/what-input@5.2.10/dist/what-input.js',
  markup: '<button data-speccer-measure="height right" type="button" class="if button"></button>',
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
      color: '#f1ece8',
      default: true
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
export const input = {
  position: 'center',
  name: 'Input',
  html: 'true',
  css: 'https://if-vid-brand-cdn.azureedge.net/ifdesignsystem.min.css',
  js: 'https://unpkg.com/what-input@5.2.10/dist/what-input.js',
  markup: `<input placeholder="Placeholder text" name="identifier" id="identifier" type="text" class="if input-field">
    <label class="if" for="identifier">Label text</label>
    <span class="if input-help">
      Help text
    </span>
    <span class="if input-error">
      Error/Validation text
    </span>`,
  wrapper: {
    el: 'div',
    classNames: 'if input-wrapper'
  },
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
      default: true,
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
      name: 'Input field',
      classNames: 'if input-field'
    }
  ],
  states: [
    {
      name: 'Disabled',
      attributes: {
        disabled: 'disabled'
      }
    },
    {
      name: 'Closed',
      classNames: 'is-closed'
    },
    {
      name: 'Invalid',
      attributes: {
        invalid: 'invalid'
      }
    }
  ],
  modifiers: [
    {
      name: 'Default',
      group: 'mandatory',
      classNames: ''
    },
    {
      name: 'Required',
      group: 'mandatory',
      attributes: {
        required: 'required'
      }
    },
    {
      name: 'Optional',
      group: 'mandatory',
      classNames: 'is-optional'
    },
    {
      name: 'With icon',
      group: 'icon',
      classNames: 'icon symbol bulb-on',
      modifiers: [
        {
          name: 'Trailing',
          group: 'icon-trailing',
          classNames: 'trailing'
        }
      ]
    }
  ],
  interactions: [
    {
      name: 'Focused',
      classNames: 'is-focused',
      previewAttributes: {
        'data-whatinput': 'keyboard'
      }
    }
  ]
};
