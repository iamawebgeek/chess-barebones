import { FigureCreator } from '../figure';
import { Figure } from '../types';
import { getRelativeDirection, pathsToObstacle } from '../helpers';

const pinningFigures = [Figure.BISHOP, Figure.ROOK, Figure.QUEEN] as Readonly<
  Figure[]
>;

export const createPinProxy = (figureCreator: FigureCreator): FigureCreator => {
  return (props) => {
    const figure = figureCreator(props);
    return {
      ...figure,
      getAvailableMoves(bypassDecorators, pierce) {
        if (!bypassDecorators) {
          const kingLookup =
            props.board
              .getFigureOwner(figure.getState().coordinate)
              ?.getFiguresByName(Figure.KING) ?? [];
          if (kingLookup.length === 0) {
            throw new Error('King has not been added');
          }
          const { coordinate } = figure.getState();
          const kingsCoordinate = kingLookup[0].getState().coordinate;
          const kingToFigureDirection = getRelativeDirection(
            kingsCoordinate,
            coordinate,
          );
          if (kingToFigureDirection !== null) {
            const path = pathsToObstacle({
              coordinate: kingsCoordinate,
              direction: kingToFigureDirection,
              includeOwnObstacle: true,
              captureObstacle: false,
              board: props.board,
            });
            const lastCoordinate = path[path.length - 1];
            if (
              lastCoordinate &&
              lastCoordinate.x === coordinate.x &&
              lastCoordinate.y === coordinate.y
            ) {
              const pinningAttacker = props.board
                .getCoordinateAttackers(figure.getState().coordinate)
                .filter((attacker) => {
                  const figureToAttackerDirection = getRelativeDirection(
                    coordinate,
                    attacker.getState().coordinate,
                  );
                  return (
                    pinningFigures.includes(attacker.getState().name) &&
                    kingToFigureDirection === figureToAttackerDirection
                  );
                })[0];
              if (pinningAttacker) {
                return figure
                  .getAvailableMoves(true)
                  .filter(({ x: moveX, y: moveY }) => {
                    return (
                      pinningAttacker
                        .getAvailableMoves(true)
                        .some(
                          ({ x: attackX, y: attackY }) =>
                            attackX === moveX && attackY === moveY,
                        ) ||
                      (pinningAttacker.getState().coordinate.x === moveX &&
                        pinningAttacker.getState().coordinate.y === moveY)
                    );
                  });
              }
            }
          }
        }
        return figure.getAvailableMoves(bypassDecorators, pierce);
      },
    };
  };
};
