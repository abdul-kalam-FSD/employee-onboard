import { sendError } from "../utils/response.js";

// Catches requests to routes that don't exist and forwards a 404
// Error into the errorHandler below.
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.type = "NOT_FOUND";
  next(error);
}

// Single place that turns any thrown/forwarded error into the standard
// { success:false, message, errors } shape. Must be registered LAST,
// after all routes, and takes 4 arguments so Express recognizes it as
// an error handler.
function errorHandler(err, req, res, next) {
  console.error(err); // always log the real error server-side for debugging

  switch (err.type) {
    case "NOT_FOUND":
      return sendError(res, 404, err.message);

    case "APPSCRIPT_ERROR":
      // Something went wrong on the Google Apps Script / Sheets side
      return sendError(res, 502, "Google Apps Script Error", [err.message]);

    case "NETWORK_ERROR":
      // Express couldn't reach Apps Script at all
      return sendError(res, 503, "Network Error - could not reach Google Apps Script", [err.message]);

    default:
      // Anything unclassified -> generic 500
      return sendError(res, 500, "Unknown Error", [err.message || "Something went wrong"]);
  }
}

export { notFound, errorHandler };
