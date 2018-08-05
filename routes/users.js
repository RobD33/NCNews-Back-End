const usersRouter = require('express').Router();
const { getUserByName } = require('../controllers/users')

usersRouter.route('/:username')
    .get(getUserByName)



module.exports = usersRouter;