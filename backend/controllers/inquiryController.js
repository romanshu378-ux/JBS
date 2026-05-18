const { Inquiry } = require('../models');

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const inquiry = await Inquiry.create({
      name, email, phone, subject, message
    });
    
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    const { status } = req.body;
    await inquiry.update({ status });

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    await inquiry.destroy();
    res.json({ success: true, message: 'Inquiry removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInquiries, createInquiry, updateInquiryStatus, deleteInquiry };
