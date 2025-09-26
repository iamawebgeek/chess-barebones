<h1 align="center">
  <img src="docs/logo.svg" width="120" alt="Chess Barebones Logo" /><br /> Chess-barebones
</h1>
<h3 align="center">TypeScript‑first, modular engine for building chess and chess‑like games, plus headless React bindings.</h3>

<p align="center">
  <a href="https://pnpm.io"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-workspace-orange" /></a>
  <a href="https://turbo.build"><img alt="Turborepo" src="https://img.shields.io/badge/build-Turborepo-blue" /></a>
  <a href="https://vitest.dev"><img alt="Vitest" src="https://img.shields.io/badge/tests-Vitest-729B1B" /></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6" /></a>
  <a href="https://github.com/changesets/changesets"><img alt="Releases: Changesets" src="https://img.shields.io/badge/release-Changesets-7B42BC" /></a>
</p>

---

Chess Barebones is a small, focused monorepo you can use to build chess engines, variants, and chess‑like board games. It exposes strongly typed primitives (board, figures, players, game), a pluggable rules/processor pipeline, robust move (de)serializers, and optional React bindings that are fully headless so you can bring your own UI.

## Highlights

- TypeScript‑first API with strict typing end‑to‑end
- Observable state (subscribe to game/board/figure changes)
- Composable handlers pipeline (enforce rules, react to events)
- Algebraic notation and FEN I/O (in the chess package)
- 8×8 board helpers and coordinate utilities
- Headless React bindings with full control over rendering

## Documentation

Visit our [official documentation](https://iamawebgeek.github.io/chess-barebones).

## Getting Started

Install what you need. Headless engine only:

```bash
pnpm add @chess-barebones/core @chess-barebones/chess
# or: npm i @chess-barebones/core @chess-barebones/chess
```

React bindings:

```bash
pnpm add @chess-barebones/chess-react react react-dom
```

### Quick start (headless chess)

```ts
import { combineHandlers } from '@chess-barebones/core';
import {
  RegularChess,
  Figure,
  ChessFigureFactory,
  ChessBoard8x8,
  StandardChessInitializer,
} from '@chess-barebones/chess';

const board = new ChessBoard8x8(new ChessFigureFactory());
const game = new RegularChess(board, new StandardChessInitializer(board));

game.start();

game.move('e4'); // White
game.move('e5'); // Black
game.move('Nf3');

console.log(game.state.started, game.state.ended); // true, false
console.log(board.serializePosition()); // FEN piece placement
```

> Tip: You can load a position directly from FEN using ChessBoard8x8#loadPosition.

## React Usage

The React bindings are headless. You provide UI primitives (Board, Figure, Capture, MoveHighlight, etc.) and wire them through the provided components and hooks.

```tsx
import { RegularChess } from '@chess-barebones/chess-react';

const App = () => {
  return (
    <RegularChess
      components={{
        Board: YourBoard,
        Figure: YourFigure,
        Capture: YourCapture,
        MoveHighlight: YourMoveHighlight,
        PawnPromotionMenu: YourPromotionMenu,
      }}
    />
  );
}
```

## Repository Layout

```
Chess barebones/
├─ packages/
│  ├─ core/         # board/game primitives
│  ├─ chess/        # chess rules, figures, serializers, processors
│  └─ chess-react/  # headless React bindings
├─ components/       # example UI blocks (private)
├─ docs/             # Docusaurus documentation site
└─ example/          # playground(s), local demos
```

## Contributing

We welcome issues and PRs. For larger changes, please open a discussion first.

## License

See [LICENSE](https://github.com/iamawebgeek/chess-barebones/blob/main/LICENSE)
