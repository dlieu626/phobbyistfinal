const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";
var fs = require('fs');
var request = require('request');
var user_movieJSON = require("../public/data/movie/user_movie.json");

exports.update = function(req, res) {
    console.log("update user_movie now");
    var id = req.params.id;
    console.log("the id is " + id);
    var status = req.param.status;
    console.log("the status is " + status);
    if (status === "true") {
        var movieInfoAPI = api_base_url + "movie/" + id + "?api_key=" + api_key;
        request.get(movieInfoAPI, function(error, response, body) {
            if (response.statusCode == 200) {
                console.log("get the movie");
                var movieInfo = JSON.parse(body);
                console.log("movieINFO" + movieInfo);
                var newMovie = {
                    "watched": false,
                    "imdb": "",
                    "title": "",
                    "tags": [],
                    "poster": "",
                    "summary": ""
                }
                newMovie.imdb = movieInfo.imdb_id;
                console.log("imdb is " + newMovie.imdb);
                newMovie.title = movieInfo.title;
                console.log("title is " + newMovie.title);
                newMovie.poster = "http://image.tmdb.org/t/p/w154" + movieInfo.poster_path;
                console.log("poster path is " + newMovie.poster);
                newMovie.summary = movieInfo.overview;
                console.log("summary is " + newMovie.summary);
                for (var i = 0; i < movieInfo.genres.length; i++) {
                    newMovie.tags.push(movieInfo.genres[i].name);
                    var existsInTags = false;
                    for (var a = 0; a < user_movieJSON.tags.length; a++) {
                        if (user_movieJSON.tags[a] == movieInfo.genres[i].name) {
                            existsInTags = true;
                        };
                    }
                    if (!existsInTags) {
                        user_movieJSON.tags.push(movieInfo.genres[i].name);
                    }
                }
                user_movieJSON.movies.unshift(newMovie);
            } else {
                console.log('error: ' + response.statusCode)
                console.log(body);
            }
        });
    } else {
        console.log("delete the movie");
        for (var i = 0; i < user_movieJSON.movies.length; i++) {
            console.log("the movie is at " + user_movieJSON.movies[i].title);
            if (user_movieJSON.movies[i].imdb == id) {
                console.log("found the movie");
                console.log("delete the movie now");
                user_movieJSON.movies.splice(i, 1);
                console.log("movie now at index " + i + " is" + user_movieJSON.movies[i].title);
            }
        }
    }
    for (var i = 0; i < recentJSON.movies.length; i++) {
        if (recentJSON.movies[i].imdb_id == imdb) {
            console.log("find the movie in recentJSON" + recentJSON.movies[i].title);
            console.log("added before modifed " + recentJSON.movies[i].added);
            recentJSON.movies[i].added = (req.param.added === "true");
            console.log("added after modified " + recentJSON.movies[i].added);
            recentJSON.movies.unshift(recentJSON.movies[i]);
            recentJSON.movies.splice(i + 1, 1);
            fs.writeFileSync("public/data/movie/index.json", JSON.stringify(recentJSON));
            break;
        }
    }
}