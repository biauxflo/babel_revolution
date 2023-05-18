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

// Get examples route
router.get('/get-examples', auth, (req, res) => {
  db.Example.findAll()
    .then(examples => {
      res.json({ success: true, examples });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des messages d'exemple : " + err });
    });
});

// Function to check if a session is completed or not
function checkCompleted(sessionId) {
  db.SessionInfo.findOne({
    where: { id: sessionId }
  })
    .then(sessionInfo => {
      if (sessionInfo === null) {
        throw new Error('Wrong session number.');
      } else {
        return sessionInfo.completed;
      }
    });
}

// Publish decree route
router.post('/publish-decree', auth, (req, res) => {
  const { idSession, decree, examples } = req.body;
  // We check if the session is already completed. If yes, no decree can be added
  if (checkCompleted(idSession)) {
    res.status(400).json({ success: false, error: 'The session is completed, no decree can be added.' });
    return;
  }
  // We define the model connected to the correct table
  const tableName = 'session-' + idSession;
  const sessionModel = db.sequelize.define(tableName, db.Node.rawAttributes, { timestamps: true });

  // 1. We add the decree to the table
  sessionModel.create({ title: decree.title, author: 'CMC', text: decree.text })
    .then(dbDecree => {
      // 2. We 'link' each example to the decree
      examples.forEach(example => {
        example.decree = dbDecree.id;
        delete example.id;
      });
      // 3. We add the examples to the table
      sessionModel.bulkCreate(examples)
        .then(() => {
          // 4. We send success
          res.json({ success: true });
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de la création de la session : ' + err });
    });
});

module.exports = router;