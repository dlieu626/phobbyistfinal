var movies = require("../public/data/movie/user_movie.json");

exports.view = function(req, res) {

    res.render('movieHistory', movies);

};