const express = require("express");
const { Client } = require('pg');
const {values} = require("pg/lib/native/query");
require("dotenv").config();
const router = express.Router();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    }
});

client.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database (profile)');
    }
});

const isAuthenticated = (req, res, next) => {
    if (!req.session || req.session.auth !== 'auth') {
        return res.status(401).send('Not Logged in');
    }
    next();
};

const isActive = async (client, username) => {
    const query = "SELECT active_profile FROM user_data WHERE username = $1";
    const values = [username];
    const result = await client.query(query, values);
    const userData = result.rows[0];
    if (!userData) {
        throw new Error('User not found');
    }
    return userData.active_profile;
};

const isAuthAndActive = async (req, res, next) => {
    try {
        if (!req.session || req.session.auth !== 'auth') {
            return res.status(401).send('Not Logged in');
        }

        const username = req.session.user;
        const userIsActive = await isActive(client, username);

        if (!userIsActive) {
            return res.status(403).send("Your profile isn't active.");
        }

        next();
    } catch (err) {
        throw new Error('Error');
    }
};

const getUserHobbies = async (client, id) => {
    try {
        const query = `
            SELECT hobbies.hobby_name
            FROM user_hobbies
            JOIN hobbies ON user_hobbies.hobby_id = hobbies.id
            WHERE user_hobbies.user_id = $1
        `;
        const values = [id];
        const result = await client.query(query, values);
        return result.rows.map(row => row.hobby_name);
    } catch (err) {
        return res.status(500).send(`Error getHobbies: ${err}`);
    }
}

router.get("/api/random-user", isAuthAndActive, async (req, res) => {
    try {
        const username = req.session.user;

        const query = `
            SELECT u2.id, u2.first_name, u2.last_name, u2.age
            FROM user_data u1
            JOIN user_hobbies uh1 ON u1.id = uh1.user_id
            JOIN user_hobbies uh2 ON uh1.hobby_id = uh2.hobby_id
            JOIN user_data u2 ON uh2.user_id = u2.id
            WHERE u1.username = $1
              AND u2.active_profile = true
              AND u2.username != $1
            ORDER BY RANDOM()
            LIMIT 1;
        `;
        const values = [username];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send('No active users found');
        }

        const { first_name, last_name, age, id } = result.rows[0];
        const hobbies = await getUserHobbies(client, id);

        res.json({ first_name, last_name, age, hobbies });
    } catch (error) {
        res.status(500).send(`Error retrieving active user: ${error.message}`);
    }
});

module.exports = router;