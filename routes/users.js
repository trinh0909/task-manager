var express = require('express');
var router = express.Router();
const session = require('express-session');
const moment = require('moment');
const multer = require('multer');
const server = require('http').Server(router);
const fs = require('fs');
const io = require('socket.io')(server);
io.on("connection",function(socket){
    console.log("connect")
})
function User(username, password,access,name, img) {
  this.username = username;
  this.password = password;
  this.access   = access;
  this.name   = name;
  this.img   = img;
}
var data2 = null;
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

router.get('/forgotpassword', function(req, res) {
  res.render('forgotpassword');
});
const nodemailer = require('nodemailer');
//======================================================================================================================================================
router.post('/forgotpasswd', function(req, res, next) {
  const email = req.body.email; // Lấy giá trị địa chỉ email từ yêu cầu POST
  var sql = `SELECT * FROM user WHERE username="${email}"`;
  db.query(sql,function(err,result){
    if (err) {                 
      console.error(err); 
      res.render('forgotpassword');
    }    
    if (result && result.length > 0) {

      const otp = Math.floor(1000 + Math.random() * 9000); // Tạo mã OTP ngẫu nhiên từ 1000 đến 9999

      // Tạo một transporter
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'truongmaitrinh0909@gmail.com', // Địa chỉ email của bạn
          pass: 'cgfn hume wuyf pahl' // Mật khẩu email của bạn
        }
      });
    
      // Tạo một email
      let mailOptions = {
        from: 'lekimngan22102002@gmail.com', // Địa chỉ email của bạn
        to: email, // Địa chỉ email của người nhận (lấy từ yêu cầu POST)
        subject: 'MÃ OTP',
        text: 'Xin chào, mã OTP của bạn là ' + otp
      };
    
      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Internal Server Error');
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Email sent successfully');        
      });
       res.render('sendotp',{ otp: otp, username:email });

      } else {                
        return res.render('/forgotpassword');
      }
  })  
});

router.post('/sendotp', function(req, res) {
  const enteredOTP = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4;
  const receivedOTP = req.body.otp; // Đây là mã OTP nhận được, bạn cần thay đổi giá trị này bằng mã OTP thực tế bạn nhận được
  const username = req.body.username;
  if (enteredOTP === receivedOTP) {
    res.render('reset', {username: username});
  } else {
    // Xử lý khi mã OTP không khớp
    res.send('Mã OTP không hợp lệ');
  }
});

router.post('/reset', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;  
  var sql = `UPDATE user SET passwork = "${password}" WHERE username = "${username}"`;
  db.query(sql,function(err,result){
    if (err) {                 
      console.error(err);       
    }    
    res.redirect('http://localhost:3000/');
  })  
});

//======================================================================================================================================================
//Thêm nhân viên
router.post('/nhanvien', function(req, res, next) {
  var a = req.body
  var username = a.username;   
  var password = a.passwork;
  var sql = `insert into user(username, passwork, quyen, name, diachi, sdt, ngaysinh, img ) values("${a.username}", "${a.passwork}",${a.quyen}, "${a.name}","${a.diachi}","${a.sdt}","${a.ngaysinh}","${a.img}")`
  db.query(sql,function(err,result){
    if (err) {
      console.error('Error executing query: ' + err.stack);
      // Hiển thị thông báo cảnh báo nếu có lỗi
      res.send("Lỗi do nhập thông tin Email chưa chính xác!")

      return;
    }

    // Tạo một transporter
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'truongmaitrinh0909@gmail.com', // Địa chỉ email của bạn
        pass: 'cgfn hume wuyf pahl' // Mật khẩu email của bạn
      }
    });
  
    // Tạo một email
    let mailOptions = {
      from: 'lekimngan22102002@gmail.com', // Địa chỉ email của bạn
      to: username, // Địa chỉ email của người nhận (lấy từ yêu cầu POST)
      subject: 'Thông báo cấp tài khoản',
      html: 'Bạn đã được cấp tài khoản! Vui lòng truy cập vào website để đăng nhập!  <br> Username: '  + username + ' <br> Password: ' + password
    };
  
    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Email sent: ' + info.response);
      return res.status(200).send('Email sent successfully');        
    });

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
// Tuyến đường để tải ảnh lên server
router.post('/uploadImage1', upload.single('img1'), function(req, res, next) {
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
//Cập nhật ảnh của profile
router.post('/updateImage/:id', function(req, res, next) {
  var id = req.params.id;
  var newImg = req.body.img1; // Lấy giá trị mới từ ô input

  var sql = `UPDATE user SET img = "${newImg}" WHERE username ="${id}"`;

  db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect("http://localhost:3000/users/manager?page=1&loai=tt");
  });
});

