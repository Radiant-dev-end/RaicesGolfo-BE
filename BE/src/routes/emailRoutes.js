const express = require('express');
const router = express.Router();

const { sendConfirmationEmail } = require('../services/emailService');

/**
 * POST /api/email/send
 * Body: { toEmail: string, type: 'room'|'tour', info: object }
 * Sends a confirmation email using the existing email service.
 */
router.post('/send', async (req, res) => {
  const { toEmail, type, info } = req.body;
  if (!toEmail || !type || !info) {
    return res.status(400).json({ message: 'Missing toEmail, type or info in request body.' });
  }
  try {
    const sent = await sendConfirmationEmail(toEmail, type, info);
    if (sent) {
      return res.json({ success: true, message: 'Email sent successfully.' });
    }
    return res.status(500).json({ success: false, message: 'Failed to send email.' });
  } catch (err) {
    console.error('Error in email route:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
