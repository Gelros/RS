const express = require('express')

const bodyParser = require("body-parser")

const cookieParser = require("cookie-parser")

const userRoutes = require("./routes/user")

const postRoutes = require("./routes/post")

require("dotenv").config({path:"./config/.env"})

require('./config/db')

const {checkUser, requireAuth} = require('./middleware/auth.middleware')

const path = require('path')

const app = express()

const cors = require('cors')

//Requêtes autorisées par l'exterieur
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
app.use(cors(corsOptions));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())

//jwt
//Vérifie sur n'importe quels routes si l'utilisateur a un token
app.get("*", checkUser)
app.get("/jwtid", requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
})

//routes
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)


// Server
app.listen(process.env.PORT, ()=> {
    console.log(`Server listening on Port ${process.env.PORT}`);
})