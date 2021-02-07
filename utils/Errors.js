/* eslint-disable max-classes-per-file */

const returnCode = require('@utils/ReturnCode');

module.exports.BadRequestError = class extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'Bad Request';
    this.fields = fields;
    this.statusCode = returnCode.BAD_REQUEST;
  }
};

module.exports.UnauthorizedError = class extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'Unauthorized';
    this.fields = fields;
    this.statusCode = returnCode.UNAUTHORIZED;
  }
};
module.exports.ForbiddenError = class extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'Forbidden';
    this.fields = fields;
    this.statusCode = returnCode.FORBIDDEN;
  }
};
module.exports.ConflictError = class extends Error {
  constructor(message, fields) {
    super(message);
    this.name = 'Conflict';
    this.fields = fields;
    this.statusCode = returnCode.CONFLICT;
  }
};
module.exports.InternalServerError = class extends Error {
  constructor(message) {
    super(message);
    this.name = 'Internal Server Error';
    this.statusCode = returnCode.INTERNAL_SERVER_ERROR;
  }
};
