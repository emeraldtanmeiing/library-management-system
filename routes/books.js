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
    renderFormPage(res, new Book(), "new")
})

router.get('/:id', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', {
            book: book
        })
    }catch{
        res.redirect('/books')
    }
})

router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    renderFormPage(res, book, 'edit');
})

router.put('/:id', async (req, res) => {
    let book;

    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = req.body.publishDate
        book.pageCount = req.body.pageCount
        book.description = req.body.description
     
        if(req.book?.cover !== null && req.book?.cover !== '' && req.book?.cover !== undefined){
            saveCover(book, req.body.cover);
        }

        await book.save();
        res.redirect(`/books/${book.id}`);

    }catch (err){
        console.log(err)
        if(book == null){
            res.redirect('/books');
        } else {
            const authors = await Author.find({});
            res.render('books/edit', {
                authors: authors,
                book: book,
                errorMessage: 'Update Book Failed'
            })
        }
        
    }
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
        renderFormPage(res, book, 'new', 'Create book Failed');
    }
})

router.delete('/:id', async (req, res) => {
    let book;

    try{

        book = await Book.findById(req.params.id);
        await book.remove()
        res.redirect('/books');

    }catch{

        if(book == null){
            res.redirect('/books');
        } else {
            res.redirect(`/books/${req.params.id}`);
        }
        
    }
})

const renderFormPage = async (res, book, form, errorMessage = null) => {
    
    try{
        const authors = await Author.find({});
        res.render(`books/${form}`, {
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