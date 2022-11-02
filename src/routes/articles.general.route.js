


//The general articles endpoint
router.get('/', async(req, res, next) => {
    try {
        articlesController.getPublishedArticles(req, res);
    } catch(error) {
        next(error);
    }
});
