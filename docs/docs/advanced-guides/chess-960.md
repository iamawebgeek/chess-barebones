---
sidebar_position: 1
---

# Chess 960

Chess 960, also known as Fischer Random Chess, is a variant where the initial position of the pieces on the back rank is randomized. The Chess barebones library can be extended to support Chess 960 by creating a custom `Handler` that randomizes the back rank.

## Example

```typescript
import { Handler, Player, Board8x8 } from '@chess-barebones/core';
import { Figure, King, Queen, Rook, Bishop, Knight } from '@chess-barebones/chess';

class Chess960Initializer implements Handler {
  constructor(private board: Board8x8<Figure>) {}

  onPlayerAdded(player: Player) {
    // 1. Place pawns in their standard position

    // 2. Generate a random permutation of the back rank pieces
    const backRank = this.shuffle([Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook]);

    // 3. Place the pieces on the board
  }

  private shuffle(array: any[]): any[] {
    // ... implementation of shuffle algorithm
    return array;
  }
}
```
