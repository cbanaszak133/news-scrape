$(function(){
	$("#scrape").on("click", function(event){
		$.ajax("/scrape", {
				type: "GET"
			}).then(
				function(){
					location.reload();
				});
	});

	//Next two methods are made to direct you to the
	//home page or the saved page
	$("#to-saved").on("click", function(event) {
		window.history.pushState('obj', 'newtitle', '/saved');
   		location.reload();
	});

	$("#return-home").on("click", function(event) {
		window.history.pushState('obj', 'newtitle', '/');
   		location.reload();
	});

	$(".comment-open").on("click", function() {
		var id = $(this).parent().attr('id');

		$('.comment-list').empty();
		getComments(id);

		$('.modal').modal('show');
	});

	$(".comment").on('click', function(event) {
		event.preventDefault();

		var text = $("textarea#commentText").val();
		var id = $(this).parent().attr('id');

		$.ajax({
			type: "POST",
			url: "/comments/" + id,
			data: {
				body:text
			}	
		})
			.then(function(data) {

				$("#commentText").val('');
				getComments(id);

			});

	});

	//Helper function to write comments
	//on the modal when added, deleted, and when
	//the modal opens
	function getComments(id){
		$('.comment-list').empty();
		$.ajax({
			type: "GET",
			url: "/comments/" + id
		})
			.then(function(data) {

				$(".modal-title").text('Comments for article: ' + data._id);
				$("div.modal-footer").attr('id',data._id);
				var comments = data.notes;

				comments.forEach(function(note) {
					var newCom = $("<li>");
					newCom.attr('id', note._id)
					var deleteButton = $("<button>");
					deleteButton.text("Delete Comment");

					deleteButton.addClass("deleteBtn");
					newCom.text(note.body);
					newCom.append(deleteButton)

					$(".comment-list").append(newCom);
				});

				
			});

	}

	//When save or unsave is clicked, change the 
	//mondoDB value to either true or false
	$(".save-article").on("click", function(event) {
		var id = $(this).parent().attr('id');
		$.ajax({
			type: "PUT",
			url: "/save/" + id
		})
			.then(function(data){
				location.reload();
			});

	});

	$(".unsave-article").on("click", function(event) {
		var id = $(this).parent().attr('id');
		$.ajax({
			type: "PUT",
			url: "/unsave/" + id
		})
			.then(function(data){
				location.reload();
		});

	});

	$(document).on("click", ".deleteBtn", function(event) {
		var commentId = $(this).parent().attr('id');

		$.ajax({
			type: "DELETE",
			url: "/comments/" + commentId
		})
			.then(function(data) { 
				var headlineId = $('div.modal-footer').attr('id');
				getComments(headlineId);
			});
	});

});



