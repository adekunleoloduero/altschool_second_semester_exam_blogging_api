const router = require('express').Router();
const articlesController = require('../controllers/articles.controller');
const passport = require('passport');



//GENERAL ENDPOINTS (Require to authentication)

//The general articles endpoint: Home route specifically redirects here
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


router.get('/read/:id', async(req, res, next) => {
    try {
        await articlesController.getPublishedArticleById(req, res);
    } catch(error) {
        next(error);
    }
})





//PROTECTED ROUTES (User must be authenticated)
router.use(passport.authenticate('jwt', { session: false }));


//Get list of own articles (draft and published)
router.get('/my-articles', async(req, res, next) => {
    try {
        await articlesController.getOwnArticles(req, res);
    } catch(error) {
        next(error);
    }
})



//Create an article
router.post('/create', async(req, res, next) => {
    try {
        await articlesController.createArticle(req, res);
    } catch(error) {
        next(error);
    }
});


//Update own article state
router.patch('/publish/:id', async(req, res, next) => {
    try {
        await articlesController.updateOwnArticleState(req, res)
    } catch(error) {
        next(error);
    }
})



//Edit own article
router.patch('/edit/:id', async(req, res, next) => {
    try {
        await articlesController.editOwnArticle(req, res);
    } catch(error) {
        next(error);
    }
});


//delete own article
router.delete('/delete/:id', async(req, res, next) => {
    try {
        await articlesController.deleteOwnArticle(req, res);
    } catch(error) {
        next(error);
    }
})


module.exports = router;