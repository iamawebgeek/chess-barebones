import { Color, Figure as ChessFigure } from '@chess-barebones/chess';
import { type FigureProps } from '@chess-barebones/chess-react';
import { type Coordinate } from '@chess-barebones/core';
import styled, { css, keyframes } from 'styled-components';

import BlackBishopIcon from './assets/black/bishop.svg';
import BlackKingIcon from './assets/black/king.svg';
import BlackKnightIcon from './assets/black/knight.svg';
import BlackPawnIcon from './assets/black/pawn.svg';
import BlackQueenIcon from './assets/black/queen.svg';
import BlackRookIcon from './assets/black/rook.svg';
import WhiteBishopIcon from './assets/white/bishop.svg';
import WhiteKingIcon from './assets/white/king.svg';
import WhiteKnightIcon from './assets/white/knight.svg';
import WhitePawnIcon from './assets/white/pawn.svg';
import WhiteQueenIcon from './assets/white/queen.svg';
import WhiteRookIcon from './assets/white/rook.svg';

const figureSpriteMapping = {
  [Color.WHITE]: {
    [ChessFigure.ROOK]: WhiteRookIcon,
    [ChessFigure.KNIGHT]: WhiteKnightIcon,
    [ChessFigure.KING]: WhiteKingIcon,
    [ChessFigure.QUEEN]: WhiteQueenIcon,
    [ChessFigure.BISHOP]: WhiteBishopIcon,
    [ChessFigure.PAWN]: WhitePawnIcon,
  },
  [Color.BLACK]: {
    [ChessFigure.ROOK]: BlackRookIcon,
    [ChessFigure.KNIGHT]: BlackKnightIcon,
    [ChessFigure.KING]: BlackKingIcon,
    [ChessFigure.QUEEN]: BlackQueenIcon,
    [ChessFigure.BISHOP]: BlackBishopIcon,
    [ChessFigure.PAWN]: BlackPawnIcon,
  },
};

export type StyledProps = {
  $selectable: boolean;
  $location: Coordinate;
};

export const StyledFigure = styled.button<StyledProps>`
  width: 12.5%;
  height: 12.5%;
  transition:
    bottom 160ms ease,
    left 160ms ease,
    transform 120ms ease,
    filter 160ms ease;
  position: absolute;
  left: ${({ $location }) => ($location.x - 1) * 12.5}%;
  bottom: ${({ $location }) => ($location.y - 1) * 12.5}%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.35));
  will-change: left, bottom, transform;
  background: none;

  &:hover {
    transform: translateY(-1px) scale(1.02);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
  }

  ${({ $selectable }) =>
    !$selectable &&
    css`
      pointer-events: none;
    `}
`;

const scaleIn = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

export const StyledCapture = styled.div`
  width: 32px;
  height: 32px;
  animation: ${scaleIn} 0.3s ease-out forwards;
`;

export const Capture = ({
  color,
  name,
  ...props
}: Pick<FigureProps, 'color' | 'name'> &
  React.HTMLAttributes<HTMLDivElement>) => {
  const Sprite = figureSpriteMapping[color as Color][name];
  return (
    <StyledCapture {...props}>
      <Sprite width="100%" height="100%" />
    </StyledCapture>
  );
};

export const Figure = ({
  name,
  color,
  location,
  onSelect,
  ...props
}: FigureProps & React.HTMLAttributes<HTMLButtonElement>) => {
  const Sprite = figureSpriteMapping[color as Color][name];
  return (
    <StyledFigure
      $selectable={typeof onSelect === 'function'}
      $location={location}
      onClick={onSelect}
      {...props}
    >
      <Sprite width="80%" height="80%" />
    </StyledFigure>
  );
};
