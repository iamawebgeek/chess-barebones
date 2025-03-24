import { Direction, Figure } from './types';
import { createAbstractFigure, FigureCreator } from './figure';
import { pathsToObstacle } from './helpers';
import { createCheckProxy, createPinProxy } from './decorators';

const directions = [
  Direction.SOUTH_EAST,
  Direction.NORTH_EAST,
  Direction.SOUTH_WEST,
  Direction.NORTH_WEST,
] as const;

export const createBishop: FigureCreator = createCheckProxy(
  createPinProxy((props) => {
    const bishop = createAbstractFigure({
      ...props,
      name: Figure.BISHOP,
    });
    return {
      ...bishop,
      getAvailableMoves(bypassDecorators, pierce = false) {
        return directions
          .map((direction) =>
            pathsToObstacle({
              captureObstacle: true,
              includeOwnObstacle: pierce,
              coordinate: bishop.getState().coordinate,
              board: props.board,
              direction,
            }),
          )
          .flat();
      },
    };
  }),
);
