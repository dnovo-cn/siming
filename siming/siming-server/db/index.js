const mysql = require('mysql');
const config = require('./config');

// 创建数据库连接池
const pool = mysql.createPool(config.database);

// 执行查询操作的函数
function query(sql, params, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return callback(err, null);
        }

        connection.query(sql, params, (err, rows) => {
            connection.release();
            if (err) {
                console.error('Error executing query:', err);
                return callback(err, null);
            }

            callback(null, rows);
        });
    });
}

module.exports = { query };