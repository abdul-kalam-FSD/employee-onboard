// Wraps an async controller function so we don't need try/catch in every
// single controller. Any rejected promise is forwarded to next(err),
// which lands in errorHandler.js below.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
