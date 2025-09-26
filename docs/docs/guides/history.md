---
sidebar_position: 5
---

# History

This guide explains how to use the `HistoryProcessor` to add move history and navigation to your game.

## The `HistoryProcessor`

The `HistoryProcessor` from `@chess-barebones/chess` is a `Handler` that records the history of the game, allowing for undo and redo functionality.

## Usage

To use the `HistoryProcessor`, you'll need to add it to your `Game`'s handler.

```typescript
import { combineHandlers } from '@chess-barebones/core';
import { StandardChessInitializer, HistoryProcessor } from '@chess-barebones/chess';

const historyProcessor = new HistoryProcessor(board);

const handler = combineHandlers([
  new StandardChessInitializer(board),
  historyProcessor,
]);

const game = new RegularChess(board, handler);
```

## API

-   `undoMove()`: Undoes the last move.
-   `previousMove()`: Navigates to the previous move in the history.
-   `nextMove()`: Navigates to the next move in the history.
-   `getAllMoves()`: Returns an array of all the moves in the history.
