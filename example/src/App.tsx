import * as React from 'react';
import styled from 'styled-components';

import { Game } from './Game';
import { GlobalStyle } from './GlobalStyle';
import { PuzzleGame } from './PuzzleGame';

const Shell = styled.div`
  display: grid;
  gap: 16px;
  place-items: center;
`;

const Header = styled.div`
  text-align: center;
`;

const Title = styled.p`
  margin: 4px 0 0;
  font-size: 20px;
  opacity: 0.8;
`;

const ModeButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const PrimaryButton = styled.button`
  height: 40px;
  padding: 6px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
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
  }
`;

export const App: React.FC = () => {
  const [mode, setMode] = React.useState<'menu' | 'chess' | 'puzzle'>('menu');

  return (
    <>
      <GlobalStyle />
      <Shell>
        <Header>
          <Title>Chess Barebones React Minimal Example</Title>
        </Header>

        {mode === 'menu' ? (
          <>
            <ModeButtons>
              <PrimaryButton onClick={() => setMode('chess')}>
                Play Chess
              </PrimaryButton>
              <PrimaryButton onClick={() => setMode('puzzle')}>
                Solve Puzzle
              </PrimaryButton>
            </ModeButtons>
          </>
        ) : mode === 'chess' ? (
          <Game />
        ) : (
          <PuzzleGame />
        )}
      </Shell>
    </>
  );
};
