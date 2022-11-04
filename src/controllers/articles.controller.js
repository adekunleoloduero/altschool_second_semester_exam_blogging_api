const articleModel = require('../models/article.model');
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


const editOwnArticle = async(req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = req.user.email;
    const article = await articlesService.editOwnArticle(id, body, user);
    if (article) {
        return res.status(200).json({message: "Your changes have been saved.", article })
    } else {
        return res.status(401).json({ message: "You don't have the permission to edit this article."})
    }
}


const deleteOwnArticle = async(req, res) => {
    const id = req.params.id;
    const user = req.user.email;
    const article = await articlesService.deleteOwnArticle(id, user);
    if (article) {
        return res.status(200).json({ message: "Deleted one (1) article."})
    } else {
        return res.status(401).json({message: "You don't have the permission to delete this article."})
    }   
}


const getOwnArticles = async(req, res) => {
    const user = req.user.email;
    let state;
    let articles
    if (req.query) {
        state = req.query.state;
        articles = await articlesService.getOwnArticles(user, state);
    } else {
        articles = await articlesService.getOwnArticles(user, null);
    }
    if (articles) {
        return res.status(200).json(articles);
    } else {
        return res.status(401).json({message: "Please signin to see a list of your articles."})
    }
}



module.exports = {
    createArticle,
    updateOwnArticleState,
    editOwnArticle,
    deleteOwnArticle,
    getOwnArticles,
}