import express from 'express';
import path from 'path';
import http from 'http';
import mysql from 'mysql';

const app = express();
const PORT = 3000;

// Setup mysql connection
const connection = mysql.createConnection({
	host: 'localhost',
	user : 'root',
	password: 'm117',
	database: 'M117'
});

app.get('/', ( req, res ) => {
    res.sendFile(path.join(__dirname, 'hello.html'));
});

app.listen(PORT, () => {
    console.log("Started server at port", PORT);

    // Connect to mysql database
    connection.connect();

    // // Test mysql connection
    // connection.query('SELECT * FROM test', ( err, rows, fields ) => {
    // 	if (err) throw err;

    // 	console.log(rows[0]);
    // });
});
