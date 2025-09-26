import {
  AbstractFigure,
  Board8x8,
  Coordinate,
  Direction,
  DirectionToVectorMap,
  getRelativeDirection,
  NotCaptured,
  Player,
  XLine,
} from '@chess-barebones/core';

import { Figure } from './types';

const directions = [
  Direction.EAST,
  Direction.WEST,
  Direction.NORTH,
  Direction.SOUTH,
  Direction.SOUTH_EAST,
  Direction.NORTH_EAST,
  Direction.SOUTH_WEST,
  Direction.NORTH_WEST,
] as const;

export enum Castling {
  SHORT = 'O-O',
  LONG = 'O-O-O',
}

export class King extends AbstractFigure<Figure> {
  public constructor(
    owner: Player,
    board: Board8x8<Figure>,
    coordinate: Coordinate,
  ) {
    super(Figure.KING, owner, board, coordinate);
  }

  public getCastlingFiles(): Record<Castling, XLine> {
    return {
      [Castling.SHORT]: XLine.G,
      [Castling.LONG]: XLine.C,
    };
  }

  private getCastlingMoves() {
    const { coordinate, previousCoordinate, captured } = this.state;
    if (captured || previousCoordinate !== null) {
      return [];
    }
    const castlingFiles = this.getCastlingFiles();
    const castlingRooks = this.getRooksForCastling();
    const moves: {
      rook: AbstractFigure<Figure.ROOK, NotCaptured>;
      type: Castling;
      move: Coordinate;
    }[] = [];
    Object.entries(castlingRooks).forEach(([type, rook]) => {
      if (rook !== null) {
        moves.push({
          rook,
          type: type as Castling,
          move: {
            x: castlingFiles[type as Castling],
            y: coordinate?.y,
          },
        });
      }
    });
    return moves;
  }

  public getRooksForCastling() {
    const castlingRooks: Record<
      Castling,
      null | AbstractFigure<Figure.ROOK, NotCaptured>
    > = {
      [Castling.SHORT]: null,
      [Castling.LONG]: null,
    };

    this.board
      .getPlayerFiguresByName(this.owner, Figure.ROOK)
      .forEach((rook) => {
        const { coordinate, captured, previousCoordinate } = rook.state;
        if (captured || previousCoordinate !== null) {
          return;
        }
        const relativeDirection = getRelativeDirection(
          coordinate,
          this.state.coordinate!,
        );
        if (
          coordinate.y === this.state.coordinate!.y &&
          [Direction.WEST, Direction.EAST].includes(
            relativeDirection as Direction,
          )
        ) {
          castlingRooks[
            relativeDirection === Direction.EAST
              ? Castling.SHORT
              : Castling.LONG
          ] = rook as AbstractFigure<Figure.ROOK, NotCaptured>;
        }
      });
    return castlingRooks;
  }

  public getAllMoves() {
    if (this.state.captured) return [];
    return [
      ...this.getReach(),
      ...this.getCastlingMoves().map(({ move }) => move),
    ];
  }

  public getReach() {
    const { coordinate, captured } = this.state;
    if (captured) {
      return [];
    }
    return directions
      .map((direction) =>
        this.board.getCoordinateWithVector(
          coordinate,
          DirectionToVectorMap[direction],
        ),
      )
      .filter((move) => move !== null);
  }

  public getAvailableMoves() {
    const { coordinate, captured } = this.state;
    if (captured) {
      return [];
    }
    const underCheck =
      this.board
        .getFiguresReachCoordinate(coordinate)
        .filter((figure) => figure.owner !== this.owner).length > 0;
    const castleMoves = underCheck
      ? []
      : this.getCastlingMoves()
          .filter(({ rook, move }) => {
            const rookAt = rook.state.coordinate;
            const lastCoordinateInPath =
              Math.abs(rookAt.x - coordinate.x) >
              Math.abs(move.x - coordinate.x)
                ? this.board.getCoordinateWithVector(
                    rookAt,
                    DirectionToVectorMap[
                      getRelativeDirection(this.state.coordinate!, rookAt)!
                    ],
                  )!
                : move;
            return this.board
              .getPathBetweenCoordinates(coordinate, lastCoordinateInPath)
              .every(
                (coordinate) =>
                  this.board.getFigure(coordinate) === null &&
                  !this.board
                    .getFiguresReachCoordinate(coordinate)
                    .some((figure) => figure.owner !== this.owner),
              );
          })
          .map(({ move }) => move);
    return [
      ...castleMoves,
      ...this.getReach().filter(
        (move) =>
          this.board.getFigure(move)?.owner !== this.owner &&
          !this.board
            .getFiguresReachCoordinate(move)
            .some((figure) => figure !== this && figure.owner !== this.owner),
      ),
    ];
  }
}
