import { describe, expect, it } from 'vitest';

import { Board8x8 } from './board';
import { BaseFigure, castFigure, NotCaptured } from './figure';
import { Player } from './player';
import { Direction } from './types';

import type { FigureFactory } from './factory';

const makePlayers = () => ({
  white: new Player('w', Direction.NORTH),
  black: new Player('b', Direction.SOUTH),
});

const baseFactory: FigureFactory<string> = {
  create(name, player, board, coordinate) {
    return castFigure<NotCaptured>(
      new BaseFigure(name, player, board, coordinate),
    );
  },
};

const makeBoard = () => new Board8x8<string>(baseFactory);

describe('BaseFigure', () => {
  it('spawns on given coordinate and reports state', () => {
    const board = makeBoard();
    const { white } = makePlayers();
    const figure = board.createFigure('figure', white, 'a1');
    expect(figure.state).toEqual({
      captured: false,
      capture: null,
      coordinate: { x: 1, y: 1 },
      previousCoordinate: null,
    });
  });

  it('has no coordinate when captured and preserves previousCoordinate; capture is idempotent', () => {
    const board = makeBoard();
    const { white, black } = makePlayers();
    const figure = board.createFigure('figure', white, 'a1');

    figure.captureBy(black);

    expect(figure.state).toEqual({
      captured: true,
      capture: [black, 1],
      coordinate: null,
      previousCoordinate: { x: 1, y: 1 },
    });

    // Capture again should not change previousCoordinate
    figure.captureBy(black);

    expect(figure.state.previousCoordinate).toEqual({ x: 1, y: 1 });
  });

  it('move() updates coordinates and board.lastMoved; moving to empty square', () => {
    const board = makeBoard();
    const { white } = makePlayers();
    const figure = board.createFigure('figure', white, 'a1');

    figure.move('b1');

    expect(figure.state).toEqual({
      captured: false,
      capture: null,
      coordinate: { x: 2, y: 1 },
      previousCoordinate: { x: 1, y: 1 },
    });
    expect(board.lastMoved).toBe(figure);
  });

  it('move() captures opponent at destination', () => {
    const board = makeBoard();
    const { white, black } = makePlayers();
    const whitePiece = board.createFigure('figure', white, 'a1');
    const blackPiece = board.createFigure('figure', black, 'b1');

    whitePiece.move('b1');

    // blackPiece should be captured
    expect(blackPiece.state.captured).toBe(true);
    expect(blackPiece.state.coordinate).toBeNull();
    // whitePiece should occupy the square
    expect(whitePiece.state.coordinate).toEqual({ x: 2, y: 1 });
    expect(board.lastMoved).toBe(whitePiece);
  });

  it('reset() returns figure to initial position and clears previousCoordinate', () => {
    const board = makeBoard();
    const { white, black } = makePlayers();
    const figure = board.createFigure('figure', white, 'c3');

    figure.move('f3');
    figure.captureBy(black);
    figure.reset();

    expect(figure.state).toEqual({
      captured: false,
      capture: null,
      coordinate: { x: 3, y: 3 },
      previousCoordinate: null,
    });
  });

  it('id format includes color-name-ordinal and ordinal increments per owner+name', () => {
    const board = makeBoard();
    const { white, black } = makePlayers();

    board.createFigure('figure', white, 'a1'); // w-figure-1
    board.createFigure('figure', white, 'b2'); // w-figure-2
    board.createFigure('figure', black, 'h8'); // b-figure-1 (separate owner)

    const figs = board.getAllFigures().filter((f) => f.name === 'figure');
    const ids = figs.map((f) => f.id).sort();
    expect(ids).toContain('w-figure-1');
    expect(ids).toContain('w-figure-2');
    expect(ids).toContain('b-figure-1');
  });

  it('BaseFigure has no available moves, all moves, or reach by default', () => {
    const board = makeBoard();
    const { white } = makePlayers();
    const figure = board.createFigure('figure', white, 'e5');

    expect(figure.getAvailableMoves()).toEqual([]);
    expect(figure.getAllMoves()).toEqual([]);
    expect(figure.getReach()).toEqual([]);
  });

  it('exposes name and owner', () => {
    const board = makeBoard();
    const { white } = makePlayers();
    const figure = board.createFigure('figure', white, 'b2');

    expect(figure.name).toBe('figure');
    expect(figure.owner).toBe(white);
  });
});
