const { User } = require("../../models/User");

const menuColor = {
    changeMenuColor: (req, res) => {
        console.log(req.body.menuColor);
        User.updateOne({ userId: req.user.userId }, {$set: {menuColor: req.body.menuColor}}, function(err){
            if(err){
                console.log(err);
                res.status(400).end()
            }else{
                res.status(201).end()
            }
        })
    }
}

module.exports = menuColor;