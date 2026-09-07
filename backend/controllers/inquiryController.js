const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Submit a tour/inquiry request
// @route   POST /api/inquiries
// @access  Public (or authenticated user)
const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, visitDate, message } = req.body;

    if (!propertyId || !name || !email || !phone || !visitDate || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all inquiry fields' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      user: req.user ? req.user._id : null,
      name,
      email,
      phone,
      visitDate,
      message,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      inquiry,
      message: 'Inquiry submitted successfully! The property agent will contact you soon.',
    });
  } catch (error) {
    console.error('createInquiry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inquiries submitted by logged-in user
// @route   GET /api/inquiries/my
// @access  Private
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    })
      .populate('property', 'title price location images purpose propertyType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title price location purpose propertyType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status ('Pending', 'Contacted', 'Closed')
// @route   PUT /api/inquiries/:id/status
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('property', 'title');

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      inquiry,
      message: `Inquiry status updated to ${status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
};
