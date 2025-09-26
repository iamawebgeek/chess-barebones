import {
  Board8x8,
  castFigure,
  Direction,
  FigureFactory,
  NotCaptured,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { King } from './king';
import { Pawn } from './pawn';
import { Queen } from './queen';
import { Figure } from './types';
import { Color } from '../chess';
import { Rook } from './rook';

const figureMap = {
  [Figure.PAWN]: Pawn,
  [Figure.ROOK]: Rook,
  [Figure.KING]: King,
  [Figure.QUEEN]: Queen,
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(name, player, board, coordinate) {
    const FigureClass = figureMap[name as Figure.KING];
    return castFigure<NotCaptured, Figure>(
      new FigureClass(player, board, coordinate),
    );
  },
};

describe('King', () => {
  const player1 = new Player(Color.WHITE, Direction.NORTH);
  const player2 = new Player(Color.BLACK, Direction.SOUTH);

  it('can move to all neighbor cells', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const king = board.createFigure(Figure.KING, player1, 'a1');

    let moves = king.getAvailableMoves();
    expect(moves).toHaveLength(3);
    expect(moves).toContainEqual({ x: XLine.A, y: YLine._2 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._2 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._1 });

    king.move({ x: XLine.C, y: YLine._5 });
    moves = king.getAvailableMoves();
    expect(moves).toHaveLength(8);
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._6 });
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._6 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._6 });
  });

  it('can reach all neighbor cells', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const king = board.createFigure(Figure.KING, player1, 'a1');

    let moves = king.getReach();
    expect(moves).toHaveLength(3);
    expect(moves).toContainEqual({ x: XLine.A, y: YLine._2 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._2 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._1 });

    king.move({ x: XLine.C, y: YLine._5 });
    moves = king.getReach();
    expect(moves).toHaveLength(8);
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._6 });
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._6 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._4 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._6 });
  });

  it('can capture attacking piece without protection', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const figure = board.createFigure(Figure.KING, player1, 'e8');
    board.createFigure(Figure.QUEEN, player2, 'e7');
    expect(figure.getAvailableMoves()).toContainEqual({
      x: XLine.E,
      y: YLine._7,
    });
  });

  it('cannot capture attacking piece with protection', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const figure = board.createFigure(Figure.KING, player1, 'e8');
    board.createFigure(Figure.QUEEN, player2, 'e7');
    board.createFigure(Figure.PAWN, player2, 'f6');
    expect(figure.getAvailableMoves()).not.toContainEqual({
      x: XLine.E,
      y: YLine._7,
    });
  });

  it('can move only to cells that are not under attack', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const figure = board.createFigure(Figure.KING, player1, 'e8');
    board.createFigure(Figure.QUEEN, player2, 'e6');

    let moves = figure.getAvailableMoves();
    expect(moves).toHaveLength(2);
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._8 });
    expect(moves).toContainEqual({ x: XLine.F, y: YLine._8 });

    figure.move('c6');

    moves = figure.getAvailableMoves();
    expect(moves).toHaveLength(4);
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._5 });
    expect(moves).toContainEqual({ x: XLine.B, y: YLine._7 });
    expect(moves).toContainEqual({ x: XLine.C, y: YLine._7 });
  });

  it('cannot move to cells where its own pieces stand', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const king = board.createFigure(Figure.KING, player1, 'e8');
    board.createFigure(Figure.QUEEN, player1, 'd8');
    board.createFigure(Figure.ROOK, player1, 'f8');

    const moves = king.getAvailableMoves();
    expect(moves).toHaveLength(3);
    expect(moves).toContainEqual({ x: XLine.D, y: YLine._7 });
    expect(moves).toContainEqual({ x: XLine.E, y: YLine._7 });
    expect(moves).toContainEqual({ x: XLine.F, y: YLine._7 });
  });

  describe('Castling', () => {
    it('can castle only when rooks have not moved', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const king = board.createFigure(Figure.KING, player1, 'e8');
      const rook1 = board.createFigure(Figure.ROOK, player1, 'h8');
      const rook2 = board.createFigure(Figure.ROOK, player1, 'a8');

      let moves = king.getAvailableMoves();
      expect(moves).toContainEqual({ x: XLine.C, y: YLine._8 });
      expect(moves).toContainEqual({ x: XLine.G, y: YLine._8 });

      rook2.move('b8');
      moves = king.getAvailableMoves();
      expect(moves).not.toContainEqual({ x: XLine.C, y: YLine._8 });

      rook1.move('g8');
      rook1.move('h8');

      moves = king.getAvailableMoves();
      expect(moves).not.toContainEqual({ x: XLine.G, y: YLine._8 });
    });

    it('cannot castle when king has already moved', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const king = board.createFigure(Figure.KING, player1, 'e8');
      board.createFigure(Figure.ROOK, player1, 'a8');

      king.move('f8');
      king.move('e8');

      const moves = king.getAvailableMoves();
      expect(moves).not.toContainEqual({ x: XLine.G, y: YLine._8 });
      expect(moves).not.toContainEqual({ x: XLine.C, y: YLine._8 });
    });

    it('cannot castle under check', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const king = board.createFigure(Figure.KING, player1, 'e8');
      board.createFigure(Figure.ROOK, player1, 'h8');
      board.createFigure(Figure.ROOK, player1, 'a8');
      board.createFigure(Figure.ROOK, player2, 'e1');

      const moves = king.getAvailableMoves();
      expect(moves).not.toContainEqual({ x: XLine.G, y: YLine._8 });
      expect(moves).not.toContainEqual({ x: XLine.C, y: YLine._8 });
    });

    it('cannot castle when a figure exists in-between', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const king = board.createFigure(Figure.KING, player1, 'e8');
      board.createFigure(Figure.ROOK, player1, 'h8');
      board.createFigure(Figure.ROOK, player1, 'a8');
      board.createFigure(Figure.QUEEN, player2, 'd1');

      const moves = king.getAvailableMoves();
      expect(moves).toContainEqual({ x: XLine.G, y: YLine._8 });
      expect(moves).not.toContainEqual({ x: XLine.C, y: YLine._8 });
    });

    it('cannot castle when any cell to castling is attacked', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const king = board.createFigure(Figure.KING, player1, 'e8');
      board.createFigure(Figure.ROOK, player1, 'h8');
      board.createFigure(Figure.ROOK, player1, 'a8');
      board.createFigure(Figure.ROOK, player2, 'g1');
      board.createFigure(Figure.ROOK, player2, 'd1');

      const moves = king.getAvailableMoves();
      expect(moves).not.toContainEqual({ x: XLine.G, y: YLine._8 });
      expect(moves).not.toContainEqual({ x: XLine.C, y: YLine._8 });
    });
  });
});
