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




module.exports = {
    getPublishedArticles,
}