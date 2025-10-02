const Advertisement = require('../models/Advertisement');
const AdPayment = require('../models/AdPayment');
const User = require('../models/User');

const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      price,
      is_negotiable,
      contact_number,
      location_city,
      location_district,
      images,
      ad_type,
      package_type,
      vehicle_data,
      property_data
    } = req.body;

    const user_id = req.user.user_id;

    // Validate required fields
    if (!title || !description || !category || !price || !contact_number || !location_city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get package pricing
    const packagePrices = AdPayment.getPackagePrices();
    const payment_amount = packagePrices[package_type] || 0;

    // Create advertisement
    const advertisement = await Advertisement.create({
      user_id,
      title,
      description,
      category,
      subcategory,
      price,
      is_negotiable: is_negotiable || false,
      contact_number,
      location_city,
      location_district,
      images,
      ad_type,
      package_type: package_type || 'standard',
      payment_amount,
      vehicle_data,
      property_data
    });

    // Create payment record if package has cost
    if (payment_amount > 0) {
      await AdPayment.create({
        user_id,
        ad_id: advertisement.ad_id,
        package_type,
        amount: payment_amount,
        payment_method: 'pending',
        payment_status: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: advertisement
    });

  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create advertisement'
    });
  }
};

const getAdvertisements = async (req, res) => {
  try {
    const { category, subcategory, city, district, minPrice, maxPrice, search } = req.query;

    let advertisements;

    if (search) {
      advertisements = await Advertisement.search(search, {
        category,
        city
      });
    } else {
      advertisements = await Advertisement.findByCategory(category, subcategory, {
        city,
        district,
        minPrice,
        maxPrice
      });
    }

    res.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements'
    });
  }
};

const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    // Only show approved ads to non-owners
    if (advertisement.status !== 'approved' && advertisement.user_id !== req.user?.user_id) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    // Increment view count
    await Advertisement.incrementViews(id);

    // Get user info
    const user = await User.findById(advertisement.user_id);
    advertisement.user_info = {
      first_name: user.first_name,
      last_name: user.last_name
    };

    res.json({
      success: true,
      data: advertisement
    });

  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisement'
    });
  }
};

const getUserAdvertisements = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { status } = req.query;

    const advertisements = await Advertisement.findByUserId(user_id, status);

    res.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error('Error fetching user advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements'
    });
  }
};

const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    // Check if advertisement exists and belongs to user
    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    if (advertisement.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this advertisement'
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    delete updateData.user_id; // Don't allow user_id changes

    // Reset to pending approval if content changed
    if (updateData.title || updateData.description || updateData.price) {
      updateData.status = 'pending_approval';
    }

    const success = await Advertisement.update(id, updateData);

    if (success) {
      const updatedAd = await Advertisement.findById(id);
      res.json({
        success: true,
        message: 'Advertisement updated successfully',
        data: updatedAd
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update advertisement'
      });
    }

  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement'
    });
  }
};

const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    // Check if advertisement exists and belongs to user
    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    if (advertisement.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this advertisement'
      });
    }

    const success = await Advertisement.delete(id);

    if (success) {
      res.json({
        success: true,
        message: 'Advertisement deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete advertisement'
      });
    }

  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete advertisement'
    });
  }
};

// Admin functions
const getPendingAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.findPendingApproval();

    res.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error('Error fetching pending advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending advertisements'
    });
  }
};

const approveAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const success = await Advertisement.updateStatus(id, 'approved', admin_notes);

    if (success) {
      res.json({
        success: true,
        message: 'Advertisement approved successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to approve advertisement'
      });
    }

  } catch (error) {
    console.error('Error approving advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve advertisement'
    });
  }
};

const rejectAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const success = await Advertisement.updateStatus(id, 'rejected', admin_notes);

    if (success) {
      res.json({
        success: true,
        message: 'Advertisement rejected successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to reject advertisement'
      });
    }

  } catch (error) {
    console.error('Error rejecting advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject advertisement'
    });
  }
};

const getPackageInfo = (req, res) => {
  try {
    const packages = AdPayment.getPackageFeatures();

    res.json({
      success: true,
      data: packages
    });

  } catch (error) {
    console.error('Error fetching package info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package information'
    });
  }
};

module.exports = {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  getUserAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  getPendingAdvertisements,
  approveAdvertisement,
  rejectAdvertisement,
  getPackageInfo
};