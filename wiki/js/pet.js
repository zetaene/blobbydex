$(document).ready(function () {
	const requestExp = new XMLHttpRequest();requestExp.open("GET", "../data/db.json");
    requestExp.responseType = "json";requestExp.send();requestExp.onload = function() {

        const requestMap = new XMLHttpRequest();requestMap.open("GET", "../data/map.json");
        requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

            const requestPet = new XMLHttpRequest();requestPet.open("GET", "../data/pet.json");
            requestPet.responseType = "json";requestPet.send();requestPet.onload = function() {
                mapLocations = requestMap.response; expInfo = requestExp.response;petInfo = requestPet.response;

                cargarPets();

                if (getSearch() != null) {
                    drawBigCard(getSearch());
                    $("#popup-outer").fadeIn(300).css("display", "table");
                    $("#popup-inner").addClass("open");
                };
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
    var pet = petInfo.filter(v => {return v.name == name});

    // Nombre y rareza
    $("#popup-content").append('<div id="first-line"><span><span class="rarity ' + pet[0].rarity + '"></span><b style="font-size: 18px">' + (pet[0].name).toUpperCase() + '</b></span></div>');

    // Imagenes
    $("#popup-content").append('<div id="second-line"><span></span></div>');
    $("#second-line span").append('<img class="pet-image egg" src="' + pet[0].img.egg + '">');
    if (pet[0].img.baby != "") { $("#second-line span").append('<img class="pet-image baby" src="' + pet[0].img.baby + '">') }
    if (pet[0].img.adult != "") { $("#second-line span").append('<img class="pet-image adult" src="' + pet[0].img.adult + '">') }

    // Alimento y cebo
    $("#popup-content").append('<div id="third-line"></div>');
    var food = expInfo.filter(v => {return v.id == pet[0].info.food});
    if (food == "?") { // Alimento desconocido
        $("#third-line").append('<div class="petinfo food" title="No disponible">?</div>');

    } else {
        var enlace = window.location.href;
        if (enlace.includes("?s=")) { 
            enlace = enlace.split("?s=");
            enlace = enlace[0];
        };
        enlace = enlace.replace("pet", "inventory");
        enlace += "?s=" + pet[0].info.food;
        $("#third-line").append('<a href="' + enlace + '" target="_blank"><div class="petinfo food"><img title="' + food[0].name + '" src="' + food[0].img + '"></div></a>');
    }
    $("#third-line").append('<div class="pettitle">Alimento</div>');

    var bait = pet[0].info.bait;
    if (bait == "?") { // Cebo desconocido
        $("#third-line").append('<div class="petinfo bait" title="No disponible">?</div>');
        $("#third-line").append('<div class="pettitle">Cebo</div>');
    } else if (bait != null) { // Tiene cebo
        bait = expInfo.filter(v => {return v.id == pet[0].info.bait}); 

        var enlace = window.location.href;
        if (enlace.includes("?s=")) { 
            enlace = enlace.split("?s=");
            enlace = enlace[0];
        };
        enlace = enlace.replace("pet", "inventory");
        enlace += "?s=" + pet[0].info.bait;

        $("#third-line").append('<a href="' + enlace + '" target="_blank"><div class="petinfo bait"><img title="' + bait[0].name + '" src="' + bait[0].img + '"></div></a>');
        $("#third-line").append('<div class="pettitle">Cebo</div>');
    }

    // Información general
    $("#popup-content").append('<div id="forth-line"></div>');
    $("#forth-line").append('<span class="middle"><b>Tiempo de eclosión:</b> ' + pet[0].info.hatch + ' minutos.</span>');

    $("#forth-line").append('<span class="middle"><b>Condiciones de evolución:</b></span>');
    
    var valor = "";
    if (pet[0].info.energy.length > 1) valor = ' / ' + pet[0].info.energy[1];
    $("#forth-line").append('<span class="middle"><b>Energía:</b> ' + pet[0].info.energy[0] + valor + '</span>');

    if (pet[0].info.evolve.level != null) {
        $("#forth-line").append('<span class="middle">Nivel ' + pet[0].info.evolve.level + ' / Afecto ' + pet[0].info.evolve.affection + '% / ' + pet[0].info.evolve.days + ' días</span>');
    } else {
        $("#forth-line").append('<span class="middle">-</span>');

    }
    
    valor = "";
    if (pet[0].info.luck.length > 1) valor = ' / ' + pet[0].info.luck[1];
    $("#forth-line").append('<span class="middle"><b>Suerte:</b> ' + pet[0].info.luck[0] + valor + '</span>');

    // Si es evento, especificar rareza real (?
    if (pet[0].rarity == "event") {
        $("#forth-line").append('<span class="middle"><b>Rareza:</b> <span class="rarity ' + pet[0].eventInfo[0] + '"></span></span>');
    }

    // Obtención
    $("#popup-content").append('<div id="fifth-line"></div>');

    if (pet[0].rarity == "event") {
        $("#fifth-line").append('<span style="margin-left: 40px;">OBTENCIÓN: (Solo durante evento asociado.)</span>');
    } else {
        $("#fifth-line").append('<span style="margin-left: 40px;">OBTENCIÓN:</span>');
    }

    // Tienda
    $("#fifth-line").append('<span class="middle"><b>Tienda:</b> <span class="maana-section"></span><span class="mo-section"></span></span>');
    $(".maana-section").eq(0).append(pet[0].location.mall[0]);
    $(".maana-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_blue.png">');
    $(".mo-section").eq(0).append(pet[0].location.mall[1]);
    $(".mo-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_gold.png">');

    if (pet[0].rarity != "event") {
        var answer = (pet[0].location.bindle) ? answer = "SI" : answer = "NO";
        $("#fifth-line").append('<span class="middle"><b>Costal:</b> ' + answer  + '</span>');
        $("#fifth-line").append('<span class="middle"><b>Exploración:</b></span>');
        answer = (pet[0].location.alchemy) ? answer = "SI" : answer = "NO";
        $("#fifth-line").append('<span class="middle"><b>Alquimia:</b> ' + answer  + '</span>'); // pendiente: linkear a receta

            // Puntos de exploración
        $("#popup-content").append('<div id="sixth-line"></div>');

        if (pet[0].location.exploration.length == 0) {
            $("#sixth-line").append('<span><br></span><span class="exploration-null"><i>— No hay puntos de exploración disponibles. —</i></span>');
        } else {
            for (i = 0; i < pet[0].location.exploration.length; i++) {
                var mapa = mapLocations.filter(v => {return v.id == pet[0].location.exploration[i]});
                var nombre = mapa[0].name;
                switch (mapa[0].map) {
                    case 11: nombre += " - Ciudad de Eel (TO)"; break;
                    case 12: nombre += " - Costa de Jade (TO)"; break;
                    case 13: nombre += " - Templo Fenghuang (TO)"; break;

                    case 21: nombre += " - Ciudad de Eel (ANE)"; break;
                    case 22: nombre += " - Montañas Genkaku (ANE)"; break;
                    case 23: nombre += " - Ciudad Terrestre (ANE)"; break;
                    case 24: nombre += " - Yaqut (ANE)"; break;
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

                $("#sixth-line").append('<div class="location-point ' + mapa + '" title="' + nombre + '"></div>');
                $(".location-point").eq(i).attr("style", "background-position: " + position);
            }

        }



    } else {
        $("#fifth-line").append('<span class="middle"><b>Evento:</b> ' + pet[0].eventInfo[1] + '</span>');
        $("#fifth-line").append('<span class="middle"><b>Exploración:</b></span>');

        if (pet[0].eventInfo[2] != null) {
            $("#fifth-line").append('<span class="middle"><b>Otros: </b>' + pet[0].eventInfo[2] + '</span>')
        };

        $("#popup-content").append('<div id="sixth-line"></div>');

        if (pet[0].info.bait != null) {
            // Tiene cebo, es de exploración
            var evento = pet[0].eventInfo[1];
            evento = evento.split(" ");
            evento = evento[0];
            var clase = "map ";

            switch (evento) {
                case "San": clase += "svalentin";break;
                case "Pascua": clase += "easter";break;
                case "Música": clase += "music";break;
                case "Verano": clase += "summer";break;
                case "Halloween": clase += "halloween";break;
                case "Navidad": clase += "christmas";break;
            }
            $("#sixth-line").append('<div class="location-event-point ' + clase + '"></div>');
            //$(".location-point").eq(i).attr("style", "background-position: " + position);

        } else {
            // No es de exploración
            $("#sixth-line").append('<span><br></span><span class="exploration-null"><i>— No hay puntos de exploración disponibles. —</i></span>');
        }

    }



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

    $("#popup-inner").click(function(event) {
        event.stopPropagation();
    });
});

function getFiltros() {
    var general = $("#filter-rarity-selector").val();
    return general;
};
