$(document).ready(function () {
	const requestExp = new XMLHttpRequest();requestExp.open("GET", "../data/db.json");
    requestExp.responseType = "json";requestExp.send();requestExp.onload = function() {

        const requestMap = new XMLHttpRequest();requestMap.open("GET", "../data/map.json");
        requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

            const requestPet = new XMLHttpRequest();requestPet.open("GET", "../data/pet.json");
            requestPet.responseType = "json";requestPet.send();requestPet.onload = function() {
                mapLocations = requestMap.response; expInfo = requestExp.response;petInfo = requestPet.response;

                cargarPets();
            };
        };
    };
});

function cargarPets() {
    var info = [];
    $("#card-list").html("");

    var filtro = getFiltros();
    filtro != "all" ? info = petInfo.filter(v => {return v.rarity == filtro}) : info = petInfo;

    var input = $("#filter-search").val();
    if (input != "") {
        if (!input.includes("/")) {
            input = normalize(input).toLowerCase();
            info = info.filter(v => {return (normalize(v.name).toLowerCase()).includes(input)});
        } else {
            if (input.includes("/item/egg/") && !input.includes("/library/")) {
                if (input.includes("~")) { input = input.split("~"); input = input[0]; }
                info = info.filter(v => {return (normalize(v.img.egg).toLowerCase()).includes(input)});
            };
        };
    };

    for (a = 0; a < info.length; a++) {
        $("#card-list").append('<li class="card-item" data-name="' + info[a].name + '"><div class="abstract-icon"></div><div class="abstract-info"><div class="abstract-middle"><div class="abstract-name"></div><div class="abstract-category"></div><div class="abstract-location-mall"></div><div class="abstract-location-map"></div></div></div></li>');
        $(".abstract-icon").eq(a).append('<img src="' + info[a].img.egg + '">');
        $(".abstract-name").eq(a).append(info[a].name);

        switch(info[a].rarity) {
            
            case "common": $(".card-item").eq(a).append('<div class="rarity-marker-common"></div>');break;
            case "rare": $(".card-item").eq(a).append('<div class="rarity-marker-rare"></div>');break;
            case "epic": $(".card-item").eq(a).append('<div class="rarity-marker-epic"></div>');break;
            case "legendary": $(".card-item").eq(a).append('<div class="rarity-marker-legendary"></div>');break;
            case "event": $(".card-item").eq(a).append('<div class="rarity-marker-event"></div>');break;
        }
    };
};


