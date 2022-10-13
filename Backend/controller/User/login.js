const { User } = require('../../models/User')

const login = {
    logouts: (req, res) => {
        req.logout((err) => {
            if (err) console.log(err)
        })
        res.redirect('/login')
    },
}

module.exports = login;