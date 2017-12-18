$(function() {
    $recommend = $('a.recommend');
    $add = $('a.add');
    $watched = $('a.watched');

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
})