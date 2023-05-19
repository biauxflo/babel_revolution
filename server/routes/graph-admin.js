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

// Get decrees route
router.get('/get-ends', auth, (req, res) => {
  db.End.findAll()
    .then(ends => {
      res.json({ success: true, ends });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des fins : " + err });
    });
});

// Function to check if a session is completed or not
function checkCompleted(sessionId) {
  return db.SessionInfo.findOne({
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
router.post('/publish-decree', auth, async (req, res) => {
  const { idSession, decree, examples } = req.body;
  // We check if the session is already completed. If yes, no decree can be added
  checkCompleted(idSession)
    .then(completed => {
      if (completed) {
        throw new Error('The session is completed, no decree can be added.');
      }
      // We define the model connected to the correct table
      const tableName = 'session-' + idSession;
      const sessionModel = db.sequelize.define(tableName, db.Node.rawAttributes, { timestamps: true });
      // 1. We add the decree to the table
      sessionModel.create({ title: decree.title, author: 'CMC', text: decree.text, type: 'decree' })
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
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de la publication du décret : ' + err });
    });
});

// End session route
router.post('/end-session', auth, (req, res) => {
  const { idSession, end } = req.body;
  // We check if the session is already completed. If yes, no decree can be added
  checkCompleted(idSession)
    .then(completed => {
      if (completed) {
        throw new Error("The session is already completed.");
      }
      // We define the model connected to the correct table
      const tableName = 'session-' + idSession;
      const sessionModel = db.sequelize.define(tableName, db.Node.rawAttributes, { timestamps: true });
      // 1. We add the end to the table
      sessionModel.create({ title: end.title, text: end.text, type: 'end' })
        .then(() => {
          // 2. We change completed in true in the table SessionInfo
          db.SessionInfo.update({ completed: true }, {
            where: { id: idSession }
          })
            .then(() => {
              // 3. We send success
              res.json({ success: true });
            })
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de la fin de la session : ' + err });
    });
});

module.exports = router;