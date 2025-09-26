export abstract class ObservableState<
  State extends object,
  InitParam = undefined,
> {
  protected _state: State;
  private listeners = new Set<() => void>();
  public abstract getInitialState(initParam?: InitParam): State;

  public constructor(initParam?: InitParam) {
    this._state = this.getInitialState(initParam);
  }

  protected set state(newState: State) {
    if (this._state !== newState) {
      this._state = newState;
      this.notify();
    }
  }

  public get state(): Readonly<State> {
    return this._state;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public unsubscribeAll() {
    this.listeners.clear();
  }

  protected notify() {
    this.listeners.forEach((listener) => listener());
  }
}
