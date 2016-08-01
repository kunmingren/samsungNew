'use strict';

angular.module('app.weather', [])
    .controller('WeatherController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'ResourceManager', '$http', function ($scope, ActivityManager, COMMON_KEYS, ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        $scope.weather = i18nText.weather;
        $scope.select = '';
        //var conUrl = ResourceManager.getConfigurations().serverUrl();
        //$scope.conUrl = conUrl;
        $scope.serverURl = 'http://192.168.18.201/weather/weather?city=';
        var cityData = ResourceManager.getCity();
        if(cityData){
            loadWeatherData(cityData.cityName);
        }else{
            loadWeatherData('101020100');
        }
        $http.get("assets/images/weather/weather_en.json").success(function (data) {
            data.content.forEach(function (el, idx, arr) {
                var zhStrs = [];
                var enStrs = [];
                var nameKey = 'weather_list'+ idx;
                zhStrs[nameKey] = el.name;
                enStrs[nameKey] = el.name_en;
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        })
        function loadWeatherData(cityName){
            $http.get($scope.serverURl+cityName).success(function (data) {
                $scope.content = data;
                var zhStrs = [];
                var enStrs = [];
                var nameKey = 'cityNameStr';
                zhStrs[nameKey] = $scope.content.City;
                enStrs[nameKey] = $scope.content.CityEng;
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
                $scope.content.City = ResourceManager.getI18NResource().getString(nameKey);

                var weatherID_1 = data.WeatherID_1;
                var weatherID_2 = data.WeatherID_2;
                var weatherID_3 = data.WeatherID_3;
                $scope.content.WeatherDes_1 = ResourceManager.getI18NResource().getString('weather_list'+ weatherID_1);
                $scope.content.WeatherDes_2 = ResourceManager.getI18NResource().getString('weather_list'+ weatherID_2);
                $scope.content.WeatherDes_3 = ResourceManager.getI18NResource().getString('weather_list'+ weatherID_3);

                ResourceManager.setCity(cityName);
            });
        }
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_ENTER:
                    activity.finish();
                    ActivityManager.startActivity('tpl_weather_list');
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
    }]);