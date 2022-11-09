const { User } = require("../../models/User");

const menuColor = {
    /**
    * 담당자 : 배도훈
    * 함수 내용 :
    * 주요 기능 :
    **/
    changeMenuColor: (req, res) => {
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