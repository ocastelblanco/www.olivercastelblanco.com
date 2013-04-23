// JavaScript Document
$(function() {
		$('#muestra1_pag13').click(function() {
			ocultarTextsoPag13();
			$('#texto1_pag13').fadeIn('fast');
	
		});
		
		$('#muestra2_pag13').click(function() {
			ocultarTextsoPag13();
			$('#texto2_pag13').fadeIn('fast');
		});
		
		$('#muestra3_pag13').click(function() {
			ocultarTextsoPag13();
			$('#texto3_pag13').fadeIn('fast');
		});
		
		$('#muestra4_pag13').click(function() {
			ocultarTextsoPag13();
			$('#texto4_pag13').fadeIn('fast');
		});
	});

function ocultarTextsoPag13(){
	$('#texto1_pag13,#texto2_pag13,#texto3_pag13,#texto4_pag13').hide();
	}
