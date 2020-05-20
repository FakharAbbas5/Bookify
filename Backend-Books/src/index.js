const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const UserRouter = require('./routes/user');
const BookRouter = require('./routes/book')
const auth = require('./middlewares/auth');
app.use('/uploads', express.static('uploads'))
app.use('/users-images', express.static('users-images'))
app.use(express.json());



const port = process.env.PORT || 3000;
app.use(cors());
app.use(UserRouter);
app.use(BookRouter);
app.use(auth)

mongoose.connect('mongodb://127.0.0.1:27017/BooksDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.listen(port, () => {
    console.log("Server is Listening at Port " + port)
})