"use strict";

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10; // number of rounds used to generate the salt
const db = require('../sequelize/models/index');
const { Op } = require("sequelize");

/*********************************** GENERAL ROUTE ***************************************/
router.get('/', auth, (req, res) => {
  res.sendFile('admin.html', { root: '../public' });
});

/*********************************** MENU BUTTONS ROUTES ***************************************/
// This function returns true if the password is correct, else it returns false and send an error
function checkPassword(password, passwordVerification, errorMessage = "") {
  // The password must have 5 characters or more
  if (password.length < 5) {
    res.status(400).json({ success: false, error: "Le mot de passe doit être composé de 5 caractères minimum. " + errorMessage });
    return false;
    // The passwords must be the same
  } else if (password !== passwordVerification) {
    res.status(400).json({ success: false, error: "Les mots de passes ne correspondent pas. " + errorMessage });
    return false;
  } else {
    return true;
  }
}

// When the user clicks on the account create prompt's button "Créer le compte", we arrive there
router.post('/create-account', auth, (req, res) => {
  // We get the info from the request
  const { username, password, password_verification, privilege } = req.body;
  // We check if the new account admin level is valid (shall be 1 or 2)
  if (privilege !== '1' && privilege !== '2') {
    res.status(400).json({ success: false, error: 'The admin level shall be 1 or 2.' });
    return;
  }
  // We check if the user has the right to create a new account (privileges 0 or 1)
  const currentUserPrivileges = req.session.user.privileges;
  if (currentUserPrivileges !== 0 && currentUserPrivileges !== 1) {
    res.status(401).json({ success: false, error: 'This account is not authorized to create account.' });
    return;
  }
  // Then we check, if the user wants to create an admin level 1 account, that they is the superadmin 
  if (privilege !== '2' && currentUserPrivileges !== 0) {
    res.status(401).json({ success: false, error: 'This account is not authorized to create admin level 1 account.' });
    return;
  }
  // Then we can create the account
  if (checkPassword(password, password_verification, "Le compte n'a pas été créé.")) {
    // We hash the password, and we will save only the hash
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erreur lors du hachage du mot de passe : ' + err });
      } else {
        const privileges = Number(privilege);
        db.User.create({ username, password: hash, privileges })
          .then(user => {
            res.json({ success: true, user });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, error: 'Erreur de la bdd lors de la création du compte : ' + err });
          });
      }
    });
  }
});

// Change password route
router.post('/change-password', auth, (req, res) => {
  const { password, password_verification } = req.body;
  if (checkPassword(password, password_verification, "Le mot de passe n'a pas été modifié.")) {
    // We hash the password, and we will save only the hash
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Erreur lors du hachage du mot de passe : ' + err });
      } else {
        const currentUsername = req.session.user.username;
        db.User.update({ password: hash }, {
          where: { username: currentUsername }
        })
          .then(() => {
            res.json({ success: true, message: "Le mot de passe a été mis à jour avec succès." });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, error: "Erreur lors de la mise à jour du mot de passe." });
          });
      }
    });
  }
});

// Get accounts list route
router.get('/accounts-list', (req, res) => {
  const currentUsername = req.session.user.username;
  db.User.findAll({
    attributes: ['username'],  // We only take usernames
    where: {
      [Op.and]: [
        { privileges: { [Op.not]: 0 } },
        { username: { [Op.not]: currentUsername } }
      ]
    }
  })
    .then(users => {
      res.json({ success: true, users });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des comptes : " + err });
    });
});

// Get privilege route
router.get('/admin-level', (req, res) => {
  const privileges = req.session.user.privileges;
  if (typeof (privileges) === 'number') {
    res.json({ success: true, privileges });
  } else {
    res.status(500).json({ success: false, error: "Erreur : pas de niveau admin valide." });
  }
});

// Get all accounts list route
router.get('/all-accounts-list', (req, res) => {
  db.User.findAll({
    attributes: ['username']  // We only take usernames
  })
    .then(users => {
      res.json({ success: true, users });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des comptes : " + err });
    });
});

// Delete account route
router.post('/delete-account', (req, res) => {
  // We first check if the user has the right to delete an account (privileges 0 or 1)
  const privileges = req.session.user.privileges;
  if (privileges !== 0 && privileges !== 1) {
    res.status(401).json({ success: false, error: 'This account is not authorized to create account.' });
    return;
  }
  // Then we can delete the account
  const { username } = req.body;
  db.User.destroy({
    where: { username }
  })
    .then(() => {
      res.json({ success: true, message: "Le compte a bien été supprimé." });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la suppression du compte : " + err });
    });
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login');
});

/*********************************** SESSION ROUTES ***************************************/
// Get all sessions
router.get('/get-sessions', auth, (req, res) => {
  const privileges = req.session.user.privileges;
  // If the admin level (privileges) is 0 or 1, we send all the sessions. Else, we send only the session created by the current account
  let options = {};
  if (privileges !== 0 && privileges !== 1) {
    options = { where: { author: req.session.user.username } };
  }
  db.SessionInfo.findAll(options)
    .then(sessions => {
      res.json({ success: true, sessions });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error getting sessions : ' + err });
    });
});

// Change visibility session route
router.post('/change-visibility', (req, res) => {
  const { id, visible } = req.body;
  db.SessionInfo.update({ visible }, {
    where: { id }
  })
    .then(() => {
      res.json({ success: true, message: "La visibilité de la session a été mise à jour avec succès." });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la mise à jour de La visibilité de la session." });
    });
});

// Create session route
router.post('/create-session', (req, res) => {
  const { title } = req.body;
  const author = req.session.user.username;
  const image = 'graphe1.png';
  const completed = false;
  const visible = false;
  // 1. We create the entry for the session in the table SessionInfo
  db.SessionInfo.create({ title, author, image, completed, visible })
    .then(session => {
      // 2. We create a new table for the new session using the id of the session
      const newTableName = 'session-' + session.id;
      const sessionModel = db.sequelize.define(newTableName, db.Node.rawAttributes, { timestamps: false });
      sessionModel.sync().
        then(() => {
          // 3. We send the info of the session
          res.json({ success: true, session });
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de la création de la session : ' + err });
    });
});

// rename session route
router.post('/rename-session', (req, res) => {
  const { id, newTitle } = req.body;
  db.SessionInfo.update({ newTitle }, {
    where: { id }
  })
    .then(() => {
      res.json({ success: true, message: "Le titre de la session a été mis à jour avec succès." });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la mise à jour du titre de la session : " + err });
    });
});

// Delete session route
router.post('/delete-session', (req, res) => {
  const { id } = req.body;
  // If the user has not the right to delete all sessions (privileges 0 or 1), they has to have created the session
  const privileges = req.session.user.privileges;
  let options = "error";
  if (privileges !== 0 && privileges !== 1) {
    options = { where: { [Op.and]: [{ privileges }, { id }] } };
  } else {
    options = { where: { id } };
  }
  // Then we can delete the account
  db.SessionInfo.destroy(options)
    .then(() => {
      res.json({ success: true, message: "La session a bien été supprimé." });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Erreur lors de la suppression de la session : " + err });
    });
});

module.exports = router;
