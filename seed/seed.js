const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatArticleData, formatCommentData , generateReferenceObject} = require('../utils')

const seedDB = ({ articleData, commentData, topicData, userData }) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            User.insertMany(userData),
            Topic.insertMany(topicData)
        ])
    })
    .then(([userDocs, topicDocs]) => {
        const userRefs = generateReferenceObject(userData, userDocs)
        return Promise.all([
            Article.insertMany(formatArticleData(articleData, userRefs)),
            userDocs,
            topicDocs
        ])
    })
    .then(([articleDocs, userDocs, topicDocs]) => {
        const articleRefs = generateReferenceObject(articleData, articleDocs);
        const userRefs = generateReferenceObject(userData, userDocs);
        return Promise.all ([
            Comment.insertMany(formatCommentData(commentData, articleRefs, userRefs)),
            articleDocs,
            userDocs,
            topicDocs
        ])
    })
}

module.exports = seedDB;
