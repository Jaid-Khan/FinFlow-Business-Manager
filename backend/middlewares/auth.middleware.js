const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    req.user = {
      userId: decoded.userId,
      businessId: decoded.businessId || null,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

module.exports = authenticateUser;
