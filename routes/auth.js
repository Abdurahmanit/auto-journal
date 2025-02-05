const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Страница авторизации
router.get('/', (req, res) => {
    res.render('auth');
});

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка, существует ли пользователь
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Пользователь уже существует');
        }

        // Создание нового пользователя (пароль хешируется автоматически в User.js)
        const user = new User({ username, password });

        await user.save();
        req.session.userId = user._id; // Сохраняем сессию
        res.redirect('/profile'); // Перенаправляем в профиль
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка регистрации');
    }
});

// Логин
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Неправильный логин или пароль');
        }

        req.session.userId = user._id; // Сохраняем userId в сессии
        res.redirect('/profile'); // Перенаправление в профиль
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка входа');
    }
});

// Выход из системы
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Перенаправление на страницу авторизации
    });
});

module.exports = router;