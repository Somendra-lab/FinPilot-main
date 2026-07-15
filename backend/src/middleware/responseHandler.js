export const responseHandler = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(body) {
    // If it's already formatted with a success flag, pass it through
    if (body && typeof body === 'object' && typeof body.success === 'boolean') {
      return originalJson.call(this, body);
    }

    // Format error responses
    if (this.statusCode >= 400) {
      const formattedError = {
        success: false,
        message: body.message || 'An error occurred',
        errors: body.errors || []
      };
      return originalJson.call(this, formattedError);
    }

    // Format success responses
    const formattedSuccess = {
      success: true,
      data: body
    };
    return originalJson.call(this, formattedSuccess);
  };
  
  next();
};
