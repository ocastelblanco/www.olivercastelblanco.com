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
    raiz.cargado = true;//false;
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