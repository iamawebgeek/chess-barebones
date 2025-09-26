import styled from 'styled-components';

import type { Move } from '@chess-barebones/core';

const StyledHighlight = styled.div<{ x: number; y: number }>`
  height: calc(12.5% - 32px);
  width: calc(12.5% - 32px);
  margin: 16px;
  position: absolute;
  left: ${({ x }) => (x - 1) * 12.5}%;
  bottom: ${({ y }) => (y - 1) * 12.5}%;
  cursor: pointer;
  border-radius: 50%;
  /* Liquid glass look */
  background: radial-gradient(
    120% 120% at 30% 30%,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.2) 45%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(8px) saturate(130%);
  -webkit-backdrop-filter: blur(8px) saturate(130%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.7),
    inset 0 -6px 12px rgba(0, 0, 0, 0.2),
    0 8px 18px rgba(0, 0, 0, 0.18);
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 6%;
    left: 14%;
    right: 14%;
    bottom: 52%;
    border-radius: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0)
    );
    filter: blur(2px);
    opacity: 0.9;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(
        80% 80% at 70% 70%,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.12) 60%,
        rgba(255, 255, 255, 0) 75%
      ),
      radial-gradient(
        100% 100% at 30% 30%,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0) 60%
      );
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

export type HighlightProps = {
  onSelect?: () => void;
  move: Move;
};

export const Highlight = ({ onSelect, move }: HighlightProps) => {
  return (
    <StyledHighlight x={move.x} y={move.y} onClick={onSelect}></StyledHighlight>
  );
};
