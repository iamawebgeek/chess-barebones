import {
  Board8x8,
  castFigure,
  Direction,
  InvalidStateError,
  NotCaptured,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Color } from '../chess';
import { applyCheckDecorator } from './check';
import { Figure, King, Knight, Rook } from '../figures';

const player1 = new Player(Color.WHITE, Direction.SOUTH);
const player2 = new Player(Color.BLACK, Direction.NORTH);

const figureMap = {
  [Figure.ROOK]: Rook,
  [Figure.KING]: King,
  [Figure.KNIGHT]: applyCheckDecorator(Knight),
} as const;

const setup = (kingsCoordinate?: string) => {
  const board = new Board8x8<Figure>({
    create(name, player, board, coordinate) {
      const FigureClass = figureMap[name as keyof typeof figureMap];
      return castFigure<NotCaptured, Figure>(
        new FigureClass(player, board, coordinate),
      );
    },
  });
  if (kingsCoordinate) {
    board.createFigure(Figure.KING, player1, kingsCoordinate);
  }
  return { board };
};

describe('CheckDecorator', () => {
  it('throws when used without a king on the board', () => {
    const { board } = setup();
    const figure = board.createFigure(Figure.KNIGHT, player1, 'd3');
    expect(() => figure.getAvailableMoves()).toThrow(InvalidStateError);
  });

  it('has moves when there is no check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'd3');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
  });

  it('has no moves when there is a double check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'd3');
    const checker1 = board.createFigure(Figure.KNIGHT, player2, 'c4');
    const checker2 = board.createFigure(Figure.KNIGHT, player2, 'g2');
    board.getFiguresReachCoordinate = () => [checker1, checker2];
    expect(figure.getAvailableMoves().length).toBe(0);
  });

  it('has no moves if a figure cannot defend from a check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'd3');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
    const checker = board.createFigure(Figure.ROOK, player2, 'a4');
    board.getFiguresReachCoordinate = () => [checker];
    expect(figure.getAvailableMoves().length).toBe(0);
  });

  it('has blocking move from a check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'c2');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
    const checker = board.createFigure(Figure.ROOK, player2, 'a5');
    board.getFiguresReachCoordinate = () => [checker];
    expect(figure.getAvailableMoves()).toEqual([
      {
        x: XLine.A,
        y: YLine._3,
      },
    ]);
  });

  it('has moves to capture the direct line figure giving a check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'c3');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
    const checker = board.createFigure(Figure.ROOK, player2, 'a4');
    board.getFiguresReachCoordinate = () => [checker];
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.A,
      y: YLine._2,
    });
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.A,
      y: YLine._4,
    });
  });

  it('has moves to capture the indirect figure giving a check', () => {
    const { board } = setup('a1');
    const figure = board.createFigure(Figure.KNIGHT, player1, 'a3');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(1);
    const checker = board.createFigure(Figure.KNIGHT, player2, 'c2');
    board.getFiguresReachCoordinate = () => [checker];
    expect(figure.getAvailableMoves()).toHaveLength(1);
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.C,
      y: YLine._2,
    });
  });
});
