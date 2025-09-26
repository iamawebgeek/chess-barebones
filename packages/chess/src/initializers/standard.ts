import { Board8x8, Handler, Player, XLine, YLine } from '@chess-barebones/core';

import { Figure } from '../figures';

const frontlinePieces = [
  [
    Figure.PAWN,
    [XLine.A, XLine.B, XLine.C, XLine.D, XLine.E, XLine.F, XLine.G, XLine.H],
  ],
] as const;
const backlinePieces = [
  [Figure.ROOK, [XLine.A, XLine.H]],
  [Figure.KNIGHT, [XLine.B, XLine.G]],
  [Figure.BISHOP, [XLine.C, XLine.F]],
  [Figure.QUEEN, [XLine.D]],
  [Figure.KING, [XLine.E]],
] as const;

export class StandardChessInitializer implements Handler {
  public constructor(private readonly board: Board8x8<Figure>) {}

  public onPlayerAdded(player: Player) {
    const [frontline, backline] =
      player.color === 'white' ? [YLine._2, YLine._1] : [YLine._7, YLine._8];
    frontlinePieces.forEach(([figureName, xLines]) => {
      xLines.forEach((x) => {
        this.board.createFigure(figureName, player, { x, y: frontline });
      });
    });
    backlinePieces.forEach(([figureName, xLines]) => {
      xLines.forEach((x) => {
        this.board.createFigure(figureName, player, { x, y: backline });
      });
    });
  }
}
