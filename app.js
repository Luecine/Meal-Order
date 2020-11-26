const express = require('express');
const app = express();
//const db_config = require(__dirname + '/config/database.js');
//const conn = db_config.init();

const bodyParser = require('body-parser');

//db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//root페이지
app.get('/15', function (req, res) {
    res.render('15.ejs');
    //res.send('ROOT');
});

/*
//list 페이지
app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM BOARD';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('list.ejs', {list : rows});
    });
});

app.get('/write', function (req, res) {
    res.render('write.ejs');
});

app.post('/writeAf', function (req, res) {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO BOARD VALUES(?, ?, ?, NOW())';
    var params = [body.id, body.title, body.content];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list');
    });
});
*/

//메뉴편집 페이지
app.get('/16',function(req,res){
    var sql = 'SELECT * FROM REVIEW';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('16.ejs', {review : rows});
    });
    
});

//리뷰확인 페이지
app.get('/17',function(req,res){
    var sql = 'SELECT * FROM REVIEW';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('17.ejs', {review : rows});
    });
});

//데이터 페이지
app.get('/18',function(req,res){
    var sql = 'SELECT * FROM BOARD';    
    conn.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('18.ejs', {data : rows});
    });
});


app.listen(3000, () => console.log('Server is running on port 3000...'));