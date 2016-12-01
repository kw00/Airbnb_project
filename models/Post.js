var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, trim: true},       //작성자 email
  title: {type: String, required: true, trim: true},                                //타이틀
  content: {type:String, required: true, trim: true},                                               //컨텐츠
  city: {type:String},
  address: {type:String},
  charge: {type:String},
  facility: {type:String},
  rule: {type:String},
  read: {type:Number, default: 0},                                                  //조회수
  createdAt: {type: Date, default: Date.now}                            //생성시간
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
