const express = require('express');
const app = express();
const db_config = require(__dirname + '/config/database.js');
const conn = db_config.init();

const bodyParser = require('body-parser');

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const mysql = require("sync-mysql");


const connection = new mysql({
    host: "localhost",
    user: "root",
    password: "",
    database: "clerkfree",
});



var url = require("url")

var session=require('express-session')
var mySqlStore= require('express-mysql-session')(session)
let router = express.Router();

var options = {
    host : 'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'clerkfree'
}

var sessionStore = new mySqlStore(options)


app.use(session({
    secret : "kim",
    resave:false,
    saveUninitialized : true,
    store : sessionStore
}))



//매니저 메뉴 페이지
app.get('/manager_menu', function (req, res) {
    res.render('manager_menu.ejs');
    //res.send('ROOT');
});

//시작 페이지
app.get('/first', function (req, res) {
    res.render('first.ejs');
});

//메뉴편집 페이지 edit_menu
app.get('/edit_menu',function(req,res){
    let sql = 'SELECT * FROM ITEM';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('edit_menu.ejs', {ITEM : rows});
    });
});

//리뷰확인 페이지 review_confirm
app.get('/review_confirm',function(req,res){
    let sql = 'SELECT * FROM REVIEW';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('review_confirm.ejs', {review : rows});
    });
});

//매출량 페이지 sale
app.get('/sale',function(req,res){
    //매출량 
    let sql = 'SELECT * FROM FINANCE';

    conn.query(sql, function (err, rows, fields) {
        if(err) {
            console.log('query is not excuted. select fail...\n' + err);
        }
        else{
            let total=0;
            for(let i=0;i<rows.length;i++){
                total+=parseInt(rows[i].totalProfit);
            }

            res.render('sale.ejs', {FINANCE : rows, sell_total : total});
        }
    });
});

//선호도 페이지 preference
/*
app.get('/19',function(req,res){
    var sql = 'SELECT * FROM BOARD';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('19.ejs', {data : rows});
    });
});*/

//삭제 기능
app.get('/delete/:menu', function (req, res) {
    conn.query('delete from ITEM where name=?', [req.params.menu], function () {
        res.redirect('/edit_menu')
      });
});

//추가 기능
app.post('/edit_menu', function (req, res) {
    const body = req.body
    conn.query('insert into ITEM (name, price) values (?, ?);', [
      body.menu,
      body.price
    ], function() {
      res.redirect('/edit_menu')
    });
});


app.get('/', function (req, res) {
    
    res.send("root")
    //res.render('login.ejs');
});


app.get('/registerPage', function (req, res) {
    let duplicateMsg=""
    res.render('register.ejs',{duplicateMsg:""})
});


app.post('/gotoRegister', function(req,res){
    res.redirect("/registerPage");
})


app.get('/duplicateFunc', function(req, res){

    const userInfo = []


    let duplicateMsg =""

    let sql = "SELECT managerid, managerPw FROM Manager";
    // const body = req.body
    // const inputId = body.id
    // const inputPw = body.pw
    // console.log(inputId)
    
    let _url = req.url;
    let queryData = url.parse(_url, true).query
    let inputId = queryData.id
    let inputPw = queryData.pswd1
    let inputName = queryData.name
    console.log(inputId,inputPw,inputName)


    conn.query(sql, function(err, rows, fields){
        if(err) throw err
        for(var i = 0; i < rows.length; i++){   
             userInfo.push( {userid:rows[i].userid, userPw: rows[i].userPw})
        }
    
       // console.log(userInfo)

      
        let flag = userInfo.some(function(element){
            if(element.userid === inputId) return true
        })

        //console.log("!:" + userInfo);


        if(inputId === "") {
            res.render('register.ejs', {duplicateMsg:""})
        } else {
            if(flag){
                res.render('register.ejs', {duplicateMsg:"중복되는 ID입니다."})
            } else {
                res.render('register.ejs', {duplicateMsg:"회원가입되었습니다."})
                sql = `insert into Manager(managerId, name, managerPw) values (?, ?, ?)`

                conn.query(sql,[inputId,inputName, inputPw])
        
            }  
        }
    })


})


app.get('/login', function(req,res) {
    let loginMsg=""
    res.render('login.ejs', {loginMsg:loginMsg});
})

app.post('/loginFunc', function (req, res) {

  const body = req.body
  const inputId = body.id
  const inputPw = body.pw
//  console.log(inputId,inputPw)

  const managerInfo = []

  

  const sql = "SELECT managerid, managerPw FROM Manager";
  conn.query(sql, function(err, rows, fields){
    if(err) throw err
    else{
        for(var i = 0; i < rows.length; i++){   
            managerInfo.push( {managerid:rows[i].managerid, managerPw: rows[i].managerPw})
        }
        
        console.log(managerInfo)

        let flag = managerInfo.some(function(element){
            if(element.managerid === inputId && element.managerPw === inputPw){
                return true;
            }
        })

        console.log(flag)

        if(inputId === "") {
            res.render('login.ejs', {loginMsg:""})
        } else {
            if(flag){
                req.session.managerid = inputId
                req.session.managerPw = inputPw
                req.session.isLogined = true

                console.log(inputId, inputPw)
                req.session.save(function(){
                    res.redirect('/manager_menu')
                })
            } else {
                res.render('login.ejs', {loginMsg:"등록되지 않은 ID 또는 PW입니다"})
            }  
        }

    }
    
  })

});




//이미지 경로
app.use(express.static('./static'));

app.listen(3000, () => console.log('Server is running on port 3000...'));