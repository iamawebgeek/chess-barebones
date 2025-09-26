import { AbstractBoard, Player } from '@chess-barebones/core';

import { Figure } from '../figures';
import { Result, ResultProcessor } from './result';

export class CheckmateProcessor extends ResultProcessor {
  public constructor(private board: AbstractBoard<Figure>) {
    super();
  }

  public check(_: Player, nextPlayer: Player) {
    const king = this.board.getPlayerFiguresByName(nextPlayer, Figure.KING)[0];
    if (
      king &&
      !king.state.captured &&
      king.state.coordinate &&
      this.board
        .getFiguresReachCoordinate(king.state.coordinate)
        .filter((figure) => figure.owner !== nextPlayer).length > 0
    ) {
      const hasNoMoves = this.board
        .getPlayerFigures(nextPlayer)
        .every((figure) => figure.getAvailableMoves().length === 0);
      if (hasNoMoves) {
        this.scorePlayer(nextPlayer, Result.LOSS);
      }
    }
  }
}
