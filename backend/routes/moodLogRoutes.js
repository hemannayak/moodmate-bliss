import express from 'express';
import {
  getMoodLogs,
  getMoodLogById,
  createMoodLog,
  updateMoodLog,
  deleteMoodLog,
  getMoodStats,
  getMoodAIInsights
} from '../controllers/moodLogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getMoodLogs)
  .post(createMoodLog);

router.get('/stats', getMoodStats);
router.get('/ai-insights', getMoodAIInsights);

router.route('/:id')
  .get(getMoodLogById)
  .put(updateMoodLog)
  .delete(deleteMoodLog);

export default router;
