function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry', field: Object.keys(err.keyValue)[0] });
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
