import {
  AbstractBoard,
  AbstractFigure,
  Coordinate,
  Player,
} from '@chess-barebones/core';

import { Figure } from './types';

const moves = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
] as Readonly<[number, number][]>;

export class Knight extends AbstractFigure<Figure> {
  public constructor(
    owner: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    super(Figure.KNIGHT, owner, board, coordinate);
  }

  public getAllMoves(): Coordinate[] {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    return moves
      .map((vector) => this.board.getCoordinateWithVector(coordinate, vector))
      .filter((move) => move !== null)
      .flat();
  }

  public getReach(): Coordinate[] {
    return this.getAllMoves();
  }

  public getAvailableMoves(): Coordinate[] {
    return this.getReach().filter(
      (coordinate) => this.board.getFigure(coordinate)?.owner !== this.owner,
    );
  }
}
