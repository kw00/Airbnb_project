var express = require('express'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/login');
  }
}

function confirm(form, isFix) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return '이름을 입력해주세요.';
  }
  if (!email) {
    return '이메일을 입력해주세요.';
  }
  if (!form.password) {
    return '비밀번호를 입력해주세요.';
  }

  if(isFix) {
    if (form.newPassword && form.newPassword.length < 4) {
      return '비밀번호는 4글자 이상이어야 합니다.';
    }
    if (form.newPassword && (form.newPassword !== form.pwCheck)) {
      return '새 비밀번호가 일치하지 않습니다.';
    }
  }
  else {
    if (form.password.length < 4) {
      return '비밀번호는 4글자 이상이어야 합니다.';
    }
    if (form.password !== form.pwCheck) {
      return '비밀번호가 일치하지 않습니다.';
    }
  }
  return null;
}


/* GET users listing. */
router.get('/', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('users/index', {users: users});
  });
});

router.get('/new', function(req, res, next) {
  res.render('users/new', {messages: req.flash()});
});

router.get('/:id/edit', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/edit', {user: user});
  });
});

router.put('/', needAuth, function(req, res, next) {
  var err = confirm(req.body, true);
  if(err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  User.findById(res.locals.currentUser.id, function(err, user) {
    if(err) {
      return next(err);
    }
    if (!user) {
      req.flash('danger', '존재하지 않는 사용자입니다.');
      return res.redirect('back');
    }
    if (!user.validatePassword(req.body.password)) {
      req.flash('danger', '현재 비밀번호가 일치하지 않습니다.');
      return res.redirect('back');
    }

    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.newPassword) {
      user.password = user.generateHash(req.body.newPassword);
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '사용자 정보가 변경되었습니다.');
      res.redirect('/users');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  User.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '사용자 계정이 삭제되었습니다.');
    res.redirect('/users');
  });
});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('users/show', {user: user});
  });
});

router.post('/', function(req, res, next) {

  var err = confirm(req.body);  //에러시 err에 에러 스트링, 에러가 없을시 null
  if(err) {                     //err에 스트링 값이 있다면
    req.flash('danger', err);   // flashMessages에 err 스트링 값 입력
    return res.redirect('back');  // redirect back 으로 이전 페이지(회원가입)으로 이동
  }

  //에러가 없다면 DB 입력 시도
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
