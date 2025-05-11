export interface CustomError {
  code: number;
  message: string;
  details?: string;
  name: string;
}

export class AppError extends Error {
  public code: number;
  public details?: string;

  constructor(name: string, message: string, code: number, details?: string) {
    super(message);
    this.name = name;
    this.code = code;
    this.message = message;
    this.details = details;
  }

  toJSON(): CustomError {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class AlreadyExistsError extends AppError {
  constructor(message = 'Resource already exists', details?: string) {
    super('AlreadyExistsError', message, 409, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: string) {
    super('NotFoundError', message, 404, details);
  }
}

export class NotAllowedError extends AppError {
  constructor(message = 'Unauthorized access', details?: string) {
    super('NotAllowedError', message, 403, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: string) {
    super('ValidationError', message, 400, details);
  }
}

export class EmailSendingError extends AppError {
  constructor(message = 'Failed to send email', details?: string) {
    super('EmailSendingError', message, 500, details);
  }
}

export class ExpiredError extends AppError {
  constructor(message = 'Resource expired', details?: string) {
    super('ExpiredError', message, 410, details);
  }
}
