import {
  BaseFigure,
  checkCoordinatesEquality,
  getRelativeDirection,
  InvalidStateError,
} from '@chess-barebones/core';

import { Bishop, Figure, Knight, Pawn, Queen, Rook } from '../figures';

const pinningFigures = [Figure.BISHOP, Figure.ROOK, Figure.QUEEN] as Readonly<
  Figure[]
>;

export type PinnableFigures =
  | typeof Bishop
  | typeof Knight
  | typeof Pawn
  | typeof Rook
  | typeof Queen;

export const applyPinDecorator = <T extends PinnableFigures>(
  FigureClass: T,
): T => {
  const Casted = FigureClass as unknown as new (
    ...args: any[]
  ) => BaseFigure<Figure>;

  return class PinDecoratedFigure extends Casted {
    public getAvailableMoves() {
      if (this.state.captured) return [];
      const coordinate = this.state.coordinate;
      const king =
        this.board.getPlayerFiguresByName(this.owner, Figure.KING)[0] ?? null;
      const kingState = king?.state;
      if (kingState === null || kingState.captured) {
        throw new InvalidStateError(
          this.board,
          `King is not on the board for player "${this.owner.color}"`,
        );
      }
      const kingsCoordinate = kingState.coordinate;
      const kingToFigureDirection = getRelativeDirection(
        kingsCoordinate,
        coordinate,
      );
      if (kingToFigureDirection !== null) {
        const path = this.board.getPathBetweenCoordinates(
          kingsCoordinate,
          coordinate,
        );
        path.pop();
        if (
          path.every((coordinate) => this.board.getFigure(coordinate) === null)
        ) {
          const pinningAttacker =
            this.board.getFiguresReachCoordinate(coordinate).find((figure) => {
              const figureToAttackerDirection = getRelativeDirection(
                coordinate,
                figure.state.coordinate,
              );
              return (
                pinningFigures.includes(figure.name) &&
                kingToFigureDirection === figureToAttackerDirection &&
                figure.owner !== king.owner
              );
            }) ?? null;
          if (pinningAttacker !== null) {
            const collidingPath = this.board.getPathBetweenCoordinates(
              coordinate,
              pinningAttacker.state.coordinate,
            );
            const availableMoves = super.getAvailableMoves();
            return collidingPath.filter((pathCoordinate) => {
              return availableMoves.some((moveCoordinate) =>
                checkCoordinatesEquality(pathCoordinate, moveCoordinate),
              );
            });
          }
        }
      }
      return super.getAvailableMoves();
    }
  } as unknown as T;
};
