const express = require("express")
const session = require("express-session")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const booksList = require("../db/booksdb")

const auth_users = express.Router()
const app = new express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: true,
    saveUninitialized: true,
}))




const users = []
auth_users.post("/login", (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        res.send("you must complete user o password !")
    }
    const userf = users.filter((use) => use.username === username)
    const user = {username: username}
    if(userf.length > 0){
        
         req.session.token = jwt.sign(user, process.env.SECRET, {expiresIn: "5m"} )
        req.session.user = username
        res.json({msg: "user loggeado !"})
    }else{
        res.json({msg: "user not REGISTED !", users: users})

    }
    res.json({msg: "user was loggin", token: req.session.token})
})

auth_users.post("/register", (req, res) => {
    const {username, password} = req.body
    
    if(!username || !password) {
        res.send("you must complete user o password !")
    }
    const user = users.filter((use) => use.username === username)
    if(!user.length > 0){
        users.push({username: username, password: password})
        res.json({msg: "user created register !"})
    }else{
        res.json({msg: "user exist !", users: users})

    }

    
})


auth_users.delete('/:isbn', (req, res) =>{
    reviews = booksList[req.params.isbn - 1].reviews
    seachBook = reviews.filter((user) => user.User !== req.session.user)
    reviews = seachBook
    res.json({msg: 'Reviws Delete', reviews})


})




module.exports = auth_users