const {Article} = require('../models');

module.exports.getArticles = (req, res, next) => {
    Article.find().then(articles => {
        res.send({ articles })
    })
}

module.exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    console.log(article_id)
    Article.findById(article_id).then(article => {
        res.send({article})
    }).catch(err => {
        console.log(err);
        next(err)
    })
}