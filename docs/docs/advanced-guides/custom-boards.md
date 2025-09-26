---
sidebar_position: 4
---

# Custom Boards

This guide explains how to create a custom board for a different shape, for example, to play with 4 people.

## The `AbstractBoard` Class

The `@chess-barebones/core` package provides the `AbstractBoard` class, which can be extended to create a board of any shape or size. You'll need to implement the following methods:

-   `getCoordinateWithVector(coordinate: Coordinate, vector: [number, number]): Coordinate | null`
-   `serializeCoordinate(coordinate: Coordinate): string`
-   `deserializeCoordinate(coordinate: string): Coordinate`

## Example: A 4-Player Board

Here is an example of how to create a 4-player board. The board is a 14x14 grid with a 3x8 area for each player's pieces.

```typescript
import { AbstractBoard, Coordinate } from '@chess-barebones/core';

class FourPlayerBoard extends AbstractBoard<MyGameFigure> {
  // Implement the abstract methods

  getCoordinateWithVector(coordinate: Coordinate, vector: [number, number]): Coordinate | null {
    const newX = coordinate.x + vector[0];
    const newY = coordinate.y + vector[1];

    if (newX < 0 || newX >= 14 || newY < 0 || newY >= 14) {
      return null;
    }

    // Add logic to handle the non-playable areas of the board

    return { x: newX, y: newY };
  }

  serializeCoordinate(coordinate: Coordinate): string {
    // ... implementation
    return `${coordinate.x},${coordinate.y}`;
  }

  deserializeCoordinate(coordinate: string): Coordinate {
    // ... implementation
    const [x, y] = coordinate.split(',').map(Number);
    return { x, y };
  }
}
```

## Using the Custom Board

Once you have created your custom board, you can use it to create a new `Game`.

```typescript
import { Game } from '@chess-barebones/core';

const board = new FourPlayerBoard(new MyGameFigureFactory());
const game = new Game(board, serializer, handler);
```
