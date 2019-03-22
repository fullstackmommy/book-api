const jwt = require("jsonwebtoken")
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')
const secret = "THIS IS SUPER SECRET"

router
  .route('/token')
  .get(async(req, res) => {
    // authenticate the user
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})

      if (!user) {
        throw new Error('You are not authorized')
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        throw new Error('You are not authorized')
      }

      const userData = {
        username
      }
      const expiresIn24hour = {
        expiresIn: '24h'
      }

      const token = await jwt.sign(userData, secret, expiresIn24hour)
      return res
        .status(200)
        .json({token})

    } catch (err) {
      res
        .status(401)
        .send(err.message)
    }

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

router
  .route('/login')
  .post(async(req, res) => {
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})

      if (!user) {
        throw new Error('You are not authorized')
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        throw new Error('You are not authorized')
      }

      //res.cookie('cookie-monster', 'me love cookies')
      return res
        .status(200)
        .end("You are logged in")

    } catch (err) {
      res
        .status(401)
        .send(err.message)
    }

  })

router.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = router