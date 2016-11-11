// import express from 'express';
// import path from 'path';
// import http from 'http';

const express = require('express');
const crypto = require('crypto');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./data.db');


const app = express();
const PORT = 3000;

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

