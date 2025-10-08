import express from 'express';
import {
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../controllers/journalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getJournalEntries)
  .post(createJournalEntry);

router.route('/:id')
  .get(getJournalEntryById)
  .put(updateJournalEntry)
  .delete(deleteJournalEntry);

export default router;
