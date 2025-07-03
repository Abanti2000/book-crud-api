import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { readJSON, writeJSON } from '../utils/fileHandler.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();
router.use(authenticate);

const BOOK_FILE = './data/books.json';

router.get('/', async (req, res) => {
  try {
    const books = await readJSON(BOOK_FILE);
    const { genre, page = 1, limit = 10 } = req.query;

    // Optional genre filter
    let filteredBooks = books;
    if (genre) {
      filteredBooks = books.filter(
        book => book.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + parseInt(limit));

    res.status(200).json({
      success: true,
      total: filteredBooks.length,
      page: +page,
      limit: +limit,
      data: paginatedBooks
    });
  } catch (err) {
    console.error('Error in GET /books:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
});




router.get('/:id', async (req, res) => {
  try {
    const books = await readJSON(BOOK_FILE);
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    console.error('Get book by ID error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch book details' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({ success: false, message: 'Title, author, and genre are required' });
    }

    const newBook = { id: uuid(), ...req.body, userId: req.user.id };
    const books = await readJSON(BOOK_FILE);
    books.push(newBook);
    await writeJSON(BOOK_FILE, books);

    res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ success: false, message: 'Failed to add book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const books = await readJSON(BOOK_FILE);
    const index = books.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' });

    if (books[index].userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this book' });
    }

    books[index] = { ...books[index], ...req.body };
    await writeJSON(BOOK_FILE, books);

    res.json({ success: true, message: 'Book updated successfully', data: books[index] });
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ success: false, message: 'Failed to update book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const books = await readJSON(BOOK_FILE);
    const index = books.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' });

    if (books[index].userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this book' });
    }

    books.splice(index, 1);
    await writeJSON(BOOK_FILE, books);

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete book' });
  }
});

export default router;
