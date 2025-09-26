import { Color, Figure, ChessFigureFactory } from '@chess-barebones/chess';
import {
  Board8x8,
  Direction,
  Player,
  XLine,
  YLine,
} from '@chess-barebones/core';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { BoardFigureComponent, FigureProps } from './BoardFigureComponent';

const DummyFigure = ({ location, color, name, onSelect }: FigureProps) => (
  <button
    data-testid="figure"
    data-x={location.x}
    data-y={location.y}
    data-color={color}
    data-name={name}
    onClick={onSelect}
  >
    Figure
  </button>
);

describe('BoardFigureComponent', () => {
  it('passes mirrored location when flipped', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const white = new Player(Color.WHITE, Direction.SOUTH);
    const figure = board.createFigure(Figure.PAWN, white, 'b3');

    render(
      <BoardFigureComponent figure={figure} Component={DummyFigure} flipped />,
    );
    const btn = screen.getByTestId('figure');
    expect(btn.getAttribute('data-x')).toBe(String(XLine.G));
    expect(btn.getAttribute('data-y')).toBe(String(YLine._6));
    expect(btn.getAttribute('data-color')).toBe('white');
    expect(btn.getAttribute('data-name')).toBe('pawn');
  });

  it('calls onSelect with the figure instance', () => {
    const board = new Board8x8<Figure>(new ChessFigureFactory());
    const black = new Player(Color.BLACK, Direction.NORTH);
    const figure = board.createFigure(Figure.QUEEN, black, { x: 5, y: 5 });

    const onSelect = vi.fn();

    render(
      <BoardFigureComponent
        figure={figure}
        Component={DummyFigure}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByTestId('figure'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(figure);
  });
});
