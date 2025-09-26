const Distric = require('../models/District');

const getAllDistricts = async (req, res) => {
    const districts = await Distric.getAllDistricts();
    if(!districts) return res.status(400).json({
        success: false,
        message: "Failed to fetch districts"
    });

    res.json({
        success: true,
        message: "Districts fetched successfully",
        data: districts
    })

}

module.exports = {
    getAllDistricts
}