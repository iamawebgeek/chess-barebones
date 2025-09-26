import {
  Board8x8,
  castFigure,
  Direction,
  FigureFactory,
  NotCaptured,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Bishop } from './bishop';
import { Rook } from './rook';
import { Figure } from './types';
import { Color } from '../chess';

const player = new Player(Color.WHITE, Direction.NORTH);
const enemy = new Player(Color.BLACK, Direction.SOUTH);

const figureMap = {
  [Figure.BISHOP]: Bishop,
  [Figure.ROOK]: Rook,
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(name, player, board, coordinate) {
    const FigureClass = figureMap[name as keyof typeof figureMap];
    return castFigure<NotCaptured, Figure>(
      new FigureClass(player, board, coordinate),
    );
  },
};

describe('Bishop', () => {
  it('moves to given coordinate', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const bishop = board.createFigure(Figure.BISHOP, player, 'c1');
    bishop.move('h6');
    expect(board.getFigure('h6')).toBe(bishop);
    expect(board.getFigure('c1')).toBe(null);
  });

  it('reaches all diagonals', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const figure = board.createFigure(Figure.BISHOP, player, 'b5');
    expect(figure.getReach()).toMatchSnapshot();
    figure.move('a1');
    expect(figure.getReach()).toMatchSnapshot();
  });

  it('is blocked by own piece and can capture opponent', () => {
    const board1 = new Board8x8<Figure>(figureFactory);
    const bishop1 = board1.createFigure(Figure.BISHOP, player, 'c1');
    board1.createFigure(Figure.ROOK, player, 'e3');

    const available1 = bishop1
      .getAvailableMoves()
      .map((c) => board1.serializeCoordinate(c));
    const reach1 = bishop1.getReach().map((c) => board1.serializeCoordinate(c));

    expect(available1).toContain('d2');
    expect(available1).not.toContain('e3');
    expect(reach1).toContain('e3');

    const board2 = new Board8x8<Figure>(figureFactory);
    const bishop2 = board2.createFigure(Figure.BISHOP, player, 'c1');
    board2.createFigure(Figure.ROOK, enemy, 'f4');

    const available2 = bishop2
      .getAvailableMoves()
      .map((c) => board2.serializeCoordinate(c));
    const reach2 = bishop2.getReach().map((c) => board2.serializeCoordinate(c));

    expect(available2).toContain('f4');
    expect(available2).not.toContain('g5');
    expect(reach2).toContain('f4');
    expect(reach2).not.toContain('g5');
  });
});
