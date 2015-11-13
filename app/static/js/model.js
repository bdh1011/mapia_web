
var posYes = false;//gps값을 읽어왔을때.. true
var prevOCenterPoint;
var oCenterPoint;//내 GPS상의 위치
var curr_cmts = {};//현재까지 불러온 코멘트리스트
var new_cmts ;//새로 받아온 코멘트 리스트
var showAll = true;
var radius = 50; //중심 위치로부터 글을 읽을 수 있는 거리
var navbar_h = 52;
var mapExist = false;//초기에 지도 그리고나면 true
var commentWindow = new nhn.api.map.InfoWindow();//info window 생성
var writeWindow = new nhn.api.map.InfoWindow();
$(function () {
    //gps얻어오기
    getGPS();
    $(window).resize(function () {
        oMap.setSize(new nhn.api.map.Size($(window).width()-1, $(window).height() - navbar_h));
    });
});
function getGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posSuccess, posError);//위치를 받아온 후 createMap 실행
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
function posError(error) {// error handling
    switch (error.code) {
        case error.PERMISSION_DENIED:
        alert("위치 정보 사용 설정 해주세요 ㅠㅠ");
        break;
        case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
        case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
        case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
    }
    posYes = false;
    //createMap(37.5885621, 127.0349458);//default위치(고려대학교)를 중심으로 지도를 그린다.
    oCenterPoint = new nhn.api.map.LatLng(37.5885621, 127.0349458);
    
    if (!mapExist) createMap();
    else moveCenter();
}
function posSuccess(pos) { //gps성공할시
    posYes = true;
    prevOCenterPoint=oCenterPoint;
    oCenterPoint = new nhn.api.map.LatLng(pos.coords.latitude, pos.coords.longitude);
    if (!mapExist) createMap();
    else moveCenter();
}

function getComment(bound) { // map에 move이벤트마다
    var minX = bound[0]['x'];
    var maxY = bound[0]['y'];
    var maxX = bound[1]['x'];
    var minY = bound[1]['y'];
    $.ajax({
        url: '/read',
        type: 'POST',
        data: { 'minX': minX, 'maxY': maxY, 'maxX': maxX, 'minY': minY },
        success:
        function (result) {
            new_cmts = JSON.parse(result);
            console.log(new_cmts);


            for (var i = 0; i < Object.keys(curr_cmts).length; i++) {
                var cmnt_id = Object.keys(curr_cmts)[i];
                    delete new_cmts[cmnt_id]; //새로 받아온 코멘트가 이미 중복된것이면 지운다
                }
                //데이터 정리하는부분 new_cmts
                printComment(new_cmts);
                //현재 읽어 온 리스트에 추가
                $.extend(curr_cmts, new_cmts);

            },
            error:
            function () {
                alert('글을 읽어오는데 실패했습니다.');
            }
        });
}

function toggleComment() {
    showAll = !showAll;//토글
    oMap.clearOverlay();//글들을 다 지우고..
    myLocation();//위치표시
    printComment(curr_cmts);//현재까지 불러온 글 다시 출력(출력표시에 맞게)
}

//메시지 출력 함수
function printComment(array) {
    for (var i = 0 ; i < Object.keys(array).length; i++) { //지도에 추가
        var id = Object.keys(array)[i];
        var oIcon;
        var size = new nhn.api.map.Size(29, 40);
        var offset = new nhn.api.map.Size(14, 40);

        
        var tmpPoint = new nhn.api.map.LatLng(array[id].lat, array[id].lng);
        if (!showAll) {//내 글만 보기 일때...
            if (array[id].username != username) continue; //내 아이디랑 다르면 넘긴다;
        }

        if (tmpPoint.getDistanceFrom(oCenterPoint) <= radius) {//범위안일때
            if (array[id].username == username) oIcon = new nhn.api.map.Icon('http://kweb.korea.ac.kr/~zmlz0727/red.png', size, offset);
            else oIcon = new nhn.api.map.Icon('http://kweb.korea.ac.kr/~zmlz0727/black.png', size, offset);

            var tmp = new nhn.api.map.Marker(oIcon, {
                point: tmpPoint,
                title: array[id].username + " : " + array[id].text,
            });
            oMap.addOverlay(tmp);


        }
        else {//범위밖일때
            if (array[id].username == username) oIcon = new nhn.api.map.Icon('http://kweb.korea.ac.kr/~zmlz0727/pink.png', size, offset);
            else oIcon = new nhn.api.map.Icon('http://kweb.korea.ac.kr/~zmlz0727/gray.png', size, offset);

            var tmp = new nhn.api.map.Marker(oIcon, {
                point: tmpPoint,
                title: array[id].username + " : " + String(array[id].text).replace(/\S/g, "X")
            });
            var a = tmp.getTitle();
            oMap.addOverlay(tmp);

        }
    }
}


