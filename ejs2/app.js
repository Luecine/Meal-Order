
var express = require('express');
var app = express();
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
var bodyParser = require('body-parser');
var url = require("url")
db_config.connect(conn);
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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
    secret : "kim",
    resave:false,
    saveUninitialized : true,
    store : sessionStore
}))

app.get('/', function (req, res) {
    const body = req.body
    const inputId = body.id
    console.log(body)

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

app.get('/registerFunc', function(req, res){
    let _url = req.url
    const queryData = url.parse(_url, true).query
    let inputId = queryData.id
    let inputPw = queryData.pswd1

    console.log(inputId,inputPw)
})


app.get('/duplicateFunc', function(req, res){

    const userInfo = []


    let duplicateMsg =""

    let sql = "SELECT userid, userPw from account";
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
                sql = `insert into ACCOUNT(userId, name, userPw, isManager) values (?, ?, ?,?)`

                conn.query(sql,[inputId,inputName, inputPw, 0])
        
            }  
        }
    })


})

app.get('/order', function(req,res){
    console.log(req.session.isLogined)
    res.render("order.ejs")
})

app.get('/review', function(req,res){
    console.log(req.session.isLogined)
    res.render("review.ejs")
})

app.get('/history', function(req,res){
    console.log(req.session.isLogined)
    res.render("history.ejs")
})





app.get('/main', function(req,res){
    console.log(req.session.isLogined);
    res.render("main.ejs", {user: req.session.userid})
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

  const userInfo = []

  

  const sql = "SELECT userid, userPw from account";
  conn.query(sql, function(err, rows, fields){
    if(err) throw err
    else{
        for(var i = 0; i < rows.length; i++){   
            userInfo.push( {userid:rows[i].userid, userPw: rows[i].userPw})
        }
        //console.log(userInfo)
        
        let flag = userInfo.some(function(element){
            if(element.userid === inputId && element.userPw === inputPw){
                return true;
            }
        })

        if(inputId === "") {
            res.render('login.ejs', {loginMsg:""})
        } else {
            if(flag){
                req.session.userid = inputId
                req.session.userPw = inputPw
                req.session.isLogined = true

                req.session.save(function(){
                    res.redirect('/main')
                })
            } else {
                res.render('login.ejs', {loginMsg:"등록되지 않은 ID 또는 PW입니다"})
            }  
        }

    }
    
  })

});

app.listen(3100, () => console.log('Server is running on port 3100...'));