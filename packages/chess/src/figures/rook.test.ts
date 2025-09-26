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
  [Figure.ROOK]: Rook,
  [Figure.QUEEN]: Queen, // used as a generic blocking/capturing piece
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(name, player, board, coordinate) {
    const FigureClass = figureMap[name as keyof typeof figureMap];
    return castFigure<NotCaptured, Figure>(
      new FigureClass(player, board, coordinate),
    );
  },
};

describe('Rook', () => {
  it('moves to given coordinate', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const rook = board.createFigure(Figure.ROOK, player, 'a1');
    rook.move('a8');
    expect(board.getFigure('a8')).toBe(rook);
    expect(board.getFigure('a1')).toBe(null);
  });

  it('reaches all ranks and files', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const rook = board.createFigure(Figure.ROOK, player, 'd4');

    const reach1 = rook.getReach().map((c) => board.serializeCoordinate(c));
    expect(reach1.length).toBe(14);
    // files up/down
    expect(reach1).toContain('d8');
    expect(reach1).toContain('d1');
    // ranks left/right
    expect(reach1).toContain('a4');
    expect(reach1).toContain('h4');

    rook.move('a1');
    const reach2 = rook.getReach().map((c) => board.serializeCoordinate(c));
    expect(reach2.length).toBe(14);
    expect(reach2).toContain('a8');
    expect(reach2).toContain('h1');
  });

  it('is blocked by own piece and can capture opponent', () => {
    // Blocked by own piece
    const board1 = new Board8x8<Figure>(figureFactory);
    const rook1 = board1.createFigure(Figure.ROOK, player, 'a1');
    board1.createFigure(Figure.QUEEN, player, 'a3');

    const available1 = rook1
      .getAvailableMoves()
      .map((c) => board1.serializeCoordinate(c));
    const reach1 = rook1.getReach().map((c) => board1.serializeCoordinate(c));

    expect(available1).toContain('a2');
    expect(available1).not.toContain('a3');
    expect(reach1).toContain('a3');

    // Can capture opponent but cannot go beyond
    const board2 = new Board8x8<Figure>(figureFactory);
    const rook2 = board2.createFigure(Figure.ROOK, player, 'a1');
    board2.createFigure(Figure.QUEEN, enemy, 'a3');

    const available2 = rook2
      .getAvailableMoves()
      .map((c) => board2.serializeCoordinate(c));
    const reach2 = rook2.getReach().map((c) => board2.serializeCoordinate(c));

    expect(available2).toContain('a3');
    expect(available2).not.toContain('a4');
    expect(reach2).toContain('a3');
    expect(reach2).not.toContain('a4');
  });
});
