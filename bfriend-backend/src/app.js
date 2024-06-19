const express = require("express")
const session = require("express-session")
const cors = require("cors")

const authentification = require("./controller/authController.js")
const accountManagement = require("./controller/accController.js")
const dataManagement = require("./controller/dataController.js")
const userProfiles = require("./controller/profileController")

const app = express()
const port = 9000

app.use(cors({
    origin: "*"
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

app.use("", userProfiles)
app.use("", authentification)
app.use("", accountManagement)
app.use("", dataManagement)

app.listen(port, () => {
    console.log("Bfriend is running on port:", port)
})