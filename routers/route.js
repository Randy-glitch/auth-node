const express = require("express")
const session = require("express-session")
const booksList = require("../db/booksdb")
const router = express.Router()


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: true,
    saveUninitialized: true,

  }))



router.get("/books", async (req,res) =>{ 
    await res.json(booksList)
})

router.get("/:id", (req,res) =>{
    let id = booksList[req.params.id - 1]
    res.send(id)
})

router.get("/author/:author", async (req,res) =>{
    let bookTilte = await req.params.author.toLowerCase()
    const author = await booksList.filter((book) => book.author.toLowerCase() === bookTilte) 
    res.send(author)
})
router.get("/title/:title",  (req,res) =>{
    let bookTilte =  req.params.title.toLowerCase()
    const title =  booksList.filter((book) => book.title.toLowerCase() === bookTilte) 
    res.send(title)
})
router.get("/reviews/:id",  (req,res) =>{
    let reviews =  booksList[req.params.id - 1].reviews

    res.send(reviews)
})
router.post("/reviews/:ibsn",  (req,res) =>{
    let reviewIbsn = booksList[req.params.ibsn - 1]
    const nombre = req.session.user
    const review = req.body.review
    const reviewList = reviewIbsn.reviews.filter((rvw) => {
        return rvw.User === nombre
    } )
    
    if(!reviewList.length > 0){
        reviewIbsn.reviews.unshift({User: nombre, review:review})
        res.json({review: reviewIbsn, msg:"added !"})
    }else{
        let NewreView = {User: nombre, review:review}
        if (reviewIbsn.reviews[0]  === NewreView) {
            res.send("review is iqual to a las review")
        } else {
            reviewIbsn.reviews[0] = NewreView
            res.json({review: reviewIbsn, msg:"Update"})
        } 
        // reviewIbsn.reviews = [{User: nombre, review:review}, ...reviewIbsn.reviews]
        res.json({review: reviewIbsn, all:reviewIbsn.reviews})
    }
   
   
    res.json({review: reviewIbsn, body:req.body})
})

module.exports = router