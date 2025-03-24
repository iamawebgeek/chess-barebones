import type { BoardInstance, Coordinate } from '../board/types';

export enum Direction {
  NORTH,
  SOUTH,
  WEST,
  EAST,
  NORTH_WEST,
  SOUTH_WEST,
  NORTH_EAST,
  SOUTH_EAST,
}

export const DirectionToVectorMap: Record<Direction, [number, number]> = {
  [Direction.NORTH]: [0, 1],
  [Direction.SOUTH]: [0, -1],
  [Direction.WEST]: [-1, 0],
  [Direction.EAST]: [1, 0],
  [Direction.NORTH_WEST]: [-1, 1],
  [Direction.SOUTH_WEST]: [-1, -1],
  [Direction.NORTH_EAST]: [1, 1],
  [Direction.SOUTH_EAST]: [1, -1],
};

export enum Figure {
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN,
}

export type FigureProps = {
  board: BoardInstance;
  initialCoordinate: Coordinate;
};
