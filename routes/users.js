var express = require('express'),
    User = require('../models/User');
var router = express.Router();

function confirm(form){
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if(!name){
    return '이름을 입력해주세요.';
  }
  if(!email){
    return '이메일을 입력해주세요.';
  }
  if(!form.password){
    return '비밀번호을 입력해주세요.';
  }
  if(form.password !== form.pwCheck){
    return '비밀번호가 일치하지 않습니다.';
  }
  if(form.password.length < 4){
    return '비밀번호가 4글자 이상이어야 합니다.';
  }
  return null;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findById(res.locals.currentUser.id, function(){
    if(err){
      return next(err);
    }
    res.render('users/progfile', {user: user});
  });
});

router.post('/', function(req, res, next) {
  var err = confirm(req.body);
  if(err) {
    req.flash('danger', err);
    return res.redirect('back');                // 이전 회원가입 페이지로 이동
  }


  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('danger', '동일한 이메일 주소가 이미 존재합니다.');
      return res.redirect('back');
    }
    var newUser = new User({
      name: req.body.name,
      email: req.body.email
    });
    newUser.password = newUser.generateHash(req.body.password);

    newUser.save(function(err) {
      if (err) {
        next(err);
      }
      else {
        req.flash('success', '가입이 완료되었습니다. 로그인 해주세요.');
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
