const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  assignCouponToProducts,
  removeCouponFromProducts,
  getProductsByCoupon,
} = require('../controllers/couponController');

router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

router.post('/:couponId/assign', assignCouponToProducts);
router.post('/:couponId/remove', removeCouponFromProducts);
router.get('/:couponId/products', getProductsByCoupon);

module.exports = router;
