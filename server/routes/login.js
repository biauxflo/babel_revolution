const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../sequelize/models/index');

router.get('/', (req, res) => {
  res.sendFile('login.html', { root: '../public' });
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  // First we get the user information using the username
  db.User.findOne({ where: { username } })
    .then(user => {
      if (user) {
        // Second, we hash the password received and compare it with the hash saved in the db
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: 'Erreur lors du hachage du mot de passe : ' + err });
          } else {
            if (result) {
              // correct password
              req.session.user = user;
              res.status(302).json({ success: true, redirectUrl: "/admin" });
            } else {
              // incorrect password
              res.status(401).json({ success: false, message: "Mot de passe incorrect." });
            }
          }
        });
      } else {
        // If there is no username that corresponds, we send that it failed
        res.status(401).json({ success: false, message: "Identifiant incorrect." });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, message: "Erreur lors de l'authentification.", error: err });
    });
});

module.exports = router;
