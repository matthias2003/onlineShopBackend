const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getBestsellers,
    getProductsByGender,
    searchProducts,
    getProductById,
} = require("../controllers/productController");

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Public product endpoints
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c1c0c7f2a3a9b1e2d3f4"
 *         name:
 *           type: string
 *           example: "Air Jordan 4"
 *         color:
 *           type: string
 *           example: "Black/Red"
 *         img:
 *           type: string
 *           example: "https://cdn.example.com/jordan4.png"
 *         gender:
 *           type: string
 *           enum: [men, women, kids, unisex]
 *           example: "men"
 *         brand:
 *           type: string
 *           example: "Nike"
 *         price:
 *           type: string
 *           example: "199.99"
 *         sold:
 *           type: number
 *           example: 152
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status: { type: boolean, example: false }
 *         message: { type: string, example: "Something went wrong" }
 */

/**
 * @openapi
 * /api:
 *   get:
 *     tags: [Products]
 *     summary: Get sample of products
 *     responses:
 *       200:
 *         description: Array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get("/", getAllProducts);

/**
 * @openapi
 * /api/bestsellers:
 *   get:
 *     tags: [Products]
 *     summary: Get bestseller products
 *     responses:
 *       200:
 *         description: Array of bestseller products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get("/bestsellers", getBestsellers);

/**
 * @openapi
 * /api/gender:
 *   post:
 *     tags: [Products]
 *     summary: Get products filtered by gender
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gender]
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: [men, women, kids, unisex]
 *                 example: "women"
 *     responses:
 *       200:
 *         description: Array of products by gender
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post("/gender", getProductsByGender);

/**
 * @openapi
 * /api/search:
 *   post:
 *     tags: [Products]
 *     summary: Search products by name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "jordan"
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post("/search", searchProducts);
router.get("/item/:id", getProductById);

module.exports = router;
