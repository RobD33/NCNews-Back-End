const apiRouter = require('express').Router();
const {getDocumentation} = require('../controllers')
const topicsRouter = require('./topics')
const articlesRouter = require('./articles')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.route('/')
    .get(getDocumentation)



module.exports = apiRouter;