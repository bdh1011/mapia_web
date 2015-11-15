$(document).ready(function(){
	$('.login').click(function(){
		var login_id = $('#login_id').val();
		var login_pw = $('#login_pw').val();
		console.log(login_id);
		console.log(login_pw);
		$.ajax({ 
			type:"POST", 
			url: 'http://mapsns.com/api/users/login', 
			contentType: "application/json; charset=utf-8", 
			dataType: "json",
			data: JSON.stringify({"id":login_id,"pw":login_pw}), 
			success: function(data){ 
				console.log(data);
				console.log("success");
			;}, 
			failure: function(errMsg) { 
				alert("errMsg");
				console.log("fail");
			}
		});
	});
});
