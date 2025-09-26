import { describe, it, expect, vi } from 'vitest';

import { ObservableState } from './observable';

class TestObservable extends ObservableState<
  { count: number; items: string[] },
  number
> {
  public getInitialState(initParam: number = 0) {
    return { count: initParam, items: [] };
  }

  public setStatePublic(newState: { count: number; items: string[] }) {
    // use protected setter
    this.state = newState;
  }
}

const setup = (initial = 5) => ({ observable: new TestObservable(initial) });

describe('ObservableState', () => {
  it('initializes state using getInitialState and constructor param', () => {
    const { observable } = setup(5);
    expect(observable.state.count).toBe(5);
    expect(observable.state.items).toEqual([]);
  });

  it('notifies all subscribed listeners when state reference changes', () => {
    const { observable } = setup();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    observable.subscribe(listener1);
    observable.subscribe(listener2);

    observable.setStatePublic({ count: 6, items: ['a'] });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('returns an unsubscribe function that removes the listener', () => {
    const { observable } = setup();
    const listener = vi.fn();
    const unsubscribe = observable.subscribe(listener);

    unsubscribe();
    observable.setStatePublic({ count: 7, items: [] });

    expect(listener).not.toHaveBeenCalled();
  });

  it('unsubscribeAll clears all listeners', () => {
    const { observable } = setup();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    observable.subscribe(listener1);
    observable.subscribe(listener2);

    observable.unsubscribeAll();
    observable.setStatePublic({ count: 8, items: [] });

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('does not notify when setting the same state object reference', () => {
    const { observable } = setup();
    const listener = vi.fn();
    observable.subscribe(listener);

    // set to the same reference -> should not notify
    observable.setStatePublic(observable.state);

    expect(listener).not.toHaveBeenCalled();
  });
});
