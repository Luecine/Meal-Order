const express = require("express");
const mysql = require("mysql");
const url = require("url");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "clerkfree",
});

app.get("/", (req, res) => {
  connection.query(`SELECT name, price FROM item`, (err, result) => {
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
});

app.get("/purchase", (req, res) => {
  let _url = req.url;
  let queryData = url.parse(_url, true).query;

  connection.query(`SELECT name, price FROM item`, (err, result) => {
    let end = result.length;
    let i = 0;
    while (i < end) {
      let result_name = result[i].name;
      let result_price = result[i].price;
      let querydata = queryData.index[i];
      connection.query(
        `INSERT INTO temp_cart(name, price, number) VALUES (?,?,?)`,
        [result_name, result_price, querydata],
        function (error, result) {
          if (error) throw error;
        }
      );
      i++;
    }
  });

  connection.query(
    `SELECT name, price, number FROM temp_cart`,
    (err, result) => {
      let end = result.length;
      let namejs = [];
      let pricejs = [];
      let numberjs = [];
      let totaljs = 0;
      let i = 0;
      while (i < end) {
        namejs[i] = result[i].name;
        pricejs[i] = result[i].price;
        numberjs[i] = result[i].number;
        totaljs += result[i].price * result[i].number;
        i++;
      }
      console.log(totaljs);
      res.render("purchaseTemplate", {
        length: end,
        name: namejs,
        number: numberjs,
        total: totaljs,
      });
    }
  );

  //쿼리로 DELETE FROM `temp_cart추가해서 초기화(지금은 db저장된걸 확인해야되서 안함)
});

app.listen(3000);
