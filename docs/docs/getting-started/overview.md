---
sidebar_position: 1
---

# Overview

Welcome to the documentation for Chess barebones! This guide will help you get started with using the library to build your own chess applications.

## Installation

Chess barebones is a monorepo that consists of three packages:

-   `@chess-barebones/core`: The core library that provides the fundamental building blocks for creating turn-based, board-centric games.
-   `@chess-barebones/chess`: A concrete implementation of the rules of chess, built on top of `@chess-barebones/core`.
-   `@chess-barebones/chess-react`: A set of React components for rendering a chess game in a React application.

To get started, you'll need to install these packages from npm:

```bash
npm install @chess-barebones/core @chess-barebones/chess @chess-barebones/chess-react
```

## Quick Start

Here's a quick example of how to use the `RegularChess` component from `@chess-barebones/chess-react` to render a chess game:

```tsx
import * as React from 'react';
import { RegularChess } from '@chess-barebones/chess-react';

// Provide minimal UI components the library will use to render
const Board = ({ boardFigures, moves, promotionMenu }: any) => (
  <div className="board">
    {boardFigures}
    {moves}
    {promotionMenu}
  </div>
);

const Figure = ({ figure, onSelect }: any) => (
  <div onClick={onSelect}>{figure.name}</div>
);

const MoveHighlight = ({ onSelect }: any) => (
  <button onClick={onSelect} className="move" />
);

const PawnPromotionMenu = ({ onSelect, onCancel }: any) => (
  <div>
    <button onClick={() => onSelect('queen')}>Q</button>
    <button onClick={onCancel}>X</button>
  </div>
);

export default function App() {
  return (
    <RegularChess
      components={{ Board, Figure, MoveHighlight, PawnPromotionMenu }}
      playingFor="white"
    />
  );
}
```

This example will render a fully functional chess game with the standard initial position. The `@chess-barebones/chess-react` package does not provide any styling, so you'll need to provide your own CSS to style the board and pieces.

## Next Steps

-   **Guides**: Learn about the core concepts of the library and how to use it to build more advanced features.
-   **API Reference**: Explore the detailed API documentation for each package.
