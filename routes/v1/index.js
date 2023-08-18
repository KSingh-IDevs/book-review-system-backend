const express = require('express')
const router = express.Router()
const userRoute = require('./user')
const authMiddleware = require('../../middlewares/user.auth')
const bookRouter = require('./book')

router.use('/user', userRoute)
router.use('/books', bookRouter)

// router.get('/protected', authMiddleware, (req, res) => {
//     res.json({ message: 'Protected route accessed' });
// });

module.exports = router