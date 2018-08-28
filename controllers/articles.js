const {Article, Comment} = require('../models');
const mongoose = require('mongoose')

exports.getArticles = (req, res, next) => {
    Article.find().populate('created_by')
        .then(articles => {
            let promiseArticles = articles.map(article => {
                return Comment.countDocuments({ belongs_to: `${article._id}`})
                        .then(commentCount => {
                            return { ...article.toObject(), comments: commentCount}
                        })
            })
            return Promise.all(promiseArticles)
    })
    .then(articles => res.send({ articles }))
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo _id`})
    Article.findById(article_id).populate('created_by')
        .then((article) => {
        if(!article) return Promise.reject({status: 404, msg: `article ${article_id} cannot be found`})
        else{
            return Promise.all([
                Comment.countDocuments({ belongs_to: `${article_id}`}),
                article
            ])
        }
    })
    .then(([comments, article]) => {
        res.send({article: { ...article.toObject(), comments}})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo _id`})
    Comment.find({ belongs_to: `${article_id}`}).populate('created_by')
        .then(comments => {
            // if(!comments.length) return Promise.reject({status: 404, msg: `article ${article_id} cannot be found`})
            // else {
                res.send({ comments })
            //}
        })
        .catch(next)
}

exports.postCommentToArticle = (req, res, next) => {
    const {article_id} = req.params
    if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo _id`})
    Article.findById(article_id)
        .then(article => {
            if (!article) return Promise.reject({status: 404, msg: `article ${article_id} not found.`})
            else {
                const newComment = new Comment({
                    body: req.body.body,
                    belongs_to: article_id,
                    created_by: req.body.created_by,
                    created_at: new Date().getTime()
                  });
                  return Comment.create(newComment)
            }
        })
        .then(comment => {
            return Comment.findOne({_id: comment._id}).populate('created_by')
        })
        .then(comment => res.status(201).send({posted: comment.toObject()}))
        .catch(next)
}

exports.incrementVotes = (req, res, next) => {
    let increment;
    const {article_id} = req.params;
    const { vote } = req.query;
    if (!mongoose.Types.ObjectId.isValid(article_id)) next({status: 400, msg: `${article_id} is not a valid mongo _id`})
    vote === 'up' ? increment = 1 
        : vote === 'down' ? increment = -1 
        : next({status: 400, msg: 'Vote must equal up or down'});
    Article.findByIdAndUpdate(article_id, { $inc: { votes: increment } }, {new: true}).lean()
        .then(article => {
            if (!article) return Promise.reject({status: 404, msg: `article ${article_id} not found.`})
            res.status(200).send({article})
        })
        .catch(next)
}