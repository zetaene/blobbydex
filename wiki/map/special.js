$(document).ready(function () {
    const requestMap = new XMLHttpRequest();requestMap.open("GET", "special.json");
    requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

        mapLocations = requestMap.response
        if (window.location.search == "") cargarMapas($("#map-select").val());

    };
});


function cargarMapas(map) {
    $("#map-container").removeAttr("class");
    $("#map-container").html("");

    var currentMap = [];
    // Si es valentin, easter, music, summer, halloween, christmas 
    $("#map-container").addClass("map " + map);
    currentMap = mapLocations.filter(v => {return v.map == map});


    // Dibujar puntos de exploración + tooltips
    for (p = 0; p < currentMap.length; p++) {
        var contador = 0;

        for (v = 0; v < currentMap[p].clothes.length; v++) {
            contador += currentMap[p].clothes[v].variations;
        }


        $("#map-container").append('<div class="map-location" data-id="' + currentMap[p].id + '" style="' + currentMap[p].style + '"></div>');
        $(".map-location").eq(p).append('<div id="location-' + currentMap[p].id + '" class="tooltip"></div>');
        $(".tooltip").eq(p).append('<span class="map-name">' + currentMap[p].name 
            + '<br>  <span class="fa fa-bolt"></span> ' + currentMap[p].energy + ' &emsp; '
            + '<span class="far fa-clock"></span> ' + currentMap[p].time + ' &emsp; '
            + '<span class="fas fa-tshirt"></span> ' + contador + ' / ' + currentMap[p].totalItems + '</span>');

        for (v = 0; v < currentMap[p].clothes.length; v++) {
            $(".tooltip").eq(p).append('<img class="clothing" title="' + currentMap[p].clothes[v].name + '" src="' + currentMap[p].clothes[v].url + '">');
        };
    };
};


$(function() {

    $("#map-select").change(function() {
        var mapa = $(this).val();
        cargarMapas(mapa);
    })

    $("#map-section").on("mouseenter", ".map-location", function(e) {
        var id = $(this).attr("data-id");
        id = "#location-" + id;
        $(this).css("z-index", 2);
        $(id).show();
    });

    $("#map-section").on("mouseleave", ".map-location", function(e) {
        var id = $(this).attr("data-id");
        id = "#location-" + id;
        $(this).css("z-index", 1);
        $(id).hide();
    });

});