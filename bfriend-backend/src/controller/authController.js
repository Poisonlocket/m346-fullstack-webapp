const express = require("express");
const SHA256 = require("crypto-js/sha256");
const { Client } = require("pg");
require("dotenv").config();


const router = express.Router()

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
        console.log('Connected to the database (auth)');
    }
});

  

router.get("/api/login", (req, res) => {
    if (req.session.auth === "auth") {
        res.redirect("/")
    } else {
        res.send("Not yet implemented.")
    }
})

router.post("/api/registration", async (req, res) => {
    if(req.session.auth !== "auth") {
        const name = JSON.stringify(req.body.name)
        const lastname = JSON.stringify(req.body.lastname)
        const age = JSON.stringify(req.body.age)
        const username = JSON.stringify(req.body.username)
        const email = JSON.stringify(req.body.email)
        const password = JSON.stringify(SHA256(req.body.password).words)
        const about = JSON.stringify(req.body.about)
        
        if (!username || !email || !password || !name || !lastname || !age) {
            return res.status(400).send('Missing required fields');
          }
        
        req.session.user = username
        
        const query = "INSERT INTO user_data (first_name, last_name, age, username, email, password, about_me) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        const values = [name , lastname, age, username, email, password, about]

        try {
            await client.query(query, values);
            res.status(200).send("Data inserted successfully!");
        } catch (error) {
            res.status(500).send(`Error inserting data: ${error.message}`)
        }

    } else {
        res.redirect("/login")
    }
});

const getUserId = async (username) => {
    const query = "SELECT id FROM user_data WHERE username = $1";
    const values = [username];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0].id;
};

router.post("/api/registration-hobbies", async (req, res) => {
    if (req.session.auth === "auth") {
        try {
            const user = req.session.user;
            const userId = await getUserId(user);
            const hobbies = req.body.hobbies;

            for (const hobbyId of hobbies) {
                const query = "INSERT INTO user_hobbies (user_id, hobby_id) VALUES ($1, $2) ON CONFLICT (user_id, hobby_id) DO NOTHING";
                const values = [userId, hobbyId];
                await client.query(query, values);
            }

            res.status(200).send("Hobbies registered successfully!");
        } catch (error) {
            res.status(500).send(`Error registering hobbies: ${error.message}`);
        }
    } else {
        res.send('ERROR: Not Logged in.');
    }
});

router.post("/api/login", async (req, res) => {
    if (req.session.auth !== "auth") {
        const username = JSON.stringify(req.body.username)
        const pw = JSON.stringify(SHA256(req.body.password).words)
        
        const query = "SELECT username, password FROM user_data WHERE username = $1"
        const values = [username];

        try {
            const result = await client.query(query, values)
            
            if (result.rows.length === 0) {
                return res.status(404).send("User not found.")
            } else {
                const userData = result.rows[0]
                
                if (userData.username === username && userData.password === pw) {
                    req.session.auth = "auth";
                    req.session.user = username;
                    res.status(200).send("Access granted.") // replace with redirect
                } else {
                    res.status(307).send("Access denied.") //replace with redirect
                    
                }
                
            }
        } catch (error) {
            res.status(500).send(`Error retrieving data: ${error.message}`)
        }

    } else {
        res.redirect("/")
    }
    
})

router.get("/api/logout", (req, res) => {

    if (req.session.auth === "auth") {
        req.session.auth = null
        req.session.user = null
        res.status(200).send("Logged out.") //redirect to login page
    } else {
        res.status(307).send("Not even logged in.") //redirect to login page
    }

})

module.exports = router