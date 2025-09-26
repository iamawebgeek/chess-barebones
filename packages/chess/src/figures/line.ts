import {
  AbstractFigure,
  Coordinate,
  Direction,
  DirectionToVectorMap,
} from '@chess-barebones/core';

import { Figure } from './types';

export abstract class LineMovingFigure<
  T extends string,
> extends AbstractFigure<T> {
  public abstract getDirections(): Direction[];

  public getAllMoves() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    return this.getDirections()
      .map((direction) => {
        let next = this.board.getCoordinateWithVector(
          coordinate,
          DirectionToVectorMap[direction],
        );
        const moves: Coordinate[] = [];
        while (next !== null) {
          moves.push(next);
          next = this.board.getCoordinateWithVector(
            next,
            DirectionToVectorMap[direction],
          );
        }
        return moves;
      })
      .flat();
  }

  public getReach() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    return this.getDirections()
      .map((direction) => {
        let next = this.board.getCoordinateWithVector(
          coordinate,
          DirectionToVectorMap[direction],
        );
        const moves: Coordinate[] = [];
        while (next !== null) {
          const figureAtCoordinate = this.board.getFigure(next);
          const owner = figureAtCoordinate?.owner ?? null;
          moves.push(next);
          next = this.board.getCoordinateWithVector(
            next,
            DirectionToVectorMap[direction],
          );
          if (
            owner !== null &&
            (figureAtCoordinate.name !== Figure.KING ||
              figureAtCoordinate.owner === this.owner)
          ) {
            break;
          }
        }
        return moves;
      })
      .flat();
  }

  public getAvailableMoves() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    return this.getDirections()
      .map((direction) => {
        let next = this.board.getCoordinateWithVector(
          coordinate,
          DirectionToVectorMap[direction],
        );
        const moves: Coordinate[] = [];
        while (next !== null) {
          const figureAtCoordinate = this.board.getFigure(next);
          const owner = figureAtCoordinate?.owner ?? null;
          moves.push(next);
          next = this.board.getCoordinateWithVector(
            next,
            DirectionToVectorMap[direction],
          );
          if (owner !== null) {
            if (owner === this.owner) {
              moves.pop();
            }
            break;
          }
        }
        return moves;
      })
      .flat();
  }
}
