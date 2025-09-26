---
sidebar_position: 3
---

# Creating a New Board Game

This guide explains how to use the `@chess-barebones/core` package to create a new board game from scratch.

## 1. Define Your Game Pieces

The first step is to define the pieces for your game. You can do this by creating a new enum or a union of string literals.

```typescript
enum MyGameFigure {
  PAWN = 'pawn',
  KING = 'king',
}
```

## 2. Create Figure Classes

Next, you'll need to create classes for each of your game pieces. These classes should extend `AbstractFigure` and implement their own logic for moves.

```typescript
import { AbstractFigure, Coordinate } from '@chess-barebones/core';

class Pawn extends AbstractFigure<MyGameFigure> {
  getAvailableMoves(): Coordinate[] {
    // ... implementation
    return [];
  }
  // ... other methods
}
```

## 3. Create a Figure Factory

The `FigureFactory` is responsible for creating the correct type of figure based on its name.

```typescript
import { FigureFactory, AbstractFigure } from '@chess-barebones/core';

class MyGameFigureFactory implements FigureFactory<MyGameFigure> {
  create(name: MyGameFigure, player: Player, board: AbstractBoard<MyGameFigure>, coordinate: Coordinate): AbstractFigure<MyGameFigure> {
    switch (name) {
      case MyGameFigure.PAWN:
        return new Pawn(player, board, coordinate);
      // ... other cases
    }
  }
}
```

## 4. Create a Game Class

Finally, you'll need to create a `Game` class for your game. This class will be responsible for managing the game loop, players, and moves.

```typescript
import { Game, Board8x8 } from '@chess-barebones/core';

class MyGame extends Game<MyGameFigure, any> {
  constructor() {
    const board = new Board8x8<MyGameFigure>(new MyGameFigureFactory());
    // ... other setup
    super(board, serializer, handler);
  }
}
```

With these four steps, you can create any board game you can imagine using the `@chess-barebones/core` package.
