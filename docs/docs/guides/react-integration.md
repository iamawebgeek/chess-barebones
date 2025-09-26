---
sidebar_position: 2
---

# React Integration

This guide explains how to integrate Chess barebones with React using the `@chess-barebones/chess-react` package.

## The `Chess` Component

The `Chess` component is a generic renderer that takes an existing `Game` and `Board` instance, plus a set of UI components, and renders the game. This component gives you full control over the rendering of the board and pieces.

## The `RegularChess` Component

The `RegularChess` component is a convenience component that wires up a ready-to-play chess game for you. It creates an 8x8 board, sets up the standard initial position, creates a `RegularChess` game, and renders it using the `Chess` component.

## The `Puzzle` Component

The `Puzzle` component renders a `Game` configured with the `PuzzleProcessor` from `@chess-barebones/core`. You provide an `initialPosition` and a `movesGenerator` to create an interactive puzzle.

## The `useObservablesState` Hook

The `useObservablesState` hook is a small utility that allows you to subscribe to an `ObservableState` instance and re-render your component when its state changes. The `Chess` component uses this hook to subscribe to the `chessInstance` and `boardInstance`.

## Styling

The `@chess-barebones/chess-react` package does not provide any styling for the board or pieces. You are responsible for providing your own CSS to style the game.

## Custom Board Example

Here is an example of how to create a custom `Board` component and handle user input.

```tsx
import * as React from 'react';
import { RegularChess } from '@chess-barebones/chess-react';
import { Figure, Move } from '@chess-barebones/chess';

const CustomBoard = ({ boardFigures, moves, promotionMenu }) => {
  const renderSquares = () => {
    const squares = [];
    for (let y = 8; y >= 1; y--) {
      for (let x = 1; x <= 8; x++) {
        const square = (x + y) % 2 === 0 ? 'white' : 'black';
        squares.push(
          <div key={`${x}-${y}`} className={`square ${square}`}>
            {/* Render figure, move highlights, etc. */}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="board">
      {renderSquares()}
      {boardFigures}
      {moves}
      {promotionMenu}
    </div>
  );
};

const FigureComponent = ({ name, color, onSelect }) => (
  <div className={`figure ${name} ${color}`} onClick={onSelect}>
    {/* Render figure SVG or image */}
  </div>
);

const MoveHighlight = ({ onSelect }) => (
  <div className="move-highlight" onClick={onSelect} />
);

const PawnPromotionMenu = ({ onSelect, onCancel }) => (
  <div className="promotion-menu">
    <button onClick={() => onSelect(Figure.QUEEN)}>Q</button>
    <button onClick={() => onSelect(Figure.ROOK)}>R</button>
    <button onClick={() => onSelect(Figure.BISHOP)}>B</button>
    <button onClick={() => onSelect(Figure.KNIGHT)}>N</button>
    <button onClick={onCancel}>X</button>
  </div>
);

export default function App() {
  return (
    <RegularChess
      components={{
        Board: CustomBoard,
        Figure: FigureComponent,
        MoveHighlight,
        PawnPromotionMenu,
      }}
      playingFor="white"
    />
  );
}
```
