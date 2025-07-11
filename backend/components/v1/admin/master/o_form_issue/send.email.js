'use strict';

const { ErrorHandler, sendEmail } = require('../../../../../lib/utils');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const body = req.body.license_email;
    const { customer_email, license_file_path, o_form_file_path } = body;

    if (!customer_email || !license_file_path || !o_form_file_path) {
      return res.status(400).json({
        success: false,
        message: 'customer_email, license_file_path, and o_form_file_path are required.'
      });
    }

    // Prepare attachments
    const attachments = [
      {
        filename: path.basename(license_file_path),
        path: license_file_path
      },
      {
        filename: path.basename(o_form_file_path),
        path: o_form_file_path
      }
    ];

    // Send email
    await sendEmail({
      to: customer_email,
      subject: 'Your License & O-Form Documents',
      text: 'Dear customer,\n\nPlease find attached your license and O-form documents.\n\nThank you.',
      html: `<p>Dear customer,</p><p>Please find attached your license and O-form documents.</p><p>Thank you.</p>`,
      attachments
    });

    return res.status(200).json({
      success: true,
      message: 'License and O-form email sent successfully.'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: { error: ErrorHandler(error) }
    });
  }
};
