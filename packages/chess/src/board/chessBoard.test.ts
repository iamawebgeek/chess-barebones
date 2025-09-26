import { Direction, Player, ParsingError } from '@chess-barebones/core';
import { describe, it, expect } from 'vitest';

import { ChessBoard8x8 } from './chessBoard';
import { Color } from '../chess';
import { ChessFigureFactory } from '../factory';

// Tests must use a setup() function instead of hooks
const setup = () => {
  const board = new ChessBoard8x8(new ChessFigureFactory());
  const white = new Player(Color.WHITE, Direction.SOUTH);
  const black = new Player(Color.BLACK, Direction.NORTH);
  const players: Record<string, Player> = {
    [Color.WHITE]: white,
    [Color.BLACK]: black,
  };
  return { board, players, white, black };
};

describe('ChessBoard8x8 FEN load/serialize', () => {
  it('loads a valid piece-placement FEN and serializes back identically', () => {
    const { board, players } = setup();
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

    board.loadPosition(fen, players);

    expect(board.serializePosition()).toBe(fen);
  });

  it('accepts full FEN by using only piece placement field', () => {
    const { board, players } = setup();
    const fullFen = '8/8/8/8/8/8/8/8 w - - 0 1';

    board.loadPosition(fullFen, players);

    expect(board.serializePosition()).toBe('8/8/8/8/8/8/8/8');
  });

  it('serializes scattered pieces correctly', () => {
    const { board, players } = setup();

    // Place a few pieces via FEN
    const fen = '8/8/8/3k4/8/8/4P3/8'; // black king on d5, white pawn on e2
    board.loadPosition(fen, players);

    expect(board.serializePosition()).toBe(fen);
  });
});

describe('ChessBoard8x8 FEN validation', () => {
  it('throws when FEN does not have 8 ranks', () => {
    const { board, players } = setup();
    const badFen = '8/8/8/8/8/8/8'; // only 7 ranks

    expect(() => board.loadPosition(badFen, players)).toThrow(ParsingError);
  });

  it('throws when a rank length is invalid (too short)', () => {
    const { board, players } = setup();
    const badFen = '7/8/8/8/8/8/8/8'; // first rank only sums to 7

    expect(() => board.loadPosition(badFen, players)).toThrow(ParsingError);
  });

  it('throws when a rank has extraneous squares (too long)', () => {
    const { board, players } = setup();
    const badFen = '9/8/8/8/8/8/8/8'; // first rank sums to 9

    expect(() => board.loadPosition(badFen, players)).toThrow(ParsingError);
  });

  it('throws when an invalid piece character is used', () => {
    const { board, players } = setup();
    const badFen = '8/8/8/8/8/8/8/7Z';

    expect(() => board.loadPosition(badFen, players)).toThrow(ParsingError);
  });

  it('throws when a player for a piece color is not provided', () => {
    const { board, players } = setup();
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { black, ...playersButBlack } = players;

    const fen = '8/8/8/3k4/8/8/4P3/8';

    expect(() => board.loadPosition(fen, playersButBlack)).toThrow(
      ParsingError,
    );
  });
});

describe('ChessBoard8x8 coordinates mapping', () => {
  it('maps board coordinates to FEN ranks/files properly in serializePosition', () => {
    const { board, players } = setup();

    // Put pieces to verify exact placement mapping:
    // a8 white rook, h1 black rook, e4 white queen, b7 black knight
    const fen = 'R6n/8/8/8/4Q3/8/8/7r';

    board.loadPosition(fen, players);

    expect(board.serializePosition()).toBe(fen);
  });
});
