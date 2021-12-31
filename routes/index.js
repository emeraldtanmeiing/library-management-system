const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//healthcheck route
router.get('/', async (req, res) => {
    let books;
    try{
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).populate('author').exec();
    }catch{
        books = []
    }
    res.render('index', { books: books });
})

module.exports = router