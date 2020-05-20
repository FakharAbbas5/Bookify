const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Price Should be a positive Number");
            }
        }
    },
    info: {
        type: String,
        required: true,
        trim: true,
    },
    inCart: {
        type: Boolean,
        default: false
    },
    count: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const Book = mongoose.model("Book", bookSchema)


module.exports = Book;