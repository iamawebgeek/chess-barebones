import styled from 'styled-components';

import type { BoardProps } from '@chess-barebones/chess-react';

export const StyledBoard = styled.div`
  --light: #c8ded3;
  --dark: #3e8564;
  --border: #d9d9d9;
  --shadow: rgba(0, 0, 0, 0.12);

  width: min(60vw, 60vh);
  aspect-ratio: 1 / 1;
  max-width: 720px;

  background: conic-gradient(
      from 90deg,
      var(--light) 25%,
      var(--dark) 0 50%,
      var(--light) 0 75%,
      var(--dark) 0
    )
    0 0 / 25% 25%;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow:
    0 10px 24px var(--shadow),
    inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const Shell = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  align-items: center;
  justify-items: center;
`;

const Row = styled.div`
  width: 100%;
  box-sizing: border-box;
  max-width: 720px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`;

const Captures = styled.div`
  display: flex;
  align-items: center;
`;

export const Board = ({
  boardFigures,
  moves,
  promotionMenu,
  capturesTop,
  capturesBottom,
  timerTop,
  timerBottom,
}: BoardProps) => (
  <Shell>
    <Row>
      <Captures>{capturesTop}</Captures>
      {timerTop}
    </Row>
    <StyledBoard>
      {moves}
      {boardFigures}
      {promotionMenu}
    </StyledBoard>
    <Row>
      <Captures>{capturesBottom}</Captures>
      {timerBottom}
    </Row>
  </Shell>
);
