var mapLocations = [], clotheList = [];

$(document).ready(function () {
    window.location.href = "../../"
    const requestMap = new XMLHttpRequest();requestMap.open("GET", "locations.json");
    requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

        const requestClothe = new XMLHttpRequest();requestClothe.open("GET", "clothes.json");
        requestClothe.responseType = "json";requestClothe.send();requestClothe.onload = function() {

            mapLocations = requestMap.response; clotheList = requestClothe.response;
            selectSets();

            $("#map-select").val() == "sets" ? $("#set-select").hide() : $("#set-select").show();
            if (window.location.search == "") cargarMapas($("#map-select").val());
        };
    };
});


function cargarMapas(map) {
    $("#map-container").removeAttr("class");
    $("#map-container").html("");

    var currentMap = [], simpleList = [];
    // Si es valentin, easter, music, summer, halloween, christmas 
    $("#map-container").addClass("map " + map);
    currentMap = mapLocations.filter(v => {return v.map == map});

    switch (map) {
        case "valentin": simpleList = clotheList.valentin;break;
        case "easter": simpleList = clotheList.easter;break;
        case "music": simpleList = clotheList.music;break;
        case "summer": simpleList = clotheList.summer;break;
        case "halloween": simpleList = clotheList.halloween;break;
        case "christmas": simpleList = clotheList.christmas;break;
    }


    // Dibujar puntos de exploración + tooltips
    for (p = 0; p < currentMap.length; p++) {

        var contador = 0;
        var clothesByLocation = [];

        clothesByLocation = simpleList.filter(v => {return v.location == currentMap[p].id})

        for (v = 0; v < clothesByLocation.length; v++) {
            contador += clothesByLocation[v].variations;
        }

        $("#map-container").append('<div class="map-location" data-id="' + currentMap[p].id + '" style="' + currentMap[p].style + '"></div>');
        $(".map-location").eq(p).append('<div id="location-' + currentMap[p].id + '" class="tooltip"></div>');
        $(".tooltip").eq(p).append('<span class="map-name">' + currentMap[p].name 
            + '<br>  <span class="fa fa-bolt energy-color"></span> ' + currentMap[p].energy + ' &emsp; '
            + '<span class="far fa-clock time-color"></span> ' + currentMap[p].time + ' &emsp; '
            + '<span class="fas fa-tshirt cloth-color"></span> ' + contador + ' / ' + currentMap[p].totalItems + '</span>');

        // V1
        
        for (v = 0; v < clothesByLocation.length; v++) {
            $(".tooltip").eq(p).append('<img class="clothing" title="' + clothesByLocation[v].name + '" src="' + clothesByLocation[v].url + '">');
        };
    

    };
};

function selectSets() {
    // Mapa?
    var mapa = $("#map-select").val();
    var tags = [];
    switch (mapa) {
        case "valentin": tags = clotheList.valentin;break;
        case "easter": tags = clotheList.easter;break;
        case "music": tags = clotheList.music;break;
        case "summer": tags = clotheList.summer;break;
        case "halloween": tags = clotheList.halloween;break;
        case "christmas": tags = clotheList.christmas;break;
    };

    for (i = 0; i < tags.length; i++) {

        var check = String( $("#set-select").html() ) ;

/*
        if ( !(check.includes( tags[i]tag )) ) {
            var nombreArray = (tags[i]tag).split("_");
            var nombre = "";

            for (t = 0; t < nombreArray.length; t++) {
                nombreArray[t][0] = nombreArray[t][0].toUpperCase();
                nombre += nombreArray[t] + " ";
            };

            nombre = nombre.trim();
            alert(nombre);

            //$("#set-select").append('<option></option>')
        }
*/

    }

}

$(function() {

    $("#map-select").change(function() {
        var mapa = $(this).val();
        if (mapa != "sets") {
            $("#set-select").show();
            cargarMapas(mapa);
        } else {
            $("#set-select").hide();
        }
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