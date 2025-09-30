const District = require("../models/District");

const getAllDistricts = async (req, res) => {
    const districts = await District.getAllDistricts();
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


const getAllProvinces = async (req, res) => {
  try {
    const provinces = await District.getAllProvinces();
    if (!provinces) {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch provinces",
      });
    }

    console.log(provinces);
    
    res.json({
      success: true,
      message: "Provinces fetched successfully",
      data: provinces, 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDistrictsByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const districts = await District.getDistrictsByProvince(provinceId);

    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No districts found for this province",
      });
    }

    console.log(districts);

    res.json({
      success: true,
      message: "Districts fetched successfully",
      data: districts, 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getCitiesByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    const cities = await District.getCitiesByDistrict(districtId);

    if (!cities || cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cities found for this district",
      });
    }

    console.log(cities);

    res.json({
      success: true,
      message: "Cities fetched successfully",
      data: cities.map((city) => {
        return {
          city_id: city.city_id,
          city_name: city.city_name,
        };
      
      }), 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDistricts,
  getAllProvinces,
  getDistrictsByProvince,
  getCitiesByDistrict,
};
