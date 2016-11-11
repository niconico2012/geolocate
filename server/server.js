// import express from 'express';
// import path from 'path';
// import http from 'http';

const express = require('express');
const crypto = require('crypto');
const sqlite = require('sqlite3').verbose();
const bodyparser = require('body-parser');
let db = new sqlite.Database('./data.db');


const app = express();
const PORT = 3000;

app.use(bodyparser.urlencoded());

app.get('/', ( req, res ) => {
    res.sendFile(path.join(__dirname, 'hello.html'));
});

app.post('/provision', ( req, res ) => {
    crypto.randomBytes(5, (err, buf) => {
        if (err) throw err;
        let stmt = db.prepare("INSERT INTO devices(name) VALUES(?)");
        stmt.run(buf.toString('hex'));
        res.json({name: buf.toString('hex')});
    })
});

app.post('/report', ( req, res )=> {
    var name = req.body.name || null;
    var location = req.body.location || null;

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
    var findName= req.params.name || null;
    db.all("SELECT * FROM devices WHERE name=?", findName, (err, rows) => {
        if (err !== null || rows.length !== 1) {
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

    // Connect to mysql database
    // connection.connect();

    // // Test mysql connection
    // connection.query('SELECT * FROM test', ( err, rows, fields ) => {
    // 	if (err) throw err;

    // 	console.log(rows[0]);
    // });
});

