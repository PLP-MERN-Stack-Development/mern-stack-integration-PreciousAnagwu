// server/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}
export default errorHandler;
