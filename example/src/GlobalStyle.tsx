import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a; /* slate-900 */
    --bg2: #1e293b; /* slate-800 */
    --accent: #10b981; /* emerald-500 */
    --text: rgba(255, 255, 255, 0.9);
    --muted: rgba(255, 255, 255, 0.6);

    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
    line-height: 1.5;
    font-weight: 400;
    color-scheme: dark;
    color: var(--text);
    background: radial-gradient(1200px 800px at 10% 10%, rgba(16, 185, 129, 0.15), transparent 60%),
      radial-gradient(1200px 800px at 90% 90%, rgba(16, 185, 129, 0.12), transparent 60%),
      linear-gradient(180deg, var(--bg1), var(--bg2));

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-color-scheme: light) {
    :root {
      --bg1: #f8fafc;
      --bg2: #e2e8f0;
      --text: #213547;
      --muted: rgba(0, 0, 0, 0.6);
      color: var(--text);
      background: radial-gradient(1000px 700px at 10% 10%, rgba(16,185,129,0.12), transparent 60%),
        radial-gradient(1000px 700px at 90% 90%, rgba(16,185,129,0.1), transparent 60%),
        linear-gradient(180deg, var(--bg1), var(--bg2));
    }
  }

  /* Page layout */
  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    display: grid;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    padding: 24px;
  }

  /* Root container from former App.css */
  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
`;
