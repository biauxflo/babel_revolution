const express = require('express');
const router = express.Router();
const db = require('../sequelize/models/index');

// Function to check if a session is completed or not
function checkCompleted(sessionId) {
    return db.SessionInfo.findOne({
        where: { id: sessionId }
    })
        .then(sessionInfo => {
            if (sessionInfo === null) {
                return false;
            } else {
                return sessionInfo.completed;
            }
        });
}

// Route to enter a session as a normal user
router.get('/:id', async (req, res) => {
    const sessionId = req.params.id;
    // If 'sessionId' corresponds to a number, we send the session page
    if (!isNaN(sessionId) && !(await checkCompleted(sessionId))) {
        res.sendFile('graph.html', { root: '../public' });  //graph.html?decree=1&react=false
    } else {
        res.status(404).json({ message: 'Session not found' });
    }
});

module.exports = router;
