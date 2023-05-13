"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const db = require('../sequelize/models/index');
const { Op } = require("sequelize");

// Get decrees route
router.get('/get-decrees', auth, (req, res) => {
  db.Decree.findAll()
    .then(decrees => {
      res.json({ success: true, decrees });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des décrets : " + err });
    });
});

module.exports = router;