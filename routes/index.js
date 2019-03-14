const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.end("Hello")
})

// router.get('/books', (req, res) => {     res.end('Books') })

module.exports = router