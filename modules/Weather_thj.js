'use strict';

angular.module('app.weather', [])
    .controller('WeatherController', ['$scope', 'ActivityManager','ResourceManager', 'COMMON_KEYS','MenuService','$http', function ($scope, ActivityManager,ResourceManager, COMMON_KEYS,MenuService,$http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        var ID = activity.getID();
        console.log(ID);
        var data = ResourceManager.getService();
        $scope.serviceName = data.name;
        $scope.iconUrl = data.icon;
        activity.loadI18NResource(function () {
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
        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.cityIn = i18nText.weather.type_in;
        $scope.cityOut = i18nText.weather.type_out;

        $scope.outside = false;
        $scope.citys = [];
        $scope.selectedIndex = 0;

        $scope.typeIn = [];
        $scope.typeOut = [];
        var cityIn = [],
            cityOut = [],
            URL_IN = "http://192.168.30.75:8888/vod_weather?city=",
            URL_OUT = "http://192.168.30.75:8888/vod_weather?city=";
        var conUrl = ResourceManager.getConfigurations().serverUrl();
        function getData() {
            $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'Weather_SubCity') {
                        var jsonUrl = conUrl + el.Json_URL;
                        $http.get(jsonUrl).success(function (wdata) {
                            wdata.china_city.forEach(function (val,idx,arr) {
                                if(lang == "en-US") {
                                    var city = {
                                        name: val.name_eng,
                                    };
                                }else {
                                    var city = {
                                        name: val.name,
                                    };
                                }
                                $scope.typeIn.push(city);
                            });
                            wdata.foreign_city.forEach(function (val,idx,arr) {
                                if(lang == "en-US") {
                                    var city = {
                                        name: val.name_eng,
                                    };
                                }else {
                                    var city = {
                                        name: val.name,
                                    };
                                }
                                $scope.typeOut.push(city);
                            })
                            changeType();
                        })
                    }
                })
            });
        };


        function changeType(){
            $scope.selectedIndex = 0;
            if($scope.outside == true){
                $scope.citys = $scope.typeOut;
            }else{
                $scope.citys = $scope.typeIn;
            }
            console.log($scope.citys)
            choseCity($scope.selectedIndex);
        }

        function choseCity(num){
            var name = $scope.citys[num].name;
            var URL = URL_IN + name;
            //$.get(URL,function(data,status){
            $http.get(URL).success(function (data) {
                if(lang == "en-US") {
                    $scope.city = {
                        date_today: data.result[0].daily_forecast_1_date,
                        date_tomorrow: data.result[0].daily_forecast_2_date,
                        date_third: data.result[0].daily_forecast_3_date,
                        icon_today: data.result[0].daily_forecast_1_cond_cond_d_code,
                        icon_tomorrow: data.result[0].daily_forecast_2_cond_cond_d_code,
                        icon_third: data.result[0].daily_forecast_3_cond_cond_d_code,
                        weather_today: data.result[0].daily_forecast_1_cond_cond_d_txt_eng,
                        weather_tomorrow: data.result[0].daily_forecast_2_cond_cond_d_txt_eng,
                        weather_third: data.result[0].daily_forecast_3_cond_cond_d_txt_eng,
                        temp_today: data.result[0].daily_forecast_1_tmp_min + " ~ " + data.result[0].daily_forecast_1_tmp_max + "℃",
                        temp_tomorrow: data.result[0].daily_forecast_2_tmp_min + " ~ " + data.result[0].daily_forecast_2_tmp_max + "℃",
                        temp_third: data.result[0].daily_forecast_3_tmp_min + " ~ " + data.result[0].daily_forecast_3_tmp_max + "℃"
                    }
                }else {
                    $scope.city = {
                        date_today: data.result[0].daily_forecast_1_date,
                        date_tomorrow: data.result[0].daily_forecast_2_date,
                        date_third: data.result[0].daily_forecast_3_date,
                        icon_today: data.result[0].daily_forecast_1_cond_cond_d_code,
                        icon_tomorrow: data.result[0].daily_forecast_2_cond_cond_d_code,
                        icon_third: data.result[0].daily_forecast_3_cond_cond_d_code,
                        weather_today: data.result[0].daily_forecast_1_cond_cond_d_txt_cn,
                        weather_tomorrow: data.result[0].daily_forecast_2_cond_cond_d_txt_cn,
                        weather_third: data.result[0].daily_forecast_3_cond_cond_d_txt_cn,
                        temp_today: data.result[0].daily_forecast_1_tmp_min + " ~ " + data.result[0].daily_forecast_1_tmp_max + "℃",
                        temp_tomorrow: data.result[0].daily_forecast_2_tmp_min + " ~ " + data.result[0].daily_forecast_2_tmp_max + "℃",
                        temp_third: data.result[0].daily_forecast_3_tmp_min + " ~ " + data.result[0].daily_forecast_3_tmp_max + "℃"
                    }
                }
            })
        }
        getData();
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(500);
        }
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('menu');
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    $scope.outside = !$scope.outside;
                    changeType();
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    $scope.outside = !$scope.outside;
                    changeType();
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    break;
                case COMMON_KEYS.KEY_UP:
                    // if(LEVEL>1){
                    //     LEVEL-=1;
                    // }
                    if($scope.selectedIndex>0){
                        $scope.selectedIndex-=1;
                    }
                    choseCity($scope.selectedIndex);
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if($scope.selectedIndex<($scope.citys.length-1)){
                        $scope.selectedIndex+=1;
                    }
                    choseCity($scope.selectedIndex);
                    break;
            }
            if ($scope.selectIndex > 3) {
                $scope.listRightStyle = (3 - $scope.selectIndex) * 285;
            } else if ($scope.listRightStyle !== 0) {
                $scope.listRightStyle = 0;
            }
        });
    }]);