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

                        if (window.location.search == "") {
                        	window.location.search = "?map=ciudadeel"
                        }

                        // Mostrar menu para cambiar de mapas 
                        $("#map-section").append('<div id="map-menu-container"></div>');
                        $("#map-menu-container").append('<a id="s1-ciudadeel" class="map-menu-option">Ciudad de Eel</a>');
                        $("#map-menu-container").append('<a id="s1-costajade" class="map-menu-option">Costa de Jade</a>');
                        $("#map-menu-container").append('<a id="s1-fenghuang" class="map-menu-option">Templo Fenghuang</a>');

                        $("#map-menu-container").append('<a id="s2-ciudadeel" class="map-menu-option">Ciudad de Eel (ANE)</a>');
                        $("#map-menu-container").append('<a id="s2-genkaku" class="map-menu-option">Montañas Genkaku</a>');

                        $("#map-section").append('<div id="map-container"></div>');


                    	cargarMapas(window.location.search);
                    };
                };
            };
        };
    };
});


function cargarMapas(map) {
    var currentMap = [];
    map = map.replace("?map=", "");

    if (map == "ciudadeel") {
    	$("#s1-ciudadeel").addClass("selected");
        currentMap = mapLocations.filter(v => {return v.map == 11});
        $("#map-container").addClass("map11");

    } else if (map == "costajade") {
    	$("#s1-costajade").addClass("selected");
        currentMap = mapLocations.filter(v => {return v.map == 12});
        $("#map-container").addClass("map12");

    } else if (map == "fenghuang") {
    	$("#s1-fenghuang").addClass("selected");
        currentMap = mapLocations.filter(v => {return v.map == 13});
        $("#map-container").addClass("map13");

    } else if (map == "ciudadeel2") {
    	$("#s2-ciudadeel").addClass("selected");
        currentMap = mapLocations.filter(v => {return v.map == 21});
        $("#map-container").addClass("map21");

    } else if (map == "genkaku") {
    	$("#s2-genkaku").addClass("selected");
        currentMap = mapLocations.filter(v => {return v.map == 22});
        $("#map-container").addClass("map22");
    };


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
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };
        
        // Buscar huevos
        elmnt = petInfo.filter(v => {return v.category == "Huevos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };

        // Buscar alimento
        elmnt = expInfo.filter(v => {return v.category == "Alimento"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
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

            $(".tooltip").eq(p).append('<img title="' + pInfo[0].english + '" src="' + url + '">');
        };

        // Buscar Alquimia
        elmnt = expInfo.filter(v => {return v.group == "alchemy"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };

        /* VERSION 1 

        // Buscar cebos
        $(".tooltip").eq(p).append('<span class="title-bait"></span>');
        var elmnt = expInfo.filter(v => {return v.category == "Cebos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".title-bait").eq(p).html("Cebos:");
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };
        
        // Buscar huevos
        $(".tooltip").eq(p).append('<span class="title-eggs"></span>');
        elmnt = petInfo.filter(v => {return v.category == "Huevos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".title-eggs").eq(p).html("Huevos:");
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };

        // Buscar alimento
        $(".tooltip").eq(p).append('<span class="title-food"></span>');
        elmnt = expInfo.filter(v => {return v.category == "Alimento"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".title-food").eq(p).html("Alimentos:");
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };

        // Buscar ropa
        $(".tooltip").eq(p).append('<span class="title-clothes"></span>');
        for (c = 0; c < currentMap[p].clothes.length; c++) {
            if (currentMap[p].clothes[0].id != 0) {$(".title-clothes").html("Equipo: ")} else {continue};
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

            $(".tooltip").eq(p).append('<img title="' + pInfo[0].english + '" src="' + url + '">');
        };

        // Buscar Alquimia
        $(".tooltip").eq(p).append('<span class="title-alchemy"></span>');
        elmnt = expInfo.filter(v => {return v.group == "alchemy"});
        //elmnt = elmnt.filter(v => {return v.category != "Pergaminos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".title-alchemy").eq(p).html("Alquimia:");
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };
    
        // Buscar pergaminos
        $(".tooltip").eq(p).append('<span class="title-scrolls"></span>');
        elmnt = expInfo.filter(v => {return v.category == "Pergaminos"});
        elmnt.reverse();
        for (c = 0; c < elmnt.length; c++) {
            if ($.inArray(currentMap[p].id, elmnt[c].location.exploration) > -1) {
                $(".title-scrolls").eq(p).html("Pergaminos:");
                $(".tooltip").eq(p).append('<img title="' + elmnt[c].name + '" src="' + elmnt[c].img + '">');
            } else {continue};
        };*/
    };
};



$(function() {
    $("body").on("click", ".map-menu-option", function() {
        var map = $(this).attr("id");

        switch (map) {
            case "s1-ciudadeel": history.pushState(null, "", "?map=ciudadeel"); break;
            case "s1-costajade": history.pushState(null, "", "?map=costajade"); break;
            case "s1-fenghuang": history.pushState(null, "", "?map=fenghuang"); break;
            case "s2-ciudadeel": history.pushState(null, "", "?map=ciudadeel2"); break;
            case "s2-genkaku": history.pushState(null, "", "?map=genkaku"); break;
        };

        $("#map-container").removeClass($("#map-container").attr("class"));
        $(".map-location").remove();

        cargarMapas(window.location.search);

    });


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