import { BadRequest } from "../apiResponses/apiResponse.js";
import { HttpStatusCode } from "../constants/httpStatusCode.js";

export const errorHandler = (err, req, res, next) => {
  const errors = {};
  let statusCode = HttpStatusCode.BadRequest;
  if (err.name === "ValidationError") {
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
  } else {
    errors[err.name] = err.message;
    statusCode = HttpStatusCode.InteralServer;
  }

  return res.status(statusCode).send(errors);
};
