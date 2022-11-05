const router = require('express').Router();
const articlesController = require('../controllers/articles.controller');


//The general articles endpoint
//Gets list of published articles and is accessible to both signed in and not signed in users
//Optional query parameters:
//Filtering (author, title and tags)
//Ordering (readCount, readingTime and timestamp)
router.get('/', async(req, res, next) => {
    try {
        await articlesController.getPublishedArticles(req, res);
    } catch(error) {
        next(error);
    }
});


router.get('/:id', async(req, res, next) => {
    try {
        await articlesController.getPublishedArticleById(req, res);
    } catch(error) {
        next(error);
    }
})




module.exports = router;