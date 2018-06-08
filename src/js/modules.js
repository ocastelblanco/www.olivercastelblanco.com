/* global angular firebase */
var flickr_api_key = '516c801b319d21342af7881ea6471812';
var flickr_user_id = '97546219%40N00';
var blogger_api_key = 'AIzaSyApRO-hxzMAmH4ZofXjl-AaO-cLxqmxcAM';
var blogger_blogs = ['2924552721978703143',/*'8845133391114104188',*/'2994125734899716427','8460214497105138981'];
var recaptcha_key = '6LdRbDAUAAAAAFJx_5UvNWkcUT1efJ6tXS5H7DpB';
var config = {
    apiKey: "AIzaSyARXtM8JStW3UmgERWH_ufd_ixPqc5qytE",
    authDomain: "www-olivercastelblanco-com.firebaseapp.com",
    databaseURL: "https://www-olivercastelblanco-com.firebaseio.com",
    projectId: "www-olivercastelblanco-com",
    storageBucket: "www-olivercastelblanco-com.appspot.com",
    messagingSenderId: "850614628513"
};
var idioma = String(window.navigator.userLanguage || window.navigator.language).substr(0,2);
if (idioma != 'es' && idioma != 'en') {
    idioma = 'en';
}
firebase.initializeApp(config);
var app = angular.module('app', [
    'ngRoute',
    'firebase',
    'ngMaterial',
    'ngSanitize',
    'ngAnimate',
    'ngAria',
    'ngMessages',
    'vcRecaptcha'
]);
app.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme('default')
        .primaryPalette('light-blue',{
            'default': '600'
        })
        .accentPalette('orange', {
            'default': '800'
        })
        .warnPalette('deep-orange')
        .backgroundPalette('grey');
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('light-blue').dark();
});
app.controller('main', ['$http',function($http){
    console.log('main');
}]);
app.controller('contenido', ['$rootScope','$http','apiFlickr','$window','$firebaseObject','$mdMenu','$timeout','$scope',function($rootScope,$http,apiFlickr,$window,$firebaseObject,$mdMenu,$timeout,$scope){
    console.log('contenido');
    var fondo,html,fondoOpacity,htmlScrollTop;
    var raiz = this;
    var refInterfaz = firebase.database().ref('interfaz');
    var refBgHeader = firebase.database().ref('bgHeader');
    var bgHeader = $firebaseObject(refBgHeader);
    raiz.interfaz = $firebaseObject(refInterfaz);
    raiz.interfaz.$loaded().then(function(resp){
        raiz.idioma = idioma;
        raiz.cambiaIdioma = function(id) {
            raiz.idioma = id;
            idioma = id;
            $rootScope.$broadcast('cambiaIdioma',idioma);
        };
        $scope.$on("$mdMenuClose", function() {
            $timeout(function(){
                html.scrollTop = htmlScrollTop;
            });
        });
        raiz.rutaHeader = 'views/navbar.html';
        raiz.rutaBody = 'views/portfolio.html';
        raiz.claseContenido = 'portfolio';
        //-----------------------------------
        //raiz.rutaBody = 'views/contactMe.html';
        //raiz.claseContenido = 'contactMe';
        //-----------------------------------
        raiz.rutaFooter = 'views/footer.html';
        raiz.rutaLogoPreloader = 'views/logoAnimado.html';
        raiz.cargado = false;
        raiz.claseContenido = obtieneNombreClase(raiz.claseContenido);
        raiz.openMenu = function($mdMenu,ev) {
            fondo = angular.element(document.getElementById('fondo-navbar'))[0];
            html = angular.element(document.getElementsByTagName('html'))[0];
            fondoOpacity = fondo.style.opacity;
            htmlScrollTop = html.scrollTop;
            $mdMenu.open(ev);
            $timeout(function(){
                fondo.style.opacity = fondoOpacity;
            });
        };
    }).catch(function(error){console.log('error',error);});
    $rootScope.$on('finPrecarga',function(e,a){
        raiz.cargado = true;
    });
    raiz.ir = function(destino) {
        raiz.rutaBody = 'views/'+destino+'.html';
        raiz.claseContenido = obtieneNombreClase(destino);
    };
    var rutasBgHeaders = [];
    bgHeader.$loaded().then(function(resp){
        angular.forEach(bgHeader,function(valor, llave) {
            apiFlickr.bgHeader(valor).then(function(resp){
                if (resp) {
                    rutasBgHeaders.push(resp.sizes);
                    if (rutasBgHeaders.length == Object.keys(bgHeader).length-4) {
                        cargaEstiloBgHeader();
                    }
                } else {
                    raiz.estiloBgHeader = {'background-image': 'url(\'https://firebasestorage.googleapis.com/v0/b/www-olivercastelblanco-com.appspot.com/o/assets%2Fimg%2Fbg-header.jpg?alt=media&token=4933e065-14dc-438a-a481-23b1a5867937\')'};
                }
            });
            
        });
    }).catch(function(error){console.log('error',error);});
    function cargaEstiloBgHeader() {
        var numImagen = Math.floor(Math.random() * rutasBgHeaders.length);
        var imagen = rutasBgHeaders[numImagen];
        var _estiloBgHeader = {};
        for (var i = 0; i < imagen.size.length; i++) {
            var ruta = imagen.size[i];
            switch (ruta.label) {
                case 'Large':
                    _estiloBgHeader.sm = {'background-image': 'url(\''+ruta.source+'\')'};
                    break;
                case 'Large 1600':
                    _estiloBgHeader.md = {'background-image': 'url(\''+ruta.source+'\')'};
                    break;
                case 'Large 2048':
                    _estiloBgHeader.lg = {'background-image': 'url(\''+ruta.source+'\')'};
                    break;
                case 'Original':
                    _estiloBgHeader.xl = {'background-image': 'url(\''+ruta.source+'\')'};
                    break;
            }
        }
        var ancho = $window.innerWidth;
        if (ancho > 600 && ancho < 960) {
            raiz.estiloBgHeader = _estiloBgHeader.sm;
        } else if (ancho >= 960 && ancho < 1280) {
            raiz.estiloBgHeader = _estiloBgHeader.md;
        } else if (ancho >= 1280 && ancho < 1920) {
            raiz.estiloBgHeader = _estiloBgHeader.lg;
        } else if (ancho >= 1920) {
            raiz.estiloBgHeader = _estiloBgHeader.xl;
        }
    }
    function obtieneNombreClase(entrada) {
        var salida = '';
        for (var i = 0;i<entrada.length;i++) {
            if (entrada.charCodeAt(i) < 97) {
                salida += "-" + String.fromCharCode(entrada.charCodeAt(i) + 32);
            } else {
                salida += entrada.substr(i,1);
            }
        }
        return salida;
    }
}]);
app.controller('animaLogo', ['$scope','$timeout','$rootScope',function($scope,$timeout,$rootScope){
    console.log('animaLogo');
    var raiz = this;
    var dummy = angular.element(document.querySelector('.dummy'));
    dummy.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e){
        raiz.paso1 = true;
        $scope.$apply();
        $timeout(function(){
            raiz.paso2 = true;
            $scope.$apply();
            $timeout(function(){
                raiz.paso3 = true;
                $scope.$apply();
                $rootScope.$emit('finPrecarga');
            },1950);
        },2000);
    });
}]);
app.controller('encabezado', [function(){
    console.log('encabezado');
    var raiz = this;
    raiz.selectedTab = 'pagina1';
    //---------------------------
    //raiz.selectedTab = 'pagina4';
    //---------------------------
}]);
app.controller('portfolio', ['$http','$scope','$firebaseStorage','$rootScope','$mdDialog','$firebaseArray','$firebaseObject','$timeout',function($http,$scope,$firebaseStorage,$rootScope,$mdDialog,$firebaseArray,$firebaseObject,$timeout){
    console.log('portfolio');
    var fondo,html,fondoOpacity,htmlScrollTop;
    var raiz = this;
    raiz.idioma = idioma;
    var ref = firebase.storage().ref('assets/projects/');
    var refe = firebase.database().ref();
    var portfolioRef = refe.child('portfolio');
    var lista = $firebaseArray(portfolioRef);
    var portfolioRefCont = firebase.database().ref('contenido/portfolio');
    var portfolio = $firebaseObject(portfolioRefCont);
    var elementos = {};
    portfolio.$loaded().then(function(resp){
        raiz.portfolio = portfolio;
    }).catch(function(error){console.log('error',error)});
    lista.$loaded().then(function(resp){
        $scope.fichas = [];
        angular.forEach(resp,function(valor, llave) {
            var cardImage = $firebaseStorage(ref.child(valor.ruta+'/card-image.jpg'));
            cardImage.$getDownloadURL().then(function(url){
                valor.cardImage = url;
                $scope.fichas[llave] = valor;
            }).catch(function(error){
                $scope.fichas[llave] = valor;
            });
            if (valor.tabs) {
                angular.forEach(valor.tabs,function(cont, id) {
                    angular.forEach(cont.elementos,function(value, key) {
                        var img = $firebaseStorage(ref.child(valor.ruta+'/'+value.nombre));
                        img.$getDownloadURL().then(function(url){
                            valor.tabs[id].elementos[key].ruta = url;
                        }).catch(function(error){
                            console.log('error',error);
                        });
                    });
                });
            }
            elementos[valor.ruta] = valor;
        });
    }).catch(function(error){console.log('error',error);});
    $rootScope.$on('abreFichaProyecto',function(ev,ruta){
        $mdDialog.show({
            controller: ProyectoController,
            templateUrl: 'views/projDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true,
            locals: {
                elemento: elementos[ruta],
                idioma: raiz.idioma,
                dialog: portfolio.dialog
            },
            bindToController: true,
            onComplete: function(scope, element) {
                fondo.style.opacity = fondoOpacity;
            },
            onRemoving: function(scope,element) {
                html.scrollTop = htmlScrollTop;
            },
            onShowing: function(scope,element) {
                $timeout(function() {
                    fondo.style.opacity = fondoOpacity;
                });
            }
        })
        .then(function() {
            console.log('Dialog hide');
        }, function(){
            console.log('Dialog close');
        });
    });
    function ProyectoController($scope,$mdDialog,locals) {
        $scope.elemento = locals.elemento;
        $scope.idioma = locals.idioma;
        $scope.dialog = locals.dialog;
        fondo = angular.element(document.getElementById('fondo-navbar'))[0];
        html = angular.element(document.getElementsByTagName('html'))[0];
        fondoOpacity = fondo.style.opacity;
        htmlScrollTop = html.scrollTop;
        $scope.cancel = function() {
            $mdDialog.hide();
            $timeout(function(){
                html.scrollTop = htmlScrollTop;
            });
        };
    }
}]);
app.controller('photos', ['apiFlickr','$timeout','$window',function(apiFlickr,$timeout,$window){
    console.log('photos');
    var raiz = this;
    raiz.fadeOut = {};
    raiz.aToolbar = {};
    raiz.modoAlbum = false;
    raiz.modoFoto = false;
    raiz.abreAlbum = function(album_id, album_titulo) {
        raiz.aToolbar[album_id] = true;
        raiz.nombreAlbum = album_titulo;
        raiz.modoAlbum = true;
        angular.forEach(raiz.albumes, function(valor, llave){
            if (valor.id != album_id) {
                raiz.fadeOut[valor.id] = true;
            }
        });
        raiz.fotosAlbumes(album_id);
    };
    raiz.abreFoto = function(foto_id, foto_titulo) {
        raiz.modoFoto = true;
        raiz.modoAlbum = true;
        raiz.foto = {};
        raiz.foto.titulo = foto_titulo;
        angular.forEach(raiz.fotos, function(valor, llave) {
            if (valor.id == foto_id) {
                raiz.foto.titulo = valor.titulo;
                if ($window.innerWidth > 1024) {
                    raiz.foto.url = valor.original_url;
                    raiz.foto.width = valor.original_width;
                    raiz.foto.height = valor.original_height;
                } else {
                    raiz.foto.url = valor.large_url;
                    raiz.foto.width = valor.large_width;
                    raiz.foto.height = valor.large_height;
                }
            }
        });
        var anchoContent = angular.element(document.querySelector('#photos .content'));
        anchoContent = anchoContent[0].clientWidth;
        var altoToolbar = angular.element(document.querySelector('#photos .content .barra'));
        altoToolbar = altoToolbar[0].clientHeight;
        var padding = angular.element(document.querySelector('#photos .content .lista.albumes'));
        padding = padding[0].offsetHeight;
        raiz.altoFoto = String(Math.ceil((anchoContent/raiz.foto.width)*raiz.foto.height)+altoToolbar+(padding*2))+'px';
    };
    raiz.cierraFoto = function() {
        raiz.modoAlbum = true;
        raiz.modoFoto = false;
        raiz.foto = null;
        raiz.altoFoto = null;
    };
    raiz.fotosAlbumes = function(album_id) {
        apiFlickr.listaFotos(album_id).then(function(resp){
            var listaFotos = resp.photoset.photo;
            raiz.fotos = [];
            for (var i=0;i<listaFotos.length;i++) {
                raiz.fotos[i] = {};
                raiz.fotos[i].id = listaFotos[i].id;
                raiz.fotos[i].titulo = listaFotos[i].title;
                apiFlickr.foto(raiz.fotos[i].id,String(i)).then(function(resp){
                    var num = Number(resp[1]);
                    var fotos = resp[0].sizes.size;
                    for (var g=0;g<fotos.length;g++) {
                        var label = fotos[g].label;
                        if (label == 'Medium 640') {
                            raiz.fotos[num].small_url = fotos[g].source;
                            var relacion = fotos[g].width / fotos[g].height;
                            raiz.fotos[num].relacion = relacion;
                            if (relacion <= 0.3) {
                                raiz.fotos[num].colspan = 1;
                                raiz.fotos[num].rowspan = 3;
                            } else if (relacion > 0.3 && relacion <= 0.7) {
                                raiz.fotos[num].colspan = 1;
                                raiz.fotos[num].rowspan = 2;
                            } else if (relacion > 0.7 && relacion <= 1.5) {
                                raiz.fotos[num].colspan = 1;
                                raiz.fotos[num].rowspan = 1;
                            } else if (relacion > 1.5 && relacion < 3) {
                                raiz.fotos[num].colspan = 2;
                                raiz.fotos[num].rowspan = 1;
                            } else if (relacion >= 3) {
                                raiz.fotos[num].colspan = 3;
                                raiz.fotos[num].rowspan = 1;
                            }
                        } else if (label == 'Large') {
                            raiz.fotos[num].large_url = fotos[g].source;
                            raiz.fotos[num].large_width = fotos[g].width;
                            raiz.fotos[num].large_height = fotos[g].height;
                        } else if (label == 'Original') {
                            raiz.fotos[num].original_url = fotos[g].source;
                            raiz.fotos[num].original_width = fotos[g].width;
                            raiz.fotos[num].original_height = fotos[g].height;
                        }
                    }
                });
            }
        });
    };
    raiz.volverAlbumes = function() {
        raiz.fotos = null;
        raiz.nombreAlbum = null;
        raiz.modoAlbum = false;
        raiz.modoFoto = false;
        raiz.foto = null;
        raiz.altoFoto = null;
        angular.forEach(raiz.albumes, function(valor, llave){
            raiz.fadeOut[valor.id] = false;
            raiz.aToolbar[valor.id] = false;
        });
    };
    raiz.albumes = [];
    apiFlickr.albumes().then(function(resp){
        var albumes = resp.photosets.photoset;
        for (var i=0;i<albumes.length;i++) {
            raiz.albumes[i] = {};
            raiz.albumes[i].titulo = albumes[i].title._content;
            raiz.albumes[i].id = albumes[i].id;
            raiz.fadeOut[albumes[i].id] = false;
            raiz.aToolbar[albumes[i].id] = false;
            var portada = albumes[i].primary;
            apiFlickr.foto(portada,String(i)).then(function(resp){
                var num = Number(resp[1]);
                var fotos = resp[0].sizes.size;
                for (var g=0;g<fotos.length;g++) {
                    var label = fotos[g].label;
                    if (label == 'Medium 640') {
                        raiz.albumes[num].portada_url = fotos[g].source;
                    }
                }
            });
        }
    });
}]);
app.controller('blogs',['apiBlogger','$timeout','$scope','$sce',function(apiBlogger,$timeout,$scope,$sce){
    console.log('blogs');
    var raiz = this;
    raiz.modoEntradas = false;
    raiz.modoPost = false;
    raiz.blogs = [];
    for (var i=0;i<blogger_blogs.length;i++) {
        apiBlogger.blogs(blogger_blogs[i],String(i)).then(function(data){
            var resp = data[0];
            var num = Number(data[1]);
            raiz.blogs[num] = {};
            raiz.blogs[num].id = resp.id;
            raiz.blogs[num].titulo = resp.name;
            raiz.blogs[num].descripcion = resp.description;
            raiz.blogs[num].numPosts = resp.posts.totalItems;
        });
    }
    raiz.abrirBlog = function(index) {
        raiz.blogBinario = false;
        if (raiz.blogs[index].id == '2994125734899716427') {
            raiz.blogBinario = true;
        }
        raiz.nombreBlog = raiz.blogs[index].titulo;
        raiz.modoEntradas = true;
        raiz.modoPost = false;
        $scope.entradas = [];
        apiBlogger.entradas(raiz.blogs[index].id,raiz.blogs[index].numPosts).then(function(data){
            angular.forEach(data.items,function(valor, llave) {
                var url,tipo,rand;
                url = valor.content.match(/<iframe[\w\W]+data-thumbnail-src="(https?:\/\/[a-zA-Z0-9.\/_+]*)"/g);
                if (url) {
                    rand = Math.floor(Math.random()*url.length);
                    url = url[rand].replace(/<iframe[\w\W]+data-thumbnail-src="(https?:\/\/[a-zA-Z0-9.\/_+]*)"/g,'$1');
                    tipo = 'video';
                } else {
                    url = valor.content.match(/<img[^>]+src="(https?:\/\/[a-zA-Z0-9.\/_+]*)"/g);
                    if (url) {
                        rand = Math.floor(Math.random()*url.length);
                        url = url[rand].replace(/<img[^>]+src="(https?:\/\/[a-zA-Z0-9.\/_+]*)"/g,'$1');
                        tipo = 'imagen';
                    } else {
                        url = '';
                        tipo = '';
                    }
                }
                var conVideo = valor.content.replace(/<iframe[^>]+(height|width)="([0-9]+)"[^>]+(height|width)="([0-9]+)"[^>]*>/g,function(match,p1,p2,p3,p4){
                    var alto,ancho,salida,medida1,medida2,k,altoMax;
                    var anchoMax = angular.element(angular.element(document.getElementsByClassName('cuerpo')[0]).children()[0]).children()[0].clientWidth - 32;
                    if (p1 == 'width') {
                        ancho = Number(p2);
                        alto = Number(p4);
                        k = alto / ancho;
                        altoMax = anchoMax * k;
                        medida1 = 'width="'+anchoMax+'"';
                        medida2 = 'height="'+altoMax+'"';
                    } else {
                        ancho = Number(p4);
                        alto = Number(p2);
                        k = alto / ancho;
                        altoMax = anchoMax * k;
                        medida1 = 'height="'+altoMax+'"';
                        medida2 = 'width="'+anchoMax+'"';
                    }
                    salida = match.replace(/(<iframe[^>]+)((height|width)="[0-9]+")([^>]+)((height|width)="[0-9]+")([^>]*>)/g,'$1'+medida1+'$4'+medida2+'$7');
                    return salida;
                });
                $scope.entradas.push(
                    {
                        'id': valor.id,
                        'titulo': valor.title,
                        'contenido': conVideo,
                        'labels': valor.labels,
                        'media': {'url': url, 'tipo': tipo}
                    }
                );
                angular.forEach(valor.labels,function(value, key) {
                    if (value == 'Oliver Castelblanco' || value == 'Isabel Aparici') {
                        $scope.entradas[llave].autor = value;
                    }
                });
            });
        });
    };
    raiz.volverBlogs = function() {
        raiz.modoEntradas = false;
        raiz.modoPost = false;
    };
    raiz.abrePost = function(index) {
        raiz.modoEntradas = true;
        raiz.modoPost = true;
        raiz.entrada = $scope.entradas[index];
        var pos = 'right';
        raiz.entrada.contenido = raiz.entrada.contenido.replace(/<a[^>]+>(<img[^>]+)(>)[^>]+>/g,function(match,p1,p2){
            if (pos == 'right') {
                pos = 'left';
            } else {
                pos = 'right';
            }
            return p1+' class="'+pos+'" '+p2;
        });
        raiz.entrada.contenido = $sce.trustAsHtml(raiz.entrada.contenido);
    };
    raiz.volverPost = function() {
        raiz.modoEntradas = true;
        raiz.modoPost = false;
    };
}]);
app.controller('contactme',['$firebaseArray','$rootScope',function($firebaseArray,$rootScope){
    console.log('contactMe');
    var raiz = this;
    raiz.recaptcha_key = recaptcha_key;
    var ref = firebase.database().ref('mensajes');
    var obj = $firebaseArray(ref); 
    raiz.enviado = false;
    raiz.gracias = false;
    raiz.enviar = function(msg) {
        var hoy  = new Date();
        msg.date = hoy.getFullYear()+'-'+a2digitos(hoy.getMonth()+1)+'-'+hoy.getDate()+' '+hoy.toLocaleTimeString('es-CO');
        msg.recaptcha = null;
        obj.$add(msg);
        raiz.enviado = true;
        $rootScope.$on('finPrecarga',function(e,a){
            raiz.gracias = true;
        });
    };
}]);
// Directivas
app.directive('scrollAbajo', ['$document','$timeout',function ($document,$timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //var doc = angular.element($document)[0].body;
            var margen = window.getComputedStyle(element[0], null).getPropertyValue('margin-top');
            margen = parseInt(margen,10);
            var margenNegativa = window.getComputedStyle(element[0].children[0], null).getPropertyValue('margin-top');
            margenNegativa = parseInt(margenNegativa, 10);
            var alturaBarra,top,margenInf,margenSup,navbar,fondoNavbar,opacidad,fondoHeader,html;
            $timeout(function(){
                navbar = angular.element(document.getElementById('navbar'))[0];
                fondoNavbar = navbar.children[0];
                opacidad = parseInt(window.getComputedStyle(fondoNavbar, null).getPropertyValue('opacity'),10);
                alturaBarra = navbar.clientHeight;
                top = margen-alturaBarra+margenNegativa;
                margenInf = top+margenNegativa;
                margenSup = margen+margenNegativa;
                fondoHeader =  angular.element(document.getElementsByClassName('fondo-header'))[0];
                html = document.getElementsByTagName('html')[0];
            },100);
            $document.on("scroll", function () {
                //var opacidadActual = 1-(((margenSup-margenInf)-(doc.scrollTop-margenInf))/(margenSup-margenInf));
                var opacidadActual = 1-(((margenSup-margenInf)-(html.scrollTop-margenInf))/(margenSup-margenInf));
                var opacidadImagen = 1;
                if (opacidadActual > 1) {
                    opacidadActual = 1;
                    opacidadImagen = 0;
                } else if (opacidadActual < 0) {
                    opacidadActual = 0;
                }
                if (window.innerWidth>959) {
                    if (opacidad == 0) {
                        angular.element(fondoNavbar).css('opacity',opacidadActual);
                    }
                    angular.element(navbar).css('box-shadow', '0px 0px 1px 0px rgba(0,0,0,'+opacidadActual+')');
                    angular.element(fondoHeader).css('opacity',opacidadImagen);
                    //console.log(opacidad, opacidadActual, opacidadImagen);
                }
            });
        }
    };
}]);
app.directive('ocColumnas', ['$window','$rootScope','$firebaseObject',function($window,$rootScope,$firebaseObject){
    return {
        restrict: 'E',
        scope: {
            colXs: '=ocColXs',
            colSm: '=ocColSm',
            colLg: '=ocColLg',
            fuente: '=ocFuente',
            open: '&',
            callback: '&'
        },
        templateUrl: function(element,attrs) {
            return 'views/'+attrs.ocTemplate+'.tmpl.html';
        },
        link: function(scope,element,attrs) {
            var ref = firebase.database().ref('contenido/portfolio/ficha');
            scope.interfaz = $firebaseObject(ref);
            calculaCol();
            var ventana = angular.element($window);
            ventana.bind("resize",function(){
                calculaCol();
                scope.$digest();
            });
            scope.idioma = idioma;
            $rootScope.$on('cambiaIdioma',function(e,a){
                scope.idioma = idioma;
            });
            scope.open = function(txt) {
                $rootScope.$emit('abreFichaProyecto',txt);
            };
            function calculaCol() {
                var columnas;
                if (window.innerWidth < 600) {
                    columnas = scope.colXs;
                } else if (window.innerWidth < 959) {
                    columnas = scope.colSm;
                } else {
                    columnas = scope.colLg;
                }
                scope.flex = Math.floor(100/columnas);
                scope.col = [];
                for (var i=0;i<columnas;i++) {scope.col[i] = i;}
            }
        }
    };
}]);
app.directive('ocBordeInferior',['$document','$window',function($document,$window){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            var anchoEl,altoEl,altoNavbar;
            var contenedor = el.parentElement;
            calculaDim();
            $document.bind('scroll',function(){
                if (contenedor.getBoundingClientRect().top > altoNavbar) {
                    angular.element(el).css('position','absolute');
                    angular.element(el).css('top','');
                } else {
                    angular.element(el).css('position','fixed');
                    angular.element(el).css('top',altoNavbar+'px');
                }
            });
            angular.element($window).bind('resize',function(){
                calculaDim();
                scope.$digest();
            });
            function calculaDim() {
                altoNavbar = document.getElementById('navbar').clientHeight;
                anchoEl = contenedor.clientWidth;
                altoEl = window.innerHeight - altoNavbar;
                var k = 3/2;
                var maxAncho = altoEl * k;
                var size = (maxAncho / anchoEl) * 100;
                var pos = 100-(size/2)-(size/50)+50;
                if (anchoEl < maxAncho) {
                    angular.element(el).css('background-size',String(size)+'%');
                    angular.element(el).css('background-position-x',String(pos)+'%');
                } else {
                    angular.element(el).css('background-size','130%');
                    angular.element(el).css('background-position-x','80%');
                }
                if (window.innerWidth > 599 && window.innerWidth < 960) {
                    angular.element(el).css('background-image', 'url(\'https://firebasestorage.googleapis.com/v0/b/www-olivercastelblanco-com.appspot.com/o/assets%2Fimg%2FbgBinario_sm.jpg?alt=media&token=9dda553d-7875-4838-9f2d-9d8a89a311c4\')');
                } else if (window.innerWidth > 959 && window.innerWidth < 1920) {
                    angular.element(el).css('background-image', 'url(\'https://firebasestorage.googleapis.com/v0/b/www-olivercastelblanco-com.appspot.com/o/assets%2Fimg%2FbgBinario_md.jpg?alt=media&token=7e074692-ff81-4737-b523-9db25297ea62\')');
                } else if (window.innerWidth > 1919) {
                    angular.element(el).css('background-image', 'url(\'https://firebasestorage.googleapis.com/v0/b/www-olivercastelblanco-com.appspot.com/o/assets%2Fimg%2FbgBinario_lg.jpg?alt=media&token=a6419e39-7e85-44af-8959-f0a1f70d584b\')');
                }
                angular.element(el).css('height',String(altoEl)+'px');
                angular.element(el).css('width',String(anchoEl)+'px');
            }
        }
    };
}]);
app.directive('ocCarousel', ['$window','$rootScope',function($window,$rootScope){
    return {
        restrict: 'E',
        scope: {
            fuente: '=ocFuente',
            izq: '&',
            der: '&'
        },
        templateUrl: function(element,attrs) {
            return 'views/carousel.tmpl.html';
        },
        link: function(scope,element,attrs) {
            var total = scope.fuente.tab.elementos.length;
            scope.izq = function() {
                if (scope.visible == 0) {
                    scope.visible = total;
                }
                scope.visible--;
            };
            scope.der = function() {
                scope.visible++;
                if (scope.visible == total) {
                    scope.visible = 0;
                }
            };
        }
    };
}]);
// Servicios
app.service('apiFlickr',['$http',function($http){
    var apiFlickr = {
        bgHeader: function(valor) {
            var promesa = $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key='+flickr_api_key+'&photo_id='+valor+'&format=json&nojsoncallback=1').then(function(resp){
                return resp.data;
            }, function(resp){
                return resp.data;
            });
            return promesa;
        },
        albumes: function() {
            var promesa = $http.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key='+flickr_api_key+'&user_id='+flickr_user_id+'&format=json&nojsoncallback=1').then(function(resp){
                return resp.data;
            }, function(resp){
                return resp.data;
            });
            return promesa;
        },
        foto: function(foto_id,num) {
            var promesa = $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key='+flickr_api_key+'&photo_id='+foto_id+'&format=json&nojsoncallback=1').then(function(resp){
                if (num) {
                    return [resp.data,num];
                } else {
                    return resp.data;
                }
            }, function(resp){
                return resp.data;
            });
            return promesa;
        },
        listaFotos: function(album_id) {
            var promesa = $http.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key='+flickr_api_key+'&photoset_id='+album_id+'&user_id='+flickr_user_id+'&format=json&nojsoncallback=1').then(function(resp){
                return resp.data;
            }, function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return apiFlickr;
}]);
app.service('apiBlogger',['$http',function($http){
    var apiBlogger = {
        blogs: function(blog_id,num){
            var promesa = $http.get('https://www.googleapis.com/blogger/v3/blogs/'+blog_id+'?key='+blogger_api_key).then(function(resp){
                if (num) {
                    return [resp.data,num];
                } else {
                    return resp.data;
                }
            });
            return promesa;
        },
        entradas: function(blog_id,numPosts) {
            var promesa = $http.get('https://www.googleapis.com/blogger/v3/blogs/'+blog_id+'/posts?key='+blogger_api_key+'&fields=items(id,title,content,labels)&maxResults='+numPosts).then(function(resp){
                return resp.data;
            });
            return promesa;
        }
    };
    return apiBlogger;
}]);
// Filtros
app.filter('simpleTexto', function(){
    return function(texto) {
        var salida;
        if (texto) {
            salida = String(texto).replace(/<[^>]+>/gm, '').substr(0,120) + '...';
        } else {
            salida = '';
        }
        return salida;
    };
});
//Funciones generales
function a2digitos(num) {
    var salida;
    if (num < 10) {
        salida = "0"+String(num);
    } else {
        salida = String(num);
    }
    return salida;
}
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }
      var result = [], prop, i;
      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }
      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}