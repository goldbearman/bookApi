const express = require('express');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiBooksRouter = require('./routes/apiBooks');

const app = express();
app.use(express.urlencoded());
app.set('view engine','ejs');


app.use('/', indexRouter);
app.use('/api', apiBooksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT);