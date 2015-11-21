$(document).ready(function(){
    $.ajax({ 
			type:"GET", 
			url: 'http://mapsns.com/api/posts?map_type=public', 
			contentType: "application/json; charset=utf-8", 
			dataType: "json",
            headers: {
                "Authorization": "Basic 1"
            },
			success: function(data){
                console.log(data);
                var len = data.result.length;
                console.log(len);
                var html = '';
                if(len > 0){
                    for(var i=0; i<len-4; i++){
                            html += '       <img src="' + date.result[i].photo+'">';
                     
                    }
                } else {
                    html += '<div class="content"></div>';
                }
                $('.contents').append(html);
            },
			failure: function(errMsg) { 
				alert("errMsg");
				console.log("fail");
			}
        })
});