const path = require('path');
const express = require('express');
const nodeRoutes = require('./node');
const sessionRoutes = require('./session');
const completedRoutes = require('./completed');
const loginRoutes = require('./login');
const adminRoutes = require('./admin');
const graphAdminRoutes = require('./graph-admin');
const router = express.Router();

// Home page
router.get('/', (req, res, next) =>
  res.status(200).sendFile(path.resolve("../index.html"))
);

// Node get and post
router.use('/node', nodeRoutes);

// Ongoing session route, to connect as a normal user
router.use('/session', sessionRoutes);

// Completed visible session route, to connect as a normal user
router.use('/completed', completedRoutes);

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
