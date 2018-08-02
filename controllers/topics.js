const { Topic, Article } = require('../models');

module.exports.getTopics = (req, res, next) => {
    Topic.find().then(topics => {
        res.status(200).send({ topics })
      }).catch(err => {
          console.log(err)
          next(err)
      })
}

module.exports.getArticlesByTopic = (req, res, next) => {
    const {topic_slug} = req.params;
    Article.find({belongs_to: `${topic_slug}`})
        .then(articles => {
            if (articles.length) res.send({articles})
            else res.status(404).send({error:'no topic of that name'})
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}