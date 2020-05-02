const Tour = require('../models/Tour');

exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
};
