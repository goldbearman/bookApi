const express = require('express');

const {v4: uuid} = require('uuid')

class Book {
  constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", id = uuid()) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
  }
}

const stor = {
  books: [
    new Book('Михаил Булгаков - Мастер и Маргарита','Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
    new Book('Антуан де Сент-Экзюпери - Маленький принц','«Маленький принц» актуален для любого возраста.'),
    new Book('Лев Толстой - Война и мир','Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
  ],
};

const app = express();
app.use(express.json());  //говорим что мы хотим получать информацию в формате json

app.get('/api/books', (req, res) => {
  const {books} = stor;
  console.log(req.params);
  res.json(books)
});

app.get('/api/books/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  console.log(req.params);
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | страница не найдена')
  }

});

app.post('/api/user/login', (req, res) => {
  const regObj = { id: 1, mail: "test@mail.ru" };
  res.status(201);
  res.json(regObj);
});

app.post('/api/books/', (req, res) => {
  const {books} = stor;
  const {title, description} = req.body;

  const newBook = new Book(title, description);
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const {books} = stor;
  const {title, description} = req.body;
  const {id} = req.params;
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

app.delete('/api/books/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json(true)
  } else {
    res.status(404)
    res.json('404 | страница не найдена')
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);