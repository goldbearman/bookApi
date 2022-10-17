const exptress = require('express');
const router = exptress.Router();
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/bookfile')

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
  fileMulter.single('cover-img'),    //(ожидаемое имя файла)
  (req, res) => {
    if (req.file) {
      const { path } = req.file
      res.json({ path })
    }
    res.json()
  })


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