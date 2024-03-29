const path = require('path')
const express = require('express')
require('./database')
const cookieParser = require('cookie-parser')
const app = express()
const server = app.listen(3000)
module.exports = {
    server,
    app,
}

app.use(cookieParser())
require('./config/jwt.config')
require('./config/socket.config')
const router = require('./routes')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)
