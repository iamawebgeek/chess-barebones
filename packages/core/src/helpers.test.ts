import { describe, it, expect } from 'vitest';

import { getRelativeDirection, checkCoordinatesEquality } from './helpers';
import { Direction } from './types';

const C = (x: number, y: number) => ({ x, y });

describe('helpers', () => {
  describe('getRelativeDirection', () => {
    it('returns NORTH/SOUTH for same file', () => {
      expect(getRelativeDirection(C(1, 5), C(1, 3))).toBe(Direction.NORTH);
      expect(getRelativeDirection(C(1, 3), C(1, 5))).toBe(Direction.SOUTH);
    });

    it('returns EAST/WEST for same rank', () => {
      expect(getRelativeDirection(C(5, 2), C(3, 2))).toBe(Direction.EAST);
      expect(getRelativeDirection(C(3, 2), C(5, 2))).toBe(Direction.WEST);
    });

    it('returns diagonals for equal deltas', () => {
      expect(getRelativeDirection(C(5, 5), C(3, 3))).toBe(Direction.NORTH_EAST);
      expect(getRelativeDirection(C(5, 3), C(3, 5))).toBe(Direction.SOUTH_EAST);
      expect(getRelativeDirection(C(3, 5), C(5, 3))).toBe(Direction.NORTH_WEST);
      expect(getRelativeDirection(C(3, 3), C(5, 5))).toBe(Direction.SOUTH_WEST);
    });

    it('returns null if not aligned orthogonally or diagonally', () => {
      expect(getRelativeDirection(C(2, 3), C(5, 5))).toBeNull();
      expect(getRelativeDirection(C(4, 4), C(5, 6))).toBeNull();
    });
  });

  describe('checkCoordinatesEquality', () => {
    it('compares coordinates', () => {
      expect(checkCoordinatesEquality(C(1, 1), C(1, 1))).toBe(true);
      expect(checkCoordinatesEquality(C(1, 1), C(2, 1))).toBe(false);
    });
  });
});
