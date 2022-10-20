const exptress = require('express');
const router = exptress.Router();
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/bookfile')
const express = require("express");

class Book {
  constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", id = uuid()) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

const bookExample = {
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: "string",
  fileCover: "string",
  fileName: "string",
  fileBook: "string"
};

const stor = {
  books: [
    new Book('Михаил Булгаков - Мастер и Маргарита', 'Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
    new Book('Антуан де Сент-Экзюпери - Маленький принц', '«Маленький принц» актуален для любого возраста.'),
    new Book('Лев Толстой - Война и мир', 'Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
  ],
};

router.get('/books', (req, res) => {
  const { books } = stor;
  console.log('req.params', req.params);
  res.json(books)
});

router.get('/books/:id', (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  console.log(req.params);
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена')
  }

});

// app.use('/api/book/id', express.static(__dirname+'/public/download/12.txt'));
router.get('/book/:id/download', (req, res) => {
  console.log(req.params);
  const { books } = stor;
  const { id } = req.params;
  const book = books.find(el => el.id === id);
  console.log(book);
  if (book) {
    console.log(`${book.fileBook}`);
    const file = `${book.fileBook}`;
    res.download(file);
  } else {
    res.status(404);
    res.json('404 | страница не найдена')
  }
})

router.post('/user/login', (req, res) => {
  const regObj = { id: 1, mail: "test@mail.ru" };
  res.status(201);
  res.json(regObj);
});

router.post('/books', (req, res) => {
  const { books } = stor;
  const { title, description } = req.body;

  const newBook = new Book(title, description);
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

router.post('/books/download',
  fileMulter.single('bookFile'),    //(ожидаемое имя файла)
  (req, res) => {
    console.log(req.file)
    if (req.file) {
      const { path } = req.file
      res.json({ path })
      if (req.body.bookFile) {
        const newBook = JSON.parse(req.body.bookFile);
        newBook.fileBook = path;
        newBook.id = uuid();
        stor.books.push(newBook);
      }
    }
    res.json()
  });


router.put('/books/:id', (req, res) => {
  const { books } = stor;
  const { title, description } = req.body;
  const { id } = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
    };

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

router.delete('/books/:id', (req, res) => {
  const { books } = stor;
  const { id } = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json(true)
  } else {
    res.status(404)
    res.json('404 | страница не найдена')
  }
});

module.exports = router;