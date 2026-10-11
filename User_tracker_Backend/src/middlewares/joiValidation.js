const validationMiddleware = (req, res, next, schema) => {
  const { error } = schema.validate(req.body);

  if (error) {
    // Handle validation error
    console.error(error);

    res.status(400).json({ errors: error.details });
  } else {
    // Data is valid, proceed to the next middleware
    return next();
  }
};

module.exports = {
  validationMiddleware,
};
