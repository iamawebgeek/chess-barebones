import { Figure } from '../types';
import { FigureCreator } from '../figure';
import { getRelativeDirection, pathsToObstacle } from '../helpers';

export const createCheckProxy = (
  figureCreator: FigureCreator,
): FigureCreator => {
  return (props) => {
    const figure = figureCreator(props);
    return {
      ...figure,
      getAvailableMoves(bypassDecorators, pierce) {
        if (bypassDecorators) {
          return figure.getAvailableMoves(bypassDecorators, pierce);
        }
        const owner = props.board.getFigureOwner(figure.getState().coordinate);
        const kingLookup = owner?.getFiguresByName(Figure.KING) ?? [];
        if (kingLookup.length === 0) {
          throw new Error('King has not been added.');
        }
        const kingsCoordinate = kingLookup[0].getState().coordinate;
        const checkingFigures =
          props.board.getCoordinateAttackers(kingsCoordinate);
        if (checkingFigures.length === 0) {
          return figure.getAvailableMoves(bypassDecorators);
        }
        if (checkingFigures.length > 1) {
          // double check forces only king move
          return [];
        }
        const checkerCoordinate = checkingFigures[0].getState().coordinate;
        const kingToCheckerDirection = getRelativeDirection(
          kingsCoordinate,
          checkerCoordinate,
        )!;
        const checkingMoves = pathsToObstacle({
          board: props.board,
          coordinate: kingsCoordinate,
          direction: kingToCheckerDirection,
          includeOwnObstacle: false,
          captureObstacle: true,
        });
        return figure.getAvailableMoves(bypassDecorators).filter(({ x, y }) => {
          // return only moves that could block the checker's path
          // valid move if the checker can be captured
          return checkingMoves.some(
            (coordinate) => x === coordinate.x && y === coordinate.y,
          );
        });
      },
    };
  };
};
