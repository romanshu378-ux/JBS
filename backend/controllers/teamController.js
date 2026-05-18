const { TeamMember } = require('../models');

const getTeam = async (req, res) => {
  try {
    const team = await TeamMember.findAll();
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, facebook, twitter, linkedin } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const member = await TeamMember.create({
      name, role, bio, facebook, twitter, linkedin, image
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const { name, role, bio, facebook, twitter, linkedin } = req.body;
    let image = member.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await member.update({
      name: name || member.name,
      role: role || member.role,
      bio: bio || member.bio,
      facebook: facebook !== undefined ? facebook : member.facebook,
      twitter: twitter !== undefined ? twitter : member.twitter,
      linkedin: linkedin !== undefined ? linkedin : member.linkedin,
      image
    });

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    await member.destroy();
    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTeam, createTeamMember, updateTeamMember, deleteTeamMember };
