---
sidebar_position: 3
---

# Puzzles

This guide explains how to create interactive puzzles with Chess barebones.

## The `PuzzleProcessor`

The `PuzzleProcessor` from `@chess-barebones/core` allows you to create interactive puzzles. A puzzle is defined by an initial position and a sequence of moves. The initial position should be the serialization of the board that could be obtained by calling `serializePosition` method on a board instance.

The `PuzzleProcessor` supports both synchronous and asynchronous generator functions for the `movesGenerator`. The generator function should yield moves until the puzzle is solved. When the player makes a move, the `PuzzleProcessor` will check if it matches the next move from the generator. If it does, the processor will make the next move for the opponent.

## The `Puzzle` Component

The `Puzzle` component from `@chess-barebones/chess-react` makes it easy to render a puzzle in a React application.

### Example

```tsx
import { Puzzle } from '@chess-barebones/chess-react';

async function* myPuzzle() {
  let moveNumber = 0;
  while (++moveNumber < 5) {
    yield await getMove(moveNumber);
  }
}

<Puzzle
  initialPosition="w-king-1:e1:-;b-king-1:e8:-;"
  movesGenerator={myPuzzle}
  components={{ Board, Figure, MoveHighlight, PawnPromotionMenu }}
/>;
```
