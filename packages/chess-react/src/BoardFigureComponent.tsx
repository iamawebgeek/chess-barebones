import { AbstractFigure } from '@chess-barebones/core';
import * as React from 'react';

import { useObservablesState } from './useObservablesState';

import type { Figure } from '@chess-barebones/chess';
import type { Coordinate, NotCaptured } from '@chess-barebones/core';

export type FigureProps = {
  location: Coordinate;
  color: string;
  name: Figure;
  onSelect?: () => void;
};

export type BoardFigureComponentProps = {
  figure: AbstractFigure<Figure, NotCaptured>;
  Component: React.ComponentType<FigureProps>;
  onSelect?: (figure: AbstractFigure<Figure>) => void;
  flipped?: boolean;
};

const mirror = (coordinate: Coordinate, flipped?: boolean): Coordinate =>
  flipped ? { x: 9 - coordinate.x, y: 9 - coordinate.y } : coordinate;

export const BoardFigureComponent = React.memo(
  ({ figure, Component, onSelect, flipped }: BoardFigureComponentProps) => {
    const figureState = useObservablesState(figure);
    return (
      <Component
        location={mirror(figureState.coordinate, flipped)}
        color={figure.owner.color}
        name={figure.name}
        onSelect={onSelect ? () => onSelect(figure) : undefined}
      />
    );
  },
);

BoardFigureComponent.displayName = 'BoardFigure';
