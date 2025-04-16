export interface CustomError {
  code: number;
  message: string;
}

export class AlreadyExists extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'AlreadyExistsError';
    this.code = code;
    this.message = message;
  }

  toJSON(): CustomError {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 404) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NotAllowedError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'NotAllowedError';
    this.code = code;
    this.message = message;
  }

  toJSON(): CustomError {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class EmailSendingError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'EmailSendingError';
    this.code = code;
    this.message = message;
  }

  toJSON(): CustomError {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
