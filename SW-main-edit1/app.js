const mysql = require("sync-mysql");

const connection = new mysql({
  host: "localhost",
  user: "root",
  password: "",
  database: "clerkfree",
});

var express = require("express");
var app = express();
var db_config = require(__dirname + "/config/database.js");
var conn = db_config.init();
var bodyParser = require("body-parser");
var url = require("url");
var datepackage = require("date-utils");
db_config.connect(conn);
var session = require("express-session");
var mySqlStore = require("express-mysql-session")(session);
let router = express.Router();
var newDate = new Date();
var time = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "clerkfree",
};
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

// ------------------------류신영-------------------------------

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

app.get("/purchase", (req, res) => {
  if (req.session.isLogined) {
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

    credittotal = totaljs2;

    res.render("purchaseTemplate", {
      length: end2,
      name: namejs2,
      number: numberjs2,
      total: totaljs2,
    });
  }
});

app.get("/creditcard", (req, res) => {
  res.render("creditTemplate");
});

app.get("/iamport", (req, res) => {
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
      console.log(result);
      res.redirect("/order");
      //modal(주문성공했습니다.. 잠시만기다려주십시오) -> 메인메뉴
      credittotal = 0;
    })
    .catch((err) => {
      if (err instanceof IamporterError) console.log(err);
      res.redirect("/creditcard");
      //modal(결제오류) -> 카드정보입력
    });
});
// ---------------------------김희수 ----------------------------
app.get("/", function (req, res) {
  res.render("root.ejs");
});

app.get("/registerPage", function (req, res) {
  let duplicateMsg = "";
  res.render("register.ejs", { duplicateMsg: "" });
});

app.post("/gotoRegister", function (req, res) {
  res.redirect("/registerPage");
});

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
        res.render("register.ejs", { duplicateMsg: "회원가입되었습니다." });
        sql = `insert into ACCOUNT(userId, name, userPw, isManager) values (?, ?, ?,?)`;

        conn.query(sql, [inputId, inputName, inputPw, 0]);
      }
    }
  });
});

app.get("/review", function (req, res) {
  console.log(req.session.isLogined);
  res.render("review.ejs");
});

app.get("/history", function (req, res) {
  console.log(req.session.isLogined);
  res.render("history.ejs");
});

app.get("/main", function (req, res) {
  console.log(req.session.isLogined);
  connection.query(`DELETE FROM temp_cart`);
  res.render("main.ejs", { user: req.session.userid });
});

app.get("/login", function (req, res) {
  let loginMsg = "";
  res.render("login.ejs", { loginMsg: loginMsg });
});

app.post("/loginFunc", function (req, res) {
  const body = req.body;
  const inputId = body.id;
  const inputPw = body.pw;
  //  console.log(inputId,inputPw)

  const userInfo = [];

  const sql = "SELECT userid, userPw from account";
  conn.query(sql, function (err, rows, fields) {
    if (err) throw err;
    else {
      for (var i = 0; i < rows.length; i++) {
        userInfo.push({ userid: rows[i].userid, userPw: rows[i].userPw });
      }
      //console.log(userInfo)

      let flag = userInfo.some(function (element) {
        if (element.userid === inputId && element.userPw === inputPw) {
          return true;
        }
      });

      if (inputId === "") {
        res.render("login.ejs", { loginMsg: "" });
      } else {
        if (flag) {
          req.session.userid = inputId;
          req.session.userPw = inputPw;
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

app.listen(3100, () => console.log("Server is running on port 3100..."));