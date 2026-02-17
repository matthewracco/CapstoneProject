
function errorHandler(err, req, res, next) {
  const status = err.status || 500

  const isZod = err?.name === 'ZodError'
  if(isZod) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.issues,
      }
    })
  }

  return res.status(status).json({
    success: false,
    error: {
      code: err.code || (status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST"),
      message: err.message || "Internal Server Error",
      details: err.details || undefined,
    }
  })

}

module.exports = errorHandler;
