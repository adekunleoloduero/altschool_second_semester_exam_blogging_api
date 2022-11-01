const articlesService = require('../services/articles.service');




const getPublishedArticles = async(req, res) => {
    const query = req.query;
    const articles = await articlesService.getPublishedArticles(query);
    return res.status(200).json(articles);
}




module.exports = {
    getPublishedArticles,
}