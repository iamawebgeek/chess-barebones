import {
  BaseFigure,
  checkCoordinatesEquality,
  InvalidStateError,
} from '@chess-barebones/core';

import { Bishop, Figure, Knight, Pawn, Queen, Rook } from '../figures';

export type CheckDecoratableFigures =
  | typeof Bishop
  | typeof Knight
  | typeof Pawn
  | typeof Rook
  | typeof Queen;

export const applyCheckDecorator = <T extends CheckDecoratableFigures>(
  FigureClass: T,
): T => {
  const Casted = FigureClass as unknown as new (
    ...args: any[]
  ) => BaseFigure<Figure>;

  return class CheckDecoratedFigure extends Casted {
    public getAvailableMoves() {
      if (this.state.captured) return [];
      const kingState =
        this.board.getPlayerFiguresByName(this.owner, Figure.KING)[0]?.state ??
        null;
      if (kingState === null || kingState.captured) {
        throw new InvalidStateError(
          this.board,
          `King is not on the board for player "${this.owner.color}"`,
        );
      }
      const kingsCoordinate = kingState.coordinate;
      const checkingFigures = this.board
        .getFiguresReachCoordinate(kingsCoordinate)
        .filter((figure) => figure.owner !== this.owner);
      if (checkingFigures.length === 0) {
        return super.getAvailableMoves();
      }
      if (checkingFigures.length > 1) {
        // double check forces only king move
        return [];
      }
      const checkerCoordinate = checkingFigures[0].state.coordinate;
      const checkingMoves = this.board.getPathBetweenCoordinates(
        kingsCoordinate,
        checkerCoordinate,
      );
      return super.getAvailableMoves().filter((move) => {
        // return only moves that could block the checker's path
        // valid move if the checker can be captured
        if (checkingMoves.length === 0) {
          return checkCoordinatesEquality(checkerCoordinate, move);
        }
        return checkingMoves.some((coordinate) =>
          checkCoordinatesEquality(coordinate, move),
        );
      });
    }
  } as unknown as T;
};
