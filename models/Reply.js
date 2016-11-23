var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  post: {type: Schema.Types.ObjectId, index: true, required: true},     //게시물
  email: {type: String, required: true, index: true, trim: true},       //작성자 email
  content: {type:String},                                               //컨텐츠
  createdAt: {type: Date, default: Date.now}                            //생성시간
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Post = mongoose.model('Reply', schema);


module.exports = Post;
