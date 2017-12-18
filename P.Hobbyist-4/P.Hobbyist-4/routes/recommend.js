var user_movieJSON = require("../public/data/movie/user_movie.json");
var recommendJSON = require('../public/data/movie/recommend.json');
var recentJSON = require("../public/data/movie/recent.json");

var fs = require('fs');

exports.update = function(req, res) {
    console.log("update recommend now: ");
    var imdb = req.params.id;
    console.log("the imdb number is " + imdb);
    var status = req.params.status;
    console.log("the status is " + status);
    var notFound;
    var prevRecommendVal;
    var movieItem;
    console.log("update user_movieJSON now");
    for (var i = 0; i < user_movieJSON.movies.length; i++) {
        if (user_movieJSON.movies[i].imdb == imdb) {
            movieItem = user_movieJSON.movies[i];
            console.log("movieItem is " + movieItem);
            console.log("found the movie " + imdb + " " + user_movieJSON.movies[i].title);
            console.log("the previous recommend status is " + user_movieJSON.movies[i].recommend);
            prevRecommendVal = user_movieJSON.movies[i].recommend;
            user_movieJSON.movies[i].recommend = (status === "true");
            console.log("the newest recommend status is " + user_movieJSON.movies[i].recommend);
            console.log("write JSON file");
            fs.writeFileSync("public/data/movie/user_movie.json", JSON.stringify(user_movieJSON));
            notFound = false;
            break;
        }
    }
    if (notFound) {
        console.log("movie not found, send status 404");
        res.sendStatus(404);
        return;
    }
    notFound = true;
    console.log("update recommendJSON now");
    if (prevRecommendVal) {
        for (var i = 0; i < recommendJSON.length; i++) {
            if (recommendJSON[i].imdb == imdb) {
                console.log("found the movie " + imdb + " " + recommendJSON[i].title);
                console.log("remove the movie");
                recommendJSON.splice(i, 1);
                console.log("write JSON file");
                fs.writeFileSync("public/data/movie/recommend.json", JSON.stringify(recommendJSON));
                notFound = false;
                break;
            }
        }
    } else {
        console.log("movieItem is " + movieItem);
        if (!movieItem) {
            res.send("500");
        }
        recommendJSON.unshift(movieItem);
        fs.writeFileSync("public/data/movie/recommend.json", JSON.stringify(recommendJSON));
    }
    console.log("update recentJSON now ");
    for (var i = 0; i < recentJSON.movies.length; i++) {
        if (recentJSON.movies[i].imdb_id == imdb) {
            console.log("find the movie in recentJSON" + recentJSON.movies[i].title);
            console.log("recommend before modifed " + recentJSON.movies[i].recommended);
            recentJSON.movies[i].recommended = (status === "true");
            console.log("recommend after modified " + recentJSON.movies[i].recommended);
            recentJSON.movies.unshift(recentJSON.movies[i]);
            recentJSON.movies.splice(i + 1, 1);
            fs.writeFileSync("public/data/movie/recent.json", JSON.stringify(recentJSON));
            break;
        }
    }
    res.send("200");
}