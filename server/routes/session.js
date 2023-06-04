const express = require('express');
const router = express.Router();
const sessionCtrl = require("../controllers/session");

// Route to enter get all visible sessions (leave first so not taken as an id)
router.get('/get-visible-sessions', sessionCtrl.getCompletedSessions);

// Route to enter a session as a normal user
router.get('/:id', sessionCtrl.getSession);

module.exports = router;
