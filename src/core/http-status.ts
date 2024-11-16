/* Exporting the object to be used in other files. */
const httpStatus = {
  success: {
    code: 200,
    message: "Successful request!",
  },
  created: {
    code: 201,
    message: "Created successfully!",
  },
  noContent: {
    code: 204,
    message: "No content available!",
  },
  badRequest: {
    code: 400,
    message: "Bad request!",
  },
  unauthorized: {
    code: 401,
    message: "Unauthorized request!",
  },
  forbidden: {
    code: 403,
    message: "Expired/Forbidden request!",
  },
  notFound: {
    code: 404,
    message: "API path not found!",
  },
  noMethod: {
    code: 405,
    message: "API method not allowed!",
  },
  conflict: {
    code: 409,
    message: "Payload conflicts with existing data",
  },
  unProcessable: {
    code: 422,
    message: "Request body is not processable!",
  },
  manyRequest: {
    code: 429,
    message: "Too many request!",
  },
  internal: {
    code: 500,
    message: "Internal server error!",
  },
};

export default httpStatus;
