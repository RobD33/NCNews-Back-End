const commentsRouter = require('express').Router();
const { incrementVotes, deleteComment } = require('../controllers/comments')

commentsRouter.route('/:comment_id')
    .put(incrementVotes)
    .delete(deleteComment)


module.exports = commentsRouter;