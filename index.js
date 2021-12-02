$(document).ready(function() {
	var enlace = [
		{"src":"wiki/dex", "name":"Lista de items"},
		{"src":"wiki/map", "name":"Exploración"},
		{"src":"wiki/set", "name":"Conjuntos"},
		{"src":"wiki/pet", "name":"Familiares"},
		{"src":"wiki/chapter", "name":"Capítulos"},
		{"src":"wiki/images", "name":"Ilustraciones"},
		{"src":"wiki/alchemy", "name":"Alquimia"},

		{"src":"wishlist/create", "name":"Crea tu wishlist"},
		{"src":"wishlist/view", "name":"Mi Wishlist"}
	]

	for (i = 0; i < enlace.length; i++) {
		var ext = enlace[i].src;
		if ((window.location.href).includes('127')) ext += ".html";
		if (i <= 1) {
			$(".pages").append('<li><a href="' + ext + '">' + enlace[i].name + '</a></li>');

		} else {
			$(".pages").append('<li><a>' + enlace[i].name + '</a></li>');
		};
	};
})