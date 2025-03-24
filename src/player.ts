import { FigureInstance } from './figures';
import { Coordinate } from './board/types';
import { Figure } from './figures/types';

export const createPlayer = (color: string) => {
  const state = {
    color,
    figures: [] as FigureInstance[],
    score: null as number | null,
  };
  return {
    assignScore(score: number) {
      state.score = score;
    },
    addFigure(figure: FigureInstance) {
      state.figures.push(figure);
    },
    getFigureByCoordinate({ x, y }: Coordinate) {
      return (
        state.figures.find((figure) => {
          const { coordinate, captured } = figure.getState();
          return coordinate.x === x && coordinate.y === y && !captured;
        }) || null
      );
    },
    getFiguresByName(figureName: Figure) {
      return state.figures.filter(
        (figure) => figure.getState().name === figureName,
      );
    },
    getCoordinateAttackers(coordinate: Coordinate) {
      return state.figures.filter((figure) =>
        figure
          .getAvailableMoves(true, true)
          .some(({ x, y }) => x === coordinate.x && y === coordinate.y),
      );
    },
    getState() {
      return state as Readonly<typeof state>;
    },
  };
};

export type Player = ReturnType<typeof createPlayer>;
