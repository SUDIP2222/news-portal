const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/PublicController');
const CategoryController = require('../controllers/CategoryController');
const { validateLanguage } = require('../middleware/langMiddleware');

// Localized public routes
router.get('/articles', validateLanguage, PublicController.getArticles);
router.get('/articles/:slug', validateLanguage, PublicController.getArticleBySlug);
router.get('/home', validateLanguage, PublicController.getHome);
router.get('/categories', validateLanguage, CategoryController.getCategories);

module.exports = router;