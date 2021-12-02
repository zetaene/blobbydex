$(document).ready(function () {

    const requestExp = new XMLHttpRequest();requestExp.open("GET", "../data/db.json");
    requestExp.responseType = "json";requestExp.send();requestExp.onload = function() {

        const requestMap = new XMLHttpRequest();requestMap.open("GET", "../data/map.json");
        requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

            const requestPet = new XMLHttpRequest();requestPet.open("GET", "../data/pet.json");
            requestPet.responseType = "json";requestPet.send();requestPet.onload = function() {

                mapLocations = requestMap.response; expInfo = requestExp.response;petInfo = requestPet.response;

                expInfo.reverse();

                /*
                var hash = window.location.hash.slice(1);

                if (hash.includes("maps")) {
                    $("#card-list").hide();
                    $("#map-section").show();
                    cargarMapas(hash);
                } else {
                    $("#map-section").hide();
                    $("#card-list").show();
                    cargarInfo(hash);
                };
                */

                cargarInfo();
            };
        };
    };
});

function cargarInfo(page = "") {
    var info = [];

    if (page.includes("-")) {

        switch (page) {
            case "pet-food": info = expInfo.filter(v => {return v.category == "Alimento"}); break;
            case "pet-bait": info = expInfo.filter(v => {return v.category == "Cebos"}); break;
            case "pet-eggs": info = petInfo.filter(v => {return v.category == "Huevos"}); break;
            case "alchemy": info = expInfo.filter(v => {return v.category == "Pergaminos"}); break;
            case "alchemy-scrolls": info = expInfo.filter(v => {return v.category == "Pergaminos"}); break;
            case "alchemy-container": info = expInfo.filter(v => {return v.category == "Recipientes"}); break;
            case "alchemy-plants": info = expInfo.filter(v => {return v.category == "Plantas"}); break;
            case "alchemy-gasliquid": info = expInfo.filter(v => {return v.category == "Gases y líquidos"}); break;
            case "alchemy-minerals": info = expInfo.filter(v => {return v.category == "Minerales"}); break;
            case "alchemy-others": info = expInfo.filter(v => {return v.category == "Otros"}); break;
            //default : info = expInfo;
        }
    } else if (page == "") {
        info = expInfo;
    } else if (page.includes("#")) {
        page = page.slice(1);
        page = normalize(page).toLowerCase();
        info = expInfo.filter(v => {return (normalize(v.name).toLowerCase()).includes(page)});

    } else {
        info = expInfo.filter(v => {return v.group == page});
    };




    for (a = 0; a < info.length; a++) {
        $("#card-list").append('<li class="card-item"><div class="abstract-icon"></div><div class="abstract-info"><div class="abstract-name"></div><div class="abstract-category"></div><div class="abstract-location-mall"></div><div class="abstract-location-map"></div></div></li>');
        $(".abstract-icon").eq(a).append('<img src="' + info[a].img + '">');
        $(".abstract-name").eq(a).append(info[a].name);
        $(".abstract-category").eq(a).append('Tipo: ' + info[a].category);
        
        // Obtención
        // Tienda y/o exploración
        
        if (info[a].location.mall == true) {
            // Está en la tienda
            $(".abstract-location-mall").eq(a).append("Disponible en la Tienda.");
        };

        if (info[a].location.exploration.length != 0) {
            // Está en exploración
            if (info[a].location.exploration.length == 1 && info[a].location.exploration[0] == "?") {
                // Lugar desconocido
                $(".abstract-location-map").eq(a).append("Exploración: ???");

            } else {
                // Filtrar ubicaciones s/mapas // Lista de mapas
                var mapa = [[],[],[],[],[]];
                var nombres = [
                    "Ciudad de Eel (TO)",
                    "Costa de Jade",
                    "Templo Fenghuang",
                    "Ciudad de Eel (ANE)",
                    "Montañas Genkaku"
                ];
                
                // mapa[0] => ciudad de eel
                // mapa[1] => costa de jade
                // mapa[2] => templo fenghuang
                // mapa[3] => ciudad de eel (ane)
                // mapa[4] => genkaku

                for (p = 0; p < info[a].location.exploration.length; p++) {
                    var getMapa = mapLocations.filter(v => {return v.id == info[a].location.exploration[p]});
                    getMapa = getMapa[0].map;

                    switch (getMapa) {
                        case 11: mapa[0].push(info[a].location.exploration[p]); break;
                        case 12: mapa[1].push(info[a].location.exploration[p]); break;
                        case 13: mapa[2].push(info[a].location.exploration[p]); break;
                        case 21: mapa[3].push(info[a].location.exploration[p]); break;
                        case 22: mapa[4].push(info[a].location.exploration[p]); break;
                    };
                };

                // Mostrar nombres de mapas
                $(".abstract-location-map").eq(a).append("Exploración: ");
                var primero = 0;
                
                for (m = 0; m < mapa.length; m++) {
                    if (mapa[m].length != 0) {
                        if (primero != m) $(".abstract-location-map").eq(a).append(", ");
                        var mapaId = mapLocations.filter(v => {return v.id == mapa[m][0]});
                        mapaId = mapaId[0].map;
                        $(".abstract-location-map").eq(a).append('<span class="map-location-preview" data-mapid="' + mapaId + '" data-locationid="' + mapa[m].join("|") + '">' + nombres[m] + '</span>');
                    } else {
                        if (m == primero) {primero++};
                    };
                };
                




            };

        };

        // Costales
        if (info[a].location.bindle == true) {
            // Está en costales
            $(".abstract-location-mall").eq(a).append("Disponible en costales.");
        };

        // Evento
        if (info[a].location.event != null) {
            // Es de evento
            $(".abstract-location-map").eq(a).append("Evento: " + info[a].location.event);
        };


        /*
        if (info[a].location.exploration[0] != -1) {

            if (isNaN(info[a].location.exploration[0])) {
                if (info[a].location.exploration[0].includes("costales") || info[a].location.exploration[0].includes("episodio") || info[a].location.exploration[0].includes("Alquimia")) {
                    $(".abstract-location-map").eq(a).append(info[a].location.exploration[0]);
                } else {
                    $(".abstract-location-map").eq(a).append('Exploración: ' + info[a].location.exploration[0]);
                }
                
            } else {
                $(".abstract-location-map").eq(a).append("Exploración: ");
    
                for (b = 0; b < info[a].location.exploration.length; b++) {
                    if (b != 0) $(".abstract-location-map").eq(a).append(", ");
                    var place = mapLocations.filter(v => {return v.id == info[a].location.exploration[b]});
                    $(".abstract-location-map").eq(a).append('<span class="map-location-preview" data-locationid="' + place[0].id + '">' + place[0].name + '</span>');
                };
            };            
        };*/


        switch(info[a].rarity) {
            
            case "common": $(".card-item").eq(a).append('<div class="rarity-marker-common"></div>');break;
            case "rare": $(".card-item").eq(a).append('<div class="rarity-marker-rare"></div>');break;
            case "epic": $(".card-item").eq(a).append('<div class="rarity-marker-epic"></div>');break;
            case "legendary": $(".card-item").eq(a).append('<div class="rarity-marker-legendary"></div>');break;
            case "event": $(".card-item").eq(a).append('<div class="rarity-marker-event"></div>');break;
        }
        
    }
}


