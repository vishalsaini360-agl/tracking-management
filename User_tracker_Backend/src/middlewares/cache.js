const cache = (req, res, next) => {
  next();
};

module.exports = { cache };
