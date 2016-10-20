import express from 'express';
import {MongoClient} from 'mongodb'
import path from 'path';
import http from 'http';

const app = express();
const PORT = 3000;

app.get('/', ( req, res ) => {
    res.sendFile(path.join(__dirname, 'hello.html'));
});

//MongoClient.connect('mongodb://localhost/users',(err, dbConnection) => {
//    db = dbConnection;
    app.listen(PORT, () => {
        console.log("Started server at port", PORT);
    });
//})