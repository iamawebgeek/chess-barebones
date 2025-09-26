import { PAWN_PROMOTION } from '@chess-barebones/chess';
import {
  AbstractBoard,
  AbstractFigure,
  Direction,
  Game,
  Timer,
} from '@chess-barebones/core';
import * as React from 'react';

import { BoardFigureComponent } from './BoardFigureComponent';
import { TimerComponent } from './TimerComponent';
import { useObservablesState } from './useObservablesState';

import type { FigureProps } from './BoardFigureComponent';
import type { TimerProps } from './TimerComponent';
import type { Figure as FigureName } from '@chess-barebones/chess';
import type { Coordinate, Move, NotCaptured } from '@chess-barebones/core';

export type MoveHighlightProps = {
  move: Move;
  onSelect(): void;
  onCancel(): void;
};

export type PawnPromotionMenuProps = {
  figure: AbstractFigure<FigureName, NotCaptured>;
  coordinate: Coordinate;
  onSelect(figureName: FigureName): void;
  onCancel(): void;
};

export type BoardProps = {
  timerTop: React.ReactElement | null;
  timerBottom: React.ReactElement | null;
  capturesTop: React.ReactElement[];
  capturesBottom: React.ReactElement[];
  boardFigures: React.ReactElement[];
  promotionMenu: React.ReactElement | null;
  moves: React.ReactElement[] | null;
};

export type ChessProps = {
  flipped?: boolean;
  playingFor?: string;
  chessInstance: Game<FigureName, any>;
  boardInstance: AbstractBoard<FigureName>;
  timer?: Timer;
  components: {
    Board: React.ComponentType<BoardProps>;
    Figure: React.ComponentType<FigureProps>;
    Capture: React.ComponentType<Pick<FigureProps, 'name' | 'color'>>;
    MoveHighlight: React.ComponentType<MoveHighlightProps>;
    PawnPromotionMenu: React.ComponentType<PawnPromotionMenuProps>;
    Timer?: React.ComponentType<TimerProps>;
  };
};

export const Chess: React.FC<ChessProps> = ({
  chessInstance,
  boardInstance,
  playingFor,
  flipped,
  components: Components,
  timer,
}) => {
  const [selected, setSelected] = React.useState<AbstractFigure<
    FigureName,
    NotCaptured
  > | null>(null);
  const [promotionAt, setPromotionAt] = React.useState<null | Coordinate>(null);

  const handleFigureSelect = React.useCallback(
    (figure: AbstractFigure<FigureName>) => {
      if (!figure.state.captured) {
        setSelected((current) =>
          current === figure
            ? null
            : (figure as AbstractFigure<FigureName, NotCaptured>),
        );
      }
    },
    [],
  );

  const handleMoveSelect = (move: Move) => () => {
    if (move.requiresInput === PAWN_PROMOTION) {
      setPromotionAt(move);
    } else {
      const serialized = chessInstance.serializer.serialize({
        from: selected!.state.coordinate,
        to: { x: move.x, y: move.y },
      });
      chessInstance.move(serialized);
      setSelected(null);
    }
  };

  const handlePromotion = React.useCallback(
    (promotion: FigureName) => {
      const serialized = chessInstance.serializer.serialize({
        from: selected!.state.coordinate,
        to: { x: promotionAt!.x, y: promotionAt!.y },
        promotion,
      });
      chessInstance.move(serialized);
      setSelected(null);
      setPromotionAt(null);
    },
    [chessInstance, promotionAt, selected],
  );

  const handleCancel = React.useCallback(() => {
    setPromotionAt(null);
    setSelected(null);
  }, []);

  const chessState = useObservablesState(chessInstance);
  const boardState = useObservablesState(boardInstance);

  const playing = !chessState.ended && chessState.started;
  const playerTopFlank = flipped ? Direction.SOUTH : Direction.NORTH;
  const playerBottomFlank = flipped ? Direction.NORTH : Direction.SOUTH;
  const playerTop = chessInstance.state.players.find(
    ({ flank }) => flank === playerTopFlank,
  );
  const playerBottom = chessInstance.state.players.find(
    ({ flank }) => flank === playerBottomFlank,
  );

  const mirror = (coord: Coordinate): Coordinate =>
    flipped ? { x: 9 - coord.x, y: 9 - coord.y } : coord;

  return (
    <Components.Board
      capturesTop={Object.values(boardState.captures)
        .filter((figure) => figure.state.capture[0] === playerTop)
        .map((figure) => (
          <Components.Capture
            key={figure.id}
            color={figure.owner.color}
            name={figure.name}
          />
        ))}
      capturesBottom={Object.values(boardState.captures)
        .filter((figure) => figure.state.capture[0] === playerBottom)
        .map((figure) => (
          <Components.Capture
            key={figure.id}
            color={figure.owner.color}
            name={figure.name}
          />
        ))}
      timerTop={
        timer && Components.Timer ? (
          <TimerComponent
            timer={timer}
            Component={Components.Timer}
            playerFlank={playerTopFlank}
            chessInstance={chessInstance}
          />
        ) : null
      }
      timerBottom={
        timer && Components.Timer ? (
          <TimerComponent
            timer={timer}
            Component={Components.Timer}
            playerFlank={playerBottomFlank}
            chessInstance={chessInstance}
          />
        ) : null
      }
      boardFigures={Object.values(boardState.activeFigures).map((figure) => {
        const ourTurnToMove =
          (typeof playingFor === 'undefined' ||
            figure.owner.color === playingFor) &&
          figure.owner === chessInstance.getPlayerToMove();
        return (
          <BoardFigureComponent
            key={figure.id}
            figure={figure}
            Component={Components.Figure}
            onSelect={playing && ourTurnToMove ? handleFigureSelect : undefined}
            flipped={!!flipped}
          />
        );
      })}
      promotionMenu={
        promotionAt !== null && selected !== null ? (
          <Components.PawnPromotionMenu
            figure={selected}
            coordinate={mirror(promotionAt)}
            onSelect={handlePromotion}
            onCancel={handleCancel}
          />
        ) : null
      }
      moves={
        selected && promotionAt === null
          ? selected
              .getAvailableMoves()
              .map((move) => (
                <Components.MoveHighlight
                  key={boardInstance.serializeCoordinate(move)}
                  move={{ ...move, ...mirror(move) }}
                  onSelect={handleMoveSelect(move)}
                  onCancel={handleCancel}
                />
              ))
          : null
      }
    />
  );
};
