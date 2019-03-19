const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        min: 0
    },
    quantity: {
        type: Number,
        min: 0
    }
}, {timestamps: true})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book