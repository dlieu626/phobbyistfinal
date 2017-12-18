/*const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";*/

$(document).ready(function() {

    $("#back").click(function() {
        window.history.back();
    });

    $('[data-toggle="popover"]').popover();

    console.log("!!!!");
    var $add = $('a.add.btn');
    var $recommend = $('a.recommend');
    console.log("$add is " + $add);
    $add.on('click', function() {
        $.getJSON("../data/movie/user_movie.json").done(function(data) {
            var user_movie_JSON = data;
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": api_base_url + "movie/" + $add.attr('id') + "?api_key=" + api_key,
                "method": "GET",
                "headers": {},
                "data": "{}"
            }
            console.log(settings);
            $.ajax(settings).done(function(response) {
                console.log(response);
                var newMovie = {
                    "watched": false,
                    "imdb": "",
                    "title": "",
                    "tags": [],
                    "poster": "",
                    "summary": ""
                }
                newMovie.imdb = response.imdb_id;
                newMovie.title = response.title;
                newMovie.poster = "http://image.tmdb.org/t/p/w154" + response.poster_path;
                newMovie.summary = response.overview;
                for (var i = 0; i < response.genres.length; i++) {
                    newMovie.tags.push(response.genres[i].name);
                    var existsInTags = false;
                    for (var a = 0; a < user_movie_JSON.tags.length; a++) {
                        if (user_movie_JSON.tags[a] == response.genres[i].name) {
                            existsInTags = true;
                        };
                    }
                    if (!existsInTags) {
                        user_movie_JSON.tags.push(response.genres[i].name);
                    }
                }


                console.log(newMovie);
                user_movie_JSON.movies.unshift(newMovie);
                user_movie_JSON = JSON.stringify(user_movie_JSON);
                $.ajax({
                    url: "/movieDetail/add",
                    type: 'POST',
                    contentType: 'application/json',
                    data: user_movie_JSON,
                    dataType: 'json',
                    /*success: function(data) {
                        //On ajax success do this
                        console.log("success");

                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        //On error do this
                        if (xhr.status == 200) {
                            alert(ajaxOptions);
                        } else {
                            alert(xhr.status);
                            alert(thrownError);
                        }
                    }*/
                });
                Materialize.toast('Added', 2000);
                $add.hide();
            });
        });
    })

    $recommend.on('click', function() {
        console.log("recommend button is clicked");
        var classAttr = $recommend.attr('class');
        console.log("current status is" + classAttr);
        if (classAttr.includes("recommended")) {
            console.log("this movie is recommened, undo recommend");
            postURL = "/recommend/" + $recommend.attr('id') + "/false";
            console.log("postURL is " + postURL);
            $.post(postURL, { "recommend": false }, function(result) {
                console.log(result);
                if (result == "200") {
                    $recommend.removeClass('recommended');
                    $recommend.text('recommend');
                    Materialize.toast('successfully undo', 2000);
                } else {
                    Materialize.toast('error occurred', 2000);
                }
            })
        } else {
            postURL = "/recommend/" + $recommend.attr('id') + "/true";
            console.log("postURL is " + postURL);
            $.post(postURL, { "recommend": true }, function(result) {
                console.log(result);
                if (result == "200") {
                    $recommend.addClass('recommended');
                    $recommend.text('undo recommend');
                    Materialize.toast('recommended', 2000);
                } else {
                    Materialize.toast('error occurred', 2000);
                }
            })

        }
    })
});