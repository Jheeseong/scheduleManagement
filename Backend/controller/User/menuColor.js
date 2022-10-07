const { User } = require("../../models/User");

const menuColor = {
    changeMenuColor: (req, res) => {
        console.log(req.body.menuColor + 111111);
        console.log(req.user.userId + 222222);
        User.updateOne({ userId: req.user.userId }, {$set: {menuColor: req.body.menuColor}}, function(err){
            if(err){
                console.log(err);
            }
        })
    }
}

module.exports = menuColor;