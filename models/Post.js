var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, trim: true},       //작성자 email
  title: {type: String, required: true},                                //타이틀
  content: {type:String},                                               //컨텐츠
  read: {type:Number},                                                  //조회수
  createdAt: {type: Date, default: Date.now}                            //생성시간
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Post = mongoose.model('Post', schema);


module.exports = Post;
