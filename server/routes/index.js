const path = require('path');
const express = require('express');
const nodeRoutes = require('./node');
const sessionRoutes = require('./session');
const loginRoutes = require('./login');
const adminRoutes = require('./admin');
const graphAdminRoutes = require('./graph-admin');
const router = express.Router();

// Home page
router.get('/', (req, res, next) =>
  res.status(200).sendFile(path.resolve("../graph.html"))
);

// Node get and post
router.use('/node', nodeRoutes);

// Session route, to connect as a normal user
router.use('/session', sessionRoutes);

// Admin login routes
router.use('/login', loginRoutes);

// Admin panel routes
router.use('/admin', adminRoutes);

// Admin session controls routes
router.use('/graph-admin', graphAdminRoutes);

// Block other access
router.all('*', (req, res, next) =>
  res.status(404).json({
    message: 'Route un-available',
  }),
);



module.exports = router;
