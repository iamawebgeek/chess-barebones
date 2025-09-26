import {
  AbstractBoard,
  Coordinate,
  Direction,
  Player,
} from '@chess-barebones/core';

import { LineMovingFigure } from './line';
import { Figure } from './types';

export class Rook extends LineMovingFigure<Figure> {
  private readonly directions = [
    Direction.NORTH,
    Direction.SOUTH,
    Direction.WEST,
    Direction.EAST,
  ];

  public constructor(
    owner: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    super(Figure.ROOK, owner, board, coordinate);
  }

  public getDirections(): Direction[] {
    return this.directions;
  }
}
