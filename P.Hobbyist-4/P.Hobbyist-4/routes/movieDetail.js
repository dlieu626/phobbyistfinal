const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";

var request = require('request');
var movies = require("../public/data/movie/user_movie.json");
var indexJSON = require("../public/data/movie/index.json");
var recentJSON = require("../public/data/movie/recent.json");
var fs = require('fs');

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





exports.view = function(req, res) {
    console.log("start render movieDetail Page");
    var id = req.params.id;
    console.log('id is ' + id);
    var newMovie = false;
    console.log("newMovie is " + newMovie);
    var watched;
    var redirected = false;
    var recommend = false;
    if (id.charAt(0) == 'a') {
        id = id.substr(1);
        console.log("get real id " + id);
        newMovie = true;
        console.log("newMovie is " + newMovie);
        watched = false;
        console.log("watched is " + watched);
    }
    var movieInfoAPI = api_base_url + "movie/" + id + "?api_key=" + api_key;
    console.log("movieInfoAPI is " + movieInfoAPI);
    console.log("start request");
    request.get(movieInfoAPI, function(error, response, body) {
        if (response.statusCode == 200) {
            console.log("response is 200");
            var movieInfo = JSON.parse(body);
            console.log("findind movie in user_movie");
            for (var temp = 0; temp < movies.movies.length; temp++) {
                console.log("right now check :" + movies.movies[temp].title);
                if (movies.movies[temp].title == movieInfo.title) {
                    console.log('find the movie ' + movies.movies[temp].title);
                    newMovie = false;
                    console.log("set newmovie to false " + newMovie);
                    console.log("watched is" + movies.movies[temp].watched);
                    if (movies.movies[temp].watched) {
                        watched = true;
                        console.log("set watched to true, " + watched);

                    }
                    if (movies.movies[temp].redirected) {
                        redirected = true;
                        console.log("set redirected to true" + redirected);
                    }
                    if (movies.movies[temp].recommend) {
                        recommend = true;
                        console.log("set redirected to true" + recommend);
                    }
                    break;
                }
            }
            console.log("expected value of newMovie" + newMovie);
            movieInfo.newMovie = newMovie;
            console.log("movieInfo,newMovie " + movieInfo.newMovie);
            console.log("expected value of added" + (!newMovie));
            movieInfo.added = (!newMovie);
            console.log("movieInfo,added " + movieInfo.added);
            console.log("expected value of redirected " + redirected);
            movieInfo.redirected = redirected;
            console.log("movieInfo,redirected " + movieInfo.redirected);
            console.log("expected value of watched " + watched);
            movieInfo.watched = watched;
            console.log("movieInfo,watched " + movieInfo.watched);
            movieInfo.recommend = recommend;
            var notInRecent = true;
            console.log("now update recentJSON");
            for (var i = 0; i < recentJSON.movies.length; i++) {
                console.log("currently at movie in recentJSON in view, " + recentJSON.movies[i].title);
                if (recentJSON.movies[i].title == movieInfo.title) {
                    notInRecent = false;
                    recentJSON.movies.unshift(recentJSON.movies[i]);
                    recentJSON.movies.splice(i + 1, 1);
                    console.log("shift to top");
                }
            }
            if (notInRecent) {
                recentJSON.movies.unshift(movieInfo);
                console.log("first element in recentJSON is " + recentJSON.movies[0].title);
            }
            fs.writeFileSync("public/data/movie/recent.json", JSON.stringify(recentJSON));
            res.render('movieDetail', movieInfo);
            console.log("new movie is " + movieInfo.newMovie);
            console.log("wathced is " + movieInfo.watched);
        } else {
            console.log('error: ' + response.statusCode)
            console.log(body);
        }
    });



};

exports.update = function(req, res) {
    console.log("update watched now ");
    //console.log(req);
    console.log("status is " + req.params.status);
    var imdb = req.params.id;
    for (var i = 0; i < movies.movies.length; i++) {
        console.log("currently at " + movies.movies[i].imdb);
        if (movies.movies[i].imdb == imdb) {
            console.log("find the movie " + movies.movies[i].imdb);
            console.log("current status " + movies.movies[i].watched);
            console.log("status is " + req.params.status);
            movies.movies[i].watched = (req.params.status === "true");
            console.log("boolean is " + Boolean(req.params.status));
            console.log("after modified " + movies.movies[i].watched);
            console.log("status is " + req.params.status);
            //Serialize as JSON and Write it to a file
            fs.writeFileSync("public/data/movie/user_movie.json", JSON.stringify(movies));
            break;
        }

    }
    /*    indexJSON = require("../public/data/movie/index.json");*/
    for (var i = 0; i < recentJSON.movies.length; i++) {
        if (recentJSON.movies[i].imdb_id == imdb) {
            console.log("find the movie in indexJSON" + recentJSON.movies[i].title);
            console.log("watched before modifed " + recentJSON.movies[i].watched);
            recentJSON.movies[i].watched = (req.param.status === "true");
            console.log("watched after modified " + recentJSON.movies[i].watched);
            recentJSON.movies.unshift(recentJSON.movies[i]);
            recentJSON.movies.splice(i + 1, 1);
            fs.writeFileSync("public/data/movie/recent.json", JSON.stringify(recentJSON));
            break;
        }
    }
};

exports.add = function(req, res) {
    console.log(req.body); //FIX req.body 
    fs.writeFileSync("public/data/movie/user_movie.json", JSON.stringify(req.body));
    var imdb = req.body.imdb;
    /*indexJSON = require("../public/data/movie/index.json");
     */
    console.log("upadta indexJSON file : " + req.body.title);
    for (var i = 0; i < recentJSON.movies.length; i++) {
        console.log("currently at index of " + i + " : " + recentJSON.movies[i].title);
        if (recentJSON.movies[i].imdb_id == imdb) {
            console.log("found the movie in indexJSON");
            console.log("added before modified: " + recentJSON.movies[i].added);
            recentJSON.movies[i].added = true;
            console.log("added after modified: " + recentJSON.movies[i].added);
            console.log("newMovie before modifed " + recentJSON.movies[i].newMovie);
            recentJSON.movies[i].newMovie = (!true);
            console.log("newMovie after modifed " + recentJSON.movies[i].newMovie);
            console.log("before shift" + recentJSON.movies[i]);
            recentJSON.movies.unshift(recentJSON.movies[i]);
            recentJSON.movies.splice(i + 1, 1);

            console.log("after shift" + recentJSON.movies[i]);
            break;
        }
    }
    fs.writeFileSync("public/data/movie/recent.json", JSON.stringify(recentJSON));

    /* res.sendStatus(200);*/
};