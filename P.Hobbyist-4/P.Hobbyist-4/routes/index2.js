const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";

var request = require('request');
var movies = require("../public/data/movie/user_movie.json");
var indexJSON = require("../public/data/movie/index.json");
var fs = require('fs');


exports.view = function(req, res) {

    res.render('index2', indexJSON);

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
                else{
                    
                }

            });
            res.render('index2', searchResult);
        } else {
            console.log('error: ' + response.statusCode)
            console.log(body);
        }
    });
}