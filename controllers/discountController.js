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

    // Use the file buffer directly from memory storage
    const base64Image = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    const newDiscount = new Discount({
      name: req.body.name || '',
      description: req.body.description || '',
      imageUrl: dataUri,
      imageType: req.file.mimetype,
    });

    await newDiscount.save();

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

// UPDATE A DISCOUNT
const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    let updateData = { name, description };

    // If a new image is uploaded
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      updateData.imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      updateData.imageType = req.file.mimetype;
    }

    const discount = await Discount.findByIdAndUpdate(id, updateData, { new: true });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discount updated successfully!',
      data: discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDiscounts,
  uploadDiscount,
  updateDiscount,
  deleteDiscount,
};
