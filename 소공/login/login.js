console.log("fighting!");
console.log(document); // html 태그 전체를 콘솔에 띄워주자.

var signinButton = document.getElementById("signinButton") // 버튼을 만들고.
signinButton.addEventListener('click', signinFunc) // 'click'이란 id의 버튼을 누르면 signinFunc 함수를 실행.

function signinFunc () {
  var userid = document.getElementById("userid").value; // userid 의 값을 받아와 넣음.
  var userpw = document.getElementById("userpw").value; // userpw 의 값을 받아와 넣음.

  const mariadb = require('mariadb/callback');
  const pool = mariadb.createPool({
      host:'localhost',
      user:'root',
      password:'',
      connectionLimit:1
  });

  pool.getConnection((err, conn) => {
      if(err) throw err;
      console.log("connected!");
      let id = conn.query("select id from users", (err, result, fields)=>{
          if(err) throw err;
          return result;
      });

      let pw = con.query("select password from users", (err, result, fields)=>{
          if(err) throw err;
          return result;
      })

  })

  if(userid == "polytech" && userpw == "12345678") {
    alert("로그인 성공");
    console.log("로그인 성공했습니다.");
  } else {
    alert("로그인 실패");
    console.log("로그인 실패했습니다.");
  }


}