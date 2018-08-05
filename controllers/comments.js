const { Comment } = require('../models')
const mongoose = require('mongoose')

exports.incrementVotes = (req, res, next) => {
    let increment;
    const { comment_id } = req.params;
    const { vote } = req.query;
    if (!mongoose.Types.ObjectId.isValid(comment_id)) next({status: 400, msg: `${comment_id} is not a valid mongo _id`})
    vote === 'up' ? increment = 1 
        : vote === 'down' ? increment = -1 
            : next({status: 400, msg: 'Vote must equal up or down'});
    Comment.findByIdAndUpdate(comment_id, { $inc: { votes: increment } }, {new: true}).lean()
        .then(comment => {
            if (!comment) return Promise.reject({status: 404, msg: `comment ${comment_id} not found.`})
            res.status(200).send({comment})
        })
        .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(comment_id)) next({status: 400, msg: `${comment_id} is not a valid mongo _id`})
    Comment.findOne({ _id: comment_id})
        .then(comment => {
            if (!comment) return Promise.reject({status: 404, msg: `comment ${comment_id} not found.`})
            else return Comment.remove({ _id: comment_id }).lean()
        })
        .then(comment => {
            res.send({removed: comment})
        })
        .catch(next)
}