import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export function addCodeCopyButton() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'pre' && node.children.some(child => child.tagName === 'code')) {
        // Remove any tabindex attributes from the pre element
        if (node.properties) {
          delete node.properties.tabindex;
        }

        // Create the copy button with an icon
        const copyButton = h('button', {
          className: 'copy-code-button',
          'aria-label': 'Copy code',
          type: 'button'
        }, [
          h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
            h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
          ])
        ]);

        // Create a wrapper div
        const wrapper = h('div', { className: 'code-block-wrapper' }, [node, copyButton]);

        // Replace the original pre node with our wrapper
        parent.children.splice(index, 1, wrapper);
      }
    });
  };
} 