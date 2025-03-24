import { createAbstractFigure, FigureCreator, FigureInstance } from './figure';
import { Direction, Figure } from './types';
import { pathsToObstacle } from './helpers';
import { createCheckProxy, createPinProxy } from './decorators';

const directions = [
  Direction.EAST,
  Direction.WEST,
  Direction.NORTH,
  Direction.SOUTH,
  Direction.SOUTH_EAST,
  Direction.NORTH_EAST,
  Direction.SOUTH_WEST,
  Direction.NORTH_WEST,
] as const;

export const createQueen: FigureCreator = createCheckProxy(
  createPinProxy((props) => {
    const queen = createAbstractFigure({
      ...props,
      name: Figure.ROOK,
    });
    return {
      ...queen,
      getAvailableMoves(bypassDecorators, pierce = false) {
        return directions
          .map((direction) =>
            pathsToObstacle({
              captureObstacle: true,
              includeOwnObstacle: pierce,
              coordinate: queen.getState().coordinate,
              board: props.board,
              direction,
            }),
          )
          .flat();
      },
    } as FigureInstance;
  }),
);
