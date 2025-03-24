import { createAbstractFigure, FigureInstance } from './figure';
import { pathsToObstacle, walk } from './helpers';
import { Direction, DirectionToVectorMap, Figure, FigureProps } from './types';
import { Coordinate, YLine } from '../board/types';
import { createQueen } from './queen';
import { createCheckProxy, createPinProxy } from './decorators';

export const createPawn = createCheckProxy(
  createPinProxy((props: FigureProps) => {
    const abstractFigure = createAbstractFigure({
      ...props,
      name: Figure.PAWN,
    });
    const pawn: FigureInstance = {
      ...abstractFigure,
      move(coordinate) {
        // promotion
        if (coordinate.y === YLine._8 || coordinate.y === YLine._1) {
          abstractFigure.move(coordinate);
          // TODO: let players select among 4 main figures
          const queen = createQueen({
            board: props.board,
            initialCoordinate: coordinate,
          });
          Object.assign(pawn, queen);
        } else {
          // handle en-passant
          if (
            coordinate.x !== abstractFigure.getState().coordinate.x &&
            !props.board.getFigureOwner(coordinate)
          ) {
            props.board.getLastMovedFigure()?.capture();
          }
          abstractFigure.move(coordinate);
        }
      },
      getAvailableMoves(bypassDecorators, pierce = false) {
        let coordinate = pawn.getState().coordinate;
        const paths = pathsToObstacle({
          board: props.board,
          coordinate,
          includeOwnObstacle: false,
          captureObstacle: false,
          takeMax: pawn.getState().moved ? 1 : 2,
          direction:
            props.initialCoordinate.y < 4 ? Direction.NORTH : Direction.SOUTH,
        });
        const figureOwner = props.board.getFigureOwner(coordinate);
        const captureDirections =
          props.initialCoordinate.y < 4
            ? [Direction.NORTH_WEST, Direction.NORTH_EAST]
            : [Direction.SOUTH_WEST, Direction.SOUTH_EAST];
        captureDirections.forEach((direction) => {
          const captureCoordinate = walk(
            coordinate,
            DirectionToVectorMap[direction],
          );
          if (!captureCoordinate) {
            return;
          }
          const figure = props.board.getFigure(captureCoordinate);
          if (
            figure &&
            (pierce
              ? true
              : props.board.getFigureOwner(captureCoordinate) !== figureOwner)
          ) {
            paths.push(captureCoordinate);
          }
        });
        // en-passant
        const lastMoved = props.board.getLastMovedFigure();
        if (lastMoved && lastMoved?.getState().name === Figure.PAWN) {
          const lastMove = lastMoved.getState().lastMove!;
          const lastMoveCoordinateYDiff = Math.abs(
            lastMove[0].y - lastMove[1].y,
          );
          const lastMovedToFigureXDiff =
            lastMoved.getState().coordinate.x - coordinate.x;
          const bothOnSameLine =
            lastMoved.getState().coordinate.y === coordinate.y;
          if (
            bothOnSameLine &&
            lastMoveCoordinateYDiff === 2 &&
            Math.abs(lastMovedToFigureXDiff) === 1
          ) {
            paths.push({ x: lastMove[1].x, y: coordinate.y + 1 });
          }
        }
        return paths;
      },
    };
    return pawn;
  }),
);
