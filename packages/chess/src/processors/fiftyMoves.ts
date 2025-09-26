import { AbstractBoard, Player } from '@chess-barebones/core';

import { Result, ResultProcessor } from './result';
import { Figure } from '../figures';

export class FiftyMovesProcessor extends ResultProcessor {
  private staleMoves = 0;
  private captures = 0;

  public constructor(private board: AbstractBoard<Figure>) {
    super();
  }

  public onMove(move: string, player: Player, nextPlayer: Player) {
    const captures = this.board
      .getAllFigures()
      .filter((figure) => figure.state.captured).length;
    if (
      captures > this.captures ||
      this.board.lastMoved?.name === Figure.PAWN
    ) {
      this.staleMoves = 0;
    } else {
      this.staleMoves++;
    }
    this.captures = captures;
    super.onMove(move, player, nextPlayer);
  }

  public check(player: Player) {
    if (this.staleMoves >= 100) {
      this.scorePlayer(player, Result.DRAW);
    }
  }
}
