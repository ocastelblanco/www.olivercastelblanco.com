/* global angular */
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
app.controller('contenido', ['$rootScope',function($rootScope){
    console.log('contenido');
    var raiz = this;
    raiz.rutaHeader = 'views/navbar.html';
    raiz.rutaBody = 'views/portfolio.html';
    raiz.rutaLogoPreloader = 'views/logoAnimado.html';
    raiz.cargado = false;
    $rootScope.$on('finPrecarga',function(e,a){
        raiz.cargado = true;
    });
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
}]);
app.controller('portfolio', [function(){
    console.log('portfolio');
    var raiz = this;
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
            var alturaBarra,top,margenInf,margenSup,navbar,fondoNavbar,opacidad;
            $timeout(function(){
                navbar = angular.element(document.getElementById('navbar'))[0];
                fondoNavbar = navbar.children[0];
                opacidad = parseInt(window.getComputedStyle(fondoNavbar, null).getPropertyValue('opacity'),10);
                alturaBarra = navbar.clientHeight;
                top = margen-alturaBarra+margenNegativa;
                margenInf = top+margenNegativa;
                margenSup = margen+margenNegativa;
                navbar,fondoNavbar,opacidad;
            },100);
            $document.bind("scroll", function () {
                var opacidadActual = 1-(((margenSup-margenInf)-(doc.scrollTop-margenInf))/(margenSup-margenInf));
                if (opacidadActual > 1) {
                    opacidadActual = 1;
                } else if (opacidadActual < 0) {
                    opacidadActual = 0;
                }
                if (opacidad == 0) {
                    angular.element(fondoNavbar).css('opacity',opacidadActual);
                }
                angular.element(navbar).css('box-shadow', '0px 0px 1px 0px rgba(0,0,0,'+opacidadActual+')');
            });
        }
    };
});