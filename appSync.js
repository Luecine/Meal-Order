const express = require("express");
const mysql = require("sync-mysql");
const url = require("url");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const connection = new mysql({
  host: "localhost",
  user: "root",
  password: "",
  database: "clerkfree",
});

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
