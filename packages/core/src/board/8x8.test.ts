import { describe, it, expect } from 'vitest';

import { Board8x8, XLine, YLine } from './8x8';
import { ParsingError } from '../errors';
import { AbstractFigure, Captured, castFigure, NotCaptured } from '../figure';
import { Player } from '../player';
import { Direction } from '../types';

import type { FigureFactory } from '../factory';
import type { AbstractFigure as IFigure } from '../figure';
import type { Coordinate } from '../types';

const dummyFactory: FigureFactory<string> = {
  create(): IFigure<string, NotCaptured> {
    throw new Error('Not implemented in tests');
  },
};

const makeBoard = () => new Board8x8<string>(dummyFactory);

describe('Board8x8', () => {
  describe('coordinate serialization', () => {
    it('serializes corners a1 and h8', () => {
      const board = makeBoard();
      expect(board.serializeCoordinate({ x: XLine.A, y: YLine._1 })).toBe('a1');
      expect(board.serializeCoordinate({ x: XLine.H, y: YLine._8 })).toBe('h8');
    });

    it('serializes middle square d4', () => {
      const board = makeBoard();
      expect(board.serializeCoordinate({ x: XLine.D, y: YLine._4 })).toBe('d4');
    });
  });

  describe('coordinate deserialization', () => {
    it('parses "a1", "h8", and "d4" into coordinates', () => {
      const board = makeBoard();
      expect(board.deserializeCoordinate('a1')).toEqual({
        x: XLine.A,
        y: YLine._1,
      });
      expect(board.deserializeCoordinate('h8')).toEqual({
        x: XLine.H,
        y: YLine._8,
      });
      expect(board.deserializeCoordinate('d4')).toEqual({
        x: XLine.D,
        y: YLine._4,
      });
    });

    it('supports round-trip serialization for valid squares', () => {
      const board = makeBoard();
      const samples = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'];
      for (const s of samples) {
        expect(board.serializeCoordinate(board.deserializeCoordinate(s))).toBe(
          s,
        );
      }
    });

    it('throws when invalid string coordinate attempted to deserialize', () => {
      const board = makeBoard();
      expect(() => board.deserializeCoordinate('yy')).toThrow(ParsingError);
    });
  });

  describe('vector navigation', () => {
    it('returns new coordinate within bounds', () => {
      const board = makeBoard();
      const from: Coordinate = { x: XLine.D, y: YLine._4 };
      expect(board.getCoordinateWithVector(from, [1, 0])).toEqual({
        x: XLine.E,
        y: YLine._4,
      }); // east
      expect(board.getCoordinateWithVector(from, [-1, 0])).toEqual({
        x: XLine.C,
        y: YLine._4,
      }); // west
      expect(board.getCoordinateWithVector(from, [0, 1])).toEqual({
        x: XLine.D,
        y: YLine._5,
      }); // north
      expect(board.getCoordinateWithVector(from, [0, -1])).toEqual({
        x: XLine.D,
        y: YLine._3,
      }); // south
      expect(board.getCoordinateWithVector(from, [1, 1])).toEqual({
        x: XLine.E,
        y: YLine._5,
      }); // NE
    });

    it('returns null if movement goes out of bounds on x', () => {
      const board = makeBoard();
      const fromA1: Coordinate = { x: XLine.A, y: YLine._1 };
      expect(board.getCoordinateWithVector(fromA1, [-1, 0])).toBeNull();
      const fromH8: Coordinate = { x: XLine.H, y: YLine._8 };
      expect(board.getCoordinateWithVector(fromH8, [1, 0])).toBeNull();
    });

    it('returns null if movement goes out of bounds on y', () => {
      const board = makeBoard();
      const fromA1: Coordinate = { x: XLine.A, y: YLine._1 };
      expect(board.getCoordinateWithVector(fromA1, [0, -1])).toBeNull();
      const fromH8: Coordinate = { x: XLine.H, y: YLine._8 };
      expect(board.getCoordinateWithVector(fromH8, [0, 1])).toBeNull();
    });
  });
});

class TestFigure extends AbstractFigure<string, NotCaptured> {
  public getAvailableMoves() {
    return [];
  }

  public getAllMoves() {
    return [];
  }

  public getReach() {
    const at = this.state.coordinate;
    const next = this.board.getCoordinateWithVector(at, [0, 1]);
    return next ? [next] : [];
  }
}

const factory: FigureFactory<string> = {
  create(name, player, board, coordinate) {
    return new TestFigure(name, player, board, coordinate);
  },
};

const makePlayers = () => ({
  white: new Player('w', Direction.NORTH),
  black: new Player('b', Direction.SOUTH),
});

