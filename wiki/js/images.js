var imgList = [];
var enlaceFormulario = "https://forms.gle/ifD1qejpqBfid5ai7";
/*illust leiftan
https://www.eldarya.fr/forum/t186,1-fan-club-leiftan-artemis.htm
======================================================*/
$(document).ready(function () {
	const requestIMG = new XMLHttpRequest();requestIMG.open("GET", "../data/illust.json");
	requestIMG.responseType = "json";requestIMG.send();requestIMG.onload = function() {

	    imgList = requestIMG.response;

	    cargarImages();
	};
});

function cargarImages() {

	$("#card-list").html(""); // limpiar todo
	$(".unselected-option").remove();
	
	
	// Filtros
	var filtro = getFiltros();
	var lista = [];

	if (filtro != "none") {
		switch (filtro) {
			case "origins":lista = imgList.origins;break;
			case "newera":lista = imgList.newera;break;
			case "spinoff":lista = imgList.spinoff;break;
			case "event":lista = imgList.event;break;
		};

		if (filtro == "origins" || filtro == "newera") {
			// Capítulos
			var chapters = lista[lista.length - 1].ch;

			for (c = 1; c <= chapters; c++) {
				var images = lista.filter(v => {return v.ch == c});

				var currentImages = images.filter(v => v.url != "");
				currentImages = currentImages.length;
				$("#card-list").append('<div class="chapter-container"></div>');
				$(".chapter-container").eq(c - 1).append('<h3>Capítulo ' + c + ' (' + currentImages + '/' + images.length + ')</h3>');
				$(".chapter-container").eq(c - 1).append('<div class="chapter-images"></div>');

				for (i = 0; i < images.length; i++) {
					if (images[i].url != "") {
						$(".chapter-images").eq(c - 1).append('<div class="image-container"><img class="ch-image" src="' + images[i].url + '"></div>');
					} else {
						$(".chapter-images").eq(c - 1).append('<div class="image-container"><div class="ch-image missing" title="Haz clic para aportar esta imagen"></div></div>');
					}
				}
			}


		} else if (filtro == "spinoff") {
			// Spin off
			lista = imgList.spinoff;

			for (c = 0; c < lista.length; c++) {
				$("#card-list").append('<div class="chapter-container"></div>');
				$(".chapter-container").eq(c).append('<h3>' + lista[c].so +'</h3>');
				$(".chapter-container").eq(c).append('<div class="chapter-images"></div>');
				$(".chapter-images").eq(c).append('<div class="image-container"><img class="ch-image" src="' + lista[c].url + '"></div>');

			}


		} else if (filtro == "event") {
			// Evento
			var fechaInicio = imgList.event.filter(v => v.name == "sv");
			fechaInicio = fechaInicio[fechaInicio.length -1].year;
			var fechaFin = 2016;
			var e = 0;
			var anio = fechaInicio;

			do {
				lista = imgList.event.filter(v => {return v.year == anio});
				if (lista.length > 0) {
					$("#card-list").append('<div class="chapter-container"></div>');
					$(".chapter-container").eq(e).append('<h3>' + anio +'</h3>');
					$(".chapter-container").eq(e).append('<div class="chapter-images"></div>');

					for (i = 0; i < lista.length; i++) {
						$(".chapter-images").eq(e).append('<div class="image-container"><img title="' + getName(lista[i].name) + '" class="ch-image" src="' + lista[i].url + '"></div>');
					}
					e++;anio--;
				}
			} while (lista.length > 0);

		}
	} else {
		$("#card-container").prepend('<span class="unselected-option"><i>Seleccione una opción de la lista.</i></span>')
	};

};

function getFiltros() {
	return $("#filter-category-selector").val();
}

function getName(nombre) {
	switch (nombre) {
		case "sv": return "San Valentín";
		case "easter": return "Pascua";
		case "music": return "Música";
		case "summer": return "Verano";
		case "halloween": return "Halloween";
		case "christmas": return "Navidad";
	}
}

$(function() {
	$("#filter-category-selector").change(function() {
		cargarImages();
	})

	$("#card-list").on("click", ".ch-image", function() {
		if (!($(this).hasClass("missing"))) {
			var img = $(this).attr("src");
			$("#popup-image").attr("src",img);

			$("#popup-outer").fadeIn(300).css("display", "table");
			$("#popup-inner").addClass("open");
		} else {
			window.open(enlaceFormulario, '_blank');
		}
	});


    $("#popup-outer").click(function() {
        var id = $(this).attr("id");
        if (id == "popup-outer") {
            $("#popup-outer").fadeOut(400);
            $("#popup-inner").removeClass("open");
            setTimeout(function() {
                $("#popup-image").html('');
            }, 500)
        }
    });

})

