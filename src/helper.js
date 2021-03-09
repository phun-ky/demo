// const getGeneratedPageURL = html => {
//   const getBlobURL = (code, type) => {
//     const blob = new Blob([code], { type });
//     return URL.createObjectURL(blob);
//   };
//
//   const source = `<html class="ph">
//   <head>
//     <meta charset="utf-8" />
//     <meta name="robots" content="none" />
//     <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//   </head>
//   <body class="ph">
//     <div class="ph demo"></div>
//   </body>
// </html>
// `;
//
//   return getBlobURL(source, 'text/html');
// };
//
// const createIframeForMediaQueryExample = (iframe, html) => {
//   if (!iframe || !html) return;
//   const url = getGeneratedPageURL(html);
//   iframe.src = url;
// };
//
// const init = () => {
//   const responsiveExampleTemplates = document.querySelectorAll('[data-responsive]');
//   responsiveExampleTemplates.forEach(template => {
//     if (!template) return;
//     const contentElementId = template.dataset.responsiveId;
//     const html = template.innerHTML;
//     if (!html) return;
//     const iframes = [];
//     iframes.push(
//       document.getElementById(`${contentElementId}-responsive-mobile`),
//       document.getElementById(`${contentElementId}-responsive-tablet-portrait`),
//       document.getElementById(`${contentElementId}-responsive-tablet-landscape`),
//       document.getElementById(`${contentElementId}-responsive-desktop`)
//     );
//     iframes.forEach(iframe => {
//       createIframeForMediaQueryExample(iframe, html);
//     });
//   });
// };
//
// export default init;

const DEMO_CONFIG = {
  position: 'center',
  name: 'Button',
  html: true,
  label: 'Click me',
  css: 'https://if-vid-brand-cdn.azureedge.net/ifdesignsystem.min.css',
  js: 'https://unpkg.com/what-input@5.2.10/dist/what-input.js',
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
