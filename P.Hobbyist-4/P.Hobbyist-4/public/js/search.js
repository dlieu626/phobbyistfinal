const api_key = "f97dbeff69a64a985e1c6f3aac12b9c7";
const api_base_url = "https://api.themoviedb.org/3/";
const poster_base = "https://image.tmdb.org/t/p/w154";
$(function() {
    var $search = $('.search:input');
    $search.on('input', function() {
        var value = $search.val();
        console.log(value);
        if (value.length > 1) {
            var movieSearchAPI = api_base_url + "search/movie/" + "?api_key=" + api_key + "&language=en-US&query=" + value + "&page=1";
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://api.themoviedb.org/3/search/movie?query=" + value + "&language=en-US&api_key=f97dbeff69a64a985e1c6f3aac12b9c7",
                "method": "GET",
                "headers": {},
                "data": "{}"
            }
            console.log(settings);
            $.ajax(settings).done(function(response) {
                console.log(response);
                var searchResult = response;
                var searchItem = '';

                for (var i = 0; i < 5; i++) {
                    searchItem += '<li class="collection-item"><div class="card horizontal movie-card" id="';
                    searchItem += searchResult.results[i].title;
                    searchItem += '"> <div class = "card-image" ><img src = "';
                    searchItem += poster_base + searchResult.results[i].poster_path;
                    searchItem += '" class="cover" alt="movie"></div><div class="card-stacked"><div class="card-content"><p>';
                    searchItem += searchResult.results[i].title;
                    searchItem += '</p></div><div class="card-action"><a class="waves-effect waves-light btn detail" id="';
                    searchItem += searchResult.results[i].id;
                    searchItem += '" href="movieDetail/a' + searchResult.results[i].id;
                    searchItem += '">detail</a></div></div></div></li>'

                }
                console.log(searchItem);
                $('#movie-search-result').html(function() {
                    return searchItem;
                });
                $('.search-result').show();
            });
        } else {
            $('.search-result').hide();

        }
    })
});