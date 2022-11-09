/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 카테고리 스키마
* 주요 기능 : 생성자, 공유자에 유저스키라 매핑
 *          카테고리 태그에 태그스키마를 매핑
**/
const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    title: {
        type: String
    },
    creator: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    tagInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"Tag"}],
    userInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
})
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category }