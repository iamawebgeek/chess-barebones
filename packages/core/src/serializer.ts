import { AbstractBoard } from './board';
import { AbstractFigure } from './figure';
import { checkCoordinatesEquality } from './helpers';
import { Player } from './player';
import { Coordinate } from './types';

export abstract class MoveSerializer<F extends string, M extends object> {
  public constructor(protected readonly board: AbstractBoard<F>) {}

  public abstract serialize(move: M): string;
  public abstract deserialize(move: string, player: Player): void;

  protected validateMove(figure: AbstractFigure<F>, move: Coordinate) {
    return figure
      .getAvailableMoves()
      .some((possibleMove) => checkCoordinatesEquality(possibleMove, move));
  }
}

export class ParseMoveError extends Error {
  public constructor(move: string) {
    super(`Unsupported move syntax: ${move}`);
  }
}

export class InvalidMoveError extends Error {
  public constructor(move: string) {
    super(`No valid figure to fulfil move: ${move}`);
  }
}

export class IllegalMoveError extends Error {
  public constructor(
    move: string,
    public readonly figure: AbstractFigure<any>,
  ) {
    super(`Move ${move} is not allowed for figure with ID ${figure.id}`);
  }
}
