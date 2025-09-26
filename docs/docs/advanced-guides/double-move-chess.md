---
sidebar_position: 2
---

# Double-Move Chess

Double-Move Chess is a variant where each player can make two moves in a row. This can be implemented by creating a custom `Game` class that overrides the `getPlayerToMove` method.

## Example

```typescript
import { Game, Player } from '@chess-barebones/core';

class DoubleMoveChess extends Game<Figure, any> {
  private moveCount = 0;

  getPlayerToMove(): Player | null {
    if (this.moveCount % 2 === 0) {
      return super.getPlayerToMove();
    }
    return this.state.lastMovedPlayer;
  }

  move(move: string): void {
    super.move(move);
    this.moveCount++;
  }
}
```
