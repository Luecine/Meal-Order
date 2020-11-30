var mysql = require('mysql');
var db_info = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'swteam'
});

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}