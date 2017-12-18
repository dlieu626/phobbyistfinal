const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";

var currentLocation = window.location.href;
console.log(currentLocation);
var index = currentLocation.lastIndexOf("/");
var imdb = currentLocation.substring(index + 1);
console.log(imdb);
if (imdb.charAt(0) == 'a') {
    imdb = imdb.substr(1);
    console.log("imdb after modification" + imdb);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": api_base_url + "movie/" + imdb + "?api_key=" + api_key,
        "method": "GET",
        "headers": {},
        "data": "{}"
    }
    console.log(settings);
    $.ajax(settings).done(function(response) {
        console.log(response);
        imdb = response.imdb_id;
    });
}
console.log(imdb);



$(function() {
    $.getJSON("../data/movie/user_movie.json").done(function(data) {
        console.log("data is " + JSON.stringify(data));
        for (var i = 0; i < data.movies.length; i++) {
            console.log("currently at " + data.movies[i].imdb);
            if (data.movies[i].imdb == imdb) {
                console.log("find the movie " + data.movies[i].imdb);
                if (data.movies[i].watched) {
                    console.log("find the movie and watched");
                    $('a#watched i').text("done");
                    $('a#watched').addClass("watched");
                    $('#watched').text('add back to watchlist');
                    break;
                }
            }

        }

    });
    $('a#watched').on('click', function() {
        var classAttr = $('a#watched').attr('class');
        console.log(classAttr);
        if (classAttr.includes("watched")) {
            console.log("?????");
            $.post(imdb + "/false", {
                "watched": false
            })
            $(this).removeClass('watched');
            $('a#watched i').text("cloud");
            $('#watched').text('Seen this Moive?');
            Materialize.toast('removed from History', 2000);
        } else {
            $.post(imdb + "/true", {
                "watched": true
            })
            $(this).addClass('watched');
            $('a#watched i').text("done");
            $('#watched').text('add back to watchlist');
            Materialize.toast('Added to History', 2000);
        }
    });
});