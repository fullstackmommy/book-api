const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const secret = "THIS IS SUPER SECRET"

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

const filterBooksBy = (property, value) => {
   return books.filter(b => b[property] === value);
};

verifyToken = async(req, res, next) => {
   if (!req.headers.authorization) 
      return res.sendStatus(403)
   try {
      const token = req
         .headers
         .authorization
         .split('Bearer ')[1]

      // return await jwt.verify(token, secret) await jwt.verify(token, secret) return
      // next()
      const payload = await jwt.verify(token, secret)
      if (payload) {
         return next()
      }

   } catch (err) {
      res
         .status(403)
         .send(err.message)
   }
}

router
   .route('/')
   .get((req, res) => {
      const {author, title} = req.query;

      if (title) {
         return Book
            .find({title})
            .then(book => {
               res.json(book)
            })
      }

      if (author) {
         return Book
            .find({author})
            .then(book => {
               res.json(book)
            })
      }

      return Book
         .find()
         .then(book => {
            return res.json(book)
         })
      /*
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
      }*/
   })
   .post(verifyToken, (req, res) => {
      const book = new Book(req.body)
      book.save((err, book) => {
         if (err) 
            return res.status(500).end()
         else 
            return res
               .status(201)
               .json(book)
         })
   })

// Protected routes:
router
   .use(verifyToken)
   .route('/:id')
   .put((req, res) => {
      return Book.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      }, (err, book) => {
         if (err) {
            res.sendStatus(400)
         }
         return res
            .status(202)
            .json(book)
      })
   })
   .delete((req, res) => {
      Book.findByIdAndDelete(req.params.id, (err, book) => {
         if (err) 
            return res.sendStatus(500)
         if (!book) {
            return res.sendStatus(404)
         }
         return res.sendStatus(202)
      })
   })

module.exports = router