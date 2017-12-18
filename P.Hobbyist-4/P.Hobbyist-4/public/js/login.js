$(document).ready(function() {

	$('#signin').click(function() {
		var user = $("#user").val();
		var password = $("#password").val();
		var error = true;
	

		$.ajax({
			type: "GET",
			url: "../data/login.json",
			dataType: "json",
			success: function(data) {
				$.each(data,function(key,value) {
					if(user == value.user_name && password == value.password) {
						error = false;
					}
				});

				if(error == false) {
					document.location = "/";
				}else {
					$(".login_form").slideUp("slow").slideDown("slow");
					$("#user").val("");
					$("#password").val("");
				}
			}
		})

		return false;

	});
});