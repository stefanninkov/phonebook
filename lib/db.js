const mysql = require('mysql');

const Database = function (config) {

    this.connectionPool =  mysql.createPool({
        host     : config.db.host,
        user     : config.db.username,
        password : config.db.password,
        database : config.db.database
    });
}

Database.prototype.query = function (query, params, callback) {
    this.connectionPool.getConnection((err, connection) => {
        connection.query(query, params, function (err, result) {
            if (err) {
                callback(err, null);
                return connection.release();
            }
            callback(null, result)
            return connection.release();
        })
    })
}

module.exports = Database;