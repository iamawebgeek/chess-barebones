import { Direction, DirectionToVectorMap, Figure } from './types';
import { createAbstractFigure, FigureCreator } from './figure';
import { getRelativeDirection, pathsToObstacle, walk } from './helpers';
import { Coordinate, XLine } from '../board/types';

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

export const createKing: FigureCreator = (props) => {
  const king = createAbstractFigure({
    ...props,
    name: Figure.KING,
  });
  return {
    ...king,
    move(coordinate: Coordinate) {
      const figure = props.board.getFigure(coordinate);
      if (figure) {
        const direction = getRelativeDirection(
          king.getState().coordinate,
          coordinate,
        );
        const rooksNewCoordinate = walk(
          coordinate,
          DirectionToVectorMap[
            direction === Direction.EAST ? Direction.WEST : Direction.EAST
          ],
        );
        if (!rooksNewCoordinate) {
          throw new Error('Cannot place rook for castling');
        }
        king.move({
          x: direction === Direction.EAST ? XLine.G : XLine.C,
          y: coordinate.y,
        });
        figure.move(rooksNewCoordinate);
      } else {
        king.move(coordinate);
      }
    },
    getAvailableMoves(bypassDecorators) {
      const kingsCoordinate = king.getState().coordinate;
      const figureOwner = props.board.getFigureOwner(kingsCoordinate);
      let moves = directions
        .map((direction) =>
          pathsToObstacle({
            captureObstacle: true,
            includeOwnObstacle: false,
            coordinate: kingsCoordinate,
            board: props.board,
            takeMax: 1,
            direction,
          }),
        )
        .flat();
      if (bypassDecorators) {
        return moves;
      }
      moves = moves.filter(
        (move) =>
          props.board
            .getAllPlayers()
            .filter(
              (player) =>
                player !== figureOwner &&
                player.getCoordinateAttackers(move).length > 0,
            ).length === 0,
      );
      // castling logic
      const underCheck = props.board
        .getCoordinateAttackers(kingsCoordinate)
        .some((attacker) => {
          return (
            props.board.getFigureOwner(attacker.getState().coordinate) !==
            figureOwner
          );
        });
      // prevent castling when the king has moved or under a check
      if (king.getState().moved || underCheck) {
        return moves;
      }
      [Direction.EAST, Direction.WEST].forEach((direction) => {
        // TODO
        const lookup = pathsToObstacle({
          captureObstacle: false,
          includeOwnObstacle: true,
          coordinate: kingsCoordinate,
          board: props.board,
          direction,
        });
        const figure = props.board.getFigure(lookup[lookup.length - 1]);
        // allow castling when the neighbour figure is rook and it hasn't moved
        if (
          figure &&
          figure.getState().name === Figure.ROOK &&
          !figure.getState().moved
        ) {
          moves.push(figure.getState().coordinate);
        }
      });
      return moves;
    },
  };
};
