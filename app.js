const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://maksimedev:ocrp6livres@p6-livres.mmzdh.mongodb.net/?retryWrites=true&w=majority&appName=p6-livres',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('connexion a mongoose réussie'))
    .catch(() => console.log('connexion echouée'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;