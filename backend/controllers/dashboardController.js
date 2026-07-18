const { Service, Project, TeamMember, Gallery, Testimonial, Inquiry } = require('../models');

const getDashboardData = async (req, res) => {
  try {
    const [
      servicesCount,
      projectsCount,
      teamCount,
      galleryCount,
      testimonialsCount,
      inquiriesCount,
      recentInquiries,
      recentProjects
    ] = await Promise.all([
      Service.count(),
      Project.count(),
      TeamMember.count(),
      Gallery.count(),
      Testimonial.count(),
      Inquiry.count(),
      Inquiry.findAll({ order: [['createdAt', 'DESC']], limit: 4 }),
      Project.findAll({ order: [['createdAt', 'DESC']], limit: 4 })
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          services: servicesCount,
          projects: projectsCount,
          team: teamCount,
          gallery: galleryCount,
          testimonials: testimonialsCount,
          inquiries: inquiriesCount
        },
        recentInquiries,
        recentProjects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
