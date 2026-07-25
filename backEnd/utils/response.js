// Small helpers so every controller returns the exact same JSON shape.
// Keeping this in one place means the response format never drifts
// between different routes/controllers.

// Standard success response -> { success: true, message, data }
function sendSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data, // spread so callers can add e.g. employeeId directly at the top level
  });
}

// Standard failure response -> { success: false, message, errors }
function sendError(res, statusCode, message, errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

export { sendSuccess, sendError };
