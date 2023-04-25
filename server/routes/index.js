const path = require('path');
const express = require('express');
const nodeRoutes = require('./node');
const router = express.Router();

// Home page
router.get('/', (req, res, next) =>
  res.status(200).sendFile(path.resolve("../graph.html"))
);

// Node get and post
router.use('/node', nodeRoutes);

// Block other access
router.all('*', (req, res, next) =>
  res.status(404).json({
    message: 'Route un-available',
  }),
);



module.exports = router;
