var express = require('express');
var router = express.Router();
var Memo = require('../models/Memo');

/* GET home page. */
router.get('/', function(req, res, next) {
  Memo.find({}, function(err, memos) {    //검색조건이 {}없기에 모든 메모를 가져온다.
    if(err) {
      return next(err);
    }
    res.render('memo/list', {memos : memos});
  });
});

router.post('/', function(req, res, next) {
  //글 작성 완료시 처리
  console.log('-----------------');
  console.log(req);         // request에 결과가 잘 왔는지 확인
  console.log('-----------------');

  var memo = new Memo({     // 메모를 만들어서 request값을 대입
    name : req.body.name,
    content : req.body.content
  });
  memo.save(function(err, resultMemo){    // MongoDB에 저장
    if(err) {                             // error가 나면 err에 변수값이 지정된다
      return next(err);                   //따라서 에러시 next로 처리
    }
    res.redirect('/memo');                //에러가 아니라면 localhost:3000/memo로 이동
  });
});

router.get('/new', function(req, res, next) {
  //메모 작성
  res.render('memo/new', {memo: {}});
});

router.get('/:id', function(req, res, next) {
  //post가 아닌 get 전송이라 req.params로 접근해야합니다.
  Memo.findById(req.params.id, function(err, memo){
    if(err) {
      return next(err);
    }
    res.render('memo/view', {memo : memo});
  });
});

router.get('/:id/edit', function(req, res, next) {
  Memo.findById(req.params.id, function(err, memo){
    if(err) {
      return next(err);
    }
    res.render('memo/new', {memo : memo});
  });
});

router.put('/:id', function(req, res, next) {
  Memo.findById(req.params.id, function(err, memo){
    if(err) {
      return next(err);
    }
    memo.name = req.body.name;
    memo.content = req.body.content;
    memo.save(function(err){
      if(err) {
        return next(err);
      }
      res.render('memo/view', {memo : memo});
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Memo.findOneAndRemove({_id: req.params.id}, function(err){
    if(err) {
      return next(err);
    }
    res.redirect('/memo');
  });
});


module.exports = router;
