'use strict';

angular.module('app.service', [])
    .directive('repeatFinish', ['ActivityManager', function (ActivityManager) {
        return {
            link: function(scope,element,attr){
                if(scope.$last == true){
                    scope.$eval( attr.repeatFinish );
                    scope.$last = false;
                }
            }
        }
    }])
    .controller('ServiceController', ['$scope','$http', 'ActivityManager', 'COMMON_KEYS','ResourceManager','MenuService', function ($scope,$http, ActivityManager, COMMON_KEYS,ResourceManager,MenuService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        var activityID = activity.getID();
        var childDataStr = activity.getChild();
        var childData = JSON.parse(childDataStr);
        console.log(childData);
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


        $scope.serviceFinish = function(){
            chose(0);
        };

        $scope.selectedIndex = 0;
        $scope.services=[];

        switch (activityID){
            case 'service':
                $scope.menuIndex = 3;
                break;
            case 'intro':
                $scope.menuIndex = 4;
                break;
            case'roomService':
                $scope.menuIndex = 5;
                break;
            case 'reservation':
                $scope.menuIndex = 6;
                break;
        }

            childData.forEach(function (val, idx, arr) {
                var service = {};
                if(lang == "en-US") {
                    service = {
                        index: idx,
                        pic: val.icon_url,
                        type: val.type,
                        activityId: val.nameEng,
                        config: val.config,
                        name:val.nameEng,
                        pic_b:val.icon_url
                    };
                }else{
                    service = {
                        index: idx,
                        pic: val.pic,
                        type: val.type,
                        activityId: val.nameEng,
                        config: val.config,
                        name:val.name,
                        pic_b:val.icon_url
                    };
                }
                $scope.services.push(service);
            });

        function chose(index){
            var target = document.getElementsByClassName('service_item');
            //var target1 = target[index];
            //activity.transform(target1,"rotateX(45deg)");
            for(var i=0;i<target.length;i++){
                activity.removeClass(target[i], 'service_item_select');
            }
            activity.addClass(target[index], 'service_item_select');
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    if($scope.selectedIndex>0) {
                        $scope.selectedIndex -= 1;
                        chose($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if($scope.selectedIndex<$scope.services.length-1) {
                        $scope.selectedIndex += 1;
                        chose($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('menu');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ActivityManager.showLoading();
                    ResourceManager.setMeal($scope.services[$scope.selectedIndex].name);
                    ResourceManager.setPic($scope.services[$scope.selectedIndex].pic_b);
                    if($scope.services[$scope.selectedIndex].config) {
                        $http.get($scope.services[$scope.selectedIndex].config).success(function (data) {
                            var dataStr = JSON.stringify(data);
                            ActivityManager.go($scope.services[$scope.selectedIndex].activityId, 3, $scope.services[$scope.selectedIndex].type, dataStr);
                        });
                    }else {
                        //nothing
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    if($scope.selectedIndex>2) {
                        $scope.selectedIndex -= 3;
                        chose($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if($scope.selectedIndex<$scope.services.length-3) {
                        $scope.selectedIndex += 3;
                        chose($scope.selectedIndex);
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
    }])
    //.service('SecondMenuService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager){
    //    this.getLogoUrl = function () {
    //        var treeView = ResourceManager.getConfigurations().viewTree();
    //        var logoUrl;
    //        for (var i = 0; i < treeView.length; i++) {
    //            if (treeView[i].type == 'Movie_Category_Secret') {
    //                logoUrl = treeView[i].icon_url;
    //            }
    //        }
    //        return logoUrl;
    //    };
    //}]);