const express = require('express');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiBooksRouter = require('./routes/apiBooks');

const app = express();
app.use(express.json());  //говорим что мы хотим получать информацию в формате json


app.use('/api/book/id', express.static(__dirname+'/public/download/12.txt'));
app.use('/', indexRouter);
app.use('/api', apiBooksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT);