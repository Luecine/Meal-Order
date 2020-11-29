var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mysql = require('sync-mysql');
const url = require('url');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./static'));

const connection = new mysql({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'clerkfree'
})


app.get('/', function (req, res) {
  let result = connection.query(`SELECT R.userId, R.content, R.rate
  FROM REVIEW AS R `);
  //세션정보에 userNum 넘어오면 WHERE문에 A.userNum = H.userNum 추가
  let end = result.length;
  let userIdjs = [];
  let contentjs = [];
  let ratejs = [];
  let i = 0;
  while (i < end) {
    userIdjs[i] = result[i].userId;
    contentjs[i] = result[i].content;
    ratejs[i] = result[i].rate;
    i++;
  }
  res.render("Review", { length: end, userId: userIdjs, content: contentjs, rate: ratejs});
});

app.get('/viewHistory', function (req, res) {
    let result = connection.query(`SELECT DISTINCT H.date, R.content, C.totalPrice, I.name
    FROM HISTORY AS H, REVIEW AS R, CART AS C, ORDER_ITEM_DETAIL AS O, ITEM AS I
    WHERE H.historyNum = R.historyNum
    AND H.userNum = C.userNum
    AND O.cartNum = C.cartNum
    AND I.itemNum = O.itemNum`);
    //세션정보에 userNum 넘어오면 WHERE문에 A.userNum = H.userNum 추가
    let end = result.length;
    let datejs = [];
    let contentjs = [];
    let pricejs = [];
    let namejs = [];
    let i = 0;
    while (i < end) {
      datejs[i] = result[i].date;
      contentjs[i] = result[i].content;
      pricejs[i] = result[i].price;
      namejs[i] = result[i].name;
      i++;
    }
    res.render("OrderHistory", { length: end, date: datejs, content: contentjs, price: pricejs, name:namejs});
});

app.get('/writeReview', function (req, res) {
  
  res.render("WriteReview");
});

app.listen(3000, () => console.log('Server is running on port 3000...'));


/*

app.get("/", (req, res) => {
  connection.query(`DELETE FROM temp_cart`);
  let result = connection.query(`SELECT name, price FROM item`);
  let end = result.length;
  let namejs = [];
  let pricejs = [];
  let i = 0;
  while (i < end) {
    namejs[i] = result[i].name;
    pricejs[i] = result[i].price;
    i++;
  }
  res.render("orderTemplate", { length: end, name: namejs, price: pricejs });
});

app.get("/purchase", (req, res) => {
  let _url = req.url;
  let queryData = url.parse(_url, true).query;

  let result1 = connection.query(`SELECT name, price FROM item`);
  let end = result1.length;
  let i = 0;
  while (i < end) {
    let result_name = result1[i].name;
    let result_price = result1[i].price;
    let querydata = queryData.index[i];

    let result1_result = connection.query(
      `INSERT INTO temp_cart(name, price, number) VALUES (?,?,?)`,
      [result_name, result_price, querydata]
    );
    i++;
  }

  result2 = connection.query(`SELECT name, price, number FROM temp_cart`);
  let end2 = result2.length;
  let namejs2 = [];
  let pricejs2 = [];
  let numberjs2 = [];
  let totaljs2 = 0;
  let j = 0;
  while (j < end) {
    namejs2[j] = result2[j].name;
    pricejs2[j] = result2[j].price;
    numberjs2[j] = result2[j].number;
    totaljs2 += result2[j].price * result2[j].number;
    j++;
  }

  console.log(totaljs2);

  res.render("purchaseTemplate", {
    length: end2,
    name: namejs2,
    number: numberjs2,
    total: totaljs2,
  });
});

//쿼리로 DELETE FROM `temp_cart추가해서 초기화(지금은 db저장된걸 확인해야되서 안함)

app.listen(3000);
*/