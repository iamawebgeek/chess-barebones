import {
  AbstractFigure,
  Board8x8,
  Direction,
  NotCaptured,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { Color } from '../chess';
import { applyPinDecorator } from './pin';
import { Figure, King, Knight, Rook } from '../figures';

describe('PinDecorator', () => {
  const player1 = new Player(Color.WHITE, Direction.SOUTH);
  const player2 = new Player(Color.BLACK, Direction.NORTH);

  const PinnedKnight = applyPinDecorator(Knight);
  const PinnedRook = applyPinDecorator(Rook);
  const figures = {
    [Figure.KING]: King,
    [Figure.KNIGHT]: PinnedKnight,
    [Figure.ROOK]: PinnedRook,
  };
  let board: Board8x8<Figure>;

  beforeEach(() => {
    board = new Board8x8({
      create(name, player, board, coordinate) {
        const FigureClass = figures[name] as new (
          ...args: ConstructorParameters<typeof King>
        ) => AbstractFigure<Figure, NotCaptured>;
        return new FigureClass(player, board, coordinate);
      },
    });
    board.createFigure(Figure.KING, player1, 'a1');
  });

  it('has moves when there is no pin', () => {
    const figure = board.createFigure(Figure.KNIGHT, player1, 'a3');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
  });

  it('has no moves when there is a non-colliding pin', () => {
    const figure = board.createFigure(Figure.KNIGHT, player1, 'a2');
    board.createFigure(Figure.ROOK, player2, 'a4');
    expect(figure.getAvailableMoves()).toEqual([]);
  });

  it('has only common moves when there is a colliding pin', () => {
    const figure = board.createFigure(Figure.ROOK, player1, 'a2');
    expect(figure.getAvailableMoves().length).toBeGreaterThan(0);
    board.createFigure(Figure.ROOK, player2, 'a4');
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.A,
      y: YLine._3,
    });
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.A,
      y: YLine._4,
    });
  });
});
