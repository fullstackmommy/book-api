const express = require('express')
const router = express.Router()

const books = [
    {
        title: "ABC",
        author: "Bob",
        genre: "Computer",
        price: 25,
        quantity: 5
    }, {
        title: "DEF",
        author: "John",
        genre: "Arts",
        price: 12,
        quantity: 10
    }, {
        title: "GHI",
        author: "Jane",
        genre: "History",
        price: 34,
        quantity: 50
    }
]

router
    .route('/')
    .get((req, res, next) => {
        res.json(books)
    })
    .post((req, res, next) => {
        const book = req.body
        book.id = '214214214'
        book.author = ''
        book.genre = ''
        book.price = 0
        book.quantity = 0
        res
            .status(201)
            .json(book)
    })

module.exports = router