const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/PublicController');
const CategoryController = require('../controllers/CategoryController');

router.get('/articles', PublicController.getArticles);
router.get('/articles/:slug', PublicController.getArticleBySlug);
router.get('/home', PublicController.getHome);
router.get('/categories', CategoryController.getCategories);

module.exports = router;