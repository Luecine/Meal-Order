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

var total=0;

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
    var sql = 'SELECT * FROM ITEM';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('edit_menu.ejs', {ITEM : rows});
    });
});

//리뷰확인 페이지 review_confirm
app.get('/review_confirm',function(req,res){
    var sql = 'SELECT * FROM REVIEW';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('review_confirm.ejs', {review : rows});
    });
});

//매출량 페이지 sale
app.get('/sale',function(req,res){
    var sql = 'SELECT * FROM FINANCE';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('sale.ejs', {FINANCE : rows, sell_total : total});
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



//이미지 경로
app.use(express.static('./static'));

app.listen(3000, () => console.log('Server is running on port 3000...'));