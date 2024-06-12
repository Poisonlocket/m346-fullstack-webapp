const express = require("express");
const { Client } = require('pg');
require("dotenv").config();

const adminPassword = process.env.ADMIN_PW;
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
        console.log('Connected to the database (acc)');
    }
});

const isAuthenticated = (req, res, next) => {
    if (!req.session || req.session.auth !== 'auth') {
        return res.status(401).send('Not Logged in');
    }
    next();
};

const isAdmin = async (client, username) => {
    const query = "SELECT is_admin FROM user_data WHERE username = $1";
    const values = [username];
    const result = await client.query(query, values);
    const userData = result.rows[0];
    if (!userData) {
        throw new Error('User not found');
    }
    return userData.is_admin;
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

const isAdminAndActive = async (req, res, next) => {
    try {
        const username = req.session.user;
        const userIsAdmin = await isAdmin(client, username);
        const userIsActive = await isActive(client, username);

        if (!userIsAdmin) {
            return res.status(403).send('Access denied. Admins only.');
        }

        if (!userIsActive) {
            return res.status(403).send("Your profile isn't active.");
        }

        next();
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).send("User not found.");
        }
        res.status(500).send("Database query error");
    }
};

router.get("/api/users", isAuthenticated, isAdminAndActive, async (req, res) => {
    try {
        const allUsers = await client.query('SELECT * FROM user_data;');
        res.json(allUsers.rows);
    } catch (err) {
        res.status(500).send("Database query error");
    }
});

router.get("/api/users/:id", isAuthenticated, isAdminAndActive, async (req, res) => {
    try {
        const query = 'SELECT * FROM user_data WHERE id = $1';
        const values = [req.params.id];
        const result = await client.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Database query error");
    }
});

router.get("/api/my-data", isAuthenticated, async (req, res) => {
    try {
        const query = 'SELECT * FROM user_data WHERE username = $1';
        const values = [req.session.user];
        const result = await client.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Database query error");
    }
});

router.put("/api/deactivate", isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user;
        const userIsActive = await isActive(client, username);

        if (userIsActive) {
            const query = 'UPDATE user_data SET active_profile = $1 WHERE username = $2';
            const values = [false, req.session.user];
            await client.query(query, values);
            res.send('Profile Deactivated');
    } else{
            res.send('Profile already Deactivated');
    }}
    catch (err) {
        res.status(500).send("Database query error");
    }
});

router.put("/api/activate", isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user;
        const userIsActive = await isActive(client, username);

        if (!userIsActive) {
            const query = 'UPDATE user_data SET active_profile = $1 WHERE username = $2';
            const values = [true, req.session.user];
            await client.query(query, values);
            res.send('Profile Activated');
        } else{
            res.send('Profile already Activated');
        }}
    catch (err) {
        res.status(500).send("Database query error");
    }
});

router.delete("/api/delete", isAuthenticated, async (req, res) => {
    try {
        const query = 'DELETE FROM user_data WHERE username = $1';
        const values = [req.session.user];
        await client.query(query, values);
        res.send();
    } catch (err) {
        res.status(500).send("Database query error");
    }
});

router.put("/api/get-admin", isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user;
        const userIsAdmin = await isAdmin(client, username);

        if (userIsAdmin) {
            res.send('Du bist schon ein Administrator');
        } else if (req.body.apw === adminPassword) {
            const query = 'UPDATE user_data SET is_admin = $1 WHERE username = $2';
            const values = [true, req.session.user];
            await client.query(query, values);
            res.send('Du bist jetzt ein Administrator');
        } else {
            res.send("Das Passwort ist falsch!");
        }
    } catch (err) {
        res.status(500).send("Database query error");
    }
});

router.put("/api/edit-user", isAuthenticated, async (req, res) => {
    try {
        const query = 'UPDATE user_data SET username = $1, email = $2, password = $3, first_name = $4, last_name = $5, age = $6, about_me = $7 WHERE username = $8';
        const values = [req.body.username, req.body.email, req.body.password, req.body.name, req.body.last_name, req.body.age, req.body.about, req.session.user];7
        await client.query(query, values);
        res.send("You have updated your profile")
    } catch (err) {
        console.log(err)
        res.status(500).send("Database query error");
    }
});

router.put("/api/edit-user/:id", isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user;
        const userIsAdmin = await isAdmin(client, username);

        if (userIsAdmin) {
            const query = 'UPDATE user_data SET username = $1, email = $2, password = $3, first_name = $4, last_name = $5, age = $6, about_me = $7 WHERE id = $8';
            const values = [req.body.username, req.body.email, req.body.password, req.body.name, req.body.last_name, req.body.age, req.body.about, req.params.id];
            await client.query(query, values);
            res.send("You have updated the users profile")
        } else {
            res.status(403).send('Access denied. Admins only.')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send("Database query error");
    }
});



module.exports = router;