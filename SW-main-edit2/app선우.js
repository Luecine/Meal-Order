var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mysql = require("sync-mysql");
const url = require("url");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./static"));
app.use(bodyParser.urlencoded({ extended: false }));

const connection = new mysql({
  host: "localhost",
  user: "root",
  password: "",
  database: "clerkfree",
});

app.get("/review", function (req, res) {
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
  res.render("Review", {
    length: end,
    userId: userIdjs,
    content: contentjs,
    rate: ratejs,
  });
});

app.get("/viewHistory", function (req, res) {
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
  let totalpricejs = [];
  let namejs = [];
  let i = 0;
  while (i < end) {
    datejs[i] = result[i].date;
    contentjs[i] = result[i].content;
    totalpricejs[i] = result[i].totalPrice;
    namejs[i] = result[i].name;
    i++;
  }
  res.render("OrderHistory", {
    length: end,
    date: datejs,
    content: contentjs,
    totalprice: totalpricejs,
    name: namejs,
  });
});

app.get("/writeReview", function (req, res) {
  let result = connection.query(`SELECT historyNum
  FROM HISTORY
  WHERE userNum = 1 `);
  //세션으로 userNum넘기면 이부분도 수정 필요

  let end = result.length;
  let historyNumjs = [];
  let i = 0;
  while (i < end) {
    historyNumjs[i] = result[i].historyNum;
    i++;
  }
  res.render("WriteReview", { length: end, historyNum: historyNumjs });
});

app.post("/insertReview", function (req, res) {
  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  var rate = req.body.rate;
  var historyNum = req.body.historyNum;
  var content = req.body.content;
  var userid = "firstid";
  var usernum = 1;
  try {
    let result1_result = connection.query(
      `INSERT INTO REVIEW(userId, userNum, historyNum, content, date, rate) VALUES (?,?,?,?,NOW(),?)`,
      //userId와 userNum은 session에서 넘어온 정보를 가지고 넣어야함
      [userid, usernum, historyNum, content, rate]
    );
  } catch (exception) {
    console.log("오류 발생");
    console.log(exception);
  }

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
  res.render("Review", {
    length: end,
    userId: userIdjs,
    content: contentjs,
    rate: ratejs,
  });
});

app.listen(3000, () => console.log("Server is running on port 3000..."));
