$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(
        $.getJSON("/articles", function(data) {
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        
            }
        })
    )
})





// $.getJson("/articles", function(data) {
//     for (let i = 0; i < data.length; i++) {
//         $("#articles").append("< data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");

//     }
// });


$(document).on("click", "p", function() {
    $("#notes").empty();

    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {

        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    })

    if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
    }
});


$(document).on("click", "#savenote", function() {
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $$("#bodyinput").val()
        }
    })
    .then(function(data) {
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});