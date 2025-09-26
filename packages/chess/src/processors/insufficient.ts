import { AbstractBoard, Player } from '@chess-barebones/core';

import { Figure } from '../figures';
import { Result, ResultProcessor } from './result';

const checkmateInsufficientFigures = [
  Figure.KNIGHT,
  Figure.BISHOP,
  Figure.KING,
];

export class InsufficientMaterialsProcessor extends ResultProcessor {
  public constructor(private board: AbstractBoard<Figure>) {
    super();
  }

  public check(player: Player) {
    const insufficientMaterials = this.players.every((player) => {
      const figures = this.board
        .getPlayerFigures(player)
        .filter((figure) => !figure.state.captured);
      return (
        figures.length < 3 &&
        figures.every((figure) =>
          checkmateInsufficientFigures.includes(figure.name),
        )
      );
    });
    if (insufficientMaterials) {
      this.scorePlayer(player, Result.DRAW);
    }
  }
}
