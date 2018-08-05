const { User } = require('../models')

exports.getUserByName = (req, res, next) => {
    const {username} = req.params;
    User.findOne({ username: req.params.username }).lean()
        .then(user => {
            if (!user) return Promise.reject({status: 404, msg: `No user found with name ${username}`})
            else res.send({user})
        })
        .catch(next)
}