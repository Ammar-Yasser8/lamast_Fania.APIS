const Discount = require('../models/Discount');
const fs = require('fs');
const path = require('path');

// GET ALL DISCOUNTS
const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPLOAD A DISCOUNT BANNER
const uploadDiscount = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided.',
      });
    }

    // Read the file and convert to Base64
    const imagePath = req.file.path;
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    const newDiscount = new Discount({
      name: req.body.name || '',
      description: req.body.description || '',
      imageUrl: dataUri,
      imageType: req.file.mimetype,
    });

    await newDiscount.save();

    // Clean up
    fs.unlinkSync(imagePath);

    res.status(201).json({
      success: true,
      message: 'Discount saved to Database!',
      data: newDiscount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE A DISCOUNT BANNER
const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByIdAndDelete(id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discount deleted from Database!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDiscounts,
  uploadDiscount,
  deleteDiscount,
};
