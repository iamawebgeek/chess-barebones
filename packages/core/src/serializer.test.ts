import { describe, it, expect } from 'vitest';

import { Board8x8 } from './board';
import { FigureFactory } from './factory';
import { AbstractFigure, NotCaptured } from './figure';
import { Player } from './player';
import {
  MoveSerializer,
  ParseMoveError,
  InvalidMoveError,
  IllegalMoveError,
} from './serializer';
import { Coordinate, Direction } from './types';

class DummyFigure extends AbstractFigure<string, NotCaptured> {
  public getAvailableMoves() {
    return [];
  }

  public getAllMoves() {
    return [];
  }

  public getReach() {
    return [];
  }
}

const factory: FigureFactory<string> = {
  create(name, player, board, coordinate) {
    return new DummyFigure(name, player, board, coordinate);
  },
};

class DummySerializer extends MoveSerializer<string, { m: string }> {
  public serialize(move: { m: string }) {
    return move.m;
  }

  public deserialize() {
    // no-op
  }

  public canFigureDo(figure: AbstractFigure<string>, move: Coordinate) {
    return this.validateMove(figure, move);
  }
}

describe('serializer', () => {
  it('validateMove returns true when move matches available moves', () => {
    const board = new Board8x8(factory);
    const p = new Player('w', Direction.NORTH);
    const figure = board.createFigure('X', p, { x: 1, y: 1 });

    // mock getAvailableMoves for this test instance
    figure.getAvailableMoves = () => [
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];

    const s = new DummySerializer(board);
    expect(s.canFigureDo(figure, { x: 3, y: 3 })).toBe(true);
    expect(s.canFigureDo(figure, { x: 4, y: 4 })).toBe(false);
  });

  it('error classes contain expected messages', () => {
    const fboard = new Board8x8(factory);
    const p = new Player('w', Direction.NORTH);
    const f = fboard.createFigure('Z', p, { x: 1, y: 1 });

    const parse = new ParseMoveError('bad');
    expect(parse.message).toMatch('Unsupported move syntax: bad');

    const invalid = new InvalidMoveError('??');
    expect(invalid.message).toMatch('No valid figure to fulfil move: ??');

    const illegal = new IllegalMoveError('e2e5', f);
    expect(illegal.message).toMatch('Move e2e5 is not allowed');
    expect(illegal.figure).toBe(f);
  });
});
