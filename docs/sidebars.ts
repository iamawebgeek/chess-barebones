import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/packages',
        'getting-started/philosophy',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/core-concepts',
        'guides/react-integration',
        'guides/puzzles',
        'guides/timers',
        'guides/history',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Guides',
      items: [
        'advanced-guides/chess-960',
        'advanced-guides/double-move-chess',
        'advanced-guides/creating-a-new-board-game',
        'advanced-guides/custom-boards',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'category',
          label: 'Core',
          items: [
            'api-reference/core/index',
            'api-reference/core/game',
            'api-reference/core/board',
            'api-reference/core/figure',
            'api-reference/core/player',
          ],
        },
        {
          type: 'category',
          label: 'Chess',
          items: [
            'api-reference/chess/index',
            'api-reference/chess/figures',
            'api-reference/chess/processors',
            'api-reference/chess/decorators',
          ],
        },
        {
          type: 'category',
          label: 'React',
          items: [
            'api-reference/react/index',
            'api-reference/react/chess-component',
            'api-reference/react/regular-chess-component',
            'api-reference/react/puzzle',
            'api-reference/react/use-observables-state',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
