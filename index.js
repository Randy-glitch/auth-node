const express = require("express")
const session = require("express-session")
const jwt = require("jsonwebtoken")
const auth_users = require("./routers/auth_users")
require('dotenv').config()
const router = require("./routers/route")


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: true,
    saveUninitialized: true,

  }))


  
  app.use("/api/*", function auth(req, res, next){
      const accesstoken = req.session.token;
        jwt.verify(accesstoken, process.env.SECRET, (err, user) => {
            if (err){
                res.send("access denied, token is incorrect")
            }else{
                next()
            }
        })
    }
);


app.use("/api", router)
app.use("/customer", auth_users)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(
        `SERVER RUN IN PORT: ${PORT}`
    );
})
