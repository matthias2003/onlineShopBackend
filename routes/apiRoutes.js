const express = require('express');
const router = express.Router();
const { getAllProducts, getBestsellers, getProductsByGender, searchProducts, getProductById } = require('../controllers/productController');

router.get('/', getAllProducts);

router.get('/bestsellers', getBestsellers);

router.post('/gender', getProductsByGender);

router.post('/search', searchProducts);

router.get('/item/:id', getProductById);

module.exports = router;
