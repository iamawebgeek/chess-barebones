import { ObservableState } from '@chess-barebones/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { useObservablesState } from './useObservablesState';

class Counter extends ObservableState<{ count: number }> {
  public getInitialState(): { count: number } {
    return { count: 0 };
  }

  increment() {
    // trigger change detection
    this.state = { count: this.state.count + 1 };
  }
}

const View: React.FC<{ counter: Counter }> = ({ counter }) => {
  const state = useObservablesState(counter);
  return <div data-testid="val">{state.count}</div>;
};

describe('useObservablesState', () => {
  it('subscribes to observable and updates on state changes', () => {
    const counter = new Counter();
    const { rerender } = render(<View counter={counter} />);

    expect(screen.getByTestId('val').textContent).toBe('0');

    counter.increment();
    rerender(<View counter={counter} />);

    expect(screen.getByTestId('val').textContent).toBe('1');
  });
});
