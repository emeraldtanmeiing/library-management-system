const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Book = require('../models/book');
const Author = require('../models/author');

//book routes
router.get('/', async (req, res) => {
    try{
        let searchOptions = {}
        if(req.query.title != null && req.query.title != '') {
            searchOptions.title = new RegExp(req.query.title.trim(), 'i')
        }
        console.log(searchOptions)
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
const uploadPath = path.join('public', Book.coverBasePath);

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


router.post('/', upload.single('cover'), async (req, res) => {
    const payload = req.body
    const fileName = req.file?.filename || null

    const book = new Book({
        title: payload.title,
        author: payload.author,
        publishDate: payload.publishDate,
        pageCount: payload.pageCount,
        cover: fileName,
        description: payload.description
    })

    try{
        const newBook = await book.save();

        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    }catch{
        if(book.cover != null){
            fs.unlink(path.join(uploadPath, book.cover), (err) => {
                if (err) console.error(err);
              });
        }
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


module.exports = router