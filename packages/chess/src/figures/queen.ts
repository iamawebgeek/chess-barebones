import {
  AbstractBoard,
  Coordinate,
  Direction,
  Player,
} from '@chess-barebones/core';

import { LineMovingFigure } from './line';
import { Figure } from './types';

export class Queen extends LineMovingFigure<Figure> {
  private readonly directions = [
    Direction.EAST,
    Direction.WEST,
    Direction.NORTH,
    Direction.SOUTH,
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
    super(Figure.QUEEN, owner, board, coordinate);
  }

  public getDirections(): Direction[] {
    return this.directions;
  }
}
