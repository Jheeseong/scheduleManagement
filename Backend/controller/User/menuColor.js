const { User } = require("../../models/User");

const menuColor = {
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 내브바 색상을 저장하는 함수
    * 주요 기능 : 유저가 설정한 내브바의 색상을 저장
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