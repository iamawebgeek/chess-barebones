import { Board8x8, Direction, Game, Player } from '@chess-barebones/core';
import { describe, it, expect } from 'vitest';

import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';
import { Figure } from '../figures';
import { AlgebraicNotationSerializer } from './algebraicNotation';

// Helpers
const makeBoard = () => new Board8x8<Figure>(new ChessFigureFactory());
const coord = (board: Board8x8<Figure>, sq: string) =>
  board.deserializeCoordinate(sq);

// New setup function: creates board, serializer, players, and places kings
const setup = (whiteKing: string, blackKing: string) => {
  const board = makeBoard();
  const serializer = new AlgebraicNotationSerializer(board);
  const white = new Player(Color.WHITE, Direction.SOUTH);
  const black = new Player(Color.BLACK, Direction.NORTH);
  // Place kings as required
  board.createFigure(Figure.KING, white, whiteKing);
  board.createFigure(Figure.KING, black, blackKing);

  const makeGame = () => {
    const game = new Game<Figure, { from: any; to: any; promotion?: Figure }>(
      board,
      serializer,
    );
    game.addPlayer(white);
    game.addPlayer(black);
    game.start();
    return game;
  };

  return { board, serializer, white, black, makeGame };
};

describe('AlgebraicNotationSerializer', () => {
  describe('serialize', () => {
    it('serializes a quiet pawn move (e2e4 -> e4)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e2');
      const from = coord(board, 'e2');
      const to = coord(board, 'e4');
      const san = serializer.serialize({ from, to });
      expect(san).toBe('e4');
    });

    it('serializes a knight move (Ng1f3 -> Nf3)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      board.createFigure(Figure.KNIGHT, white, 'g1');
      const san = serializer.serialize({
        from: coord(board, 'g1'),
        to: coord(board, 'f3'),
      });
      expect(san).toBe('Nf3');
    });

    it('serializes a pawn capture (e4xd5 -> exd5)', () => {
      const { board, serializer, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e4');
      board.createFigure(Figure.PAWN, black, 'd5');
      const san = serializer.serialize({
        from: coord(board, 'e4'),
        to: coord(board, 'd5'),
      });
      expect(san).toBe('exd5');
    });

    it('adds file disambiguation for knights (Nbd2)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      board.createFigure(Figure.KNIGHT, white, 'b1');
      board.createFigure(Figure.KNIGHT, white, 'f1');
      // Target d2 can be reached by both, moving the b1 knight requires file disambiguation
      const san = serializer.serialize({
        from: coord(board, 'b1'),
        to: coord(board, 'd2'),
      });
      expect(san).toBe('Nbd2');
    });

    it('adds rank disambiguation for rooks (R2e3)', () => {
      const { board, serializer, white } = setup('e1', 'c8');
      board.createFigure(Figure.ROOK, white, 'e2');
      board.createFigure(Figure.ROOK, white, 'e4');
      const san = serializer.serialize({
        from: coord(board, 'e2'),
        to: coord(board, 'e3'),
      });
      expect(san).toBe('R2e3');
    });

    it('adds both file and rank disambiguation for knights (Nb1d2)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      // Knights that can reach d2: b1 (mover), b3 (same file), f1 (same rank)
      board.createFigure(Figure.KNIGHT, white, 'b1');
      board.createFigure(Figure.KNIGHT, white, 'b3');
      board.createFigure(Figure.KNIGHT, white, 'f1');
      const san = serializer.serialize({
        from: coord(board, 'b1'),
        to: coord(board, 'd2'),
      });
      expect(san).toBe('Nb1d2');
    });

    it('serializes castling (O-O)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      board.createFigure(Figure.ROOK, white, 'h1');
      // Squares between must be empty for move validation of the king
      const san = serializer.serialize({
        from: coord(board, 'e1'),
        to: coord(board, 'g1'),
      });
      expect(san).toBe('O-O');
    });

    it('serializes promotion (h8=Q)', () => {
      const { board, serializer, white } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'h7');
      const san = serializer.serialize({
        from: coord(board, 'h7'),
        to: coord(board, 'h8'),
        promotion: Figure.QUEEN,
      });
      expect(san).toBe('h8=Q');
    });

    it('serializes en passant capture by black (dxe5)', () => {
      const { board, serializer, makeGame, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e2');
      board.createFigure(Figure.PAWN, black, 'd4');
      const game = makeGame();
      game.move('e4');
      const san = serializer.serialize({
        from: coord(board, 'd4'),
        to: coord(board, 'e5'),
      });
      expect(san).toBe('dxe5');
    });

    it('serializes pawn capture to promotion (exf8=Q)', () => {
      const { board, serializer, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e7');
      board.createFigure(Figure.ROOK, black, 'f8');
      const san = serializer.serialize({
        from: coord(board, 'e7'),
        to: coord(board, 'f8'),
        promotion: Figure.QUEEN,
      });
      expect(san).toBe('exf8=Q');
    });
  });

  describe('deserialize', () => {
    it('applies a quiet pawn move e4', () => {
      const { board, makeGame, white } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e2');
      const game = makeGame();
      game.move('e4');
      expect(board.getFigure('e4')?.name).toBe(Figure.PAWN);
      expect(board.getFigure('e2')).toBeNull();
    });

    it('applies a capture exd5', () => {
      const { board, makeGame, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e4');
      board.createFigure(Figure.PAWN, black, 'd5');
      const game = makeGame();
      game.move('exd5');
      const moved = board.getFigure('d5');
      expect(moved?.name).toBe(Figure.PAWN);
      // Captured pawn should be gone
      expect(board.getFigure('d5')?.owner).toBe(white);
    });

    it('applies disambiguated knight move Nbd2', () => {
      const { board, makeGame, white } = setup('e1', 'e8');
      board.createFigure(Figure.KNIGHT, white, 'b1');
      board.createFigure(Figure.KNIGHT, white, 'f1');
      const game = makeGame();
      game.move('Nbd2');
      expect(board.getFigure('d2')?.name).toBe(Figure.KNIGHT);
      // Ensure the other knight stayed
      expect(board.getFigure('f1')?.name).toBe(Figure.KNIGHT);
    });

    it('applies both-file-and-rank disambiguation for knights Nb1d2', () => {
      const { board, makeGame, white } = setup('e1', 'e8');
      board.createFigure(Figure.KNIGHT, white, 'b1');
      board.createFigure(Figure.KNIGHT, white, 'b3');
      board.createFigure(Figure.KNIGHT, white, 'f1');
      const game = makeGame();
      game.move('Nb1d2');
      expect(board.getFigure('d2')?.name).toBe(Figure.KNIGHT);
      // Ensure the other knights stayed
      expect(board.getFigure('b3')?.name).toBe(Figure.KNIGHT);
      expect(board.getFigure('f1')?.name).toBe(Figure.KNIGHT);
    });

    it('applies castling O-O moving both king and rook', () => {
      const { board, makeGame, white } = setup('e1', 'e8');
      board.createFigure(Figure.ROOK, white, 'h1');
      const game = makeGame();
      game.move('O-O');
      expect(board.getFigure('g1')?.name).toBe(Figure.KING);
      expect(board.getFigure('f1')?.name).toBe(Figure.ROOK);
      expect(board.getFigure('e1')).toBeNull();
      expect(board.getFigure('h1')).toBeNull();
    });

    it('applies promotion b8=Q', () => {
      const { board, makeGame, white } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'b7');
      const game = makeGame();
      game.move('b8=Q');
      const at = board.getFigure('b8');
      expect(at?.name).toBe(Figure.QUEEN);
      expect(at?.owner).toBe(white);
    });

    it('deserializes en passant sequence d4, exd5 (black captures)', () => {
      const { board, makeGame, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, black, 'e4');
      board.createFigure(Figure.PAWN, white, 'd2');
      const game = makeGame();

      // White double push to enable en passant
      game.move('d4');

      // Black captures en passant
      game.move('exd3');
      const at = board.getFigure('d3');
      expect(at?.name).toBe(Figure.PAWN);
      expect(at?.owner).toBe(black);
      expect(board.getFigure('e4')).toBeNull();
      expect(board.getFigure('d4')).toBeNull();
    });

    it('deserializes pawn capture to promotion exf8=Q', () => {
      const { board, makeGame, white, black } = setup('e1', 'e8');
      board.createFigure(Figure.PAWN, white, 'e7');
      board.createFigure(Figure.ROOK, black, 'f8');
      const game = makeGame();
      game.move('exf8=Q');
      const at = board.getFigure('f8');
      expect(at?.name).toBe(Figure.QUEEN);
      expect(at?.owner).toBe(white);
      // Captured rook removed
      expect(
        board
          .getPlayerFiguresByName(black, Figure.ROOK)
          .every((f) => f.state.captured),
      ).toBeTruthy();
    });
  });
});
