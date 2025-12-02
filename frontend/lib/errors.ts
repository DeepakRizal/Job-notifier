export class ApiError<T = unknown> extends Error {
  status?: number;
  data?: T;

  constructor(message: string, status?: number, data?: T) {
    super(message);

    // Fix the prototype chain.
    // When extending built-in classes like Error, calling `super()` can create an
    // instance whose prototype incorrectly points to Error.prototype instead of
    // ApiError.prototype (especially in ES5 or transpiled environments).
    // This line ensures `instanceof ApiError` works and the prototype chain is correct.
    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status;
    this.data = data;
  }
}

export function isApiError<T = unknown>(err: unknown): err is ApiError<T> {
  return err instanceof ApiError;
}
