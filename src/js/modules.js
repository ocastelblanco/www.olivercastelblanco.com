/* global angular */
var app = angular.module('app', [
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngRoute'
]);
app.controller('main', [function(){
    console.log('main');
}]);
app.controller('contenido', [function(){
    console.log('contenido');
}]);