var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user)
  res.render('index', { info: 'no' });
  else res.render('index', { info: 'yes' });
});

module.exports = router;
