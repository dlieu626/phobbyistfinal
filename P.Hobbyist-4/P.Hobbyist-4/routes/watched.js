var request = require('request');
var movies = require("../public/data/movie/user_movie.json");
var recentJSON = require("../public/data/movie/recent.json");
var fs = require('fs');

exports.update = function(req, res) {
    console.log("update watched now: ");
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
    /*    recentJSON moviesire("../public/data/movie/index.json");*/
    for (var i = 0; i < recentJSON.movies.length; i++) {
        if (recentJSON.movies[i].imdb_id == imdb) {
            console.log("find the movie in recentJSON" + recentJSON.movies[i].title);
            console.log("watched before modifed " + recentJSON.movies[i].watched);
            recentJSON.movies[i].watched = (req.param.status === "true");
            console.log("watched after modified " + recentJSON.movies[i].watched);
            recentJSON.movies.unshift(recentJSON.movies[i]);
            recentJSON.movies.splice(i + 1, 1);
            fs.writeFileSync("public/data/movie/index.json", JSON.stringify(recentJSON));
            break;
        }
    }
};