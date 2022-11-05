const ArticleModel = require('../models/article.model');



const getPublishedArticles = async(query) => {
    let articles;
    if (query) {
        //
        const searchBy = {};
        const orderBy = {};
        searchBy.state = "published" //Ensure that only published articles are returned
        
        //Filter parameters (state, title and tags)
        if (query.author) {
            searchBy.author = query.author;
        }
        if (query.title) {
            searchBy.title = query.title;
        }
        if (query.tags) {
            let tags = query.tags.split(',');
            //Ensure that all the tags are in lowercase to match with structure of saved documents
            tags = tags.map((tag) => {
                return tag.toLowerCase();
            });
            searchBy.tags = {$in: tags};
        }

        //Order parameters (readCount, readingTime and timestamp)
        if (query.readCount) {
            if (query.readCount == 'asc') {
                orderBy.readCount = 1;
            } else if (query.readCount == 'desc') {
                orderBy.readCount = -1;
            }
        }
        if (query.readingTime) {
            if (query.readingTime == 'asc') {
                orderBy.readingTime = 1;
            } else if (query.readingTime == 'desc') {
                orderBy.readingTime = -1;
            }
        }
        if (query.timestamp) {
            if (query.timestamp == 'asc') {
                orderBy.timestamp = 1;
            } else if (query.timestamp == 'desc') {
                orderBy.timestamp = -1;
            }
        }
        
        articles = await ArticleModel.find(searchBy)
        .where("state").equals("published")
        .limit(20)
        .sort(orderBy);
    } else {
        articles = await ArticleModel.find({ state: "published" })
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



const getOwnArticles = async(user, state) => {
    if (user) { //Ensure that the user is signed in
        const query = {};
        query.author = user;
        if (state) {
            query.state = state;
        } 
        const articles = await ArticleModel.find(query)
        .limit(20);
        return articles;
    } else return false;
}


module.exports = {
    getPublishedArticles,
    createArticle,
    updateOwnArticleState,
    editOwnArticle,
    deleteOwnArticle,
    getOwnArticles,
}