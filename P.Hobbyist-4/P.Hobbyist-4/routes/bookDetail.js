exports.view = function(req, res) {
    var id = req.params.id;
    console.log("book id is " + id);

    res.render('bookDetail');

};