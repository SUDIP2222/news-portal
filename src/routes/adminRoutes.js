const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const UserRole = require('../enums/UserRole');

router.use(protect);
router.use(authorize(UserRole.ADMIN, UserRole.EDITOR));

// Article routes
router.post('/articles', AdminController.createArticle);
router.put('/articles/:id', AdminController.updateArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

// Category routes
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

module.exports = router;