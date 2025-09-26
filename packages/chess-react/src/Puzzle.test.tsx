import { Color } from '@chess-barebones/chess';
import { Game } from '@chess-barebones/core';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { FigureProps } from './BoardFigureComponent';
import { BoardProps } from './Chess';
import { Puzzle } from './Puzzle';

const DummyFigure = ({ name, location, color }: FigureProps) => (
  <button
    data-testid="figure"
    data-x={location.x}
    data-y={location.y}
    data-color={color}
    data-name={name}
  />
);

const DummyBoard = ({ boardFigures }: BoardProps) => (
  <div>
    <div data-testid="figures-count">{boardFigures.length}</div>
    {boardFigures}
  </div>
);

describe('Puzzle component', () => {
  it('loads initial position and makes first puzzler move when playing for white', async () => {
    const movesGenerator = function* () {
      yield 'e4';
    } as GeneratorFunction;

    render(
      <Puzzle
        initialPosition="k7/8/8/8/8/8/4P3/4K3"
        movesGenerator={movesGenerator}
        autoFirstMove={true}
        playingFor={Color.BLACK}
        components={{
          Board: DummyBoard,
          Figure: DummyFigure,
          Capture: () => null,
          MoveHighlight: () => null,
          PawnPromotionMenu: () => null,
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('figures-count').textContent).toBe('3');
    });

    const figures = await screen.findAllByTestId('figure');
    const whitePawn = figures.find(
      (el) =>
        el.getAttribute('data-color') === Color.WHITE &&
        el.getAttribute('data-x') === '5' &&
        el.getAttribute('data-y') === '4',
    );
    expect(whitePawn).toBeTruthy();
  });

  it('renders figures at correct place after move', async () => {
    // eslint-disable-next-line require-yield
    const movesGenerator = function* () {
      return 'e5';
    } as GeneratorFunction;
    const ref = { current: null as unknown as Game };

    render(
      <Puzzle
        initialPosition="4k3/4p3/8/8/8/8/8/8"
        autoFirstMove={false}
        chessRef={ref}
        movesGenerator={movesGenerator}
        playingFor={Color.BLACK}
        components={{
          Board: DummyBoard,
          Figure: DummyFigure,
          Capture: () => null,
          MoveHighlight: () => null,
          PawnPromotionMenu: () => null,
        }}
      />,
    );

    // Wait for move to apply then assert two figures and black pawn at e5
    await waitFor(() => {
      expect(screen.getByTestId('figures-count').textContent).toBe('2');
    });

    act(() => {
      ref.current.move('e5');
    });

    const figures = await screen.findAllByTestId('figure');
    const blackE5 = figures.find(
      (el) =>
        el.getAttribute('data-color') === Color.BLACK &&
        el.getAttribute('data-x') === '5' &&
        el.getAttribute('data-y') === '5',
    );
    expect(blackE5).toBeTruthy();
  });
});
