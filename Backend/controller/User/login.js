const { User } = require('../../models/User')
/**
* 담당자 : 정희성
* 함수 내용 : logout이라는 passport의 함수를 통해 session을 없애주고 로그아웃해주는 함수
* 주요 기능 : 로그아웃 해주는 기능
 *          로그인 화면으로 리다이렉트해주는 기능
**/
const login = {
    logouts: (req, res) => {
        req.logout((err) => {
            if (err) console.log(err)
        })
        res.redirect('/login')
    },
}

module.exports = login;