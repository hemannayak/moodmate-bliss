import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadPhoto,
  deleteAvatar,
  deletePhoto
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.post('/avatar', uploadAvatar);
router.delete('/avatar', deleteAvatar);

router.post('/photo', uploadPhoto);
router.delete('/photo', deletePhoto);

export default router;
