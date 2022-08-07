export abstract class BaseError extends Error {
  constructor(message: string, originalError: unknown) {
    super(message);
    this.initError();
    this.setOriginalError(originalError);
  }

  private setOriginalError = (originalError: unknown) => {
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
      this.cause = originalError.cause;
    }
  };

  abstract initError(): void;
}
