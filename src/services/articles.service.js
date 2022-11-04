const ArticleModel = require('../models/article.model');



const getPublishedArticles = async(query) => {
    //
    let articles;
    if (query) {
        const searchBy = {};
        const orderBy = {};
        
        //Filter parameters
        if (query.author) {
            searchBy.state = query.state;
        }
        if (query.title) {
            searchBy.title = query.title;
        }
        if (query.tags) {
            searchBy.tags = query.tags.split('');
        }

        //Order parameters
        if (query.readCount) {
            orderBy.readCount = query.readCount
        }
        if (query.readingTime) {
            orderBy.readingTime = query.readingTime
        }
        if (query.timestamp) {
            orderBy.timestamp = query.timestamp;
        }
        
        articles = await ArticleModel.find(searchBy)
        .limit(20)
        .sort(orderBy)
    } else {
        articles = await ArticleModel.find()
        .limit(20);
    }
    
    return articles;
};



const createArticle = async(body, userId) => {
    const article = new ArticleModel(body);
    article.author = userId;
    const readingTime = article.calculateReadingTime(body.body); //calculateReadingTime is a helper method in the articleModel
    article.readingTime = readingTime;
    article.save();
    return article;
}


const updateOwnArticleState = async(id, state, user) => {
    const article = await ArticleModel.findById(id);
    
    if (article.author == user) { //Ensure that the article belongs to the logged in user
        let article = await ArticleModel.findByIdAndUpdate(id, state, {new: true});
        
        if (!article) {
            return false;
        }
        return article;
    }
}

//Editable properties are title, description, body and tags
const editOwnArticle = async(id, body, user) => {
    const article = await ArticleModel.findById(id);
    
    if (article.author == user) { //Ensure that the article belongs to the logged in user
        let article = await ArticleModel.findByIdAndUpdate(id, body, {new: true});
        const readingTime = await article.calculateReadingTime(article.body); //Update readingTime
        article.readingTime = readingTime;
        article.save();

        if (!article) {
            return false;
        }
        return article;
    } else {
        return false;
    }
}



const deleteOwnArticle = async(id, user) => {
    let article = await ArticleModel.findById(id);
    
    if (article.author == user) { //Ensure that the article belongs to the logged in user
        await ArticleModel.findByIdAndDelete(id); //Delete the article
        //Confirm that it was deleted successfully
        article = await ArticleModel.findById(id);
        if (!article) {
            return true; //Assert that the article has been deleted
        }
    } else {
        return false; //If the user is unauthorized
    }
}


module.exports = {
    getPublishedArticles,
    createArticle,
    updateOwnArticleState,
    editOwnArticle,
    deleteOwnArticle,
}