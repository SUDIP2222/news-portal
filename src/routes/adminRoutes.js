const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const UserRole = require('../enums/UserRole');

router.use(protect);
router.use(authorize(UserRole.ADMIN, UserRole.EDITOR));

router.post('/articles', AdminController.createArticle);
router.put('/articles/:id', AdminController.updateArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

module.exports = router;