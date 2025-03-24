import { Player } from '../player';
import { BoardInstance, Coordinate } from './types';
import type { FigureInstance } from '../figures';
import { Color } from '../chess';

export const createBoard = () => {
  const state = {
    players: [] as Player[],
    lastMovedFigure: null as null | FigureInstance,
  };
  const board: BoardInstance = {
    addPlayer(player: Player) {
      state.players.push(player);
    },
    move(figure: FigureInstance) {
      state.lastMovedFigure = figure;
    },
    getPlayer(color: Color) {
      return (
        state.players.find((player) => player.getState().color === color) ||
        null
      );
    },
    getAllPlayers() {
      return state.players;
    },
    getFigure(coordinate: Coordinate) {
      for (const player of state.players) {
        const figure = player.getFigureByCoordinate(coordinate);
        if (figure !== null) {
          return figure;
        }
      }
      return null;
    },
    getFigureOwner(coordinate: Coordinate) {
      for (const player of state.players) {
        const figure = player.getFigureByCoordinate(coordinate);
        if (figure !== null) {
          return player;
        }
      }
      return null;
    },
    getCoordinateAttackers(coordinate: Coordinate) {
      const owner = board.getFigureOwner(coordinate);
      return state.players
        .map((player) => {
          if (player === owner) {
            return [];
          }
          return player.getState().figures.filter((figure) => {
            return (
              !figure.getState().captured &&
              figure
                .getAvailableMoves(true, true)
                .some(
                  (move) => move.x === coordinate.x && move.y === coordinate.y,
                )
            );
          });
        })
        .flat();
    },
    getLastMovedFigure() {
      return state.lastMovedFigure;
    },
    getAllFigures() {
      return state.players.flatMap(({ getState }) => getState().figures);
    },
  };
  return board;
};
