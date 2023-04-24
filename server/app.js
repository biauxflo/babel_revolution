const express = require('express');
const routes = require('./routes');
const {router} = require("express/lib/application");
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

app.use('/', routes);

module.exports = app;
