import Contact from '../models/Contact.js';
import { sendContactEmail, sendAutoReply } from '../config/email.js';

// @desc    Submit contact/feedback form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      type: type || 'contact',
      userId: req.user?._id // Optional - if user is logged in
    });

    // Send email to hemwritess@gmail.com
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
      type: type || 'contact'
    });

    // Send auto-reply to user
    if (emailResult.success) {
      await sendAutoReply(email, name);
    }

    res.status(201).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      contact,
      emailSent: emailResult.success
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact
// @access  Private (admin only - for future)
export const getAllContacts = async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'email');

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own contact submissions
// @route   GET /api/contact/my-submissions
// @access  Private
export const getMySubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private (admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
