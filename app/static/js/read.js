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
                for(var i=0; i<len; i++){
                    console.log(data.result[i].photo)
                    var date = dateToString(data.result[i].timestamp);

                    html += '<div class="content">';
                    html += '   <div class="top">';
                    if(data.result[i].hasOwnProperty("profile_pic")){
                        html += '       <img class="profile" src="'+data.result[i].profile_pic + '" style="width:33px;height:33px">'
                    }
                    else{
                        html += '       <img class="profile" src="' + '../static/img/picsample.png' + '" width="33px" height="33px">';
                    }
                    html += '       <div class="top_name"><span style="font-weight:bold;">' + data.result[i].username + '</span>님이 '+ '<span style="color:red; font-weight:bold;">어딘가</span>'+'에 있습니다.</div>';
                    html += '       <div class="top_date">' + date + '</div>';
                    html += '   </div>';
                    html += '   <div class="text" id="text">' +data.result[i].content+ '</div>';
                    if(data.result[i].photo != null){
                        html += '   <div class="pic">';
                        html += '       <img src="' + data.result[i].photo+'">';
                        html += '   </div>';
                    } else {
                        html += '   <div class="pic">';
                        html += '   </div>';
                    }
                    html += '   <div class="like_num"><a id="numbers" href="/comment/'+data.result[i].post_id+'">좋아요 <span class="l_num">' +data.result[i].like_num+ '</span>개 댓글 ' +data.result[i].comment_num+ '개</a></div>';
                    html += '   <nav class="like">';
                    html += '       <ul>';
                    //html += '           <li><a>♥ 좋아요</a></li>';
                    html += '           <li><div id="like_btn"><a onclick="like();">♥ 좋아요</a></div></li>';
                    html += '           <li><a href="/comment/'+data.result[i].post_id+'">댓글</a></li>';
                    html += '           <li><a href="">공유</a></li>';
                    html += '       </ul>';
                    html += '   </nav>';
                    html += '</div>';
                    html += '<div class="gap"></div>';
                    
                }
            } else {
                html += '<div class="content"></div>';
            }
            //$('.contents').append('<div class="like_btn">♥ 좋아요</div>');
            $('.contents').append(html);
        },
        failure: function(errMsg) { 
            alert("errMsg");
            console.log("fail");
        }
    });
});

function like(){
    $.ajax({ 
        type:"POST", 
        url: 'http://mapsns.com/api/like', 
        contentType: "application/json; charset=utf-8", 
        dataType: "json",
        data: JSON.stringify({"post_id":1}),
        headers: {
            "Authorization": "Basic 1"
        },
        success: function(data){
            console.log("like success");
            //location.reload();
            $(this).toggleClass("active");
        },
        failure: function(errMsg) { 
            alert("errMsg");
            console.log("fail");
        }
    });
}



function dateToString(s){
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


