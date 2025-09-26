import {
  AbstractBoard,
  Board8x8,
  Coordinate,
  Direction,
  FigureFactory,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Pawn, PAWN_PROMOTION } from './pawn';
import { Rook } from './rook';
import { Figure } from './types';
import { Color } from '../chess';

const player1 = new Player(Color.WHITE, Direction.SOUTH);
const player2 = new Player(Color.BLACK, Direction.NORTH);

const figureMap = {
  [Figure.PAWN]: Pawn,
  [Figure.ROOK]: Rook,
} as const;

const figureFactory: FigureFactory<Figure> = {
  create(
    name: Figure,
    player: Player,
    board: AbstractBoard<Figure>,
    coordinate: Coordinate,
  ) {
    const FigureClass = figureMap[name as keyof typeof figureMap];
    return new FigureClass(player, board, coordinate);
  },
};

describe('Pawn', () => {
  it('can only jump over a cell from initial position', () => {
    const board = new Board8x8<Figure>(figureFactory);
    board.createFigure(Figure.PAWN, player2, 'a7');
    board.createFigure(Figure.PAWN, player2, 'b7');
    board.getFigure('b7').move('b6');
    expect(board.getFigure('a7').getAvailableMoves()).toEqual([
      { x: XLine.A, y: YLine._6 },
      { x: XLine.A, y: YLine._5 },
    ]);
    expect(board.getFigure('b6').getAvailableMoves()).toEqual([
      { x: XLine.B, y: YLine._5 },
    ]);
  });

  it('can only move to empty squares', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const pawnA = board.createFigure(Figure.PAWN, player2, 'a7');
    board.createFigure(Figure.ROOK, player2, 'a6');
    const pawnC = board.createFigure(Figure.PAWN, player2, 'c7');
    board.createFigure(Figure.PAWN, player2, 'c6');
    const pawnE = board.createFigure(Figure.PAWN, player2, 'e7');
    board.createFigure(Figure.ROOK, player1, 'e6');

    expect(pawnA.getAvailableMoves()).toEqual([]);
    expect(pawnC.getAvailableMoves()).toEqual([]);
    expect(pawnE.getAvailableMoves()).toEqual([]);
  });

  it('returns all moves even when blocked from moving forward', () => {
    const board = new Board8x8<Figure>(figureFactory);
    const pawnA = board.createFigure(Figure.PAWN, player2, 'a7');
    board.createFigure(Figure.ROOK, player2, 'a6');
    const pawnC = board.createFigure(Figure.PAWN, player2, 'c7');
    board.createFigure(Figure.PAWN, player2, 'c6');
    const pawnE = board.createFigure(Figure.PAWN, player2, 'e7');
    board.createFigure(Figure.ROOK, player1, 'e6');

    const [pawnAMoves, pawnCMoves, pawnEMoves] = [pawnA, pawnC, pawnE].map(
      (pawn) => pawn.getAllMoves().map((m) => board.serializeCoordinate(m)),
    );
    ['a6', 'b6', 'a5'].forEach((move) => expect(pawnAMoves).toContain(move));
    ['b6', 'd6', 'c6', 'c5'].forEach((move) =>
      expect(pawnCMoves).toContain(move),
    );
    ['d6', 'f6', 'e6', 'e5'].forEach((move) =>
      expect(pawnEMoves).toContain(move),
    );
  });

  it('returns all moves', () => {
    const board = new Board8x8<Figure>(figureFactory);
    board.createFigure(Figure.PAWN, player2, 'a7');
    board.createFigure(Figure.PAWN, player2, 'b7');
    board.getFigure('a7').move('a6');
    const figure1Moves = board.getFigure('a6').getAllMoves();
    expect(figure1Moves).toHaveLength(2);
    expect(figure1Moves).toContainEqual({ x: XLine.A, y: YLine._5 });
    expect(figure1Moves).toContainEqual({ x: XLine.B, y: YLine._5 });
    const figure2Moves = board.getFigure('b7').getAllMoves();
    expect(figure2Moves).toHaveLength(4);
    expect(figure2Moves).toContainEqual({ x: XLine.A, y: YLine._6 });
    expect(figure2Moves).toContainEqual({ x: XLine.C, y: YLine._6 });
    expect(figure2Moves).toContainEqual({ x: XLine.B, y: YLine._5 });
    expect(figure2Moves).toContainEqual({ x: XLine.B, y: YLine._6 });
  });

  it('reaches the left and right flanks in the next rank', () => {
    const board = new Board8x8<Figure>(figureFactory);
    board.createFigure(Figure.PAWN, player2, 'b7');
    expect(board.getFigure('b7').getReach()).toEqual([
      { x: XLine.A, y: YLine._6 },
      { x: XLine.C, y: YLine._6 },
    ]);
    board.getFigure('b7').move('b5');
    expect(board.getFigure('b5').getReach()).toEqual([
      { x: XLine.A, y: YLine._4 },
      { x: XLine.C, y: YLine._4 },
    ]);
  });

  describe('En-passant', () => {
    it("supports en-passant move after opponent's neighbor pawn makes double squares move", () => {
      const board = new Board8x8<Figure>(figureFactory);

      const pawn1 = board.createFigure(Figure.PAWN, player2, 'e7');
      const pawn2 = board.createFigure(Figure.PAWN, player1, 'f2');

      pawn1.move('e4');

      expect(pawn1.getAvailableMoves()).not.toContainEqual({
        x: XLine.F,
        y: YLine._3,
      });

      // jump 2 ranks
      pawn2.move('f4');

      expect(pawn1.getAvailableMoves()).toContainEqual({
        x: XLine.F,
        y: YLine._3,
      });
    });

    it('can en-passant only a neighbor pawn', () => {
      const board = new Board8x8<Figure>(figureFactory);

      const pawn1 = board.createFigure(Figure.PAWN, player2, 'e7');
      pawn1.move('e4');
      const rook = board.createFigure(Figure.ROOK, player1, 'f2');
      const pawn2 = board.createFigure(Figure.PAWN, player1, 'h2');

      expect(pawn1.getAvailableMoves()).toEqual([{ x: XLine.E, y: YLine._3 }]);
      expect(pawn1.getAvailableMoves()).not.toContainEqual({
        x: XLine.F,
        y: YLine._3,
      });

      // jump 2 ranks
      pawn2.move('f4');
      expect(pawn1.getAvailableMoves()).not.toContainEqual({
        x: XLine.F,
        y: YLine._3,
      });

      rook.move('h4');
      expect(pawn1.getAvailableMoves()).not.toContainEqual({
        x: XLine.F,
        y: YLine._3,
      });
    });

    it('captures the pawn with en-passant', () => {
      const board = new Board8x8<Figure>(figureFactory);

      const pawn1 = board.createFigure(Figure.PAWN, player2, 'e7');
      const pawn2 = board.createFigure(Figure.PAWN, player1, 'f2');

      pawn1.move('e4');

      expect(pawn2.state.captured).toBe(false);

      // jump 2 ranks
      pawn2.move('f4');

      expect(pawn2.state.captured).toBe(false);
    });
  });

  describe('Promotion', () => {
    it('requires promotion input for final rank', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const pawn = board.createFigure(Figure.PAWN, player1, 'e7');

      expect(pawn.getAvailableMoves()).toEqual([
        { requiresInput: PAWN_PROMOTION, x: XLine.E, y: YLine._8 },
      ]);
    });

    it('requires promotion input for capture move at promotion square', () => {
      const board = new Board8x8<Figure>(figureFactory);
      const pawn = board.createFigure(Figure.PAWN, player1, 'e7');
      board.createFigure(Figure.ROOK, player2, 'f8');
      expect(pawn.getAvailableMoves()).toContainEqual({
        x: XLine.F,
        y: YLine._8,
        requiresInput: PAWN_PROMOTION,
      });
    });
  });
});