function drawBigCard(name) {
    var item = petInfo.filter(v => {return v.name == name});

    // Nombre y rareza
    $("#popup-content").append('<div id="first-line"><span><span class="rarity ' + item[0].rarity + '"></span><b style="font-size: 18px">' + (item[0].name).toUpperCase() + '</b></span></div>');

    // Imagenes
    $("#popup-content").append('<div id="second-line"><span></span></div>');
    $("#second-line span").append('<img class="pet-image" src="' + item[0].img.egg + '">');
    if (item[0].img.baby != "") { $("#second-line span").append('<img class="pet-image baby" src="' + item[0].img.baby + '">') }
    if (item[0].img.adult != "") { $("#second-line span").append('<img class="pet-image" src="' + item[0].img.adult + '">') }


    /*
    $("#first-line").append('<div id="first-left"></div><div id="first-right"></div>');
    $("#first-left").append('<img src="' + item[0].img + '">');
    $("#first-left").append('<span class="rarity ' + item[0].rarity + '"></span>');

    $("#first-right").append('<span>' + grupo + id + '</span>');
    $("#first-right").append('<span><b>Nombre:</b> ' + item[0].name + '</span>');
    $("#first-right").append('<span><b>Tipo:</b> ' + item[0].category + '</span>');

    var abstractText = "";
    item[0].group == "pet" ? abstractText = "<b>Familiar asociado:</b> " : abstractText = "<b>Receta asociada:</b> ";

    var filterList = [];
    switch (item[0].category) {
        case "Alimento": filterList = petInfo.filter(v => {return v.food == id}); break;
        case "Cebos": filterList = petInfo.filter(v => {return v.bait == id}); break;
    };

    var asociatedList = "";

    for (i = 0; i < filterList.length; i++) {
        asociatedList += filterList[i].name;
        if (i != filterList.length - 1) {
            asociatedList += ", "
        };
    };

    if (asociatedList == "") asociatedList = "?????";

    $("#first-right").append('<span>' + abstractText + asociatedList + '</span>');


    $("#second-line").append('<div id="second-left"></div><div id="second-middle"></div><div id="second-right"></div></id>');
    var answer = item[0].location.exploration.length > 0 ? "SI" : "NO";
    $("#second-left").append('<span>Exploración: ' + answer + '</span>');
    $("#second-left").append('<span>Ubicación:</span>');

    answer = (item[0].location.mall[0] == "-" && item[0].location.mall[1] == "-") ? "NO" : "SI";
    if (answer == "SI") {
        if (item[0].category == "Cebos" && item[0].rarity == "event") answer = ("Solo durante evento asociado.");
    }
    $("#second-middle").append('<span>Tienda: ' + answer + '</span>');
    $("#second-middle").append('<span>Precio: <span class="maana-section"></span><span class="mo-section"></span></span>');
    $(".maana-section").eq(0).append(item[0].location.mall[0]);
    $(".maana-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_blue.png">');
    $(".mo-section").eq(0).append(item[0].location.mall[1]);
    $(".mo-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_gold.png">');

    answer = item[0].location.alchemy;
    answer ? answer = "SI" : answer = "NO";
    $("#second-right").append('<span>Alquimia: ' + answer + '</span>');
    answer = item[0].location.bindle;
    answer ? answer = "SI" : answer = "NO";
    $("#second-right").append('<span>Costales: ' + answer + '</span>');

    // Puntos de exploración
    $("#popup-content").append('<div id="third-line"></div>');

    if (item[0].location.exploration.length == 0) {
        $("#third-line").append('<span><br></span><span class="exploration-null"><i>— No hay puntos de exploración disponibles. —</i></span>');
    } else {
        for (i = 0; i < item[0].location.exploration.length; i++) {
            var mapa = mapLocations.filter(v => {return v.id == item[0].location.exploration[i]});
            var nombre = mapa[0].name;
            switch (mapa[0].map) {
                case 11: nombre += " - Ciudad de Eel (TO)"; break;
                case 12: nombre += " - Costa de Jade (TO)"; break;
                case 13: nombre += " - Templo Fenghuang (TO)"; break;

                case 21: nombre += " - Ciudad de Eel (ANE)"; break;
                case 22: nombre += " - Montañas Genkaku (ANE)"; break;
                case 23: nombre += " - Ciudad Terrestre (ANE)"; break;
            };

            var position = mapa[0].style;

            mapa = "map" + mapa[0].map;
            position = position.replace("left: ", "-");
            position = position.replace("top: ", "-");
            position = position.split(";");
            var posX = parseInt(position[0].replace("px",""));
            var posY = parseInt(position[1].replace("px",""));
            posX = (posX + 25) + "px ";
            posY = (posY + 25) + "px";
            position = posX + posY;

            $("#third-line").append('<div class="location-point ' + mapa + '" title="' + nombre + '"></div>');
            $(".location-point").eq(i).attr("style", "background-position: " + position);
        }

    };
    */
};



var normalize = (function() {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
        to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};
   
    for(var i = 0, j = from.length; i < j; i++ )
        mapping[ from.charAt( i ) ] = to.charAt( i );
   
    return function( str ) {
        var ret = [];
        for( var i = 0, j = str.length; i < j; i++ ) {
            var c = str.charAt( i );
            if( mapping.hasOwnProperty( str.charAt( i ) ) )
                ret.push( mapping[ c ] );
            else
                ret.push( c );
        }      
        return ret.join( '' );
    }
})();

$(function() {
    $("#filter-search").on("input", function() {
        cargarPets();
    });

    $("#filter-rarity-selector").change(function() {
        cargarPets();
    });

    $("#card-list").on("click", ".card-item", function() {
        var name = $(this).attr("data-name");
        drawBigCard(name);
        $("#popup-outer").fadeIn(300).css("display", "table");
        $("#popup-inner").addClass("open");
    });

    $("#popup-outer").click(function() {
        var id = $(this).attr("id");
        if (id == "popup-outer") {
            $("#popup-outer").fadeOut(400);
            $("#popup-inner").removeClass("open");
            setTimeout(function() {
                $("#popup-content").html('');
            }, 500)
        }
    });
});

function getFiltros() {
    var general = $("#filter-rarity-selector").val();
    return general;
};
