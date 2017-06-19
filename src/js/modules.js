/* global angular */
var flickr_api_key = '516c801b319d21342af7881ea6471812';
var flickr_user_id = '97546219%40N00';
var app = angular.module('app', [
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngRoute'
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
});
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenido', ['$rootScope','$http','apiFlickr','$window',function($rootScope,$http,apiFlickr,$window){
    console.log('contenido');
    var raiz = this;
    raiz.rutaHeader = 'views/navbar.html';
    //raiz.rutaBody = 'views/portfolio.html';
    //raiz.claseContenido = 'portfolio';
    //-----------------------------------
    raiz.rutaBody = 'views/photos.html';
    raiz.claseContenido = 'photos';
    //-----------------------------------
    raiz.rutaFooter = 'views/footer.html';
    raiz.rutaLogoPreloader = 'views/logoAnimado.html';
    raiz.cargado = false;
    $rootScope.$on('finPrecarga',function(e,a){
        raiz.cargado = true;
    });
    raiz.ir = function(destino) {
        raiz.rutaBody = 'views/'+destino+'.html';
        raiz.claseContenido = destino;
    };
    var rutasBgHeaders = [];
    $http.get('assets/img/index.json').then(function(resp){
        var bgHeaders = resp.data.bgHeader;
        for (var i = 0;i < resp.data.bgHeader.length;i++) {
            var header = resp.data.bgHeader[i];
            apiFlickr.bgHeader(header).then(function(resp){
                if (resp) {
                    rutasBgHeaders.push(resp.sizes);
                    if (rutasBgHeaders.length == bgHeaders.length) {
                        cargaEstiloBgHeader();
                    }
                } else {
                    raiz.estiloBgHeader = {'background-image': 'url(\'assets/img/bg-header.jpg\')'};
                }
            });
        }
    });
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
    //raiz.selectedTab = 'pagina1';
    //---------------------------
    raiz.selectedTab = 'pagina2';
    //---------------------------
}]);
app.controller('portfolio', ['$http',function($http){
    console.log('portfolio');
    var raiz = this;
    $http.get('assets/projects/index.json').then(function(resp){
        raiz.fichas = resp.data;
    }, function(error){
        console.log('error',error);
    });
}]);
app.controller('photos', ['apiFlickr','$timeout','$window',function(apiFlickr,$timeout,$window){
    console.log('photos');
    var raiz = this;
    raiz.fadeOut = {};
    raiz.aToolbar = {};
    raiz.modoAlbum = false;
    raiz.modoFoto = false;
    raiz.foto = null;
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
                } else {
                    raiz.foto.url = valor.large_url;
                }
            }
        });
    };
    raiz.cierraFoto = function() {
        raiz.foto = null;
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
                        } else if (label == 'Original') {
                            raiz.fotos[num].original_url = fotos[g].source;
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
// Directivas
app.directive('scrollAbajo', function ($document,$timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var doc = angular.element($document)[0].body;
            var margen = window.getComputedStyle(element[0], null).getPropertyValue('margin-top');
            margen = parseInt(margen,10);
            var margenNegativa = window.getComputedStyle(element[0].children[0], null).getPropertyValue('margin-top');
            margenNegativa = parseInt(margenNegativa, 10);
            var alturaBarra,top,margenInf,margenSup,navbar,fondoNavbar,opacidad,fondoHeader;
            $timeout(function(){
                navbar = angular.element(document.getElementById('navbar'))[0];
                fondoNavbar = navbar.children[0];
                opacidad = parseInt(window.getComputedStyle(fondoNavbar, null).getPropertyValue('opacity'),10);
                alturaBarra = navbar.clientHeight;
                top = margen-alturaBarra+margenNegativa;
                margenInf = top+margenNegativa;
                margenSup = margen+margenNegativa;
                fondoHeader =  angular.element(document.getElementsByClassName('fondo-header'))[0];
            },100);
            $document.bind("scroll", function () {
                var opacidadActual = 1-(((margenSup-margenInf)-(doc.scrollTop-margenInf))/(margenSup-margenInf));
                var opacidadImagen = 1;
                if (opacidadActual > 1) {
                    opacidadActual = 1;
                    opacidadImagen = 0;
                } else if (opacidadActual < 0) {
                    opacidadActual = 0;
                }
                if (opacidad == 0) {
                    angular.element(fondoNavbar).css('opacity',opacidadActual);
                }
                angular.element(navbar).css('box-shadow', '0px 0px 1px 0px rgba(0,0,0,'+opacidadActual+')');
                angular.element(fondoHeader).css('opacity',opacidadImagen);
            });
        }
    };
});
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