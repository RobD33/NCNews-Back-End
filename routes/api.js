const apiRouter = require('express').Router();
const {getDocumentation} = require('../controllers/home')
const topicsRouter = require('./topics')
const articlesRouter = require('./articles')
const commentsRoute = require('./comments')
const usersRouter = require('./users')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRoute);
apiRouter.use('/users', usersRouter)
apiRouter.route('/')
    .get(getDocumentation)



module.exports = apiRouter;