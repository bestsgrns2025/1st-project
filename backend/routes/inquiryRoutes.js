const express = require('express');
const router = express.Router();
const ProjectInquiry = require('../models/ProjectInquiry');
const nodemailer = require('nodemailer');
const geoip = require('geoip-lite');
const xlsx = require('xlsx');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @route   POST /api/inquiries
// @desc    Submit a project inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    let location = 'Unknown';
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log('IP Address:', ip);
      const geo = geoip.lookup(ip);
      if (geo) {
        location = `${geo.city}, ${geo.country}`;
      }
    } catch (error) {
      console.error('GeoIP lookup failed:', error);
    }

    const newInquiry = new ProjectInquiry({
      ...req.body,
      location,
    });
    const inquiry = await newInquiry.save();

    // Send email notification
    const { name, email, company, service, budget, message, timeline } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Project Inquiry from ${name}`,
      html: `
        <p>You have received a new project inquiry:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company || 'N/A'}</li>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Budget:</strong> ${budget || 'N/A'}</li>
          <li><strong>Timeline:</strong> ${timeline || 'N/A'}</li>
          <li><strong>Message:</strong> ${message}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(inquiry);
  } catch (err) {
    console.error(err);
    console.error('Error sending email:', err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/inquiries/export
// @desc    Export all inquiries to an Excel sheet
// @access  Public
router.get('/export', async (req, res) => {
  try {
    const inquiries = await ProjectInquiry.find();

    const data = inquiries.map(inquiry => ({
      Name: inquiry.name,
      Email: inquiry.email,
      Company: inquiry.company,
      Service: inquiry.service,
      Budget: inquiry.budget,
      Timeline: inquiry.timeline,
      Message: inquiry.message,
      Location: inquiry.location,
      Date: inquiry.createdAt.toLocaleDateString(),
      Time: inquiry.createdAt.toLocaleTimeString(),
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=inquiries.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    console.error('Error sending email:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
