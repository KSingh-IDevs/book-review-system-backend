const Book = require('../models/book.schema');


exports.createBook = async (req, res) => {
    try {
        const { title, author, isbn, desc } = req.body;


        if (!title || !author || !isbn) {
            return res.status(400).json({ message: 'Title, author, and ISBN are required' });
        }


        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

        const book = new Book({ title, author, isbn, desc, createdBy: req.user.userId });
        await book.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.getUserBooks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = { createdBy: userId };

        if (req.query.search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { author: { $regex: req.query.search, $options: 'i' } },
                ],
            };
        }

        const totalUserBooks = await Book.countDocuments(query);
        const userBooks = await Book.find(query).skip(skip).limit(limit);

        res.json({
            userBooks,
            totalUserBooks,
            currentPage: page,
            totalPages: Math.ceil(totalUserBooks / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.search) {
            query = {
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { author: { $regex: req.query.search, $options: 'i' } },
                ],
            };
        }

        const totalBooks = await Book.countDocuments(query);
        const books = await Book.find(query).skip(skip).limit(limit);

        res.json({ books, totalBooks, currentPage: page, totalPages: Math.ceil(totalBooks / limit) });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You do not have permission to access this book' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author, isbn, desc } = req.body;


        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }


        if (book.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You do not have permission to update this book' });
        }


        if (!title || !author || !isbn) {
            return res.status(400).json({ message: 'Title, author, and ISBN are required' });
        }


        if (isbn !== book.isbn) {
            const existingBook = await Book.findOne({ isbn });
            if (existingBook) {
                return res.status(400).json({ message: 'Book with this ISBN already exists' });
            }
        }


        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.desc = desc;
        await book.save();

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this book' });
        }

        await Book.findByIdAndDelete(bookId);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

//* Book Review controller
exports.writeReview = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { rating, reviewContent } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !reviewContent) {
            return res.status(400).json({ message: 'Invalid rating or reviewContent' });
        }

        const review = {
            rating,
            reviewContent,
            createdBy: req.user.userId,
        };

        book.reviews.push(review);
        await book.save();

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};


exports.viewReviews = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book.reviews);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviewIndex = book.reviews.findIndex((review) => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (book.reviews[reviewIndex].createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this review' });
        }

        book.reviews.splice(reviewIndex, 1);
        await book.save();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};