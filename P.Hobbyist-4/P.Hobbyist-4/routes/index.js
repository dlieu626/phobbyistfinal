const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";

var request = require('request');
var movies = require("../public/data/movie/user_movie.json");
var indexJSON = require("../public/data/movie/index.json");
var recentJSON = require("../public/data/movie/recent.json");
var recommendJSON = require('../public/data/movie/recommend.json');
var fs = require('fs');

exports.view = function(req, res) {
    var length = movies.movies.length;
    var index = Math.floor((Math.random() * (length - 1)));
    var randomMovie = movies.movies[index];
    while (randomMovie.watched) {
        index = Math.floor((Math.random() * (length - 1)));
        randomMovie = movies.movies[index];
    }
    index = Math.floor((Math.random() * (recommendJSON.length - 1)));
    var recommendMovie = recommendJSON[index];
    console.log("index is " + index);
    indexJSON.random = randomMovie;
    indexJSON.recent = recentJSON.movies;
    indexJSON.recommend = recommendMovie;
    res.render('index', indexJSON);

};

exports.search = function(req, res) {
    var keyword = req.params.keyword;
    var movieSearchAPI = api_base_url + "search/movie/" + "?api_key=" + api_key + "&language=en-US&query=" + keyword + "&page=1";
    console.log("movieSearchAPI is " + movieSearchAPI);
    request.get(movieSearchAPI, function(error, response, body) {
        if (response.statusCode == 200) {
            //console.log(body);
            var searchResult = JSON.parse(body);
            console.log(JSON.stringify(searchResult));
            //console.log(res);
            fs.writeFile('../P.Hobbyist/public/data/movie/searchResult.json', JSON.stringify(searchResult), 'utf8', function(err) {
                if (err) throw err;
                else {

                }

            });
            res.render('index', searchResult);
        } else {
            console.log('error: ' + response.statusCode)
            console.log(body);
        }
    });
}