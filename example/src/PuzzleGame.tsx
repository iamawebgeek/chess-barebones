import { Color } from '@chess-barebones/chess';
import { Puzzle } from '@chess-barebones/chess-react';
import { Game, type Handler } from '@chess-barebones/core';
import {
  Figure,
  Board,
  PawnPromotionMenu,
  Capture,
  Highlight,
} from 'chess-barebones-ui-components';
import * as React from 'react';
import styled from 'styled-components';

const ContentRow = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusBanner = styled.div<{
  $visible: boolean;
  $variant?: 'neutral' | 'success' | 'error';
}>`
  padding: 8px 12px;
  border-radius: 12px;
  height: 42px;
  box-sizing: border-box;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  ${({ $variant = 'neutral' }) =>
    $variant === 'success'
      ? `background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.35);`
      : $variant === 'error'
        ? `background: rgba(239, 68, 68, 0.18); border: 1px solid rgba(239, 68, 68, 0.35);`
        : `background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2);`}
`;

export const PuzzleGame: React.FC = () => {
  const chessInstanceRef = React.useRef<Game>(null);
  const [solved, setSolved] = React.useState<null | boolean>(null);
  const handler = React.useMemo<Handler>(
    () => ({
      onEnd() {
        const you = chessInstanceRef.current?.state.players.find(
          (player) => (player.color as Color) === Color.WHITE,
        );
        setSolved(you?.state.score === 1);
      },
    }),
    [],
  );

  const initialPosition = '1k1r1q2/2b2p2/7R/pK6/2N1Q3/1P6/8/8';
  const movesGenerator = React.useMemo(
    () =>
      async function* () {
        const moves = [
          'Rb6',
          'Bxb6',
          'Ka6',
          'Rd7',
          'Qa8',
          'Kxa8',
          'Nxb6',
          'Kb8',
          'Nxd7',
          'Kc8',
          'Nxf8',
          'Kd8',
          'Kxa5',
        ];
        let moveIndex = 0;
        while (moveIndex < moves.length) {
          const nextMove = moves[moveIndex++];
          await new Promise((resolve) => {
            setTimeout(resolve, 250);
          });
          if (moveIndex === moves.length) {
            return nextMove;
          } else {
            yield nextMove;
          }
        }
      } as AsyncGeneratorFunction,
    [],
  );

  return (
    <>
      <StatusBanner
        $visible={solved !== null}
        role="status"
        aria-live="polite"
        $variant="neutral"
      >
        {solved !== null &&
          (solved ? 'Nice, you nailed it!' : 'Oopsie! That was a wrong move')}
      </StatusBanner>
      <ContentRow>
        <Puzzle
          chessRef={chessInstanceRef as React.RefObject<Game>}
          autoFirstMove={false}
          initialPosition={initialPosition}
          movesGenerator={movesGenerator}
          playingFor={Color.WHITE}
          handler={handler}
          components={{
            Board,
            Figure,
            MoveHighlight: Highlight,
            PawnPromotionMenu,
            Capture,
          }}
        />
      </ContentRow>
    </>
  );
};
