/**
 * @file main file used for load server
 * @copyright Rayane Guemmoud 2022
 */
'use strict';

// Import required module
/**
 * Import http module for create server
 * @kind constant
 */
const http = require('node:http');
/** 
 * Import express for create a server handler
 * @kind constant
 */
const express = require('express');
/**
 * Import path for using path tools
 * @kind constant
 */
const path = require('node:path');
/**
 * Import fs for create file stream
 * @kind constant
 */
const fs = require('node:fs');

/**
 * Initial server handler
 * @kind constant
 * @type {express.Express}
 */
const app = express();

/**
 * Get listen from env or 3000
 * @kind constant
 * @default
 * @type {string}
 */
const LISTEN = process.env.PORT ?? '3000';

// Create path for all static file from src/static/*
app.use(express.static(
    path.resolve(path.join(__dirname, 'static'))
))

// Create GET / path
app.get('/', (req, res) => {
    // Set Content-Type header to text/html
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    /**
     * Create read stream from src/view/index.html
     * stream is fatest than fs.readFile
     * @kind constant
     * @type {fs.ReadStream}
     */
    const stream = fs.createReadStream(
        path.resolve(path.join(__dirname, 'view', 'index.html')),
        {encoding: 'binary'}
    );

    /**
     * Remove all event listener
     * @function
     * @name handleRemoveListeners
     * @example
     * stream.on('data', console.log);
     * stream.on('end', handleRemoveListeners);
     * @return {void}
     */
    const handleRemoveListeners = () => {
        // Remove all data listeners
        stream.removeAllListeners('data');
        // Remove all error listeners
        stream.removeAllListeners('error');
        // Remove all end listeners
        stream.removeAllListeners('end');
    };

    // Send data to client at the same time as get data
    stream.on('data', (data) => res.write(data));
    // When error is occured
    stream.on('error', (err) => {
        // Log error
        console.error(err);
        // Stop connection white status 500
        res.status(500).end();
        // Remove all listener
        handleRemoveListeners();
        // Destroy stream
        stream.destroy();
    });
    // When finished
    stream.on('end', () => {
        // Remove all listener
        handleRemoveListeners();
        // Stop connection white status 200
        res.status(200).end();
    });
});

/**
 * Create server
 * @kind constant
 * @type {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>}
 */
const server = http.createServer(app);
/** 
 * Listen server on @see {LISTEN}
 * And if done log server ready white port
 */
server.listen(LISTEN, '0.0.0.0', () => console.log('🚀 server ready on localhost:%s', LISTEN));