describe('AbstractBoard', () => {
  it('creates and queries figures by owner and name', () => {
    const board = new Board8x8<string>(factory);
    const { white, black } = makePlayers();

    board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    board.createFigure('P', white, { x: XLine.E, y: YLine._4 });
    board.createFigure('Q', black, { x: XLine.A, y: YLine._1 });

    expect(board.getAllFigures().length).toBe(3);
    expect(board.getPlayerFigures(white).length).toBe(2);
    expect(board.getPlayerFiguresByName(white, 'P').length).toBe(2);
    expect(board.getPlayerFiguresByName(white, 'Q').length).toBe(0);

    const f = board.getFigure({ x: XLine.D, y: YLine._4 });
    expect(f).not.toBeNull();
    expect(f.name).toBe('P');
  });

  it('replaces a figure at the same position', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    const figure = board.getFigure({ x: XLine.D, y: YLine._4 });

    board.replaceFigure(figure, 'Q');

    const replacedFigure = board.getFigure({ x: XLine.D, y: YLine._4 });
    expect(replacedFigure.name).toBe('Q');
  });

  it('lists figures that can reach target', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    const target = { x: XLine.D, y: YLine._5 };
    const reachers = board.getFiguresReachCoordinate(target);
    expect(reachers.length).toBe(1);
    expect(reachers[0].state.coordinate).toEqual({ x: XLine.D, y: YLine._4 });
  });

  it('getPathBetweenCoordinates returns inclusive straight/diagonal path', () => {
    const board = new Board8x8<string>(factory);
    const path1 = board.getPathBetweenCoordinates(
      { x: XLine.A, y: YLine._1 },
      { x: XLine.A, y: YLine._3 },
    );
    expect(path1).toEqual([
      { x: XLine.A, y: YLine._2 },
      { x: XLine.A, y: YLine._3 },
    ]);
    const path2 = board.getPathBetweenCoordinates(
      { x: XLine.C, y: YLine._3 },
      { x: XLine.E, y: YLine._5 },
    );
    expect(path2).toEqual([
      { x: XLine.D, y: YLine._4 },
      { x: XLine.E, y: YLine._5 },
    ]);
  });

  it('serializePosition/loadPosition round-trip state', () => {
    const board = new Board8x8<string>(factory);
    const { white, black } = makePlayers();
    // two white pawns and one black queen
    board.createFigure('P', white, { x: XLine.A, y: YLine._2 });
    board.createFigure('P', white, { x: XLine.B, y: YLine._2 });
    board.createFigure('Q', black, { x: XLine.H, y: YLine._7 });

    // move one white pawn forward, capture black queen with the other
    board
      .getFigure({ x: XLine.A, y: YLine._2 })
      .move({ x: XLine.A, y: YLine._3 });
    board
      .getFigure({ x: XLine.B, y: YLine._2 })
      .move({ x: XLine.H, y: YLine._7 }); // capture

    const serialized = board.serializePosition();

    // mutate board arbitrarily
    const figures = board.getAllFigures();
    figures.forEach((f) => f.reset());

    // load should restore the previous positions and captures
    board.loadPosition(serialized, { w: white, b: black });

    const a3 = board.getFigure({ x: XLine.A, y: YLine._3 });
    const h7 = board.getFigure({ x: XLine.H, y: YLine._7 });
    expect(a3).not.toBeNull();
    expect(h7).not.toBeNull();

    // the queen should be captured (not present on board but still in figures list with captured=true)
    const queen = board.getAllFigures().find((f) => f.name === 'Q');
    expect(queen?.state.captured).toBe(true);
  });

  it('getPathBetweenCoordinates returns empty path for non-aligned squares', () => {
    const board = new Board8x8<string>(factory);
    const path = board.getPathBetweenCoordinates(
      { x: XLine.C, y: YLine._3 },
      { x: XLine.E, y: YLine._4 },
    );
    expect(path).toEqual([]);
  });

  it('throws when creating a figure on an occupied square', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    expect(() =>
      board.createFigure('Q', white, { x: XLine.D, y: YLine._4 }),
    ).toThrow('Another figure exists at coordinate "d4"');
  });

  it('throws when replacing a captured figure', () => {
    const board = new Board8x8<string>(factory);
    const { white, black } = makePlayers();
    const victim = board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    victim.captureBy(black, 1);
    expect(() => board.replaceFigure(victim, 'Q')).toThrow(
      'Cannot replace captured figure',
    );
  });

  it('getFigure accepts string coordinates', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    board.createFigure('P', white, { x: XLine.A, y: YLine._1 });
    const found = board.getFigure('a1');
    expect(found).not.toBeNull();
    expect(found?.name).toBe('P');
  });

  it('moves figure from active to captures when captured (subscription)', () => {
    const board = new Board8x8<string>(factory);
    const { white, black } = makePlayers();
    const victim = board.createFigure('P', white, { x: XLine.D, y: YLine._4 });
    expect(board.state.activeFigures.includes(victim)).toBe(true);
    victim.captureBy(black, 1);
    expect(board.state.activeFigures.includes(victim)).toBe(false);
    expect(board.state.captures.includes(castFigure<Captured>(victim))).toBe(
      true,
    );
  });

  it('throws when serialized chunk is missing coordinate parts', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    const bad = 'w-p-1:e2';
    expect(() => board.loadPosition(bad, { w: white })).toThrow(ParsingError);
  });

  it('throws when player in id is not provided in parameters', () => {
    const board = new Board8x8<string>(factory);
    const bad = 'x-p-1:e2:-';
    expect(() => board.loadPosition(bad, {})).toThrow(
      'Player is not found in the parameters',
    );
  });

  it('throws when figure name is missing in id', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    const bad = 'w-:e2:-';
    expect(() => board.loadPosition(bad, { w: white })).toThrow(
      'Expected figure name to be provided',
    );
  });

  it('throws when capture info has unknown player', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    const bad = 'w-p-1:#x-1:-';
    expect(() => board.loadPosition(bad, { w: white })).toThrow(ParsingError);
  });

  it('throws when capture ordinal is missing or not a number', () => {
    const board = new Board8x8<string>(factory);
    const { white } = makePlayers();
    const bad = 'w-p-1:#w-NaN:-';
    expect(() => board.loadPosition(bad, { w: white })).toThrow(ParsingError);
  });
});
