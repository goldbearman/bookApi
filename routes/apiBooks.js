const exptress = require('express');
const path = require('path');

const router = exptress.Router();
const {v4: uuid} = require('uuid');
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
    const {books} = stor;
    res.render('book/index', {title: 'Books', books: books});
});

router.get('/books/create', (req, res) => {
    res.render('book/create', {title: 'Create book', books: {}});
});

router.post('/books/create', (req, res) => {
    const {books} = stor;
    const {title, description} = req.body;
    const book = new Book(title, description);
    books.push(book);

    res.redirect('/books');
});

// router.post('/books', (req, res) => {
//   const {books} = stor;
//   const {title, description} = req.body;
//
//   const newBook = new Book(title, description);
//   books.push(newBook);
//
//   res.status(201);
//   res.json(newBook);
// });

router.get('/books/:id', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        res.render('book/view', {title: 'Book', book: books[idx]});
    } else {
        res.redirect('/404')
    }
});

router.get('/books/update/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    res.render('book/update', {title: 'Update book', book: books[idx]});
  } else {
    res.redirect('/404')
  }
});

router.post('/books/update/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const {title, description} = req.body;
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    books[idx]={
      ...books[idx],title, description,
    }
  } else {
    res.redirect('/404')
  }
});

router.post('/books/delete/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id)

  console.log('post')
  if (idx !== -1) {
    books.slice(idx, 1);
    res.redirect('/books')
  } else {
    res.redirect('/404')
  }
});





router.post('/user/login', (req, res) => {
    const regObj = {id: 1, mail: "test@mail.ru"};
    res.status(201);
    res.json(regObj);
});



router.get('/book/:id/download', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const book = books.find(el => el.id === id);
    if (book) {
        const file = path.join(__dirname, '..', book.fileBook);
        res.download(file, book.fileName);
    } else {
        res.json('Запрашиваемый ресурс не найден!')
    }
});

router.post('/books/download',
    fileMulter.single('bookFile'),    //(ожидаемое имя файла)
    (req, res, next) => {
        if (req.file) {
            const {path} = req.file
            if (req.body.bookFile) {
                try {
                    const newBook = JSON.parse(req.body.bookFile);
                    newBook.fileBook = path;
                    newBook.id = uuid();
                    if (!keyComparison(new Book(), newBook)) {         //Проверка наличия всех полей
                        res.json('Не хватает данных в книге!');
                    } else {
                        const isNewBook = stor.books.every(el => el.title !== newBook.title && el.authors !== newBook.authors);
                        if (isNewBook) {                                  //Проверка дублирующей книги
                            stor.books.push(newBook);
                            res.json({path})
                        } else res.json('Данная книга уже есть!');
                    }
                } catch (e) {
                    res.json('Неверная структура данных!');
                }
            } else res.json('Неверная структура данных!');
        } else res.json('Нет файла книги!');
        res.json()
    });

router.put('/books/:id', (req, res) => {
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

router.delete('/books/:id', (req, res) => {
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

//Functions
function keyComparison(bookExample, book) {
    return Object.keys(bookExample).every(el => {
        return book[el] !== undefined;
    });
}

module.exports = router;