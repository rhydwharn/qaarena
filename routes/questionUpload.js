const express = require('express');
const multer = require('multer');
const {
  uploadQuestionsFromExcel,
  downloadTemplate,
  getUploadStats,
  getCategories
} = require('../controllers/questionUploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only Excel files
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  }
});

// Public routes
router.get('/categories', getCategories);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

// Upload questions from Excel
router.post('/upload', upload.single('file'), uploadQuestionsFromExcel);

// Download template
router.get('/template', downloadTemplate);

// Get upload statistics
router.get('/stats', getUploadStats);

module.exports = router;
