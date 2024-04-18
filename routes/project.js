// Trong file './routes/project.js'
const express = require('express');
const router = express.Router();
var db=require('../model/connectdb');
const session = require('express-session');
const moment = require('moment');
const multer = require('multer');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truongmaitrinh0909@gmail.com',
        pass: 'cgfn hume wuyf pahl'
    }
})
// Định nghĩa các route và middleware cho router này
router.get('/mail', function(req, res) {
     // Thiết lập các tùy chọn email
     let mailOptions = {
        from: 'truongmaitrinh0909@gmail.com',
        to: 'hyzaxx@gmail.com',
        subject: 'Test Email',
        text: 'phương ngân là con heo heheeee'
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Failed to send email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully.');
        }
    });
});
router.post('/',(req,res) =>{
    var id = req.body.id
    var  sql = `UPDATE customer SET trangthai = 1 WHERE id = ${id}`
    db.query(sql,(err,result)=>{
        if(err) throw err
         if(result.affectedRows > 0)
           { 
            var name = req.body.orderpj
            var BD = req.body.ngayBD
            BD = moment(BD).format('YYYY-MM-DD');
            var KT = req.body.ngayKT
            KT = moment(KT).format('YYYY-MM-DD')
            var ds =  req.body.motapj
            if(req.session.user){
                var us = req.session.user.username
                var sql2 = `INSERT INTO projects (namePJ, description, ngayBD, ngayKT,id_customer,id_user) VALUES ('${name}', '${ds}', '${BD}', '${KT}','${id}','${us}');`
                db.query(sql2,(err, data)=>{
                    if(err) throw err;
                    res.redirect('/users/manager?page=1&loai=cv');
                })
            }
            // var us = req.session.user.username
            // var sql2 = `INSERT INTO projects (namePJ, description, ngayBD, ngayKT,id_customer,id_user) VALUES ('${name}', '${ds}', '${BD}', '${KT}','${id}','${us}');`
           else
             res.send('scsi');
           }
          
       
      })
    // var name = req.body.namepj
    // var phone = req.body.phonerj

    // var sql = 'INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')';
  
});
router.post('/process',(req,res)=>{
     var username = req.body.nv
     var job = req.body.idpro
     var startjob = req.body.ngayBD
     var endjob = req.body.ngayKT 
     var idcv = req.body.idCV 
     var idkh = req.body.idkh 
    //var username = 'hyzaxx@gmail.com'
     // Thiết lập các tùy chọn email
     let mailOptions = {
        from: 'truongmaitrinh0909@gmail.com',
        to: username,
        subject: 'Mail nhận công việc',
        text: `xin chào, tôi là quản lý tôi đã giao cho bạn một công việc là ${job}. thời gian diễn ra từ ${startjob} đến ${endjob}
        \n\nXin vui lòng thực hiện công việc đúng thời hạn, chi tiết khách hàng xin vui lòng xem trên website của công ty.\n\nTrân trọng, ${req.session.user.name}`
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
           // res.redirect('/users/manager?page=1&loai=cv')
           // console.log(error);
            res.send('Failed to send email.');
        } else { 
            var sql = `UPDATE projects SET process = 1 WHERE id = ${idcv}` 
            db.query(sql,(err,data)=>{
                if(err) throw err;
                //res.send(data)
                if(data.affectedRows > 0){
                    var sql2 = `INSERT INTO processing (id_user, id_projects) VALUES ('${username}','${idkh}')`
                    db.query(sql2,(err,result)=>{
                        if(err) throw err;
                        res.redirect('/users/manager?page=1&loai=cv');
                    })
                }
                else res.send('không thành công')
            })
           // res.send(idcv)
           // res.redirect('/users/manager?page=1&loai=cv')
           // console.log('Email sent: ' + info.response);
            //res.send('Email sent successfully.');
        }
    });
    //res.send(username)
})
// Xuất router để có thể sử dụng trong file khác
module.exports = router;