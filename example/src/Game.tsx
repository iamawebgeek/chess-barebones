import { Color, RegularChess } from '@chess-barebones/chess';
import { RegularChess as RegularChessComponent } from '@chess-barebones/chess-react';
import { type Handler, Player, Timer } from '@chess-barebones/core';
import {
  Figure,
  Board,
  PawnPromotionMenu,
  Timer as TimerComponent,
  Capture,
  Highlight,
} from 'chess-barebones-ui-components';
import * as React from 'react';
import styled from 'styled-components';

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

const ContentRow = styled.div`
  display: flex;
  gap: 8px;
`;

const FlipIcon = styled.svg`
  width: 18px;
  height: 18px;
  display: inline-block;
  transition: transform 200ms ease;
  fill: currentColor;
`;

const FlipButton = styled.button`
  margin-top: 75px;
  height: 40px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))
      padding-box,
    linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(0, 0, 0, 0.25))
      border-box;
  color: var(--text);
  cursor: pointer;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition:
    transform 120ms ease,
    box-shadow 200ms ease,
    background 200ms ease;
  backdrop-filter: blur(6px);

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 10px 24px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 4px rgba(16, 185, 129, 0.35),
      0 8px 20px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  &[aria-pressed='true'] {
    background:
      linear-gradient(
          180deg,
          rgba(16, 185, 129, 0.18),
          rgba(16, 185, 129, 0.08)
        )
        padding-box,
      linear-gradient(180deg, rgba(16, 185, 129, 0.45), rgba(0, 0, 0, 0.25))
        border-box;
    border-color: rgba(16, 185, 129, 0.65);
  }

  &:hover ${FlipIcon} {
    transform: rotate(8deg);
  }

  &[aria-pressed='true'] ${FlipIcon} {
    transform: rotate(180deg);
  }
`;

export const Game: React.FC = () => {
  const chessInstanceRef = React.useRef<RegularChess>(null);

  const [leads, setLeads] = React.useState<null | Readonly<Player[]>>(null);
  const [flipped, setFlipped] = React.useState(false);
  const timer = React.useMemo(() => new Timer({ seconds: 600 }), []);

  const handler = React.useMemo<Handler>(
    () => ({
      onEnd() {
        const winner = chessInstanceRef.current?.state.players.find(
          (player) => player.state.score === 1,
        );
        if (!winner) {
          setLeads(chessInstanceRef.current?.state.players ?? []);
        } else {
          setLeads([winner]);
        }
      },
    }),
    [],
  );

  return (
    <>
      <StatusBanner
        $visible={!!leads}
        role="status"
        aria-live="polite"
        $variant="neutral"
      >
        {leads &&
          (leads.length === 1
            ? `${(leads[0].color as Color) === Color.BLACK ? 'Black' : 'White'} player wins!`
            : "It's a draw")}
      </StatusBanner>

      <ContentRow>
        <RegularChessComponent
          handler={handler}
          flipped={flipped}
          chessRef={chessInstanceRef as React.RefObject<RegularChess>}
          timer={timer}
          components={{
            Board,
            Figure,
            MoveHighlight: Highlight,
            PawnPromotionMenu,
            Capture,
            Timer: TimerComponent,
          }}
        />
        <FlipButton
          type="button"
          onClick={() => setFlipped((current) => !current)}
          aria-pressed={flipped}
          aria-label={flipped ? 'Unflip board' : 'Flip board'}
          title={flipped ? 'Unflip board' : 'Flip board'}
        >
          <FlipIcon
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 7a5 5 0 0 1 8.66-3.54l1.42-1.42A7 7 0 0 0 5 7H2l3.5 3.5L9 7H7zm10 10a5 5 0 0 1-8.66 3.54l-1.42 1.42A7 7 0 0 0 19 17h3l-3.5-3.5L15 17h2z" />
          </FlipIcon>
        </FlipButton>
      </ContentRow>
    </>
  );
};
