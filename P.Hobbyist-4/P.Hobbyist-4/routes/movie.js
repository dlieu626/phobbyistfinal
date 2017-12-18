const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";


var request = require('request');
var movies = require("../public/data/movie/user_movie.json");

function getMovieInfo(imdb) {
    var movieInfoAPI = api_base_url + "movie/" + imdb + "?api_key=" + api_key;
    console.log(movieInfoAPI);
    request.get(movieInfoAPI, function(error, response, body) {
        if (response.statusCode == 200) {
            console.log(body);
            var movieInfo = JSON.parse(body);
            console.log("!!!movieINFO" + movieInfo);
            return movieInfo;
        } else {
            console.log('error: ' + response.statusCode)
            console.log(body);
        }
    });
}

function getPoster() {
    console.log(JSON.stringify(movies));

    var configAPI = api_base_url + "configuration?api_key=" + api_key;
    var img_base_url;
    var poster_size = "w154/";
    request.get(configAPI, function(error, response, body) {
        if (response.statusCode == 200) {
            console.log(body);
            var config = JSON.parse(body);
            img_base_url = config.images['base_url'];
            console.log(img_base_url);
            console.log(movies.movies.length);
            for (var i = 0; i < movies.movies.length; i++) {
                console.log(movies.movies[i]);
                var movieInfo = getMovieInfo(movies.movies[i].imdb);
                //console.log("movieInfo: " + movieInfo);
                //var poster_url = img_base_url + poster_size + JSON.stringify(movieInfo['poster_path']);
                //movies.movies[i].poster = poster_url;
            }

        } else {
            console.log('error: ' + response.statusCode)
            console.log(body);
        }
    })
}



exports.view = function(req, res) {
    console.log(movies);
    var length = movies.movies.length;
    var index = Math.floor((Math.random() * (length - 1)));
    var randomMovie = movies.movies[index];
    while (randomMovie.watched) {
        index = Math.floor((Math.random() * (length - 1)));
        randomMovie = movies.movies[index];
    }
    movies.random = randomMovie;
    res.render('movie', movies);

};