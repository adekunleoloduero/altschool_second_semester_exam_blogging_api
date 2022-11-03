const articlesService = require('../services/articles.service');




const getPublishedArticles = async(req, res) => {
    const query = req.query;
    const articles = await articlesService.getPublishedArticles(query);
    return res.status(200).json(articles);
}



const createArticle = async(req, res) => {
    const body = req.body;
    const user = req.user.email; //Email of signed in user derived from decrypted jwt token
    const article = await articlesService.createArticle(body, user);
    return res.status(201).json({message: "New draft article created.", article });
}


const updateOwnArticleState = async(req, res) => {
    const id = req.params.id;
    const state = req.body;
    const user = req.user.email;
    const article = await articlesService.updateOwnArticleState(id, state, user);
    if (article) {
        return res.status(200).json({message: "Congratulations, your article was successfully published.", article })
    }
}


module.exports = {
    createArticle,
    updateOwnArticleState,
}