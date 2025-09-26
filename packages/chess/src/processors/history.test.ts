import { Player } from '@chess-barebones/core';
import { describe, it, expect, vi } from 'vitest';

import { HistoryProcessor } from './history';
import { ChessBoard8x8 } from '../board';
import { RegularChess, Color } from '../chess';
import { ChessFigureFactory } from '../factory';

const setup = () => {
  const board = new ChessBoard8x8(new ChessFigureFactory());
  const processor = new HistoryProcessor(board);
  const game = new RegularChess(board, processor);

  const players: Record<string, Player> = {
    [Color.WHITE]: game.getPlayerByColor(Color.WHITE),
    [Color.BLACK]: game.getPlayerByColor(Color.BLACK),
  };

  return { board, processor, game, players };
};

// Positions: start with only two pawns so SAN moves can be executed via Game.move
const INIT = '3k4/3p4/8/8/8/8/4P3/4K3'; // black pawn d7, white pawn e2
const AFTER_E4 = '3k4/3p4/8/8/4P3/8/8/4K3'; // after white plays e4
const AFTER_D5 = '3k4/8/8/3p4/4P3/8/8/4K3'; // after black replies d5

describe('HistoryProcessor with ChessBoard8x8', () => {
  it('initialises with no moves', () => {
    const { board, players, processor, game } = setup();
    board.loadPosition(INIT, players);
    game.start();
    expect(processor.getAllMoves()).toEqual([]);
  });

  it('records moves and positions correctly', () => {
    const { board, players, processor, game } = setup();

    board.loadPosition(INIT, players);
    game.start();
    game.move('e4');
    game.move('d5');

    expect(processor.getAllMoves()).toEqual(['e4', 'd5']);
  });

  it('removes the last move and restores board state on undoMove call', () => {
    const { board, players, processor, game } = setup();

    board.loadPosition(INIT, players);
    game.start();

    game.move('e4');
    game.move('d5');

    processor.undoMove();

    expect(processor.getAllMoves()).toEqual(['e4']);
    expect(board.serializePosition()).toBe(AFTER_E4);
  });

  it('does nothing when undoMove is called on an empty history', () => {
    const { board, processor } = setup();
    const spy = vi.spyOn(board, 'loadPosition');
    processor.undoMove();
    expect(spy).not.toHaveBeenCalled();
  });

  it('navigates the faced positions on previousMove and nextMove', () => {
    const { board, players, processor, game } = setup();

    board.loadPosition(INIT, players);
    game.start();

    game.move('e4');
    game.move('d5');

    processor.previousMove();
    expect(board.serializePosition()).toBe(AFTER_E4);

    processor.nextMove();
    expect(board.serializePosition()).toBe(AFTER_D5);
  });

  it('does nothing on the initial position when previousMove called', () => {
    const { board, processor, game } = setup();
    const spy = vi.spyOn(board, 'loadPosition');
    game.start();
    processor.previousMove();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not go beyond the last recorded position', () => {
    const { board, players, processor, game } = setup();
    const spy = vi.spyOn(board, 'loadPosition');

    board.loadPosition(INIT, players);
    game.start();

    game.move('e4');
    game.move('d5');

    processor.previousMove();
    expect(board.serializePosition()).toBe(AFTER_E4);
    processor.nextMove();
    expect(board.serializePosition()).toBe(AFTER_D5);

    spy.mockClear();
    processor.nextMove(); // at the end already
    expect(board.serializePosition()).toBe(AFTER_D5);
    expect(spy).not.toHaveBeenCalled();
  });
});
