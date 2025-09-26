import { AbstractBoard, Player } from '@chess-barebones/core';

import { Result, ResultProcessor } from './result';

export class StalemateProcessor<T extends string> extends ResultProcessor {
  public constructor(private board: AbstractBoard<T>) {
    super();
  }

  public check(_: Player, player: Player) {
    const noMoves = this.board
      .getPlayerFigures(player)
      .every((figure) => figure.getAvailableMoves().length === 0);
    if (noMoves) {
      this.scorePlayer(player, Result.DRAW);
    }
  }
}