function mapPreview(map, location) {
    var info = mapLocations.filter(v => {return v.map == map});
    $("body").append('<div id="map-preview-container"></div>');
    $("#map-preview-container").append('<div id="map-preview-content"><div id="map-preview-title"></div><div id="map-preview-locations"></div></div>');
    switch (info[0].map) {
        case 11: 
            $("#map-preview-title").append("Ciudad de Eel - The Origins");
            $("#map-preview-locations").addClass("map11");break;
        case 12: 
            $("#map-preview-title").append("Costa de Jade - The Origins");
            $("#map-preview-locations").addClass("map12");break;
        case 13: 
            $("#map-preview-title").append("Templo Fenghuang - The Origins");
            $("#map-preview-locations").addClass("map13");break;

        case 21: 
            $("#map-preview-title").append("Ciudad de Eel - New Era");
            $("#map-preview-locations").addClass("map21");break;
        case 22: 
            $("#map-preview-title").append("Montañas Genkaku - New Era");
            $("#map-preview-locations").addClass("map22");break;
    };

    if (location.includes("|")) {
        var locations = location.split("|");
        for (a = 0; a < locations.length; a++) {
            info = mapLocations.filter(v => {return v.id == locations[a]});
            $("#map-preview-locations").append('<div class="map-location" title="' + info[0].name + '" data-id="' + map + '" style="' + info[0].style + '"></div>');
        }
    } else {
        info = mapLocations.filter(v => {return v.id == location});
        $("#map-preview-locations").append('<div class="map-location" title="' + info[0].name + '" data-id="' + map + '" style="' + info[0].style + '"></div>');

    }

    

    $("#map-preview-container").fadeIn(300);

}





$(function() {
    $("#filter-search").on("input", function() {
        var input = "#" + $(this).val();
        $("#card-list").html("");
        cargarInfo(input);
    });

    $("#card-list").on("click", ".map-location-preview", function() {
        var map = parseInt($(this).attr("data-mapid"));
        var location = $(this).attr("data-locationid");
        mapPreview(map, location);
    });


    $("body").on("click", "#map-preview-container", function() {
        $(this).fadeOut(200);
        setTimeout(function() {
            $("#map-preview-container").remove();
        }, 200);
    });

});


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