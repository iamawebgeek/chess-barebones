import { Direction, Figure } from './types';
import { createAbstractFigure, FigureCreator } from './figure';
import { pathsToObstacle } from './helpers';
import { createCheckProxy, createPinProxy } from './decorators';

const directions = [
  Direction.EAST,
  Direction.WEST,
  Direction.NORTH,
  Direction.SOUTH,
] as const;

export const createRook: FigureCreator = createCheckProxy(
  createPinProxy((props) => {
    const rook = createAbstractFigure({
      ...props,
      name: Figure.ROOK,
    });
    return {
      ...rook,
      getAvailableMoves(bypassDecorators, pierce = false) {
        return directions
          .map((direction) =>
            pathsToObstacle({
              captureObstacle: true,
              includeOwnObstacle: pierce,
              coordinate: rook.getState().coordinate,
              board: props.board,
              direction,
            }),
          )
          .flat();
      },
    };
  }),
);
