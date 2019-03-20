const jwt = require("jsonwebtoken")
const express = require('express')
const router = express.Router()

const User = require('../models/user')
const secret = "THIS IS SUPER SECRET"

router
  .route('/token')
  .get(async(req, res) => {
    const userData = {
      _id: "123"
    }
    const expiresIn24hour = {
      expiresIn: '24h'
    }

    const token = await jwt.sign(userData, secret, expiresIn24hour)
    return res
      .status(200)
      .json({token})
  })
  .post(async(req, res) => {
    if (!req.headers.authorization) {
      res.sendStatus(401)
    }
    const token = req
      .headers
      .authorization
      .split('Bearer ')[1]
    const userData = await jwt.verify(token, secret)
    return res
      .status(200)
      .json(userData)
  })

router
  .route('/register')
  .post(async(req, res) => {
    try {
      const user = new User(req.body)
      await User.init()
      await user.save()
      res.sendStatus(204)
    } catch (err) {
      res
        .status(400)
        .json(err)
    }

  })

router.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = router