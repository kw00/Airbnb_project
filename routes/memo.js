var express = require('express'),
    multer  = require('multer'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    upload = multer({ dest: 'tmp' }),
    Memo = require('../models/memo'),
    Comment = require('../models/comment');
var router = express.Router();
var mimetypes = {
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png"
};

/* GET posts listing. */
router.get('/', function(req, res, next) {
  Memo.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('memo/index', {memos: docs});
  });
});

router.get('/new', function(req, res, next) {
  res.render('memo/new');
});

router.post('/', upload.array('photos'), function(req, res, next) {
  var dest = path.join(__dirname, '../public/images/');
  var images = [];
  if (req.files && req.files.length > 0) {
    _.each(req.files, function(file) {
      var ext = mimetypes[file.mimetype];
      if (!ext) {
        return;
      }
      var filename = file.filename + "." + ext;
      fs.renameSync(file.path, dest + filename);
      images.push("/images/" + filename);
    });
  }

  var memo = new Memo({
    title: req.body.title,
    email: req.body.email,
    images: images,
    content: req.body.content
  });

  memo.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/memo');
  });
});

router.get('/:id', function(req, res, next) {
  Memo.findById(req.params.id, function(err, memo) {
    if (err) {
      return next(err);
    }
    Comment.find({memo: memo.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('memo/view', {memo: memo, comments: comments});
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    memo: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    Memo.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/memo/' + req.params.id);
    });
  });
});

module.exports = router;
