const router = require('express').Router();
const articlesController = require('../controllers/articles.controller');


//The general articles endpoint
router.get('/', async(req, res, next) => {
    try {
        articlesController.getPublishedArticles(req, res);
    } catch(error) {
        next(error);
    }
});




module.exports = router;