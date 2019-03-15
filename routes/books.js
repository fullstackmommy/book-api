const express = require('express')
const router = express.Router()

const books = [
   {
      id: "1",
      title: "ABC",
      author: "Bob",
      genre: "Computer",
      price: 25,
      quantity: 5
   }, {
      id: "2",
      title: "DEF",
      author: "John",
      genre: "Arts",
      price: 12,
      quantity: 10
   }, {
      id: "3",
      title: "GHI",
      author: "Jane",
      genre: "History",
      price: 34,
      quantity: 50
   }
]

verifyToken = (req, res, next) => {
   const {authorization} = req.headers
   if (!authorization) {
      res.sendStatus(403)
   } else {
      if (authorization === "Bearer my-token") {
         next()
      } else {
         res.sendStatus(403)
      }
   }
}

router
   .route('/')
   .get((req, res) => {
      if (Object.entries(req.query).length === 0) {
         res.json(books)
      } else {
         const keys = Object.keys(req.query)

         const filteredBooks = books.filter(book => keys.some(key => book[key] === req.query[key]))
         if (filteredBooks.length === 0) {
            res.status(200)
            res.send('No book found')
         } else {
            res.status(200)
            res.json(filteredBooks)
         }
      }

   })
   .post(verifyToken, (req, res) => {
      const book = req.body
      book.id = '214214214'
      books.push(book)
      res
         .status(201)
         .json(req.body)
   })

// Protected routes:
router.use(verifyToken)
router
   .route('/:id')
   .put((req, res) => {
      const book = books.find(book => book.id === req.params.id)
      if (book) {
         res
            .status(202)
            .json(req.body)
      } else {
         res.sendStatus(400)
      }
   })
   .delete((req, res) => {
      const book = books.find(book => book.id === req.params.id)
      if (book) {
         res.sendStatus(202)
      } else {
         res.sendStatus(400)
      }
   })

module.exports = router