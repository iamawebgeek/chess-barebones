import {
  AbstractBoard,
  Coordinate,
  Direction,
  Player,
} from '@chess-barebones/core';

import { LineMovingFigure } from './line';
import { Figure } from './types';

export class Bishop extends LineMovingFigure<Figure> {
  private readonly directions = [
    Direction.SOUTH_EAST,
    Direction.NORTH_EAST,
    Direction.SOUTH_WEST,
    Direction.NORTH_WEST,
  ];

  public constructor(
    owner: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    super(Figure.BISHOP, owner, board, coordinate);
  }

  public getDirections(): Direction[] {
    return this.directions;
  }
}
