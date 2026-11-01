const express = require('express');
const router = express.Router();
const { saveJob, removeSavedJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveJob);
router.get('/', protect, getSavedJobs);
router.delete('/:jobId', protect, removeSavedJob);

module.exports = router;
