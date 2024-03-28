var express = require('express');
var router = express.Router();
const session = require('express-session');
function User(username, password,access) {
  this.username = username;
  this.password = password;
  this.access   = access;
}
var db=require('../model/connectdb');
// router.use(session({
//   secret: 'mySecret', // Key bí mật để mã hóa session (có thể được thay đổi)
//   resave: false,
//   saveUninitialized: true
// }));
// router.use((req, res, next) => {
//   res.locals.session = req.session;
//   next();
// });
// router.get('/temp',(req,res)=>{
//   var sql = `select * from user`
//   db.query(sql,(err,data)=>{
//     if(err) throw err
//     res.send(data)
//   })
// })

router.post('/login', function(req, res, next) {
  var a = 0
  if (!req.session.user) {
     var username = req.body.username;
     var pass = req.body.pass;
     var pass = req.body.pass;
    
     
     var sql = `select * from user where username = '${username}' and passwork = '${pass}'`
     db.query(sql,(err,data)=>{
       if(err) throw err
        if(data.length === 0)
          {
           
            res.redirect('http://localhost:3000/');
          }
          else{
            var acc = data[0].quyen
            var user = new User(username, pass,acc);
            req.session.user = user;
            res.redirect('/users/manager/1')
          }  
      
     })
  } 
});
router.get('/manager', function(req, res, next) {
  if (req.session.user) {
    res.render('manager.ejs',{}); // Render template 'manager.ejs' khi session user đã tồn tại
  } 
});
router.get('/manager/:id', function(req, res, next) {
  if (req.session.user) {
    var a = req.params.id
    res.render('manager.ejs',{lc:a}); // Render template 'manager.ejs' khi session user đã tồn tại
  } 
});
router.get('/login', function(req, res, next) {
  if (req.session.user) {
    res.send('dd')
   // res.render('manager.ejs',{info:'yes'}); // Render template 'manager.ejs' khi session user đã tồn tại
  } 
  else{
    res.redirect('http://localhost:3000/');
  }
});

module.exports = router;
