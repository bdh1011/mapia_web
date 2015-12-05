var mapcanvas = document.getElementById('map');
var map;

function initMap(){
    var seoul = {lat: 37.544, lng: 126.984};

    map = new google.maps.Map(mapcanvas, {
      center: seoul,
      zoom: 14,
      streetViewControl: false
    });
}

function getLoc(){

}

$(document).ready(function(){
    var currentLoc;
    $()
})
