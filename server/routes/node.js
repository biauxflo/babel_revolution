const express = require('express');
const nodesCtrl = require('../controllers/node');

const router = express.Router();

router.get('/', nodesCtrl.getNodes);
router.post('/', nodesCtrl.addNewNode);
router.get('/del', nodesCtrl.resetNodes);

module.exports = router;