const articlesRouter = require('express').Router();
const { getArticles, getArticleById, getCommentsByArticleId, postCommentToArticle, incrementVotes } = require('../controllers/articles')

articlesRouter.route('/')
    .get(getArticles)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .put(incrementVotes)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentToArticle)

module.exports = articlesRouter;