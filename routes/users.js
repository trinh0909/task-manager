var express = require('express');
var router = express.Router();
const session = require('express-session');
const moment = require('moment');
const multer = require('multer');

function User(username, password,access,name, img) {
  this.username = username;
  this.password = password;
  this.access   = access;
  this.name   = name;
  this.img   = img;
}
var db=require('../model/connectdb');
var temp = null;
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
            var img = data[0].img
            var name = data[0].name
            var user = new User(username, pass,acc,name,img);
            req.session.user = user;
            res.redirect('/users/manager?page=1&loai=cv')
          }  
      
     })
  } 
});

//Thêm nhân viên
router.post('/nhanvien', function(req, res, next) {
  var a = req.body
  var sql = `insert into user(username, passwork, quyen, name, diachi, sdt, ngaysinh, img ) values("${a.username}", "${a.passwork}",${a.quyen}, "${a.name}","${a.diachi}","${a.sdt}","${a.ngaysinh}","${a.img}")`
  db.query(sql,function(err,result){
    if (err) {
      console.error('Error executing query: ' + err.stack);
      // Hiển thị thông báo cảnh báo nếu có lỗi
      res.send("Lỗi do nhập thông tin Email chưa chính xác!")

      return;
    }
    res.redirect("http://localhost:3000/users/manager?page=1&loai=nv")
  })
});
//Xóa nhân viên
router.get('/xoa/:id', function(req, res, next) {
  var page = req.query['page'];
  var loai = req.query['loai'];
  var sql = `delete from user where username="${req.params.id}"`;
  db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect(`http://localhost:3000/users/manager?page=${page}&loai=${loai}`);    
  });
});

// Sửa nhân viên
router.get('/sua/:id', function(req, res, next) {
  var id = req.params.id;
  //res.send(id)
   var sql = `select * from user where username = '${id}'`
  
   db.query(sql, (err,data)=>{
    temp = data
    res.redirect('/users/updateNV')
   // res.render('udateNV.ejs',{data : data});
   })
});
router.get('/updateNV', function(req, res, next) {
  if(temp != null) {
    res.render('udateNV.ejs',{data : temp});
  }
  else res.send("không có dữ liệu")
});

//Lưu ảnh

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Tuyến đường để tải ảnh lên server
router.post('/uploadImage', upload.single('img'), function(req, res, next) {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Lấy đường dẫn của ảnh đã tải lên
  var imagePath = '/images/' + req.file.filename;
  // Trả về đường dẫn của ảnh đã tải lên để sử dụng trong mã JavaScript
  res.send(imagePath);
});

router.post('/update', function(req, res, next) {
  var a = req.body;
  var sql = `UPDATE user SET username = "${a.username}", passwork = "${a.passwork}", quyen = ${a.quyen}, name = "${a.name}", diachi = "${a.diachi}", sdt = "${a.sdt}", ngaysinh = "${a.ngaysinh}", img = "${a.img}" WHERE username = '${a.username}'`;
  
  db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect("http://localhost:3000/users/manager?page=1&loai=nv");
  });
});

//Cập nhật thông tin cá nhân
router.post('/updateProfile', function(req, res, next) {
  var a = req.body;
  var sql = `UPDATE user SET username = "${a.username}", passwork = "${a.passwork}", quyen = ${a.quyen}, name = "${a.name}", diachi = "${a.diachi}", sdt = "${a.sdt}", ngaysinh = "${a.ngaysinh}" WHERE username = '${a.username}'`;
  
  db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect("http://localhost:3000/users/manager?page=1&loai=tt");
  });
});
router.post('/updateImage', function(req, res, next) {
  var a = req.body;
  var sql = `UPDATE user SET img = "${a.img}" WHERE username = '${a.username}'`;
  
  db.query(sql, function(err, result) {
    if (err) {
      console.log('Lỗi khi cập nhật ảnh trong cơ sở dữ liệu:', err);
      res.status(500).send('Lỗi khi cập nhật ảnh trong cơ sở dữ liệu');
    } else {
      console.log('Cập nhật ảnh thành công trong cơ sở dữ liệu');
      res.status(200).send('Cập nhật ảnh thành công trong cơ sở dữ liệu');
    }
  });
});

//Thêm khách hàng
router.post('/khachhang', function(req, res, next) {
  var a = req.body
  var sql = `insert into customer(name, phone, ngaysinh, address, trangthai, order_project) values("${a.name}", "${a.phone}",${a.ngaysinh}, "${a.address}","${a.trangthai}","${a.order}")`
  db.query(sql,function(err,result){
    if (err) {
      console.error('Error executing query: ' + err.stack);
      // Hiển thị thông báo cảnh báo nếu có lỗi
      res.send("Lỗi do nhập thông tin chưa chính xác!")

      return;
    }
    res.redirect("http://localhost:3000/users/manager?page=3&loai=cv")
  })
});
//Xóa KH
router.get('/xoaKH/:id', function(req, res, next) {
  var page = req.query['page'];
  var loai = req.query['loai'];
  var sql = `delete from customer where id="${req.params.id}"`;
  db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect(`http://localhost:3000/users/manager?page=${page}&loai=${loai}`);    
  });
});


router.get('/manager', function(req, res, next) {
  if (req.session.user) {
    var id = req.query['page']
    var loai = req.query['loai']
    var data1 = []
    var sql = ''
    if(req.session.user.access == 1 ){
     
      if(loai == 'cv'){
          if( id == 3)
            sql = `select * from customer where trangthai = 0` ;
        else if(id == 2)
          sql = `select * from customer where trangthai = 2` 
        else 
         sql = `select * from customer where trangthai = 1` 
  }
   if(loai == 'nv') {
      if(id == 1){
        sql = `SELECT * FROM user JOIN access ON user.quyen = access.id WHERE id <> 1` 
      }
      else if(id == 2) {
        sql = `SELECT * FROM user JOIN access ON user.quyen = access.id where quyen = 3` 
      }
      else if(id == 3) {
        sql = `SELECT * FROM user JOIN access ON user.quyen = access.id where quyen = 2` 
      }
  } 
  else if(loai == 'tt'){
    if(req.session.user){
      var username = req.session.user.username
      sql = `select * from user where username = '${username}'`
    }
   
  }
}
   else if(req.session.user.access == 2){
    if(loai == 'cv'){
      if( id == 1)
        sql = `select * from customer where trangthai = 0`
    else if(id == 2) 
      sql = `select * from customer where trangthai = 1` 
  }
  } 
  db.query(sql,(err,data)=>{
    if(err) throw err;
    data1 = data
    if(data.length !=0){
      for(let e of data){
        e.ngaysinh = moment(e.ngaysinh).format('DD-MM-YYYY')
      }
    }
    // res.send(data)
    res.render('manager.ejs',{id:id,loai:loai,data:data});
  } )
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
router.get('/logout',(req,res)=>{
  if(req.session.user){
    req.session.destroy()
    res.redirect('http://localhost:3000/')
  }
})




module.exports = router;

