const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

//book routes
router.get('/', async (req, res) => {
    try{
        let searchOptions = {}
        if(req.query.title != null && req.query.title != '') {
            searchOptions.title = new RegExp(req.query.title.trim(), 'i')
        }
     
        const books = await Book.find(searchOptions)
        res.render('books/index', { 
            books: books,
            searchOptions: req.query
        });
        
    }catch{
        res.redirect('/');
    }

    
})

router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

const imageMimeTypes = ['image/jpeg', 'image/png', 'image.gif']

router.post('/', async (req, res) => {
    const payload = req.body
    const book = new Book({
        title: payload.title,
        author: payload.author,
        publishDate: payload.publishDate,
        pageCount: payload.pageCount,
        description: payload.description
    })

    saveCover(book, req.body.cover);

    try{
        const newBook = await book.save();

        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    }catch{
        renderNewPage(res, book, 'Create book Failed')
    }
})

const renderNewPage = async (res, book, errorMessage = null) => {
    
    try{
        const authors = await Author.find({});
        res.render('books/new', {
            authors: authors,
            book: book,
            ...errorMessage && {errorMessage: errorMessage}
        });
    }catch{
        res.redirect('/books');
    }
    
}

const saveCover = (book, encodedCover) => {
    if(encodedCover == null) return;
    const cover = JSON.parse(encodedCover);
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.cover = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}


module.exports = router