// JavaScript Document
$(function() {
		$('#muestra1_pag21').click(function() {
			ocultarTextsoPag21();
			$('#texto1_pag21').fadeIn('fast');
	
		});
		
		$('#muestra2_pag21').click(function() {
			ocultarTextsoPag21();
			$('#texto2_pag21').fadeIn('fast');
		});
		
		$('#muestra3_pag21').click(function() {
			ocultarTextsoPag21();
			$('#texto3_pag21').fadeIn('fast');
		});
		
		$('#muestra4_pag21').click(function() {
			ocultarTextsoPag21();
			$('#texto4_pag21').fadeIn('fast');
		});
	});

function ocultarTextsoPag21(){
	$('#texto1_pag21,#texto2_pag21,#texto3_pag21,#texto4_pag21').hide();
	}
