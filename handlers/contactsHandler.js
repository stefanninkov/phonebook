const ContactsHandler = function (db) {
    this.db = db;
    this.table = 'contacts';
}

ContactsHandler.prototype.create = function (req, res) {

    var _sql = "INSERT INTO " + this.table + " (first_name, last_name, telephone_number) VALUES (?)";
    var _params = [req.body.first_name, req.body.last_name, req.body.telephone_number];

    this.db.query(_sql, [_params], function (err, result) {
        if (!err) {
            return res.status(200).send("OK");
        }
        return res.status(400).send("ERROR");
    });
}

ContactsHandler.prototype.delete = function (req, res) {

    var _sql = "DELETE FROM " + this.table + " WHERE id = ?";

    this.db.query(_sql, [req.params.id], function (err, result) {
        if (!err) {
            return res.status(200).send("DELETED");
        }
        return res.status(400).send("ERROR WHILE DELETING");
    })
}

ContactsHandler.prototype.get = function (req, res) {

    var _filterKey = req.query.key ? req.query.key : "last_name";
    var _sql = "SELECT * FROM " + this.table

    if (req.query.value) {
        _sql += " WHERE " + _filterKey + " LIKE \"%"+ req.query.value + "%\""
    }

    this.db.query(_sql, [], function (err, result) {
        if (!err) {
            return res.status(200).send(result);
        }
        return res.status(400).send("ERROR");
    })
}

ContactsHandler.prototype.update = function (req, res) {

    console.log(req.query)

    var _sql = "UPDATE " + this.table + " SET first_name = ?, last_name = ?, telephone_number = ? WHERE id = ?";
    var _params = [req.body.first_name, req.body.last_name, req.body.telephone_number, req.params.id]

    this.db.query(_sql, _params, function (err, result) {
        if (!err) {
            return res.status(200).send("OK");
        }
        return res.status(400).send("ERROR");
    })
}

module.exports = ContactsHandler;