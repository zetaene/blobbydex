$(document).ready(function () {
	const requestExp = new XMLHttpRequest();requestExp.open("GET", "../data/db.json");
    requestExp.responseType = "json";requestExp.send();requestExp.onload = function() {

        const requestMap = new XMLHttpRequest();requestMap.open("GET", "../data/map.json");
        requestMap.responseType = "json";requestMap.send();requestMap.onload = function() {

            const requestPet = new XMLHttpRequest();requestPet.open("GET", "../data/pet.json");
            requestPet.responseType = "json";requestPet.send();requestPet.onload = function() {

                const requestC_Info = new XMLHttpRequest();requestC_Info.open("GET", "https://gardiemaker.github.io/data/groupInfo.json");
                requestC_Info.responseType = "json";requestC_Info.send();requestC_Info.onload = function() {
                    
                    const requestC_List = new XMLHttpRequest();requestC_List.open("GET", "https://gardiemaker.github.io/data/groupList.json");
                    requestC_List.responseType = "json";requestC_List.send();requestC_List.onload = function() {

                        mapLocations = requestMap.response; expInfo = requestExp.response;petInfo = requestPet.response;
                        cInfo = requestC_Info.response; cList = requestC_List.response;

                        expInfo.reverse();

                    	if (window.location.search == "") cargarMapas($("#map-select").val());
                    };
                };
            };
        };
    };
});


function cargarMapas(map) {
    $("#map-container").removeAttr("class");
    $("#map-container").html("");


    var currentMap = [];

    if (map == "eel") {
        currentMap = mapLocations.filter(v => {return v.map == 11});
        $("#map-container").addClass("map11");

    } else if (map == "jade") {
        currentMap = mapLocations.filter(v => {return v.map == 12});
        $("#map-container").addClass("map12");

    } else if (map == "fenghuang") {
        currentMap = mapLocations.filter(v => {return v.map == 13});
        $("#map-container").addClass("map13");

    } else if (map == "eel2") {
        currentMap = mapLocations.filter(v => {return v.map == 21});
        $("#map-container").addClass("map21");

    } else if (map == "genkaku") {
        currentMap = mapLocations.filter(v => {return v.map == 22});
        $("#map-container").addClass("map22");

    } else if (map == "terrestre") {
        currentMap = mapLocations.filter(v => {return v.map == 23});
        $("#map-container").addClass("map23");
    };;


    // Dibujar puntos de exploración + tooltips
    for (p = 0; p < currentMap.length; p++) {
        $("#map-container").append('<div class="map-location" data-id="' + currentMap[p].id + '" style="' + currentMap[p].style + '"></div>');
        $(".map-location").eq(p).append('<div id="location-' + currentMap[p].id + '" class="tooltip"></div>');
        $(".tooltip").eq(p).append('<span class="map-name">' + currentMap[p].name 
            + '  ( <span class="fa fa-bolt"> ' + currentMap[p].energy + '</span>  /  '
            + '<span class="fa fa-clock-o"> ' + currentMap[p].time + '</span> )</span>');

        // VERSION 2
        // Buscar cebos
        var elmnt = expInfo.filter(v => {return v.category == "Cebos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img class="alchemy" id="' + elmnt[c].id + '" title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };
        
        // Buscar huevos
        elmnt = petInfo//.filter(v => {return v.category == "Huevos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img class="egg" id="' + elmnt[c].id + '" title="' + elmnt[c].name + '" src="' + elmnt[c].img.egg + '">');
            } else {continue};
        };

        // Buscar alimento
        elmnt = expInfo.filter(v => {return v.category == "Alimento"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img class="pet" id="' + elmnt[c].id + '" title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };

        // Buscar ropa
        for (c = 0; c < currentMap[p].clothes.length; c++) {
            var pInfo = cInfo.filter(v => {return v.groupId == currentMap[p].clothes[c].id});
            var pIMG = cList.filter(v => {return v.itemId == currentMap[p].clothes[c].id});

              var url = "https://www.eldarya.com/assets/img/";

            switch (pInfo[0].category) {
                case "skin": url += "player/skin/icon/" + pIMG[0].itemURL; break;
                case "mouth": url += "player/mouth/icon/" + pIMG[0].itemURL; break;
                case "eye": url += "player/eyes/icon/" + pIMG[0].itemURL; break;
                case "hair": url += "player/hair/icon/" + pIMG[0].itemURL; break;
                default: url += "item/player/icon/" + pIMG[0].itemURL;
            };

            var nombre = (pInfo[0].english).replace("(x)", "");

            $(".tooltip").eq(p).append('<img class="clothing" title="' + nombre + '" src="' + url + '">');
        };

        // Buscar Alquimia
        elmnt = expInfo.filter(v => {return v.group == "alchemy"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img class="alchemy" id="' + elmnt[c].id + '" title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
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