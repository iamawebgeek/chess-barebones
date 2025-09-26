import { Direction, Game, Timer } from '@chess-barebones/core';
import * as React from 'react';

import { useObservablesState } from './useObservablesState';

export type TimerProps = {
  remainingMS: number;
  running: boolean;
  color: string;
};

export type TimerComponentProps = {
  timer: Timer;
  Component: React.ComponentType<TimerProps>;
  playerFlank: Direction;
  chessInstance: Game<any, any>;
};

export const TimerComponent: React.FC<TimerComponentProps> = ({
  chessInstance,
  playerFlank,
  timer,
  Component,
}) => {
  const chessState = useObservablesState(chessInstance);
  const player = chessState.players.find(({ flank }) => flank === playerFlank)!;
  const [, forceUpdate] = React.useReducer((s: number) => s + 1, 0);
  const running =
    chessState.started &&
    !chessState.ended &&
    chessInstance.getPlayerToMove() === player;

  React.useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        forceUpdate();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <Component
      remainingMS={timer.getRemainingTime(player)}
      running={running}
      color={player.color}
    />
  );
};
