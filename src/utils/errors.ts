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
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'NotFoundError';
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
  code: number;
  errors?: any[];

  constructor(message: string, code: number, errors?: any[]) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.errors = errors;
  }

  toJSON(): any {
    return {
      code: this.code,
      message: this.message,
      errors: this.errors,
    };
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
