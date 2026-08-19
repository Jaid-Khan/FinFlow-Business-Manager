const Business = require("../models/Business");

const requireActiveBusiness = async (req, res, next) => {
  try {
    const { userId, businessId } = req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Active business is required",
      });
    }

    const business = await Business.findOne({
      _id: businessId,
      ownerId: userId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Active business not found",
      });
    }

    req.business = business;

    next();
  } catch (error) {
    console.error("Business middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = requireActiveBusiness;