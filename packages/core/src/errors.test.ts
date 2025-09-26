import { describe, it, expect } from 'vitest';

import { InvalidStateError, InvalidStateArgumentError } from './errors';
import { ObservableState } from './observable';

class DummyObservable extends ObservableState<{ v: number }> {
  public getInitialState() {
    return { v: 0 };
  }
}

describe('errors', () => {
  it('InvalidStateError includes class name and additional info', () => {
    const inst = new DummyObservable();
    const err = new InvalidStateError(inst, 'Oops');
    expect(err.message).toContain('Reached invalid state at DummyObservable');
    expect(err.message).toContain('Oops');
  });

  it('InvalidStateArgumentError includes class name and additional info', () => {
    const inst = new DummyObservable();
    const err = new InvalidStateArgumentError(inst, 'Bad arg');
    expect(err.message).toContain(
      'Received argument of DummyObservable in invalid state',
    );
    expect(err.message).toContain('Bad arg');
  });
});
