const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3013;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gkdBookStore', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    description: String,
    price: Number,
    ebook_link: String
});
const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/books', async (req, res) => {
    const { title, author, category, description, price, ebook_link } = req.body;
    const book = new Book({ title, author, category, description, price, ebook_link });
    try {
        await book.save();
        res.status(201).send(book);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, category, description, price, ebook_link } = req.body;
    try {
        const book = await Book.findByIdAndUpdate(id, { title, author, category, description, price, ebook_link }, { new: true });
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.send(book);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.send(book);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
