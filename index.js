const express = require('express');

const { v4: uuid } = require('uuid')

const indexRouter = require('./routes/index');
const apiBooksRouter = require('./routes/apiBooks');

const app = express();
app.use(express.json());  //говорим что мы хотим получать информацию в формате json

app.use('/', indexRouter);
app.use('/api', apiBooksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);