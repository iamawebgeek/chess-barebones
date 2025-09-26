import {
  Board8x8,
  castFigure,
  Direction,
  FigureFactory,
  NotCaptured,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Queen } from './queen';
import { Rook } from './rook';
import { Figure } from './types';
import { Color } from '../chess';

const player = new Player(Color.WHITE, Direction.NORTH);
const enemy = new Player(Color.BLACK, Direction.SOUTH);

const figureMap = {
  [Figure.QUEEN]: Queen,
  [Figure.ROOK]: Rook, // used as a generic blocking/capturing piece
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(name, player, board, coordinate) {
    const FigureClass = figureMap[name as keyof typeof figureMap];
    return castFigure<NotCaptured, Figure>(
      new FigureClass(player, board, coordinate),
    );
  },
};

describe('Queen', () => {
  it('moves to given coordinate', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const queen = board.createFigure(Figure.QUEEN, player, 'd1');
    queen.move('h5');
    expect(board.getFigure('h5')).toBe(queen);
    expect(board.getFigure('d1')).toBe(null);
  });

  it('reaches lines and diagonals', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const queen = board.createFigure(Figure.QUEEN, player, 'd4');

    const reach1 = queen.getReach().map((c) => board.serializeCoordinate(c));
    expect(reach1.length).toBe(27);
    // straight lines
    expect(reach1).toContain('d8');
    expect(reach1).toContain('d1');
    expect(reach1).toContain('a4');
    expect(reach1).toContain('h4');
    // diagonals
    expect(reach1).toContain('a1');
    expect(reach1).toContain('h8');
    expect(reach1).toContain('a7');
    expect(reach1).toContain('g1');

    queen.move('a1');
    const reach2 = queen.getReach().map((c) => board.serializeCoordinate(c));
    expect(reach2.length).toBe(21);
    expect(reach2).toContain('h8');
    expect(reach2).toContain('a8');
    expect(reach2).toContain('h1');
    expect(reach2).toContain('b2');
  });

  it('is blocked by own piece and can capture opponent', () => {
    // Blocked by own piece on diagonal
    const board1 = new Board8x8<Figure>(figureFactory);
    const queen1 = board1.createFigure(Figure.QUEEN, player, 'd1');
    board1.createFigure(Figure.ROOK, player, 'f3');

    const available1 = queen1
      .getAvailableMoves()
      .map((c) => board1.serializeCoordinate(c));
    const reach1 = queen1.getReach().map((c) => board1.serializeCoordinate(c));

    expect(available1).toContain('e2');
    expect(available1).not.toContain('f3');
    expect(reach1).toContain('f3');

    // Can capture opponent but cannot go beyond on the same diagonal
    const board2 = new Board8x8<Figure>(figureFactory);
    const queen2 = board2.createFigure(Figure.QUEEN, player, 'd1');
    board2.createFigure(Figure.ROOK, enemy, 'f3');

    const available2 = queen2
      .getAvailableMoves()
      .map((c) => board2.serializeCoordinate(c));
    const reach2 = queen2.getReach().map((c) => board2.serializeCoordinate(c));

    expect(available2).toContain('f3');
    expect(available2).not.toContain('g4');
    expect(reach2).toContain('f3');
    expect(reach2).not.toContain('g4');
  });
});
