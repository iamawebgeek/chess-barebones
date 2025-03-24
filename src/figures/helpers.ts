import { BoardInstance, Coordinate, XLine, YLine } from '../board/types';
import { Direction, DirectionToVectorMap } from './types';

export const walk = (coordinate: Coordinate, vector: [number, number]) => {
  const newX: number = coordinate.x + vector[0];
  if (newX > XLine.H || newX < XLine.A) {
    return null;
  }
  const newY: number = coordinate.y + vector[1];
  if (newY > YLine._8 || newY < YLine._1) {
    return null;
  }
  return { x: newX, y: newY };
};

export const getRelativeDirection = (a: Coordinate, b: Coordinate) => {
  if (a.x === b.x) {
    return a.y > b.y ? Direction.SOUTH : Direction.NORTH;
  }
  if (a.y === b.y) {
    return a.x > b.x ? Direction.EAST : Direction.WEST;
  }
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  if (Math.abs(xDiff) === Math.abs(yDiff)) {
    // verify whether the direction is eastern or else western
    if (xDiff < 0) {
      return yDiff < 0 ? Direction.NORTH_EAST : Direction.SOUTH_EAST;
    } else {
      return yDiff < 0 ? Direction.NORTH_WEST : Direction.SOUTH_WEST;
    }
  }
  return null;
};

type PathsToObstacleParams = {
  direction: Direction;
  coordinate: Coordinate;
  captureObstacle: boolean;
  includeOwnObstacle: boolean;
  board: BoardInstance;
  takeMax?: number;
  originalCoordinate?: Coordinate;
};

export const pathsToObstacle = (params: PathsToObstacleParams) => {
  if (params.takeMax === 0) {
    return [];
  }
  const next = walk(params.coordinate, DirectionToVectorMap[params.direction]);
  if (next === null) {
    return [];
  }
  const owner = params.board.getFigureOwner(
    params.originalCoordinate ?? params.coordinate,
  );
  const nextCoordinateOwner = params.board.getFigureOwner(next);
  if (owner && owner === nextCoordinateOwner) {
    return params.includeOwnObstacle ? [next] : [];
  }
  if (nextCoordinateOwner) {
    return params.captureObstacle ? [next] : [];
  }
  return [
    next,
    ...pathsToObstacle({
      ...params,
      originalCoordinate: params.originalCoordinate ?? params.coordinate,
      coordinate: next,
      takeMax:
        typeof params.takeMax !== 'undefined' ? params.takeMax - 1 : undefined,
    }),
  ];
};
