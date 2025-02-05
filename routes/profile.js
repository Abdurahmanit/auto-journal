const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Настройка загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Файлы сохраняются в /public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, req.session.userId + path.extname(file.originalname)); // Уникальное имя (ID пользователя)
    }
});

const upload = multer({ storage });

// Страница профиля
router.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
});

// Загрузка аватара
router.post('/upload', upload.single('avatar'), async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }

    const user = await User.findById(req.session.userId);
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.redirect('/profile'); // Перезагрузка страницы профиля
});

module.exports = router;
