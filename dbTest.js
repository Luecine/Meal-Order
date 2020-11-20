const mysql = require('mysql');
const pool = mysql.createPool({ 
    host: 'localhost', 
    user: 'root',
    password: '',
    database:'test',
    connectionLimit: 1 });

pool.getConnection((err, conn) => {
  if (err) throw err;

    console.log("connected ! connection id is " + conn.threadId);
    
    let idQuery = conn.query("select * from info", (err, result)=>{
        if(err) throw err;
        console.log(result)
    });

    conn.end(); //release to pool
});
