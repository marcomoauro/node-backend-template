import asyncStorage from './asyncStorage.js';
import log from './log.js';

export const apiErrorManager = (ctx, error) => {
  let e = error;
  if (error.apiError) {
    e = error.apiError;
  }

  ctx.state.stack = e.stack;

  if (e instanceof APIError) {
    e.id_transaction = asyncStorage.getStore()?.id_transaction ?? 'id_transaction is not defined. Maybe you are outside http lifecycle.';
    ctx.status = e.http_code;
    ctx.body = e;
  } else if (e.status === 401) {
    ctx.status = 401;
    ctx.set('WWW-Authenticate', 'Basic');
    ctx.body = 'Authentication failed, please retry.';
  } else if (e.constructor.name === 'BadRequest') {
    ctx.status = 400;
    ctx.body = e.errors.map((error) => `${error.path} ${error.message}`).join(', ');
  } else {
    log.error(e);
    ctx.status = 500;
    ctx.body = 'Internal server error.';
  }
};

/**
 * ApiError class used to return errors to external world (api callers)
 * @class
 * @extends Error
 */
export class APIError extends Error {
  /**
   * @param {string} message error message
   * @param {string} code human-readable error code
   * @param {number} http_code http error code
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message, code, http_code = 500, params = undefined) {
    super(message);
    this.name = 'APIError';
    this.message = message;
    this.code = code;
    this.id_transaction = undefined;
    this.http_code = http_code;
    this.params = params;
  }

  /**
   * @returns {{id_transaction: (*|string), code: string, error: boolean, message: string, params: Object[]}}
   */
  toJSON() {
    return { error: true, code: this.code, message: this.message, id_transaction: this.id_transaction, params: this.params };
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.message;
  }
}

export class APIError400 extends APIError {
  /**
   * @param {string?} message error message, default to: "Bad request."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Bad request.', params = undefined) {
    super(message, 'HTTP_400', 400, params);
    this.name = 'APIError400';
  }
}

export class APIError401 extends APIError {
  /**
   * @param {string?} message error message, default to: "Unauthorized."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Unauthorized.', params = undefined) {
    super(message, 'HTTP_401', 401, params);
    this.name = 'APIError401';
  }
}

export class APIError403 extends APIError {
  /**
   * @param {string?} message error message, default to: "Forbidden."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Forbidden.', params = undefined) {
    super(message, 'HTTP_403', 403, params);
    this.name = 'APIError403';
  }
}

export class APIError404 extends APIError {
  /**
   * @param {string?} message error message, default to: "Not found."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Not found.', params = undefined) {
    super(message, 'HTTP_404', 404, params);
    this.name = 'APIError404';
  }
}

export class APIError405 extends APIError {
  /**
   * @param {string?} message error message, default to: "Method not allowed."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Method not allowed.', params = undefined) {
    super(message, 'HTTP_405', 405, params);
    this.name = 'APIError405';
  }
}

export class APIError409 extends APIError {
  /**
   * @param {string?} message error message, default to: "Conflict."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Conflict.', params = undefined) {
    super(message, 'HTTP_409', 409, params);
    this.name = 'APIError409';
  }
}

export class APIError410 extends APIError {
  /**
   * @param {string?} message error message, default to: "Gone."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Gone.', params = undefined) {
    super(message, 'HTTP_410', 410, params);
    this.name = 'APIError410';
  }
}

export class APIError413 extends APIError {
  /**
   * @param {string?} message error message, default to: "Payload Too Large."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Payload Too Large.', params = undefined) {
    super(message, 'HTTP_413', 413, params);
    this.name = 'APIError413';
  }
}

export class APIError415 extends APIError {
  /**
   * @param {string?} message error message, default to: "Unsupported Media Type."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Unsupported Media Type.', params = undefined) {
    super(message, 'HTTP_415', 415, params);
    this.name = 'APIError415';
  }
}

export class APIError422 extends APIError {
  /**
   * @param {string?} message error message, default to: "Unprocessable entity."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Unprocessable entity.', params = undefined) {
    super(message, 'HTTP_422', 422, params);
    this.name = 'APIError422';
  }
}

export class APIError425 extends APIError {
  /**
   * @param {string?} message error message, default to: "Too Early."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Too Early.', params = undefined) {
    super(message, 'HTTP_425', 425, params);
    this.name = 'APIError425';
  }
}

export class APIError429 extends APIError {
  /**
   * @param {string?} message error message, default to: "Too Many Requests."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Too Many Requests.', params = undefined) {
    super(message, 'HTTP_429', 429, params);
    this.name = 'APIError429';
  }
}

export class APIError500 extends APIError {
  /**
   * @param {string?} message error message, default to: "Internal server error."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Internal server error.', params = undefined) {
    super(message, 'HTTP_500', 500, params);
    this.name = 'APIError500';
  }
}

export class APIError501 extends APIError {
  /**
   * @param {string?} message error message, default to: "Not Implemented."
   * @param {object[]?} params params that generated the error
   * @constructor
   */
  constructor(message = 'Not Implemented.', params = undefined) {
    super(message, 'HTTP_501', 501, params);
    this.name = 'APIError501';
  }
}