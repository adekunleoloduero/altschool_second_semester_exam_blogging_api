const router = require('express').Router();
const articlesController = require('../controllers/articles.controller');



//Create an article
router.post('/create', async(req, res, next) => {
    try {
        articlesController.createArticle(req, res);
    } catch(error) {
        next(error);
    }
});




//Update own article state
router.patch('/publish/:id', async(req, res, next) => {
    try {
        articlesController.updateOwnArticleState(req, res)
    } catch(error) {
        next(error);
    }
})



//Edit own article
router.patch('/edit/:id', async(req, res, next) => {
    try {
        articlesController.editOwnArticle(req, res);
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


//Get list of own article
router.get('/my-articles', async(req, res, next) => {
    try {
        await articlesController.getOwnArticles(req, res);
    } catch(error) {
        next(error);
    }
})


module.exports = router;