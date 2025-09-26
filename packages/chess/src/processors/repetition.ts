import { AbstractBoard, Player } from '@chess-barebones/core';

import { ResultProcessor, Result } from './result';
import { Figure } from '../figures';

export class RepetitionProcessor extends ResultProcessor {
  private positionCounts = new Map<string, number>();

  private currentPosition = '';

  public constructor(private readonly board: AbstractBoard<Figure>) {
    super();
  }

  public onMove(move: string, player: Player, nextPlayer: Player) {
    this.currentPosition = this.board.serializePosition();
    this.positionCounts.set(
      this.currentPosition,
      (this.positionCounts.get(this.currentPosition) ?? 0) + 1,
    );
    super.onMove(move, player, nextPlayer);
  }

  public check(player: Player) {
    const count = this.positionCounts.get(this.currentPosition) || 0;

    if (count >= 3) {
      this.scorePlayer(player, Result.DRAW);
    }
  }
}
