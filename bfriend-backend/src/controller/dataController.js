const express = require("express");
const {Client} = require('pg');
require("dotenv").config()
const fs = require("fs")
const { google } = require("googleapis")

const apikeys = require("./apiKeys.json");
const router = express.Router();

router.post("/api/upload", (req, res) => {
    if (req.session.auth === "auth") {
        const username = req.session.user
        const logFile = username + ".log"
        console.log(logFile)

    }
    //Get previous info
    //Add new info
    //upload again
})

module.exports = router