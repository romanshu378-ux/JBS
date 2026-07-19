const { Testimonial } = require('../models');

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { clientName, role, company, content, rating } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.create({
      clientName, role, company, content, rating, image
    });
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    const { clientName, role, company, content, rating } = req.body;
    let image = testimonial.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await testimonial.update({
      clientName: clientName || testimonial.clientName,
      role: role !== undefined ? role : testimonial.role,
      company: company !== undefined ? company : testimonial.company,
      content: content || testimonial.content,
      rating: rating || testimonial.rating,
      image
    });

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    await testimonial.destroy();
    res.json({ success: true, message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
