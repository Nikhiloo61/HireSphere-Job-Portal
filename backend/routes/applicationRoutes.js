const express = require('express');
const router = express.Router();
const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, applyJob);
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
