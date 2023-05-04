const express = require('express');
const routes = require('./routes');
const {router} = require("express/lib/application");
const logger = require('morgan');
const session = require('express-session');
const crypto = require('crypto');
const path = require("path");
const app = express();

app.use(express.static(path.resolve("../public")));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// To get the data from the post requests
app.use(express.urlencoded({ extended: false }));

// To use express-session to authentificate the admin
const secretSignature = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secretSignature,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict'
    }
}));

// To see the request received and sent by the server
app.use(logger('dev'));

app.use('/', routes);

module.exports = app;
