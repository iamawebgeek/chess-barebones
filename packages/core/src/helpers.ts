import { Coordinate, Direction } from './types';

export const getRelativeDirection = (a: Coordinate, b: Coordinate) => {
  if (a.x === b.x) {
    return a.y > b.y ? Direction.NORTH : Direction.SOUTH;
  }
  if (a.y === b.y) {
    return a.x > b.x ? Direction.EAST : Direction.WEST;
  }
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  if (Math.abs(xDiff) === Math.abs(yDiff)) {
    // verify whether the direction is eastern or else western
    if (a.x > b.x) {
      return a.y > b.y ? Direction.NORTH_EAST : Direction.SOUTH_EAST;
    } else {
      return a.y > b.y ? Direction.NORTH_WEST : Direction.SOUTH_WEST;
    }
  }
  return null;
};

export const checkCoordinatesEquality = (a: Coordinate, b: Coordinate) =>
  a.x === b.x && a.y === b.y;
