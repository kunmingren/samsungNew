'use strict';

angular.module('app.tpl_weather_list', [])
    .controller('TplWeatherListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();

        var LEVEL = 0;
        var cityObj = {};

        //var conUrl = ResourceManager.getConfigurations().serverUrl();
        //$scope.conUrl = conUrl;

        activity.initialize($scope);

        $scope.selectedIndex = 0;
        //$scope.firstList = ['北京','上海','天津','重庆','安徽','福建','甘肃','广东','广西','贵州','海南','河北','黑龙江','河南','香港','湖北','湖南','内蒙古','江苏','江西','吉林','辽宁','澳门','宁夏','青海','陕西','山东','山西','四川','西藏','新疆','云南','浙江','台湾'];
        $scope.firstList = [];
        $scope.firstListCN = [];
        $scope.firstListEN = ['Beijing','Shanghai','Tianjin','Chongqing','Heilongjiang','Jilin','Liaoning','Inner Mongolia','Hebei','Shanxi','Shaanxi','Shandong','Xinjiang','Tibet','Qinghai','Gansu','Ningxia','Henan','Jiangsu','Hubei','Zhejiang','Anhui','Fujian','Jiangxi','Hunan','Guizhou','Sichuan','Guangdong','Yunnan','Guangxi','Hainan','Hong Kong','Macao','Taiwan'];
        //$scope.firstListContent = [];
        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.weather = i18nText.weather;
        $scope.listTopStyle = 0;
        $scope.listTopStyle2 = 0;

        $http.get("assets/images/weather/weather.json").success(function (data) {
                data.content.forEach(function(val,idx,arr){
                    var menuItem = val.d4;
                    var cityInfo = {
                        areaID: val.d1,
                        areaName:val.d2,
                        areaEnName:val.d3
                    }
                    if($scope.firstListCN.indexOf(menuItem)<0){
                        $scope.firstListCN.push(menuItem);
                        cityObj[menuItem] = [];
                    }else{
                        cityObj[menuItem].push(cityInfo);
                    }
                    //$scope.firstListContent.push(val.subArea);
                })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            LEVEL = 1;
            $scope.selectedIndex = num;
            $scope.cities = [];
            $scope.areaIDArr = [];
            var province = $scope.firstListCN[num];
            if(lang == "en-US"){
                $scope.firstList = $scope.firstListEN;
                cityObj[province].forEach(function(el,index,arr){
                    $scope.cities.push(el.areaEnName);
                    $scope.areaIDArr.push(el.areaID);
                })
            }else {
                $scope.firstList = $scope.firstListCN;
                cityObj[province].forEach(function (el, index, arr) {
                    $scope.cities.push(el.areaName);
                    $scope.areaIDArr.push(el.areaID);
                })
            }
        }

        function bindSecondLevel() {
            LEVEL = 2;
            $scope.selectedCityIndex = 0;
        }

        function cancelBindSecondLevel() {
            LEVEL = 1;
            $scope.selectedCityIndex = -1;
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    } else if (LEVEL == 2) {
                        if ($scope.selectedCityIndex > 0) {
                            $scope.selectedCityIndex--;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex < $scope.firstList.length - 1) {
                            $scope.selectedIndex++;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    } else if (LEVEL == 2) {
                        if ($scope.selectedCityIndex < $scope.cities.length - 1) {
                            $scope.selectedCityIndex++;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    ActivityManager.startActivity('weather');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }
                    else if (LEVEL == 2) {
                        //alert($scope.selectedIndex+"......" + $scope.selectedCityIndex)
                        var city = $scope.areaIDArr[$scope.selectedCityIndex];
                        ResourceManager.setCity(city);
                        activity.finish();
                        ActivityManager.startActivity('weather');
                    }
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if (LEVEL == 2) {
                        cancelBindSecondLevel();
                        bindFirstLevel($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }
                    break;
            }
            if ($scope.selectedCityIndex > 11) {
                $scope.listTopStyle2 = (11 - $scope.selectedCityIndex) * 39;
            } else if ($scope.listTopStyle2 !== 0) {
                $scope.listTopStyle2 = 0;
            }
            if ($scope.selectedIndex > 11) {
                $scope.listTopStyle = (11 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

    }])