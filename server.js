require('dotenv').config(); // Загружает переменные окружения из .env
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const articleRoutes = require('./routes/articles');
const config = require('./config/database');

const app = express();

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Подключение к MongoDB
mongoose.connect(config.database)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Настройка сессий
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/articles', articleRoutes);

// Главная страница (выводит страницу авторизации)
app.get('/', (req, res) => {
    res.render('auth');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
