const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
});

module.exports = router;