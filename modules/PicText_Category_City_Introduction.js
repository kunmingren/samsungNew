'use strict';

angular.module('app.city_list', [])
    .controller('CityListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','MenuService','ResourceManager', function ($scope, ActivityManager, COMMON_KEYS,MenuService,ResourceManager) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        var data = ResourceManager.getService();
        $scope.serviceName = data.name;
        $scope.iconUrl = data.icon;
        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.aName = ResourceManager.getMeal().id;
        $scope.imgUrl = ResourceManager.getPic().url;
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
                // icon: 'assets/images/icon_toolbar_menu.png',
                // right: toolvarData.menu
            };
        });

        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(500);
        }


        $scope.city = [];
        var childDataStr = activity.getChild();
        var childData = JSON.parse(childDataStr);
        var thisData = childData.Content;
        thisData.forEach(function(val,idx,arr){
            if(lang == "en-US") {
                var city = {
                    index: idx,
                    name: val.name_eng,
                    activityId: val.name_eng
                };
                $scope.text1 = "total";
                $scope.text2 = "";
            }else{
                var city = {
                    index: idx,
                    name: val.name,
                    activityId: val.name_eng
                };
                $scope.text1 = "共";
                $scope.text2 = "个";
            }
            $scope.city.push(city);
        });
        $scope.titleText = $scope.text1 + $scope.city.length + $scope.text2;
        $scope.selectedIndex = 0;


        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('menu');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    //ActivityManager.go($scope.services[$scope.selectedIndex].activityId, 4);
                    var dataStr = JSON.stringify(thisData[$scope.selectedIndex]);
                    if($scope.city[$scope.selectedIndex]) {
                        ActivityManager.showLoading();
                        ActivityManager.go($scope.city[$scope.selectedIndex].activityId, 4, 'city_detail', dataStr);
                    }else {
                        //nothing
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    if($scope.selectedIndex>0) {
                        $scope.selectedIndex -= 1;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if($scope.selectedIndex<$scope.city.length-1) {
                        $scope.selectedIndex += 1;
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
            if ($scope.selectedIndex > 6) {
                $scope.listTopStyle2 = (6 - $scope.selectedIndex) * 69;
            } else if ($scope.listTopStyle2 !== 0) {
                $scope.listTopStyle2 = 0;
            }
        });
    }]);