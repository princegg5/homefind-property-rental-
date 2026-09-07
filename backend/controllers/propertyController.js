const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// @desc    Get all properties with advanced filters & search
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      purpose,
      city,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      search,
      sort,
    } = req.query;

    const query = {};

    // Filter by purpose (Buy / Rent)
    if (purpose && purpose !== 'All') {
      query.purpose = purpose;
    }

    // Filter by city
    if (city && city !== 'All') {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by propertyType
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by bedrooms
    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by bathrooms
    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Text search in title, description, or address
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const properties = await Property.find(query).sort(sortOptions).populate('owner', 'name email');

    res.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('getProperties error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
  try {
    const featured = await Property.find({ isFeatured: true }).limit(6).sort({ createdAt: -1 });
    res.json({ success: true, count: featured.length, properties: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email role');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private/Admin or Owner
const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id,
    };

    // Ensure images is an array
    if (typeof propertyData.images === 'string') {
      propertyData.images = propertyData.images.split(',').map((img) => img.trim());
    }

    const property = await Property.create(propertyData);
    res.status(201).json({
      success: true,
      property,
      message: 'Property created successfully',
    });
  } catch (error) {
    console.error('createProperty error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin or Owner
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // If images is comma-separated string, convert to array
    if (req.body.images && typeof req.body.images === 'string') {
      req.body.images = req.body.images.split(',').map((img) => img.trim());
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      property,
      message: 'Property updated successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Admin or Owner
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Also delete any inquiries associated with this property
    await Inquiry.deleteMany({ property: req.params.id });
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property and associated inquiries deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/properties/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const activeRentals = await Property.countDocuments({ purpose: 'Rent' });

    // Aggregate sales value of all 'Buy' properties
    const salesAggregate = await Property.aggregate([
      { $match: { purpose: 'Buy' } },
      { $group: { _id: null, totalSalesValue: { $sum: '$price' } } },
    ]);

    const totalSalesValue = salesAggregate.length > 0 ? salesAggregate[0].totalSalesValue : 0;

    res.json({
      success: true,
      stats: {
        totalProperties,
        totalInquiries,
        activeRentals,
        totalSalesValue,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAdminStats,
};
