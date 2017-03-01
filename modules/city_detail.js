'use strict';

angular.module('app.city_detail', [])
    .controller('CityDetailController', ['$scope', 'ActivityManager','ResourceManager', 'COMMON_KEYS','MenuService', function ($scope, ActivityManager,ResourceManager, COMMON_KEYS,MenuService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        var data = ResourceManager.getService();
        $scope.serviceName = data.name;
        $scope.iconUrl = data.icon;
        activity.loadI18NResource(function (res) {
            var toolvarData = MenuService.getLanguage().toolbar;
            $scope.select = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_select.png',
                right: toolvarData.selsct
            };
            $scope.ok = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_menu1.png',
                right: toolvarData.ok
            };
            $scope.menu = {
                // left: toolvarData.left,
                // icon: 'assets/images/icon_toolbar_menu1.png',
                // right: toolvarData.menu
            };
        });

        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(500);
        }


        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        var conUrl = ResourceManager.getConfigurations().serverUrl();
        var childDataStr = activity.getChild();
        var childData = JSON.parse(childDataStr);
        var thisData = childData;
        if(lang == "en-US") {
            $scope.data = {
                name: thisData.name_eng,
                intro: thisData.introduce_eng,
                bigImg: conUrl + thisData.picurl,
                smallImg: conUrl + thisData.SubContent[0].picurl,
                subName: thisData.SubContent[0].name_eng
            };
        }else{
            $scope.data = {
                name: thisData.name,
                intro: thisData.introduce,
                bigImg: conUrl + thisData.picurl,
                smallImg: conUrl + thisData.SubContent[0].picurl,
                subName: thisData.SubContent[0].name
            };
        }


        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('menu');
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
    }]);