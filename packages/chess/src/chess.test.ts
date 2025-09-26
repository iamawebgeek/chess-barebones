import { Board8x8, Direction, Player } from '@chess-barebones/core';
import { describe, expect, it } from 'vitest';

import { Color, RegularChess } from './chess';
import { ChessFigureFactory } from './factory';
import { Figure } from './figures';
import { StandardChessInitializer } from './initializers';

describe('RegularChess', () => {
  it('starts the game', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const chess = new RegularChess(board, new StandardChessInitializer(board));
    chess.start();
    expect(chess.state.started).toBeTruthy();
  });

  it('throws on attempt to start the game when more players have been added', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const chess = new RegularChess(board);
    chess.addPlayer(new Player(Color.WHITE, Direction.WEST));
    expect(() => chess.start()).toThrow();
    expect(chess.state.started).toBeFalsy();
  });

  it('returns correct color player', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const chess = new RegularChess(board);
    expect(chess.getPlayerByColor(Color.WHITE)?.color).toBe(Color.WHITE);
    expect(chess.getPlayerByColor(Color.BLACK)?.color).toBe(Color.BLACK);
  });
});
