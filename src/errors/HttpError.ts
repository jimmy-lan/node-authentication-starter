/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

export type SerializedHttpError = { message: string; cause?: string };

/**
 * This class represents an HttpError with an http status code
 * and a list of error messages.
 * Error messages returned by serializeErrors method should
 * meant to be sent to clients.
 * Standard message property of the Error class is used for
 * logging purposes only.
 *
 * @see Error
 * @version 1.0
 */
export abstract class HttpError extends Error {
  abstract statusCode: number;

  /**
   * Construct HttpError
   * @param message Error message for logging purposes
   */
  protected constructor(message?: string) {
    super(message);

    // Configure this class to work with typescript
    // Need this statement when extending a typescript built-in class
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  serializeErrors(): SerializedHttpError[] {
    return [{ message: this.message }];
  }
}
