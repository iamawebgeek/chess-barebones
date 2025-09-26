import {
  Board8x8,
  castFigure,
  Direction,
  FigureFactory,
  NotCaptured,
  Player,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Knight } from './knight';
import { Figure } from './types';
import { Color } from '../chess';

const player1 = new Player(Color.WHITE, Direction.NORTH);
const player2 = new Player(Color.BLACK, Direction.SOUTH);

const figureMap = {
  [Figure.KNIGHT]: Knight,
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(name, player, board, coordinate) {
    const FigureClass = figureMap[name as keyof typeof figureMap];
    return castFigure<NotCaptured, Figure>(
      new FigureClass(player, board, coordinate),
    );
  },
};

describe('Knight', () => {
  it('moves to given coordinate and captures on landing', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const knight = board.createFigure(Figure.KNIGHT, player1, 'b5');
    knight.move('c7');
    expect(board.getFigure('c7')).toBe(knight);
    expect(board.getFigure('b5')).toBeNull();

    const enemy1 = board.createFigure(Figure.KNIGHT, player2, 'e6');
    knight.move('e6');
    expect(board.getFigure('e6')).toBe(knight);
    expect(board.getFigure('c7')).toBeNull();
    expect(enemy1.state.captured).toBe(true);

    const enemy2 = board.createFigure(Figure.KNIGHT, player2, 'e8');
    knight.move('g7');
    expect(board.getFigure('g7')).toBe(knight);
    knight.move('e8');
    expect(board.getFigure('e8')).toBe(knight);
    expect(enemy2.state.captured).toBe(true);
  });

  it('reaches all diagonals', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const figure = board.createFigure(Figure.KNIGHT, player1, 'b5');
    expect(figure.getReach()).toMatchSnapshot();
    figure.move('a1');
    expect(figure.getReach()).toMatchSnapshot();
  });

  it('returns all moves and available moves correctly with blocking and enemies', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const knight = board.createFigure(Figure.KNIGHT, player1, 'd4');

    board.createFigure(Figure.KNIGHT, player1, 'e6');
    board.createFigure(Figure.KNIGHT, player1, 'c2');
    board.createFigure(Figure.KNIGHT, player2, 'f5');

    const allMoves = knight
      .getAllMoves()
      .map((c) => board.serializeCoordinate(c))
      .sort();
    expect(allMoves).toEqual(
      ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'].sort(),
    );

    const availableMoves = knight
      .getAvailableMoves()
      .map((c) => board.serializeCoordinate(c))
      .sort();
    expect(availableMoves).toEqual(['b3', 'b5', 'c6', 'e2', 'f3', 'f5'].sort());
  });
});
