import express from 'express';
import {
  submitContact,
  getAllContacts,
  getMySubmissions,
  updateContactStatus
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit
router.post('/', submitContact);

// Protected routes
router.get('/my-submissions', protect, getMySubmissions);
router.get('/', protect, getAllContacts);
router.put('/:id/status', protect, updateContactStatus);

export default router;
