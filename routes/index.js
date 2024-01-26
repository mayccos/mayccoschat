const userRoutes = require('./user.routes')
const authRoutes = require('./auth.routes')
const router = require('express').Router()
const { ensureAuthenticated } = require('../config/security.config')

router.use('/users', userRoutes)
router.use('/auth', authRoutes)

router.get('/', ensureAuthenticated, (req, res) => {
    req.isAuthenticated()
        ? res.render('index', { user: req.user })
        : res.redirect('/auth/signin/form')
})
router.get('*', (req, res) => res.redirect('/'))

module.exports = router
