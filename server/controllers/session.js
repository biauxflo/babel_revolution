const path = require('path')
const { SessionInfo } = require(path.resolve('sequelize', 'models'))
const db = require(path.resolve('sequelize', 'models', 'index.js'))

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

exports.getCompletedSessions = async (req, res, next) => {
    db.SessionInfo.findAll({
        where: { completed: true, visible: true }
    })
    .then(sessions => {
        res.status(200).json(sessions)
    })
        .catch(error => res.status(400).json({ error }))
}

exports.getSession = async (req, res, next) => {
    const sessionId = req.params.id;
    // If 'sessionId' corresponds to a number, we send the session page
    if (!isNaN(sessionId) && !(await checkCompleted(sessionId))) {
        res.sendFile('graph.html', {root: '../public'});  //graph.html?decree=1&react=false
    } else {
        res.status(404).json({message: 'Session not found'});
    }
}