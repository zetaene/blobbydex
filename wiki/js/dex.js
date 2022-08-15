$(document).ready(function () {

    const requestExp = new XMLHttpRequest();requestExp.open("GET", "../data/db.json");
    requestExp.responseType = "json";requestExp.send();requestExp.onload = function() {

        const requestMap = new XMLHttpRequest();requestMap.open("GET", "../data/map.json");
        requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

            const requestPet = new XMLHttpRequest();requestPet.open("GET", "../data/pet.json");
            requestPet.responseType = "json";requestPet.send();requestPet.onload = function() {

                mapLocations = requestMap.response; expInfo = requestExp.response;pet = requestPet.response;

                expInfo.reverse();
                $("#filter-category-selector").val("all");
                $("#filter-alchemy-type").val("all");
                $("#filter-pet-type").val("all");
                $("#filter-search").val("");

                cargarInfo();
            };
        };
    };
});

function cargarInfo(page = "") {
    var info = [];
    $("#card-list").html("");

    var filtro = getFiltros();
    if (filtro == "all") { info = expInfo;
    } else if (filtro == "alchemy" || filtro == "pet") { info = expInfo.filter(v => {return v.group == filtro});
    } else { info = expInfo.filter(v => {return v.category == filtro}); }

    if (page.includes("#")) {
        page = page.slice(1);
        if (page.includes("consumable/")) {
            page = page.split("consumable/");
            page = page[1];
            if (page.includes("~")) { page = page.split("~"); page = page[0]; }
            page = normalize(page).toLowerCase();
            info = info.filter(v => {return (normalize(v.img).toLowerCase()).includes(page)});
        } else {
            page = normalize(page).toLowerCase();
            info = info.filter(v => {return (normalize(v.name).toLowerCase()).includes(page)});
        }
    };

    for (a = 0; a < info.length; a++) {
        $("#card-list").append('<li class="card-item" data-itemid="' + info[a].id + '"><div class="abstract-icon"></div><div class="abstract-info"><div class="abstract-middle"><div class="abstract-name"></div><div class="abstract-category"></div><div class="abstract-location-mall"></div><div class="abstract-location-map"></div></div></div></li>');
        $(".abstract-icon").eq(a).append('<img src="' + info[a].img + '">');
        $(".abstract-name").eq(a).append(info[a].name);
        $(".abstract-category").eq(a).append('Tipo: ' + info[a].category);

        switch(info[a].rarity) {
            
            case "common": $(".card-item").eq(a).append('<div class="rarity-marker-common"></div>');break;
            case "rare": $(".card-item").eq(a).append('<div class="rarity-marker-rare"></div>');break;
            case "epic": $(".card-item").eq(a).append('<div class="rarity-marker-epic"></div>');break;
            case "legendary": $(".card-item").eq(a).append('<div class="rarity-marker-legendary"></div>');break;
            case "event": $(".card-item").eq(a).append('<div class="rarity-marker-event"></div>');break;
        }
        
    }
}


