import { Color, Figure as ChessFigure } from '@chess-barebones/chess';
import styled from 'styled-components';

import BlackBishopIcon from './assets/black/bishop.svg';
import BlackKnightIcon from './assets/black/knight.svg';
import BlackQueenIcon from './assets/black/queen.svg';
import BlackRookIcon from './assets/black/rook.svg';
import WhiteBishopIcon from './assets/white/bishop.svg';
import WhiteKnightIcon from './assets/white/knight.svg';
import WhiteQueenIcon from './assets/white/queen.svg';
import WhiteRookIcon from './assets/white/rook.svg';

import type { PawnPromotionMenuProps } from '@chess-barebones/chess-react';

const Container = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => (x - 1) * 12.5}%;
  bottom: ${({ y }) => (y - 2) * 12.5}%;
  width: 12.5%;
  height: 50%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Cell = styled.button`
  flex: 1 1 25%;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px) saturate(120%);
  -webkit-backdrop-filter: blur(6px) saturate(120%);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  & > img {
    max-width: 80%;
    max-height: 80%;
    pointer-events: none;
  }
`;

const sprite = {
  [Color.WHITE]: {
    [ChessFigure.QUEEN]: WhiteQueenIcon,
    [ChessFigure.ROOK]: WhiteRookIcon,
    [ChessFigure.BISHOP]: WhiteBishopIcon,
    [ChessFigure.KNIGHT]: WhiteKnightIcon,
  },
  [Color.BLACK]: {
    [ChessFigure.QUEEN]: BlackQueenIcon,
    [ChessFigure.ROOK]: BlackRookIcon,
    [ChessFigure.BISHOP]: BlackBishopIcon,
    [ChessFigure.KNIGHT]: BlackKnightIcon,
  },
} as const;

export const PawnPromotionMenu = ({
  coordinate,
  figure,
  onSelect, // eslint-disable-line @typescript-eslint/unbound-method
}: PawnPromotionMenuProps) => {
  const options: ChessFigure[] = [
    ChessFigure.BISHOP,
    ChessFigure.KNIGHT,
    ChessFigure.QUEEN,
    ChessFigure.ROOK,
  ] as const;

  return (
    <Container x={coordinate.x} y={coordinate.y}>
      {options.map((fig) => {
        const Sprite =
          sprite[figure.owner.color as keyof typeof sprite][
            fig as keyof (typeof sprite)['white']
          ];
        return (
          <Cell key={fig} onClick={() => onSelect?.(fig)}>
            <Sprite />
          </Cell>
        );
      })}
    </Container>
  );
};
