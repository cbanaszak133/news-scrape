$(function(){
	$("#scrape").on("click", function(event){
		$.ajax("/scrape", {
				type: "GET"
			}).then(
				function(){
					console.log("scraped some data");
					location.reload();
				});
	});


	$(".comment-open").on("click", function() {
		var id = $(this).parent().attr('id');
		console.log(id);
		console.log('hi!');
		$('.comment-list').empty();

		$.ajax({
			type: "GET",
			url: "/comments/" + id
		})
			.then(function(data) {
				console.log(data);
				$(".modal-title").text('Comments for article: ' + data._id);
				$("div.modal-footer").attr('id',data._id);
				var comments = data.notes;
				console.log(comments);

				comments.forEach(function(note) {
					var newCom = $("<li>");
					newCom.attr('id', note._id)
					var deleteButton = $("<button>");
					deleteButton.text("Delete Comment");

					deleteButton.addClass("btn-danger");
					newCom.text(note.body);
					newCom.append(deleteButton)

					$(".comment-list").append(newCom);
				});

				$('.modal').modal('show');
			});
	});

	$(".comment").on('click', function(event) {
		event.preventDefault();

		var text = $("textarea#commentText").val();
		var id = $(this).parent().attr('id');

		console.log(text);

		$.ajax({
			type: "POST",
			url: "/comments/" + id,
			data: {
				body:text
			}	
		})
			.then(function(data) {
				console.log(data);
				$("#commentText").val('');

			});

	});


});



