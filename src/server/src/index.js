'use strict';

const http = require('node:http');
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const app = express();

const LISTEN = process.env.PORT ?? '3000';

app.use(express.static(
    path.resolve(path.join(__dirname, 'static'))
))

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // stream is fatest than fs.readFile
    const stream = fs.createReadStream(
        path.resolve(path.join(__dirname, 'view', 'index.html')),
        {encoding: 'binary'}
    );

    const handleRemoveListeners = () => {
        stream.removeAllListeners('data');
        stream.removeAllListeners('error');
        stream.removeAllListeners('end');
    };

    stream.on('data', (data) => res.write(data));
    stream.on('error', (err) => {
        console.error(err);
        res.status(500).end();
        handleRemoveListeners();
        stream.destroy();
    });
    stream.on('end', () => {
        handleRemoveListeners();
        res.status(200).end();
    });
});

const server = http.createServer(app);
server.listen(LISTEN, '0.0.0.0', () => console.log('🚀 server ready on localhost:%s', LISTEN));
