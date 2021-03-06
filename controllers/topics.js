const { Topic, Article, Comment } = require('../models');

module.exports.getTopics = (req, res, next) => {
    Topic.find().then(topics => {
        res.status(200).send({ topics })
      }).catch(err => {
          next(err)
      })
}

module.exports.getArticlesByTopic = (req, res, next) => {
    const {topic_slug} = req.params;
    Article.find({belongs_to: `${topic_slug}`}).populate('created_by')
        .then(articles => {
            let promiseArticles = articles.map(article => {
                return Comment.countDocuments({ belongs_to: `${article._id}`})
                        .then(commentCount => {
                            return { ...article.toObject(), comments: commentCount}
                        })
            })
            return Promise.all(promiseArticles)
        })
        .then(articles => {
            if (articles.length) res.send({articles})
            else res.status(404).send({msg:'no topic of that name'})
        })
        .catch(err => {
            next(err)
        })
}

module.exports.postArticleToTopic = (req, res, next) => {
    const { topic_slug } = req.params
    Topic.findOne({slug: topic_slug})
        .then((topic) => {
            if(topic === null) return Promise.reject({status: 404, msg: `topic ${topic_slug} cannot be found`})
            else {
                const newArticle = new Article({
                    title: req.body.title,
                    body: req.body.body,
                    belongs_to: topic_slug,
                    created_by: req.body.user,
                    comments: 0,
                    created_at: new Date().getTime()
                });
                return Article.create(newArticle)
            }   
        })
        .then((article) => {
            res.status(201).send({ posted: article })
        })
        .catch(next)
}