//현재위치 표시 함수(원모양으로)
function myLocation() {
    if (posYes) { //사용자 위치 표시하는 원 그리기
        var circle = new nhn.api.map.Circle(
        {
                strokeColor: "red",//선 색
                strokeOpacity: 0.1,
                strokeWidth: 3,
                fillColor: "#0094ff",
                fillOpacity: 0.1
            }
            );
        circle.setCenterPoint(oCenterPoint);
        circle.setRadius(radius);//단위는 meter;
        oMap.addOverlay(circle);
    }
}

function moveCenter() {

    if(prevOCenterPoint.getLat() != oCenterPoint.getLat() || prevOCenterPoint.getLng() != oCenterPoint.getLng()){
        oMap.clearOverlay();//글들을 다 지우고..
        myLocation();//위치표시
        printComment(curr_cmts);//현재까지 불러온 글 다시 출력(출력표시에 맞게)
    }
    oMap.setCenterAndLevel(oCenterPoint, 14, { useEffect: true, centerMark: true });
}

function createMap() {
    //지도 생성 함수
    mapExist = true;
    nhn.api.map.setDefaultPoint('LatLng');
    oMap = new nhn.api.map.Map('testMap', {
        point: oCenterPoint,
        zoom: 14,
        enableWheelZoom: true,
        enableDragPan: true,
        enableDblClickZoom: false,
        mapMode: 0,
        activateTrafficMap: false,
        activateBicycleMap: false,
        minMaxLevel: [1, 14],
        size: new nhn.api.map.Size($(window).width()-1, $(window).height() - navbar_h)
    });
    var cc = new nhn.api.map.CustomControl();
    cc.createControl('<div style="position:absolute; ">'+
        '<div class="mapControl myLoc" style=" "></div>' +
        '<div class="show" style="">' +
        '<div class="mapControl all"></div>' + '<div class="mapControl mine" hidden></div>' +
        '</div>' +
        '</div>', { position: { left: 10, top: 10 } });
    cc.attachEvent('myLoc', 'click', function () {
        //moveCenter();
        getGPS();
    });
    cc.attachEvent('show', 'click', function () {
        $(".mine, .all").toggle();
        toggleComment();
    });
    oMap.addControl(cc);


    if (posYes) {//gps를 읽어왔을때만..
        initFunc();//초기화 함수
        //commentWindow.setVisible(false); // - infowindow 표시 여부 지정.
        //클릭 이벤트 생성
        oMap.attach('click', function (oCustomEvent) {
            var oPoint = oCustomEvent.point;
            var oTarget = oCustomEvent.target;
			//oMap.removeOverlay(commentWindow);
			commentWindow.setVisible(false);
				oMap.removeOverlay(writeWindow);//글쓰기창 지움
				  // 마커 클릭하면
				if (oTarget instanceof nhn.api.map.Marker) {
               oMap.addOverlay(commentWindow);     // - 지도에 추가.     


                // 겹침 마커 클릭한거면
                if (oCustomEvent.clickCoveredMarker) {
                    return;
                }
                // - InfoWindow 에 들어갈 내용은 setContent 로 자유롭게 넣을 수 있습니다. 외부 css를 이용할 수 있으며, 
                // - 외부 css에 선언된 class를 이용하면 해당 class의 스타일을 바로 적용할 수 있습니다.
                // - 단, DIV 의 position style 은 absolute 가 되면 안되며, 
                // - absolute 의 경우 autoPosition 이 동작하지 않습니다. 
                commentWindow.setContent('<DIV style="border-radius:2em;border-right:2px solid;border-bottom:1px solid;margin-bottom:1px;color:black;background-color:white; width:auto; height:auto; font-family:NanumGothic !important"><span style="color: #000000 !important;display: inline-block;font-size: 12px !important; !important;letter-spacing: -1px !important;white-space: nowrap !important; padding: 2px 7px 2px 7px !important"><span class="glyphicon glyphicon-comment"></span> <b>'+ oTarget.getTitle()+'</span></div>');
                commentWindow.setPoint(oTarget.getPoint());
                commentWindow.setVisible(true);
                commentWindow.setPosition({ right: 15, top: 30 });
                commentWindow.autoPosition();
                return;
            }


            //그외에는 글쓰기
            if (oPoint.getDistanceFrom(oCenterPoint) <= radius) {//원 안에 있을 때
                writeComment(oPoint);
                return;
            }
            else {
                alert('자신의 위치에 글을 남겨주세요');
                moveCenter();
                return;
            }
        }   );
}
else {
    locLost(); 
}
}


