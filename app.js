const path = require('path');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/public`));

const tourRoutes = require('./routes/api/tourRoutes');
const userRoutes = require('./routes/api/userRoutes');
const reviewRoutes = require('./routes/api/reviewRoutes');
const viewRoutes = require('./routes/api/viewRoutes');

// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'Forest Hiker',
//     user: 'Jonas',
//   });
// });

// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'All Tours',
//   });
// });

// app.get('/tour', (req, res) => {
//   res.status(200).render('tour', {
//     title: 'The Forest Hiker',
//   });
// });

app.use('/', viewRoutes);

app.use('/api/v1/tours', tourRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Couldnt find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Couldnt find ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Couldnt find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
