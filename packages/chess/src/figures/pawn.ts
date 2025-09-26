import {
  AbstractBoard,
  AbstractFigure,
  Coordinate,
  Direction,
  DirectionToVectorMap,
  Move,
  Player,
} from '@chess-barebones/core';

import { Figure } from './types';

const INITIAL_LOCATION_TO_ATTACK_DIRECTION = {
  [Direction.NORTH]: [Direction.NORTH_WEST, Direction.NORTH_EAST],
  [Direction.SOUTH]: [Direction.SOUTH_WEST, Direction.SOUTH_EAST],
};

export const PAWN_PROMOTION = Symbol('PAWN_PROMOTION');

export class Pawn extends AbstractFigure<Figure> {
  public constructor(
    owner: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    super(Figure.PAWN, owner, board, coordinate);
  }

  private get headedDirection() {
    return this.owner.flank === Direction.NORTH
      ? Direction.SOUTH
      : Direction.NORTH;
  }

  private checkForPromotion(coordinate: Coordinate) {
    const nextCell = this.board.getCoordinateWithVector(
      coordinate,
      DirectionToVectorMap[this.headedDirection],
    );
    return nextCell === null;
  }

  public move(to: Coordinate | string) {
    if (typeof to === 'string') {
      to = this.board.deserializeCoordinate(to);
    }
    // en-passant capture
    if (
      to.x !== this.state.coordinate!.x &&
      this.board.getFigure(to) === null
    ) {
      this.board.lastMoved?.captureBy(this.owner);
    }
    super.move(to);
  }

  public getAllMoves() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    const nextCoordinates = [
      this.board.getCoordinateWithVector(
        coordinate,
        DirectionToVectorMap[this.headedDirection],
      ),
    ] as Move[];
    if (nextCoordinates[0]) {
      const nextCell = this.board.getCoordinateWithVector(
        nextCoordinates[0],
        DirectionToVectorMap[this.headedDirection],
      );
      if (this.checkForPromotion(nextCoordinates[0])) {
        nextCoordinates[0].requiresInput = PAWN_PROMOTION;
      }
      if (this.state.previousCoordinate === null && nextCell !== null) {
        nextCoordinates.push(nextCell);
      }
    }
    return [
      ...this.getReach(),
      ...(nextCoordinates[0] ? nextCoordinates : []),
    ] as Coordinate[];
  }

  public getReach() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    return INITIAL_LOCATION_TO_ATTACK_DIRECTION[this.headedDirection]
      .map((direction) =>
        this.board.getCoordinateWithVector(
          coordinate,
          DirectionToVectorMap[direction],
        ),
      )
      .filter((move) => move !== null);
  }

  public getAvailableMoves() {
    const { captured, coordinate } = this.state;
    if (captured) return [];
    const reach = this.getReach();
    const otherMoves = this.getAllMoves().slice(reach.length);
    return [
      ...reach
        .filter((move) => {
          // en-passant
          const lastFigure = this.board.lastMoved;
          if (lastFigure !== null && lastFigure.name === Figure.PAWN) {
            const lastState = lastFigure.state;
            const prev = lastState.previousCoordinate;
            const curr = lastState.coordinate;
            // Must be immediate previous move, adjacent file target, same rank as our pawn,
            // enemy pawn must have moved exactly two squares last move
            if (
              prev &&
              curr &&
              lastFigure.owner !== this.owner &&
              curr.y === coordinate.y &&
              curr.x === move.x &&
              Math.abs(curr.y - prev.y) === 2
            ) {
              return true;
            }
          }
          const owner = this.board.getFigure(move)?.owner;
          return owner && owner !== this.owner;
        })
        .map((coordinate) =>
          this.checkForPromotion(coordinate)
            ? ({ ...coordinate, requiresInput: PAWN_PROMOTION } as Move)
            : coordinate,
        ),
      ...(this.board.getFigure(otherMoves[0]) === null
        ? otherMoves.filter(
            (coordinate) => this.board.getFigure(coordinate) === null,
          )
        : []),
    ];
  }
}
