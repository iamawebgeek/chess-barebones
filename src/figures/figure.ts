import type { Figure, FigureProps } from './types';
import type { Coordinate } from '../board/types';

export const createAbstractFigure = ({
  name,
  initialCoordinate,
  board,
}: FigureProps & { name: Figure }) => {
  const state = {
    name,
    coordinate: initialCoordinate,
    captured: false,
    moved: false,
    lastMove: null as null | [Coordinate, Coordinate],
  };
  return {
    move(coordinate: Coordinate) {
      const coordinateFigure = board.getFigure(coordinate);
      coordinateFigure?.capture();
      state.lastMove = [state.coordinate, coordinate];
      state.coordinate = coordinate;
      state.moved = true;
    },
    capture() {
      state.captured = true;
    },
    getAvailableMoves(
      bypassDecorators: boolean = false,
      pierce: boolean = false,
    ) {
      return [] as Coordinate[];
    },
    getState() {
      return state as Readonly<typeof state>;
    },
  };
};

export type FigureInstance = ReturnType<typeof createAbstractFigure>;
export type FigureCreator = (props: FigureProps) => FigureInstance;
