const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  { timestamps: true });

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviews: [reviewSchema],
  desc: { type: String },
},
  { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
