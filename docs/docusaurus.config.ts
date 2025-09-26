import { themes as prismThemes } from 'prism-react-renderer';

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Chess Barebones',
  tagline: 'Everything you need to build chess like or other board games',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://iamawebgeek.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/chess-barebones/',

  // GitHub pages deployment config.
  organizationName: 'iamawebgeek', // Usually your GitHub org/user name.
  projectName: 'chess-barebones', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          editUrl:
            'https://github.com/iamawebgeek/chess-barebones/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/iamawebgeek/chess-barebones/tree/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Chess Barebones',
      logo: {
        alt: 'Chess Barebones Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'chess-builder', label: 'Builder', position: 'left' },
        {
          href: 'https://github.com/iamawebgeek/chess-barebones',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: 'docs/getting-started/overview',
            },
            {
              label: 'Core Package',
              to: 'docs/api-reference/core',
            },
            {
              label: 'Chess Package',
              to: 'docs/api-reference/chess',
            },
            {
              label: 'React',
              to: 'docs/api-reference/react',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/iamawebgeek/chess-barebones',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'Builder',
              to: 'chess-builder',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Chess Barebones. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
