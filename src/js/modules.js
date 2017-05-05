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
        .primaryPalette('light-blue')
        .accentPalette('orange')
        .warnPalette('deep-orange')
        .backgroundPalette('grey');
});
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenido', [function(){
    console.log('contenido');
    var raiz = this;
    raiz.rutaHeader = 'views/navbar.html';
    raiz.rutaBody = 'views/portfolio.html';
    raiz.rutaLogoPreloader = 'views/logoAnimado.html';
}]);
app.controller('animaLogo', ['$scope',function($scope){
    console.log('animaLogo');
    var raiz = this;
    var liver = angular.element(document.querySelector('.liver'));
    var astelblanco = angular.element(document.querySelector('.astelblanco'));
    var apellido = angular.element(document.querySelector('.apellido'));
    var logo = angular.element(document.querySelector('.logo'));
    liver.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',function(e){
        liver.removeClass('inicial');
        liver.addClass('final');
        astelblanco.removeClass('inicial');
        astelblanco.addClass('final');
        apellido.addClass('final');
        logo.addClass('fondo-cambiante')
    });
}]);