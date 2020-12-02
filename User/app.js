var express = require("express");
var app = express();
var db_config = require(__dirname + "/config/database.js");
var conn = db_config.init();
var bodyParser = require("body-parser");
var url = require("url");
var datepackage = require("date-utils");
var session = require("express-session");
var mySqlStore = require("express-mysql-session")(session);
let router = express.Router();

const mysql = require("sync-mysql");

db_config.connect(conn);

const connection = new mysql({
  host: "localhost",
  user: "root",
  password: "",
  database: "clerkfree",
});

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "clerkfree",
}; //using two options, one for sync, another for async

const { Iamporter, IamporterError } = require("iamporter");

const iamporter = new Iamporter({
  apiKey: "8091106363283840",
  secret:
    "WqZBo6BcawklAYEekV6HKwM50jpY8cZ4DZF26hfgNzBnygBScHAWen2eGscOFcTjbzliQAyEaa1IqDBC",
});
var credittotal;

var sessionStore = new mySqlStore(options);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("image"));

app.use(
  session({
    secret: "kim",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);
//Presets

//start page
app.get("/", function (req, res) {
  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  req.session.bistroid = queryData.id;
  console.log(req.session.bistroid);
  res.render("root.ejs");
});

//login page
app.get("/login", function (req, res) {
  let loginMsg = "";
  res.render("login.ejs", { loginMsg: loginMsg });
});

//after hitting 'login'
app.post("/loginFunc", function (req, res) {
  const body = req.body;
  const inputId = body.id;
  const inputPw = body.pw;
  //  console.log(inputId,inputPw)

  const userInfo = [];

  const sql = "SELECT userid, userPw, name from account";
  conn.query(sql, function (err, rows, fields) {
    if (err) throw err;
    else {
      for (var i = 0; i < rows.length; i++) {
        userInfo.push({ userid: rows[i].userid, userPw: rows[i].userPw, name : rows[i].name });
      }
      console.log(userInfo)

      let flag = userInfo.some(function (element) {
        if (element.userid === inputId && element.userPw === inputPw) {
          return true;
        }
      }); //check if there's a match

      let userIndex = userInfo.findIndex(function(element){
        if (element.userid === inputId && element.userPw === inputPw) {
          return true;
        }
      })



      if (inputId === "") {
        res.render("login.ejs", { loginMsg: "" });
      } else {
        if (flag) {
          req.session.userid = userInfo[userIndex].userid
          req.session.userPw = userInfo[userIndex].userPw
          req.session.name = userInfo[userIndex].name
          console.log(userInfo[userIndex].name)
          req.session.isLogined = true;

          req.session.save(function () {
            res.redirect("/main");
          });
        } else {
          res.render("login.ejs", {
            loginMsg: "등록되지 않은 ID 또는 PW입니다",
          });
        }
      }
    }
  });
});

//after hitting 'register'
app.post("/gotoRegister", function (req, res) {
  res.redirect("/registerPage");
});

app.get("/registerPage", function (req, res) {
  let duplicateMsg = "";
  res.render("register.ejs", { duplicateMsg: "" });
});

//preventing duplicate ids
app.get("/duplicateFunc", function (req, res) {
  const userInfo = [];

  let duplicateMsg = "";

  let sql = "SELECT userid, userPw from account";
  // const body = req.body
  // const inputId = body.id
  // const inputPw = body.pw
  // console.log(inputId)

  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  let inputId = queryData.id;
  let inputPw = queryData.pswd1;
  let inputName = queryData.name;
  console.log(inputId, inputPw, inputName);

  conn.query(sql, function (err, rows, fields) {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      userInfo.push({ userid: rows[i].userid, userPw: rows[i].userPw });
    }

    // console.log(userInfo)

    let flag = userInfo.some(function (element) {
      if (element.userid === inputId) return true;
    });

    //console.log("!:" + userInfo);

    if (inputId === "") {
      res.render("register.ejs", { duplicateMsg: "" });
    } else {
      if (flag) {
        res.render("register.ejs", { duplicateMsg: "중복되는 ID입니다." });
      } else {
        //res.render("register.ejs", { duplicateMsg: "회원가입되었습니다." });
        res.send('<script>alert("회원가입 성공");location.href="/login";</script>');
        sql = `insert into ACCOUNT(userId, name, userPw) values (?, ?, ?)`;

        conn.query(sql, [inputId, inputName, inputPw]);
      }
    }
  });
});

//after successful login
app.get("/main", function (req, res) {
  console.log(req.session.isLogined);
  connection.query(`DELETE FROM temp_cart`);
  res.render("main.ejs", { name: req.session.name });
});

app.get("/logout", function (req, res) {
  req.session.destroy(function () {
    req.session;
  });
  res.redirect("/");
});

//after hitting 'order'
app.get("/order", (req, res) => {
  console.log(req.session.isLogined);
  if (req.session.isLogined) {
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
  }
});

//order -> purchase
app.get("/purchase", (req, res) => {
  if (req.session.isLogined) {
    let _url = req.url;
    let queryData = url.parse(_url, true).query;

    let result1 = connection.query(`SELECT name, price FROM item`);
    let end = result1.length;
    let i = 0;
    let result_name;
    let result_price;
    let querydata;

    while (i < end) {
      if (queryData.index[i] != 0) {
        result_name = result1[i].name;
        result_price = result1[i].price;
        querydata = queryData.index[i];
        connection.query(
          `INSERT INTO temp_cart(name, price, number) VALUES (?,?,?)`,
          [result_name, result_price, querydata]
        );
      }
      i++;
    }

    result2 = connection.query(`SELECT name, price, number FROM temp_cart`);
    let end2 = result2.length;
    let namejs2 = [];
    let pricejs2 = [];
    let numberjs2 = [];
    let totaljs2 = 0;
    req.session.cartContent = 0;
    let j = 0;

    while (j < end2) {
      namejs2[j] = result2[j].name;
      pricejs2[j] = result2[j].price;
      numberjs2[j] = result2[j].number;
      totaljs2 += result2[j].price * result2[j].number;

      req.session.cartContent += result2[j].name + "X" + result2[j].number;

      j++;
    }

    req.session.total = totaljs2;
    console.log(req.session.cartContent);
    res.render("purchaseTemplate", {
      length: end2,
      name: namejs2,
      number: numberjs2,
      total: totaljs2,
    });
  }
});

//creditcard info
app.get("/creditcard", (req, res) => {
  res.render("creditTemplate");
});

//check creditcard auth
app.get("/iamport", (req, res) => {
  console.log("주문성공했습니다");
  var newDate = new Date();
  var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  req.session.time = time;
  var contentString = req.session.cartContent;
  contentString = contentString.substr(1);
  connection.query(
    `INSERT INTO temp_history(userId, date, content, totalPrice, restaurantId) VALUES (?,?,?,?,?)`,
    [
      req.session.userid,
      req.session.time,
      contentString,
      req.session.total,
      req.session.bistroid,
    ]
  );
  req.session.total = null;
  req.session.cartContent = null;
  res.redirect("/main");
  /*
  let _url = req.url;
  let queryData = url.parse(_url, true).query;
  console.log(queryData.cn, queryData.ed, queryData.b, queryData.pw);

  iamporter
    .payOnetime({
      merchant_uid: "imp34539870" + new Date().getTime(),
      amount: 1000, //(credittotal, 실제로 돈안빠져나가게 1000원만)
      card_number: queryData.cn,
      expiry: queryData.ed,
      birth: queryData.b,
      pwd_2digit: queryData.pw,
      name: "류신영",
      buyer_email: "chocohummingbird@gmail.com",
      buyer_name: "류신영",
      buyer_tel: "010-2630-5341",
    })
    .then((result) => {
      console.log("주문성공했습니다");
      connection.query(
        `INSERT INTO temp_history(userId, date, content, totalPrice) VALUES (?,?,?,?)`,
        [
          req.session.userid,
          req.session.time,
          req.session.cartContent,
          req.session.total,
        ]
      );
      req.session.total = 0;
      req.session.cartContent = 0;
      res.redirect("/writeReview");
      //modal(주문성공했습니다.. 잠시만기다려주십시오) -> 메인메뉴
    })
    .catch((err) => {
      if (err instanceof IamporterError) console.log(err);
      res.redirect("/creditcard");
      //modal(결제오류) -> 카드정보입력
    });
    */
});

//write review of that restaurant right after purchase
app.get("/writeReview", function (req, res) {
  let result = connection.query(
    `SELECT restaurantId, date FROM temp_history WHERE userId = ?`,
    [req.session.userid]
  );
  //세션으로 userNum넘기면 이부분도 수정 필요

  let end = result.length;
  let restaurantInfo = [];
  let i = 0;
  while (i < end) {
    restaurantInfo[i] = result[i].restaurantId + " " + result[i].date;
    console.log(result[i].restaurantId + result[i].date);
    i++;
  }

  res.render("WriteReview", { length: end, resInfo: restaurantInfo });
});

//written review insertion
app.post("/insertReview", function (req, res) {

  var rate = req.body.rate;
  var resSessionBlock = req.body.restInfo;
  var comment = req.body.comment;

  try {
   connection.query(
      `INSERT INTO temp_review(resBlock, userId, rate, comment) VALUES (?,?,?,?)`,
      //userId와 userNum은 session에서 넘어온 정보를 가지고 넣어야함
      [resSessionBlock, req.session.userid, rate, comment]
    );
  } catch (exception) {
    console.log("오류 발생");
    console.log(exception);
  }

  res.redirect("/review");
});

//your last reviews
app.get("/review", function (req, res) {

  var rwsql = `select userId, comment, rate, resBlock from temp_review where resBlock LIKE ?`;
  var rwsqljs =('%'+req.session.bistroid+'%');

   let result = connection.query(rwsql,[rwsqljs]);
  //세션정보에 userNum 넘어오면 WHERE문에 A.userNum = H.userNum 추가
  let end = result.length;
  let userIdjs = [];
  let contentjs = [];
  let ratejs = [];
  let resBlockb = [];
  let i = 0;
  while (i < end) {
    userIdjs[i] = result[i].userId;
    contentjs[i] = result[i].comment;
    ratejs[i] = result[i].rate;
    resBlockb[i] = result[i].resBlock;
    i++;
  }
  res.render("Review", {
    length: end,
    userId: userIdjs,
    content: contentjs,
    rate: ratejs,
    date: resBlockb
  });
});

//view order history
app.get("/viewHistory", function (req, res) {
  var sqlquery =
    "SELECT date, content, totalPrice, restaurantId  FROM temp_history WHERE userId=?";
  let result = connection.query(sqlquery, [req.session.userid]);
  //세션정보에 userNum 넘어오면 WHERE문에 A.userNum = H.userNum 추가
  let end = result.length;
  let contentjs = [];
  let totalpricejs = [];
  let datejs =[];
  let residjs =[];
  let i = 0;
  while (i < end) {
    contentjs[i] = result[i].content;
    totalpricejs[i] = result[i].totalPrice;
    datejs[i] = result[i].date;
    residjs[i] = result[i].restaurantId;
    i++;
  }
  res.render("OrderHistory", {
    length: end,
    resid: residjs, 
    date: datejs,
    content: contentjs,
    totalprice: totalpricejs,
  });
});

app.listen(3100, () => console.log("Server is running on port 3100..."));
