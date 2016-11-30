var express = require('express'),
    User = require('../models/User'),
    Post = require('../models/Post'),
    Reply = require('../models/Reply');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  Post.find({}, function(err, posts) {
    if(err) {
      return next(err);
    }
    res.render('posts/list', {posts : posts});    // 이전 메모랑 동일, 자세한것은 이전 메모 만들기 참고
  });
});

router.get('/new', needAuth, function(req, res, next) {
  res.render('posts/edit', {post: {}});         // views/posts/edit.jade를 그릴때 post를 참조
                                                //post에 내용이 있으면 게시물 수정으로 생성
                                                // 자세한것은 이전 메모 만들기 참고
});

router.post('/', needAuth, function(req, res, next) {
  var newPost = new Post({
        email: res.locals.currentUser.email,
        password: req.body.password,
        title: req.body.title,
        content: req.body.content,
        read: 0                                //조회수는 0으로 입력
    });
    newPost.save(function(err) {                //post를 DB에 저장
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + newPost._id);                 //다그렸으면 완성된 게시물로 이동
    });
});

router.get('/:id', function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {     //request로 넘어온 id값으로 db검색
    if (err) {
      return next(err);
    }
    post.read = post.read+1;
    post.save(function(err) {
      if (err) {
        return next(err);
      }
      Reply.find({post: post.id}, function(err, replys){
        if(err){
          return next(err);
        }
        res.render('posts/view', {post: post, replys: replys});
      });
    });
  });
});

router.get('/:id/edit', needAuth, function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {   //해당 게시물 검색
    if (err) {
      return next(err);
    }
    User.findOne({email: post.email}, function(err, user) {
      if(err) {
        return next(err);
      }
      if(user.email !== res.locals.currentUser.email) {
        req.flash('danger', '작성자가 아닙니다.');
        return res.redirect('back');
      }
      res.render('posts/edit', {post: post});
    });
  });
});

router.put('/:id', needAuth, function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    User.findOne({email: post.email}, function(err, user) {
      if (err) {
        return next(err);
      }
      if(user.email !== res.locals.currentUser.email) {
        req.flash('danger', '작성자가 아닙니다.');
        return res.redirect('back');
      }
      post.title = req.body.title;
      post.content = req.body.content;

      post.save(function(err) {
        if (err) {
          return next(err);
        }
        res.render('posts/view', {post: post});
      });
    });
  });
});

router.delete('/:id', needAuth, function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    User.findOne({email: post.email}, function(err, user) {
      if (err) {
        return next(err);
      }
      if(user.email !== res.locals.currentUser.email) {
        req.flash('danger', '작성자가 아닙니다.');
        return res.redirect('back');
      }
      post.remove(function(err){
        if(err) {
          return next(err);
        }
        res.redirect('/posts');
      });
    });
  });
});

router.post('/:id/reply', needAuth, function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    var newReply = new Reply({
      post: post.id,
      email: res.locals.currentUser.email,
      content: req.body.reply
    });
    newReply.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + post.id);
    });
  });
});

router.delete('/:id/reply', needAuth, function(req, res, next) {
  Reply.findById({_id: req.params.id}, function(err, reply) {
    if (err) {
      return next(err);
    }
    User.findOne({email: reply.email}, function(err, user) {
      if (err) {
        return next(err);
      }
      if(user.email !== res.locals.currentUser.email) {
        req.flash('danger', '작성자가 아닙니다.');
        return res.redirect('back');
      }
      reply.remove(function(err){
        if(err) {
          return next(err);
        }
        res.redirect('back');
      });
    });
  });
});

module.exports = router;
