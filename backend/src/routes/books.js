const express = require('express');
const router = express.Router();

// Static book data (matches frontend data/books.js)
// In production you'd store these in MongoDB
const books = [
  { id: '1', title: 'English File Advanced', author: 'Clive Oxenden, Christina Latham-Koenig', publisher: 'Oxford University Press', language: 'English', level: 'C1', price: 890, isbn: '978-0-19-403727-0', pages: 208, category: 'General English', featured: true, new: false },
  { id: '2', title: 'Schritte International Neu A1', author: 'Daniela Niebisch', publisher: 'Hueber', language: 'German', level: 'A1', price: 750, isbn: '978-3-19-001080-0', pages: 240, category: 'General Language', featured: true, new: true },
  { id: '3', title: 'Alter Ego+ B2', author: 'Annie Berthet, Catherine Hugot', publisher: 'Didier', language: 'French', level: 'B2', price: 820, isbn: '978-2-278-07392-2', pages: 224, category: 'General Language', featured: true, new: false },
  { id: '4', title: 'Nuevo Español en Marcha B1', author: 'Francisca Castro, Pilar Díaz', publisher: 'Santillana', language: 'Spanish', level: 'B1', price: 780, isbn: '978-84-9780-415-3', pages: 200, category: 'General Language', featured: true, new: true },
  { id: '5', title: 'Čeština pro cizince A2', author: 'Lída Holá', publisher: 'Fraus', language: 'Czech', level: 'A2', price: 690, isbn: '978-80-7238-673-3', pages: 192, category: 'General Language', featured: false, new: false },
  { id: '6', title: 'Business English Grammar', author: 'Paul Emmerson', publisher: 'Cambridge University Press', language: 'English', level: 'B2', price: 950, isbn: '978-1-107-62938-4', pages: 256, category: 'Business English', featured: false, new: false },
  { id: '7', title: 'IELTS Preparation & Practice', author: 'Wendy Sahanaya', publisher: 'Oxford University Press', language: 'English', level: 'B2', price: 1050, isbn: '978-0-19-553565-0', pages: 320, category: 'Exam Preparation', featured: false, new: false },
  { id: '8', title: 'Deutsch Üben - Grammatik A1/A2', author: 'Lehr- und Übungsbuch', publisher: 'Hueber', language: 'German', level: 'A2', price: 620, isbn: '978-3-19-007493-2', pages: 160, category: 'Grammar', featured: false, new: true },
  { id: '9', title: 'English Vocabulary in Use Advanced', author: "Michael McCarthy, Felicity O'Dell", publisher: 'Cambridge University Press', language: 'English', level: 'C1', price: 870, isbn: '978-1-107-68044-6', pages: 288, category: 'Vocabulary', featured: false, new: false },
  { id: '10', title: 'Le Nouveau Taxi! A1', author: 'Guy Capelle, Robert Menand', publisher: 'Didier', language: 'French', level: 'A1', price: 710, isbn: '978-2-01-155800-2', pages: 184, category: 'General Language', featured: false, new: false },
  { id: '11', title: 'Pasaporte Español C1', author: 'Matilde Cerrolaza', publisher: 'Santillana', language: 'Spanish', level: 'C1', price: 850, isbn: '978-84-9780-200-5', pages: 216, category: 'General Language', featured: false, new: false },
  { id: '12', title: 'Nová čeština expres 1', author: 'Lída Holá, Pavla Bořilová', publisher: 'Fraus', language: 'Czech', level: 'A1', price: 650, isbn: '978-80-7238-880-5', pages: 144, category: 'General Language', featured: false, new: true },
];

// GET /api/books — list with optional filters
router.get('/', (req, res) => {
  const { language, level, publisher, search, featured } = req.query;
  let result = [...books];
  if (language) result = result.filter(b => b.language === language);
  if (level) result = result.filter(b => b.level === level);
  if (publisher) result = result.filter(b => b.publisher === publisher);
  if (featured === 'true') result = result.filter(b => b.featured);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  }
  res.json({ success: true, books: result, total: result.length });
});

// GET /api/books/:id — single book
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  res.json({ success: true, book });
});

module.exports = router;
