$(function() {
	var mensajeOK = '<div class="grid_8 mensaje alpha omega"><strong>Oliver says:</strong> your message has been sent. Thank you!</div><div class="clearfix"></div><div class="grid_8 imagenOliver alpha omega"><img src="img/rostro.png" alt="Oliver Castelblanco"></div>';
	var mensajeError = '<div class="grid_8 mensaje alpha omega"><strong>Oliver says:</strong> I have a problem sending your message. Try again, please.</div><div class="clearfix"></div><div class="grid_8 imagenOliver alpha omega"><img src="img/rostro.png" alt="Oliver Castelblanco"></div>';
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
		if (formulario.name.value.length < 3 || formulario.email.value.length < 3 || formulario.comment.value.length < 3) {
			$('form #send').parent().next().children('#tooltipo').show('slide', 250);
			return false;
		} else if(!validarEmail(formulario.email.value)) {
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
    		$('#contactme').parent().html('Oops, there is an error... please try again.');
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

});