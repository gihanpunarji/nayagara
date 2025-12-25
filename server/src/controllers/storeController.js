const Store = require("../models/Store");

const incrementStoreView = async (req, res) => {
    try {
        const { sellerId } = req.params;

        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "Seller ID is required"
            });
        }

        await Store.incrementViewCount(sellerId);

        res.json({
            success: true,
            message: "View count incremented"
        });
    } catch (error) {
        console.error("Increment store view error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    incrementStoreView
};