//Thêm khách hàng
router.post('/khachhang', function(req, res, next) {
  var a = req.body
  var ngaysinh = new Date(a.ngaysinh1).toISOString().slice(0, 19).replace('T', ' ');
  var sql = `insert into customer(name, phone, ngaysinh, address, trangthai, order_project) values("${a.name}", "${a.phone}","${ngaysinh}", "${a.address}","${a.trangthai}","${a.order}")`
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
          sql = `select * from customer where trangthai = 0`;
        else if(id == 2)
          sql = `SELECT *,customer.name AS customer_name FROM projects 
        JOIN processing ON projects.id = processing.id_projects AND projects.process <> 0
         JOIN customer ON projects.id_customer = customer.id 
         JOIN user WHERE processing.id_user = user.username;` 
        else 
         sql = `SELECT * FROM projects JOIN customer ON projects.id_customer = customer.id AND projects.process = 0` 
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
  else if(loai == 'chat'){
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
      else if(id == 2) {
        var username = req.session.user.username
        sql = `SELECT * FROM projects JOIN customer ON projects.id_customer = customer.id  where projects.id_user = '${username}'` 
        
      }
  }
  else if(loai == 'tt'){
    if(req.session.user){
      var username = req.session.user.username
      sql = `select * from user where username = '${username}'`
    }
  }
  else if(loai == 'chat'){
    if(req.session.user){
      var username = req.session.user.username
      sql = `select * from user where username = '${username}'`
    }
  }
  } 
  else if(req.session.user.access == 3){
    if(loai == 'cv'){
      if(id == 1){
        var username = req.session.user.username
        sql = `SELECT * FROM projects JOIN processing ON projects.id = processing.id_projects AND processing.id_user='${username}' AND projects.process = 1 JOIN customer ON projects.id_customer = customer.id`
      }
      else if(id == 2){
        var username = req.session.user.username
        sql = `SELECT * FROM projects JOIN processing ON projects.id = processing.id_projects AND processing.id_user='${username}' AND projects.process = 3 JOIN customer ON projects.id_customer = customer.id`
      
      }
    }
  }
   if(loai == 'tt'){
    if(req.session.user){
      var username = req.session.user.username
      sql = `select * from user where username = '${username}'`
    }
  }

  
  db.query(sql,(err,data)=>{
    var dt2 = null;
    var sql2;
    if(err) throw err;
    data1 = data
    if(data.length !=0){
      for(let e of data){
        e.ngaysinh = moment(e.ngaysinh).format('DD-MM-YYYY')
      }
    }
    if(loai == "cv" && id == 1  || loai == "cv" && id == 2){
      for(let e of data){
        e.ngayBD = moment(e.ngayBD).format('DD-MM-YYYY')
        e.ngayKT = moment(e.ngayKT).format('DD-MM-YYYY')
      }
      sql2 = "select * from user where quyen = 3"
      db.query(sql2,(err, result)=>{
        if(err) throw err;
        res.render('manager.ejs',{id:id,loai:loai,data:data, result: result});
      })
    }
    else {
      res.render('manager.ejs',{id:id,loai:loai,data:data});
    }
    
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
router.get('/job',(req,res)=>{
  if(req.session.user){
    //req.session.destroy()
    res.render('job')
  }
})




module.exports = router;

