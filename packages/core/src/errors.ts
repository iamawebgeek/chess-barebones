import { ObservableState } from './observable';

export class InvalidStateError<T extends object> extends Error {
  public constructor(
    public readonly instance: ObservableState<T>,
    additionalInfo?: string,
  ) {
    const message = `Reached invalid state at ${instance.constructor.name}`;
    super(additionalInfo ? `${message}. ${additionalInfo}` : message);
  }
}

export class InvalidStateArgumentError<T extends object> extends Error {
  public constructor(
    public readonly instance: ObservableState<T>,
    additionalInfo?: string,
  ) {
    const message = `Received argument of ${instance.constructor.name} in invalid state`;
    super(additionalInfo ? `${message}. ${additionalInfo}` : message);
  }
}

export class ParsingError extends Error {
  public constructor(parse: string, additionalInfo?: string) {
    super(
      additionalInfo
        ? `Failed to parse "${parse}". ${additionalInfo}`
        : additionalInfo,
    );
  }
}
