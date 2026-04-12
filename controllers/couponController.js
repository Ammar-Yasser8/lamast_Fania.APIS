const { v4: uuidv4 } = require('uuid');

// In-memory storage (will be lost on restart, similar to products/discounts)
let coupons = [];
let productCouponAssignments = []; // { couponId, productId }

// GET ALL COUPONS
const getAllCoupons = (req, res) => {
  res.status(200).json({
    success: true,
    data: coupons,
  });
};

// CREATE COUPON
const createCoupon = (req, res) => {
  const { code, discountType, discountValue, expiryDate } = req.body;
  
  if (!code || !discountType || !discountValue) {
    return res.status(400).json({
      success: false,
      message: 'Please provide code, type, and value.',
    });
  }

  const newCoupon = {
    id: uuidv4(),
    code,
    discountType, // 'percentage' or 'fixed'
    discountValue,
    expiryDate,
    createdAt: new Date().toISOString(),
  };

  coupons.push(newCoupon);

  res.status(201).json({
    success: true,
    data: newCoupon,
  });
};

// UPDATE COUPON
const updateCoupon = (req, res) => {
  const { id } = req.params;
  const index = coupons.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  coupons[index] = { ...coupons[index], ...req.body };

  res.status(200).json({
    success: true,
    data: coupons[index],
  });
};

// DELETE COUPON
const deleteCoupon = (req, res) => {
  const { id } = req.params;
  coupons = coupons.filter(c => c.id !== id);
  productCouponAssignments = productCouponAssignments.filter(a => a.couponId !== id);

  res.status(200).json({
    success: true,
    message: 'Coupon deleted',
  });
};

// ASSIGN COUPON TO PRODUCTS
const assignCouponToProducts = (req, res) => {
  const { couponId } = req.params;
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds)) {
    return res.status(400).json({ success: false, message: 'Invalid productIds' });
  }

  // Remove existing assignments for these products for this coupon to avoid duplicates
  productCouponAssignments = productCouponAssignments.filter(
    a => !(a.couponId === couponId && productIds.includes(a.productId))
  );

  // Add new assignments
  productIds.forEach(productId => {
    productCouponAssignments.push({ couponId, productId });
  });

  res.status(200).json({ success: true, message: 'Coupon assigned to products' });
};

// REMOVE COUPON FROM PRODUCTS
const removeCouponFromProducts = (req, res) => {
  const { couponId } = req.params;
  const { productIds } = req.body;

  productCouponAssignments = productCouponAssignments.filter(
    a => !(a.couponId === couponId && productIds.includes(a.productId))
  );

  res.status(200).json({ success: true, message: 'Coupon removed from products' });
};

// GET PRODUCTS BY COUPON
const getProductsByCoupon = (req, res) => {
  const { couponId } = req.params;
  const assignedProductIds = productCouponAssignments
    .filter(a => a.couponId === couponId)
    .map(a => a.productId);

  res.status(200).json({
    success: true,
    data: assignedProductIds,
  });
};

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  assignCouponToProducts,
  removeCouponFromProducts,
  getProductsByCoupon,
};
