// set up express server 
const express = require('express');
const axios = require ('axios');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
    });

const Favorite = sequelize.define('Favorite', {
    pair: {
        type: DataTypes.STRING,
        allowNull: false
    }
    });

app.use(express.json());
app.use(express.static('public'));

app.post('/save-favorite', async (req, res) => {
    try {
        const favorite = await Favorite.create({ pair: req.body.favoritePair });
        res.json({ success: true, favorite });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
    });

    app.get('/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.findAll();
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

    sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    });