function drawBigCard(id) {
    var item = expInfo.filter(v => {return v.id == id});
    var grupo = item[0].group;
    grupo == "pet" ? grupo = "FAMILIAR # " : grupo = "ALQUIMIA # ";

    // Info general
    $("#popup-content").append('<div id="first-line"></div>');
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
        case "Alimento": filterList = pet.filter(v => {return v.info.food == id}); break;
        case "Cebos": filterList = pet.filter(v => {return v.info.bait == id}); break;
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

    // Obtención
    $("#popup-content").append('<div id="second-line"></div>');
    $("#second-line").append('<span style="margin-left: 40px;margin-top: 25px;">OBTENCIÓN:</span>');

    $("#second-line").append('<div id="second-left"></div><div id="second-right"></div></id>');

        // Tienda?
    answer = (item[0].location.mall[0] == "-" && item[0].location.mall[1] == "-") ? "NO" : "SI";
    if (item[0].category == "Cebos" && item[0].rarity == "event") {
        if (answer == "SI") { $("#second-left").append('<span><b>Tienda:</b> Solo durante evento asociado.</span>');
        } else { $("#second-left").append('<span><b>Tienda:</b> NO</span>'); }

    } else {
        $("#second-left").append('<span><b>Tienda:</b> <span class="maana-section"></span><span class="mo-section"></span></span>');
        $(".maana-section").eq(0).append(item[0].location.mall[0]);
        $(".maana-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_blue.png">');
        $(".mo-section").eq(0).append(item[0].location.mall[1]);
        $(".mo-section").eq(0).append(' <img src="https://www.eldarya.es/static/img/coin_gold.png">');
    }

        // Exploración ?
    var answer = item[0].location.exploration.length > 0 ? "SI" : "NO";
    $("#second-left").append('<span><b>Exploración:</b></span>');

        // Alquimia ?
    answer = item[0].location.alchemy;
    answer ? answer = "SI" : answer = "NO";
    $("#second-right").append('<span><b>Alquimia:</b> ' + answer + '</span>');

        // Costal ?
    answer = item[0].location.bindle;
    answer ? answer = "SI" : answer = "NO";
    $("#second-right").append('<span><b>Costales:</b> ' + answer + '</span>');

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

    $("#filter-category-selector").change(function() {
        var categoria = $(this).val()
        if (categoria == "all") {
            $("#filter-alchemy-type").val("all");
            $("#filter-alchemy-type").hide();
            $("#filter-pet-type").val("all");
            $("#filter-pet-type").hide();
        } else if (categoria == "pet") {
            $("#filter-alchemy-type").hide();
            $("#filter-pet-type").show();
        } else if (categoria == "alchemy") {
            $("#filter-pet-type").hide();
            $("#filter-alchemy-type").show();
        }

        updateStuff();
    });

    $("#filter-alchemy-type").change(function() { updateStuff() });
    $("#filter-pet-type").change(function() { updateStuff() });

    $("#card-list").on("click", ".card-item", function() {
        var id = parseInt($(this).attr("data-itemid"));
        drawBigCard(id);
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

    $("#popup-inner").click(function() {

    });
});

function updateStuff() {
    $("#filter-search").val("");
    cargarInfo();
};

function getFiltros() {
    var general = $("#filter-category-selector").val();

    if (general == "all") { return general;
    } else if (general == "alchemy") {

        general = $("#filter-alchemy-type").val();
        switch (general) {
            case "all": return "alchemy"; break;
            case "potions": return "Pociones"; break;
            case "containers": return "Recipientes"; break;
            case "scrolls": return "Pergaminos"; break;
            case "plants": return "Plantas"; break;
            case "minerals": return "Minerales"; break;
            case "gasnliq": return "Gases y líquidos"; break;
            case "other": return "Otros"; break;
        };
    } else if (general == "pet") {
        general = $("#filter-pet-type").val();
        switch (general) {
            case "all": return "pet"; break;
            case "food": return "Alimento"; break;
            case "bait": return "Cebos"; break;
            case "utility": return "Herramientas"; break;
        };
    };
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

/* Cebos faltantes
        ---145
    Incandescent Horseshoe  Rawist          https://www.eldarya.es/assets/img/item/consumable/f2104cc4faf0dac0d1cdc45565168cc7.png
        Very Special Fork   Sgarkellogy     https://www.eldarya.es/assets/img/item/consumable/26ddfdce9436d57995676597b7f2e0f3.png
        Radioactive Silk    SPADEL          https://www.eldarya.es/assets/img/item/consumable/b87db6f0b784c58e1d4726e5838de5bf.png
        ---150
---------------------------------------------------------------------------------------------------------------------------------------
        ---170
            Fabric Mouse    Ciralak         https://www.eldarya.es/static/img/item/consumable/41a2ac8d5c3313e6650301c7267271dc.png

            Cozy Stocking   Okanya          https://www.eldarya.es/static/img/item/consumable/dd41d4451e2acf01f7fd3c5aa5c4e453.png
    Heaven Stellar Flask    Danalasm        https://www.eldarya.es/static/img/item/consumable/7ee306e7ef7f06c203c96f57654161cb.png
        ---178
---------------------------------------------------------------------------------------------------------------------------------------
        ---238
        239?Ball of Bandages    Mohmiau     https://www.eldarya.es/static/img/item/consumable/288bfe06a66b9173da7d9d638e1210b4.png
        240 ?   Bezoar      Bakhrahell      https://www.eldarya.es/static/img/item/consumable/d2d32fe07d698487207bf9a9f2de7cbf.png
        ---241
---------------------------------------------------------------------------------------------------------------------------------------
        ---326              Marquilla
                Air Key     Ailikamp        https://www.eldarya.es/static/img/item/consumable/9c5ce31c5894f227216c081783893690.png
        ---332
---------------------------------------------------------------------------------------------------------------------------------------
        ---333
        Centipede's Soul    Pterocorvus     https://www.eldarya.es/assets/img/item/consumable/6639ba25254a706b7847d21b1cd4e253.png
        ---339

        ---375--Spectral Lamp
            polished stone
            Toilet Paper    Pocoku          https://www.eldarya.fr/assets/img/item/consumable/fa8fab648d3e85bf69aaa48b5fa10463.png
        ----371
            
            
            

            ???
            obsidiana caoba
            386--Fosil congelado--408
            hoja helada

        Polished Stone      Loutruol

TENEDOR PAL SKARGELLOGY O COMO SE ESCRIBA
SEDA RADIACTIVA  
ZANAHORIA ENCANTADA
RATON DE TRAPO
MEDIA NAVIDAD
POLVO ESTELAR ?
TRE DEDOS


pocion de energia oscura(legendario) antes de pocion de evolucion- despues de pocion grande
*/