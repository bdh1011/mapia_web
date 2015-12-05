/*$(document).ready(function(){
    //var pra = 1;
		$.ajax({ 
			type:"GET", 
			url: 'http://mapsns.com/api/comments?post_id=1', 
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
                    for(var i=0; i<len; i++){
                        var date = dateToString(data.result[i].timestamp);
                        html += '<div class="content">';
                        if(data.result[i].hasOwnProperty("profile_pic")){
                            html += '   <img class="profile" src="'+data.result[i].profile_pic + '" style="width:33px;height:33px">'
                        }
                        html += '   <div class="comment_name">'+data.result[i].user_id+'</div>';
                        html += '   <div class="comment_content">'+data.result[i].content+'</div>';
                        html += '   <div class="comment_date">'+date+'</div>';
                        html += '</div>';
                    }
                    
                    
                } else {
                    html += '<div class="content"></div>';
                }
                $('.top').append(html);
            },
			failure: function(errMsg) { 
				alert("errMsg");
				console.log("fail");
			}
		});
    
    $('#send_btn').click(function(){
        var comment_content = $('#comment_content').val();
		$.ajax({ 
			type:"POST", 
			url: 'http://mapsns.com/api/comments', 
			contentType: "application/json; charset=utf-8", 
			dataType: "json",
            headers: {
                "Authorization": "Basic 1"
            },
			data: JSON.stringify({"post_id":1,"content":comment_content}), 
			success: function(data){
				console.log("success");
			}, 
			failure: function(errMsg) { 
				alert("errMsg");
				console.log("fail");
			}
		});
	});
    
});

function dateToString(s)  {
    s = s.split(/[-: ]/);
    var hour = "";
    if(s[3] > 12){
        s[3] = s[3] - 12;
        hour = '오후 ' + s[3];
    } else {
        hour = '오전 ' + s[3];
    }
    return (s[1]-1) +'월 '+ s[2] +'일 ' + hour +':'+ s[4];
}

*/