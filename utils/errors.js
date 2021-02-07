/* eslint-disable max-classes-per-file */

const returnCode = require('./ReturnCode');

module.exports = {
  BadRequestError: class extends Error {
    constructor(message, fields) {
      super(message);
      this.name = 'Bad Request';
      this.fields = fields;
      this.statusCode = returnCode.BAD_REQUEST;
    }
  },
  UnauthorizedError: class extends Error {
    constructor(message, fields) {
      super(message);
      this.name = 'Unauthorized';
      this.fields = fields;
      this.statusCode = returnCode.UNAUTHORIZED;
    }
  },
  ForbiddenError: class extends Error {
    constructor(message, fields) {
      super(message);
      this.name = 'Forbidden';
      this.fields = fields;
      this.statusCode = returnCode.FORBIDDEN;
    }
  },
  ConflictError: class extends Error {
    constructor(message, fields) {
      super(message);
      this.name = 'Conflict';
      this.fields = fields;
      this.statusCode = returnCode.CONFLICT;
    }
  },
  InternalServerError: class extends Error {
    constructor(message) {
      super(message);
      this.name = 'Internal Server Error';
      this.statusCode = returnCode.INTERNAL_SERVER_ERROR;
    }
  },
};
