const mongoose = require('mongoose');

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
        type: Buffer,
        required: true,
    },
    coverImageType: {
        type: String,
        required: true,
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
    if(this.cover != null && this.coverImageType != null){
        return `data:${this.coverImageType};charser=utf-8;base64,${this.cover.toString('base64')}`;
    }
})

module.exports = mongoose.model('Book', bookSchema);