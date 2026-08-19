const mongoose = require("mongoose");
const Business = require("../models/Business");

const createBusiness = async (req, res) => {
  try {
    const { businessName, businessType, address } = req.body;

    const business = await Business.create({
      ownerId: req.user.userId,
      businessName,
      businessType,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  } catch (error) {
    console.error("Create business error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({
      ownerId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      businesses,
    });
  } catch (error) {
    console.error("Get businesses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID",
      });
    }

    const business = await Business.findOne({
      _id: id,
      ownerId: req.user.userId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Get business error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessName, businessType, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID",
      });
    }

    const business = await Business.findOne({
      _id: id,
      ownerId: req.user.userId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (businessName !== undefined) {
      business.businessName = businessName;
    }

    if (businessType !== undefined) {
      business.businessType = businessType;
    }

    if (address !== undefined) {
      business.address = address;
    }

    await business.save();

    return res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    console.error("Update business error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID",
      });
    }

    const business = await Business.findOneAndDelete({
      _id: id,
      ownerId: req.user.userId,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Delete business error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};