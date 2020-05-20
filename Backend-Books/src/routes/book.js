const Book = require('../models/book');
const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth')
const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function (req, file, cb) {
            //req.body is empty...
            cb(null, file.originalname);
        }
    }
);

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb("Please Upload and Image File", false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.post('/books', auth, upload.single('Image'), async (req, res) => {
    console.log(req.file)
    try {
        const imagePath = req.file.path;
        const book = new Book({
            ...req.body,
            image: imagePath,
            owner: req.user._id
        })
        const nbook = await book.save();
        if (!nbook) {
            res.status(400).send();
        }

        nbook.image = nbook.image.replace("uploads\\", "http://localhost:3000/uploads/");

        res.send({ book: nbook });
    }
    catch (error) {
        res.status(500).send(error);
    }

})


router.get('/books/me', auth, async (req, res) => {
    try {
        const books = await Book.find({ owner: req.user._id });
        if (!books) {
            res.status(400).send();
        }

        res.send(books);
    }
    catch (error) {
        res.status(500).send(error);
    }
})


router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        if (!books) {
            res.status(404).send();
        }
        books.forEach(book => {
            book.image = book.image.replace("uploads\\", "http://localhost:3000/uploads/")
        })
        res.send(books);
    }
    catch (error) {
        res.status(500).send();
    }
})

router.get('/books/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const book = await Book.findById(id);
        book.image = book.image.replace("uploads\\", "http://localhost:3000/uploads/")
        if (!book) {
            res.status(400).send("Book Not Found");
        }
        res.send(book);
    }
    catch (error) {
        res.status(500).send(error);
    }
})




module.exports = router;