const mongoose = require('mongoose');
const path = require('path');

const coverBasePath = 'uploads/booksCover'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number
    },
    cover: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
});

bookSchema.virtual('coverPath').get(function(){
    if(this.cover != null){
        return path.join('/', coverBasePath, this.cover);
    }
})

module.exports = mongoose.model('Book', bookSchema);module.exports.coverBasePath = coverBasePath;