const { Inquiry } = require('../models');

// GET ALL INQUIRIES
const getInquiries = async (req, res) => {

  try {

    const inquiries = await Inquiry.findAll({

      order: [['createdAt', 'DESC']]

    });

    res.json({

      success: true,

      data: inquiries

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// CREATE INQUIRY
const createInquiry = async (req, res) => {

  try {

    const {

      name,

      email,

      phone,

      service,

      subject,

      message

    } = req.body;

    const inquiry = await Inquiry.create({

      name,

      email,

      phone,

      service: service || subject || 'General Inquiry',

      message

    });

    res.status(201).json({

      success: true,

      data: inquiry,

      message: 'Inquiry submitted successfully'

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// UPDATE STATUS
const updateInquiryStatus = async (req, res) => {

  try {

    const inquiry = await Inquiry.findByPk(req.params.id);

    if (!inquiry) {

      return res.status(404).json({

        success: false,

        message: 'Inquiry not found'

      });

    }

    const { status } = req.body;

    await inquiry.update({ status });

    res.json({

      success: true,

      data: inquiry

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// DELETE INQUIRY
const deleteInquiry = async (req, res) => {

  try {

    const inquiry = await Inquiry.findByPk(req.params.id);

    if (!inquiry) {

      return res.status(404).json({

        success: false,

        message: 'Inquiry not found'

      });

    }

    await inquiry.destroy();

    res.json({

      success: true,

      message: 'Inquiry removed'

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

module.exports = {

  getInquiries,

  createInquiry,

  updateInquiryStatus,

  deleteInquiry

};