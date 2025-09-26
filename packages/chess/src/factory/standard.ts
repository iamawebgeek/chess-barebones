import {
  AbstractBoard,
  AbstractFigure,
  Coordinate,
  FigureFactory,
  NotCaptured,
  Player,
} from '@chess-barebones/core';

import { applyCheckDecorator, applyPinDecorator } from '../decorators';
import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from '../figures';

const DecoratedFigures = {
  [Figure.KING]: King,
  [Figure.BISHOP]: applyCheckDecorator(applyPinDecorator(Bishop)),
  [Figure.ROOK]: applyCheckDecorator(applyPinDecorator(Rook)),
  [Figure.KNIGHT]: applyCheckDecorator(applyPinDecorator(Knight)),
  [Figure.QUEEN]: applyCheckDecorator(applyPinDecorator(Queen)),
  [Figure.PAWN]: applyCheckDecorator(applyPinDecorator(Pawn)),
};

export class ChessFigureFactory implements FigureFactory<Figure> {
  public create(
    name: Figure,
    player: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    const DecoratedFigure = DecoratedFigures[name];
    return new DecoratedFigure(player, board, coordinate) as AbstractFigure<
      Figure,
      NotCaptured
    >;
  }
}
