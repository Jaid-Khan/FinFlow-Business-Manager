const sanitizeInput = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === "string") {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value.map(sanitize);
    }

    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, sanitize(val)])
      );
    }

    return value;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

module.exports = sanitizeInput;