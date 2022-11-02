function getSearch() {
	if (window.location.search != "") {
		var valor = unescape(decodeURIComponent(window.location.search));
		
		if (valor.includes("&")) {
			valor = valor.split("&");
			valor = valor[0];
		};

		valor = valor.replace("?s=", "");
		return valor;
	}
		return null;
};