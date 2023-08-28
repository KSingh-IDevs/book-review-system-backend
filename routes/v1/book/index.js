const express = require('express')
const router = express.Router()
const bookController = require('../../../controllers/book.controller')
const userAuth = require('../../../middlewares/user.auth')

//* With user auth
router.post('/', userAuth, bookController.createBook);
router.get('/user', userAuth, bookController.getUserBooks);
router.get('/:id', userAuth, bookController.getBookById);
router.put('/:id', userAuth, bookController.updateBook);
router.delete('/:id', userAuth, bookController.deleteBook);

//* With no auth
router.get('/', bookController.getAllBooks);

//* Book review 
router.post('/:id/reviews', userAuth, bookController.writeReview)
router.get('/:id/reviews', bookController.viewReviews);
router.delete('/:bookId/reviews/:reviewId', userAuth, bookController.deleteReview);


module.exports = router