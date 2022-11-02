const articlesService = require('../services/articles.service');




const getPublishedArticles = async(req, res) => {
    const query = req.query;
    const articles = await articlesService.getPublishedArticles(query);
    return res.status(200).json(articles);
}



const createArticle = async(req, res) => {
    const body = req.body;
    const user = req.user.email; //ID of signed in user derived from decrypted jwt token
    const article = await articlesService.createArticle(body, user);
    return res.status(201).json({message: "New draft article created.", article });
}



module.exports = {
    getPublishedArticles,
    createArticle,
}