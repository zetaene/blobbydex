$(document).ready(function() {
	var enlace = [
		// añadir "beta" a la clase si la página está en beta

		{"src":"wiki/inventory", "name":"Inventario", "class":"inventory beta", "type":"local"},
		{"src":"wiki/map", "name":"Exploración", "class":"maps", "type":"local"},
		{"src":"wiki/pet", "name":"Familiares", "class":"pet beta", "type":"local"},
		{"src":"wiki/images", "name":"Ilustraciones", "class":"illust", "type":"local"},
		/*{"src":"wiki/set", "name":"Conjuntos", "class":"sets"},
		{"src":"wiki/chapter", "name":"Capítulos"},
		{"src":"wiki/alchemy", "name":"Alquimia", "class":"alchemy"},

		{"src":"wishlist/create", "name":"Crea tu wishlist"},
		{"src":"wishlist/view", "name":"Mi Wishlist"},*/
		//{"src":"help", "name":"Colaborar", "class":"help", "type":"local"},

		{"src":"https://gardiemaker.github.io/", "name":"GardieMaker", "class":"gm", "type":"external"}
	]

	for (i = 0; i < enlace.length; i++) {
		var ext = enlace[i].src;
		if (enlace[i].type == "local") {
			if ((window.location.href).includes('127') || (window.location.href).includes('192')) ext += ".html";
			$("#local-pages").append('<li><a href="' + ext + '"><div class="page-list ' + enlace[i].class + '"><span>' + enlace[i].name + '</span></div></a></li>');
		} else {
			$("#external-links").append('<li><a href="' + ext + '" target="_blank"><div class="page-list ' + enlace[i].class + '"><span>' + enlace[i].name + '</span></div></a></li>');
		}
		//if (i <= 2) {

		//} else {
		//	$(".pages").append('<li><div><a>' + enlace[i].name + '</a></div></li>');
		//};
	};

	$("#footer").removeClass("hidden");
})

$(function () {
	$(".footer-close-button").click(function () {
		$("#footer").addClass("hidden");
	})
});