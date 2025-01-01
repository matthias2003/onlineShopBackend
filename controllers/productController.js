const { getData, getBestsellers, getDataGender, getDataByName, getDataById } = require("services/productService");

exports.getHome = (req, res) => {
    res.status(200).json({ status: true, message: "Online shop Api" });
};

exports.getAllProducts = async (req, res) => {
    try {
        const data = await getData();
        res.status(200).json({ status: true, data });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch products" });
    }
};

exports.getBestsellers = async (req, res) => {
    try {
        const data = await getBestsellers();
        res.status(200).json({ status: true, data });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch bestsellers" });
    }
};

exports.getProductsByGender = async (req, res) => {
    try {
        const data = await getDataGender(req.body.gender);
        res.status(200).json({ status: true, data });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch products by gender" });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const data = await getDataByName(req.body.name);
        res.status(200).json({ status: true, data });
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to search products" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const data = await getDataById(req.params.id);
        if (data) {
            res.status(200).json({ status: true, data });
        } else {
            res.status(404).json({ status: false, message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch product by ID" });
    }
};
