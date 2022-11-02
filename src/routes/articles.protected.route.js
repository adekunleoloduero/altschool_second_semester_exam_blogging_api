const router = require('express').Router();
const articlesController = require('../controllers/articles.controller');



//Create an article
router.post('/', async(req, res, next) => {
    try {
        articlesController.createArticle(req, res);
    } catch(error) {
        next(error);
    }
});




module.exports = router;