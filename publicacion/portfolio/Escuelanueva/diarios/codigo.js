// JavaScript Document
function gup( name ){
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp ( regexS );
	var tmpURL = window.location.href;
	var results = regex.exec( tmpURL );
	if( results == null )
		return"";
	else
		return results[1];
}


$(document).ready(function() { 

//llamado a la funcion que captura las variables por el metodo get
$unidad=gup( 'u' );
$guia=gup( 'g' );
$diario=gup( 'd' );
$pagRutum='';
//codigo que carga las direcciones de los foros saberes en la unidad 1
if($unidad==1&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584637_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43128825_1');
		$pagRutum='../unidad1/guia01pag02.html';
}
if($unidad==1&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584637_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43128898_1');
		$pagRutum='../unidad1/guia02pag02.html';
}
if($unidad==1&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584637_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43128943_1');
		$pagRutum='../unidad1/guia03pag02.html';
}
if($unidad==1&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584637_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43128999_1');
		$pagRutum='../unidad1/guia04pag02.html';
}


//codigo que carga las direcciones de los foros saberes en la unidad 2
if($unidad==2&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=1584648&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43332002_1');
		$pagRutum='../unidad2/guia01pag02.html';
}
if($unidad==2&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=1584648&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129268_1');
		$pagRutum='../unidad2/guia02pag02.html';
}
if($unidad==2&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=1584648&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129320_1');
		$pagRutum='../unidad2/guia03pag02.html';
}
if($unidad==2&&$guia==4&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=1584648&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129386_1');
		$pagRutum='../unidad2/guia04pag02.html';
}
if($unidad==2&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=1584648&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129438_1');
		$pagRutum='../unidad2/guia05pag02.html';
}

//codigo que carga las direcciones de los foros saberes en la unidad 3
if($unidad==3&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584656_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129789_1');
		$pagRutum='../unidad3/guia01pag02.html';
}
if($unidad==3&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584656_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129883_1');
		$pagRutum='../unidad3/guia02pag02.html';
}
if($unidad==3&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584656_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43129956_1');
		$pagRutum='../unidad3/guia03pag02.html';
}
//codigo que carga las direcciones de los foros saberes en la unidad 4
if($unidad==4&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584662_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43130064_1');
		$pagRutum='../unidad4/guia01pag02.html';
}
if($unidad==4&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584662_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43130118_1');
		$pagRutum='../unidad4/guia02pag02.html';
}
if($unidad==4&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584662_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43130154_1');
		$pagRutum='../unidad4/guia03pag02.html';
}
if($unidad==4&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/message?action=list_messages&forum_id=_1584662_1&nav=cp_discussion_board&conf_id=_290066_1&course_id=_240471_1&message_id=_43130186_1');
		$pagRutum='../unidad4/guia04pag02.html';
}



//codigo que carga las direcciones de los foros diarios de progreso de la unidad 1
if($unidad==1&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584647_1');
		$pagRutum='';
}
if($unidad==1&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584647_1');
		$pagRutum='';
}
if($unidad==1&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584647_1');
		$pagRutum='';
}
if($unidad==1&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584647_1');
		$pagRutum='';
}

//codigo que carga las direcciones de los foros diarios de progreso de la unidad 2
if($unidad==2&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584651_1');
		$pagRutum='';
}
if($unidad==2&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584651_1');
		$pagRutum='';
}
if($unidad==2&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584651_1');
		$pagRutum='';
}
if($unidad==2&&$guia==4&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584651_1');
		$pagRutum='';
}
if($unidad==2&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584651_1');
		$pagRutum='';
}

//codigo que carga las direcciones de los foros diarios de progreso de la unidad 3
if($unidad==3&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584661_1');
		$pagRutum='';
}
if($unidad==3&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584661_1');
		$pagRutum='';
}
if($unidad==3&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584661_1');
		$pagRutum='';
}

//codigo que carga las direcciones de los foros saberes en la unidad 4
if($unidad==4&&$guia==1&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584668_1');
		$pagRutum='';
}
if($unidad==4&&$guia==2&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584668_1');
		$pagRutum='';
}
if($unidad==4&&$guia==3&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584668_1');
		$pagRutum='';
}
if($unidad==4&&$guia=='MPM'&&$diario=='saberes'){	
		$('#foro').attr('src','http://sena.blackboard.com/webapps/discussionboard/do/forum?action=list_threads&nav=cp_discussion_board&course_id=_240471_1&conf_id=_290066_1&forum_id=_1584668_1');
		$pagRutum='';
}	
	
	
			
$("#regreso").click(function(){
	//alert($pagRutum);
	
	//document.write($pagRutum);
	window.location=$pagRutum;
	
	});					
});
