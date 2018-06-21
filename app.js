const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/resources'));

// CONFIG FILE READING
const config = JSON.parse(fs.readFileSync('config.json', 'utf8')); // Config file reading

// DATABASE CONNECTION INIT
const Database = require('./lib/db.js')
var db = new Database(config);

// CONTROLLER INIT
const contactsHandler = require('./handlers/contactsHandler.js');
const contacts = new contactsHandler(db);

// WEB ROUTES
app.get("/", function (req, res) { res.sendFile('views/index.html', {root: __dirname }); })

// API ROUTES
app.get("/api/contacts", function (req, res) { contacts.get(req, res) })
app.post('/api/contacts', function (req, res) { contacts.create(req, res) })
app.put('/api/contacts/:id', function (req, res) { contacts.update(req, res) })
app.delete('/api/contacts/:id', function (req, res) { contacts.delete(req, res) })

app.listen(config.server.port, function () {
    console.log("Application api listen on port: ", config.server.port)
});