function initFunc() {//처음 실행 시 한번 실행되는 초기화 함수
    oMap.clearOverlay();//글들을 다 지우고..
    myLocation(oCenterPoint);//gps원 그린다
    getComment(oMap.getBound());//첫 화면에서 읽어온 코멘트
    oMap.attach('move', function(){ getComment(oMap.getBound());});
    //지도가 움직일때마다, 코멘트 불러오기 이벤트를 추가
}
function locLost() {//gps값을 못 불러올때
    oMap.clearOverlay();//글들을 다 지우고..
    //화면가림
    var p1 = new nhn.api.map.LatLng(30.3466388, 116.1252694);
    var p2 = new nhn.api.map.LatLng(30.3466388, 137.3551916);
    var p3 = new nhn.api.map.LatLng(44.1447805, 137.3551916);
    var p4 = new nhn.api.map.LatLng(44.1447805, 116.1252694);
    var blacksheepwall = new nhn.api.map.Polygon([p1, p2, p3, p4], {
        fillColor: "black",
        fillOpacity: 0.8
    });
    oMap.addOverlay(blacksheepwall);

}

function writeComment(p) {
   //테스트 하려다 실패

    writeWindow = new nhn.api.map.InfoWindow();//info window 생성
    writeWindow.setVisible(false); // - infowindow 표시 여부 지정.
    writeWindow.setContent('<div style="font-family: NanumGothic;position:relative;width:300%;height:190px;background:white;border:solid 1px gray;border-radius:3em 3em 3em 0em;padding:10px;"><textarea id="userComment" class="form-control" rows="4" placeholder="무슨 생각을 하고 있나요?" style="font-family: NanumGothic !important;margin-top:10px;margin-bottom:10px;resize:none; "></textarea><div style="float:right;display:block"><button id="write" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button> <button id="cancel" class="btn btn-danger btn-lg"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></div></div>');
    writeWindow.setPoint(p);
    writeWindow.setPosition({ right: 0, top: 0 });
    writeWindow.setVisible(true); // - infowindow 표시 여부 지정.
    writeWindow.autoPosition();
	var newP = new nhn.api.map.LatLng(p.getLat(),p.getLng());//지도중심점이동 좌표
    newP.x += 0.00015;//값을 살짝 변경해줌
    newP.y += 0.0002;
    oMap.setCenterAndLevel(newP, 14, { useEffect: true, centerMark: true });
    oMap.addOverlay(writeWindow);     // - 지도에 추가.     

    $("#userComment").focus();
    $("#write").click(function(){
        //alert($("#userComment").val());

        var comment = $("#userComment").val();
        oMap.removeOverlay(writeWindow);
        
        if (comment) {
            $.ajax({
                url: '/write',
                type: 'POST',
                data: { text: comment, lat: p.getLat(), lng: p.getLng() },
                success: function (result) {
            //alert('글이 업로드되었습니다');
            getComment(oMap.getBound())
        },
        error: function (result) {
            alert('글쓰기 실패');
        }
    });
        }
    });
    $("#cancel").click(function(){
        oMap.removeOverlay(writeWindow);
    });
    
    //var comment = prompt("무슨 생각을 하고 있나요?");
    
}