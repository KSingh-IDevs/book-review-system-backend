const express = require('express')
const router = express.Router()
const bookController = require('../../../controllers/book.controller')
const userAuth = require('../../../middlewares/user.auth')

//* With user auth
router.post('/create', userAuth, bookController.createBook);
router.get('/user', userAuth, bookController.getUserBooks);
router.get('/:id', userAuth, bookController.getBookById);
router.put('/:id', userAuth, bookController.updateBook);
router.delete('/:id', userAuth, bookController.deleteBook);

//* With no auth
router.get('/', bookController.getAllBooks);


module.exports = router