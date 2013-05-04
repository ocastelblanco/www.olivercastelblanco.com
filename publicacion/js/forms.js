$(function() {
	var mensajeOK = '<div class="grid_8 mensaje alpha omega"><strong>Oliver says:</strong> your message has been sent. Thank you!</div><div class="clearfix"></div><div class="grid_8 imagenOliver alpha omega"><img src="img/rostro.png" alt="Oliver Castelblanco"></div>';
	var mensajeError = '<div class="grid_8 mensaje alpha omega"><strong>Oliver says:</strong> I have a problem sending your message. Try again later, please.</div><div class="clearfix"></div><div class="grid_8 imagenOliver alpha omega"><img src="img/rostro.png" alt="Oliver Castelblanco"></div>';
	var resultadoCaptcha;
	$('form .textinput').focusin(function(e) {
        $(this).removeClass('textInputUnselected');
        $(this).addClass('textInputSelected');
    });
	$('form .textinput').focusout(function(e) {
        $(this).addClass('textInputUnselected');
        $(this).removeClass('textInputSelected');
		if ($(this).val().length < 3) {
			$(this).parent().next().children('#tooltipo').show('slide', 250);
		} else if($(this).attr('id') == 'email' && !validarEmail($(this).val())) {
			$(this).parent().next().children('#tooltipo').children('span').html('Use valid email');
			$(this).parent().next().children('#tooltipo').show('slide', 250);
		}
    });
	$('form .textinput').change(function(e) {
		if ($(this).val().length < 3) {
			$(this).parent().next().children('#tooltipo').show('slide', 250);
		} else {
			$(this).parent().next().children('#tooltipo').hide('slide', 250);
			$('form #send').parent().next().children('#tooltipo').hide('slide', 250);
		}
    });
	$('form #send').mouseenter(function(e) {
        $(this).removeClass('sendPress');
        $(this).addClass('sendOver');
    });
	$('form #send').mousedown(function(e) {
        $(this).addClass('sendPress');
        $(this).removeClass('sendOver');
    });
	$('form #send').mouseleave(function(e) {
        $(this).removeClass('sendPress');
        $(this).removeClass('sendOver');
    });
	$('form #send').click(function(e) {
        $(this).removeClass('sendPress');
        $(this).addClass('sendOver');
		e.preventDefault();
		$('form#contactme').ajaxSubmit({
        	beforeSubmit: validar,
			dataType: 'json',
       		success: recibir
		});
    });
	function validar(datos, jqForm, opciones) {
		var formulario = jqForm[0];
		if (formulario.name.value.length < 3 || formulario.email.value.length < 3 || formulario.comment.value.length < 3 || formulario.captcha.value.length < 1) {
			$('form #send').parent().next().children('#tooltipo').show('slide', 250);
			return false;
		} else if(!validarEmail(formulario.email.value)) {
			$('form #send').parent().next().children('#tooltipo').show('slide', 250);
			return false;
		} else if(formulario.captcha.value != resultadoCaptcha) {
			$('form #send').parent().next().children('#tooltipo').children(':first').html('Do the math!');
			$('form #send').parent().next().children('#tooltipo').show('slide', 250);
			return false;
		} else {
			return true;
		}
	}
	function recibir(datos) {
		if (datos.respuesta) {
    		$('#contactme').parent().html(mensajeOK);
		} else {
    		$('#contactme').parent().html(mensajeError);
		}
	}
	function validarEmail(email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if(!emailReg.test(email)) {
			return false;
		} else {
			return true;
		}
	}
	creaCaptcha();
	function creaCaptcha(){
		var ops = new Array('+', '-', '*');
		var uno = Math.ceil(Math.random()*9);
		var dos = Math.ceil(Math.random()*9);
		var op = Math.floor(Math.random()*3);
		var salida = uno+" "+ops[op]+" "+dos+" =";
		if (op == 0) {
			resultadoCaptcha = uno+dos;
		} else if (op == 1 && uno < dos) {
			salida = dos+" "+ops[op]+" "+uno+" =";
			resultadoCaptcha = dos-uno;
		} else if (op == 1) {
			resultadoCaptcha = uno-dos;
		} else if (op == 2) {
			resultadoCaptcha = uno*dos;
		}
		$('.suma').html(salida);
	}
	iniciaMapa();
	function iniciaMapa() {
		var textoVentana = '<div id="content">'+
		'<h3>Oliver says:</h3>'+
		'<div id="bodyContent">'+
		'<p>Thank you for click on me. Also, you can download my CV or find me in the social networks links below.</p>'+
		'</div>'+
		'</div>';
		var infoVentana = new google.maps.InfoWindow({
			content: textoVentana,
			maxWidth: 240
		});
		var myLatLng = new google.maps.LatLng(4.641018,-74.064615);
		var mapOptions = {
			center: myLatLng,
			zoom: 4,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
		
		var image = 'img/rostroMarker.png';
		var oliMarker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: image,
    		animation: google.maps.Animation.DROP
		});
		google.maps.event.addListener(oliMarker, 'click', function() {
  			infoVentana.open(map,oliMarker);
		});
		google.maps.event.addListener(infoVentana, 'closeclick', function() {
			map.panTo(myLatLng);
		});
	}
});