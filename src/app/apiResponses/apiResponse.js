import { HttpStatusCode } from "../constants/httpStatusCode.js";

class ApiResponse {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

class SuccessResponse extends ApiResponse {
  constructor(data) {
    super(HttpStatusCode.Ok, "Data Retrieved Successfully");
    this.data = data;
  }
}

class Pagination extends ApiResponse {
  constructor(data, pageIndex, pageSize, total) {
    super(HttpStatusCode.Ok, "Data Retrieved Successfully");
    this.data = data;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
  }
}

class ErrorResponse extends ApiResponse {
  constructor(statusCode, errors) {
    super(statusCode, "An Error has occur");
    this.errors = errors;
  }
}

class BadRequest extends ApiResponse {
  constructor(message) {
    super(HttpStatusCode.BadRequest, [message]);
  }
}

class UnAuthorize extends ApiResponse {
  constructor() {
    super(HttpStatusCode.Unauthorized, ["Unauthorized"]);
  }
}

class Forbidden extends ApiResponse {
  constructor() {
    super(HttpStatusCode.Forbidden, ["Can not access this endpoint"]);
  }
}

export {
  SuccessResponse,
  ErrorResponse,
  Pagination,
  BadRequest,
  UnAuthorize,
  Forbidden,
};
