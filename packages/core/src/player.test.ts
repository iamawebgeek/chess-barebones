import { describe, it, expect } from 'vitest';

import { Player } from './player';
import { Direction } from './types';

describe('Player', () => {
  const makePlayer = () => new Player('white', Direction.NORTH);

  it('initializes with null score', () => {
    const p = makePlayer();
    expect(p.state.score).toBeNull();
  });

  it('assignScore sets the score', () => {
    const p = makePlayer();
    p.assignScore(1);
    expect(p.state.score).toBe(1);
  });

  it('assignScore throws if score is already assigned', () => {
    const p = makePlayer();
    p.assignScore(0);
    expect(() => p.assignScore(1)).toThrow('Score has already been assigned');
  });
});
