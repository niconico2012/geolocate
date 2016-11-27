'use strict';
var express = require('express');
var crypto = require('crypto');
var sqlite = require('sqlite3').verbose();
var bodyparser = require('body-parser');
var db = new sqlite.Database('./data.db');
var app = express();
var PORT = process.env.PORT || 4000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.get('/', ( req, res ) => {
    res.json('sup');
});
app.post('/provision', ( req, res ) => {
    console.log('/provision received')

    crypto.randomBytes(5, (err, buf) => {
        if (err) throw err;
        // db.run("INSERT INTO devices(name) VALUES(?)", "5C:F9:38:B2:21:20");
        var stmt = db.prepare("INSERT INTO devices(name) VALUES(?)");
        stmt.run(buf.toString('hex'));
        res.json({name: buf.toString('hex')});
    })
});

app.post('/report', ( req, res )=> {
    console.log('/report received')
    var name = req.body.name || null;
    var location = req.body.location || null;

    location = location.latitude + ' ' + location.longitude;

    if (!name || !location) {
        res.json({success: false});
    }
    else {
        db.run("UPDATE devices SET location=?, time=? WHERE name=?", location, Date.now(), name , (err) => {
            if (err)
                console.log("/report err: ", err);

            res.json({success: err === null});
        });
    }
});

app.get('/find/:name', ( req, res ) => {
    console.log('/find received')
    var findName= req.params.name || null;
    db.all("SELECT * FROM devices WHERE name=?", findName, (err, rows) => {
        // if (err !== null || rows.length !== 1) {
        if (err !== null) {
            console.log(err, rows);
            res.json({success: false});
        }
        else {
            res.json({success: true, device: rows[0]});
        }
    });
});

app.listen(PORT, () => {
    console.log("Started server at port", PORT);
});

