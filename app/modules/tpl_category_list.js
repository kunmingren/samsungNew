'use strict';

angular.module('app.tpl_category_list', [])
    .controller('TplCategoryListController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'TplCategoryListService', function ($scope, ActivityManager, COMMON_KEYS, TplCategoryListService) {
        var activity = ActivityManager.getActiveActivity();
        var firstLevel,
            secondLevel,
            LEVEL = 0,
            jsonUrl;
        var langData = TplCategoryListService.getTitle();
        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.categories = [];

        TplCategoryListService.getJsonUrl();

        activity.loadI18NResource(function (res) {
            $scope.title = langData.title;
            if (TplCategoryListService.getFirstLevel().length == 0) {
                TplCategoryListService.getJsonUrl().success(function (data) {
                    TplCategoryListService.initialize().success(function (data) {
                        firstLevel = TplCategoryListService.getFirstLevel();
                        bindFirstLevel();
                    })
                })
            } else {
                firstLevel = TplCategoryListService.getFirstLevel();
                bindFirstLevel();
            }
        });

        $scope.listTopStyle = 0;

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_UP:
                    if ($scope.selectedIndex > 0) {
                        if ($scope.selectedIndex >= $scope.categories.length - 1){
                            activity.triggerBottom(false);
                            $scope.$broadcast('triggerBottom.change', false);
                        }
                        $scope.selectedIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if ($scope.selectedIndex < $scope.categories.length - 1) {
                        $scope.selectedIndex++;
                    } else {
                        $scope.selectedIndex++;
                        activity.triggerBottom(true);
                        $scope.$broadcast('triggerBottom.change', true);
                        return;
                    }
                    break;
                case COMMON_KEYS.KEY_BACK:
                    if (LEVEL == 1) {
                        activity.finish();
                    } else if (LEVEL == 2) {
                        bindFirstLevel();
                    }

                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 1) {
                        jsonUrl = firstLevel[$scope.selectedIndex].json_Url;
                        $scope.title = langData.title + '/' + TplCategoryListService.getName(firstLevel[$scope.selectedIndex].nameKey);
                        getSecondLevelData(jsonUrl);
                    } else if (LEVEL == 2) {
                        var secondTitle = $scope.title + '/' + TplCategoryListService.getName(secondLevel[$scope.selectedIndex].nameKey) ;
                        TplCategoryListService.setPicTextDetail(secondTitle, secondLevel[$scope.selectedIndex].threelevel);
                        ActivityManager.startActivity('tpl_pic_text_simple');
                    }
                    break;
            }
            if ($scope.selectedIndex > 9) {
                $scope.listTopStyle = (9 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });

        function bindFirstLevel() {
            LEVEL = 1;
            $scope.selectedIndex = 0;
            $scope.categories = [];
            $scope.title = langData.title;
            for (var i = 0; i < firstLevel.length; i++) {
                $scope.categories.push({
                    name: TplCategoryListService.getName(firstLevel[i].nameKey),
                    previewText: TplCategoryListService.getName(firstLevel[i].introduceKey),
                    previewImage: firstLevel[i].picUrl
                });
            }
        }

        function bindSecondLevel() {
            LEVEL = 2;
            $scope.selectedIndex = 0;
            $scope.categories = [];
            for (var i = 0; i < secondLevel.length; i++) {
                $scope.categories.push({
                    name: TplCategoryListService.getName(secondLevel[i].nameKey)
                });
            }
        }

        function getSecondLevelData(jsonUrl) {
            secondLevel = null;
            TplCategoryListService.secondLevel(jsonUrl).success(function (data) {
                secondLevel = TplCategoryListService.getSecondLevel();
                bindSecondLevel();
            });
        }
    }])
    .service('TplCategoryListService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        var conUrl = ResourceManager.getConfigurations().serverUrl(),
            jsonUrl,
            configUrl,
            firstLevel = [],
            secondLevel = [];

        this.getJsonUrl = function () {
            return $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (menuJSON) {
                menuJSON.Content.forEach(function (el, idx, arr) {
                    if (el.Type == 'SecondMenu') {
                        el.Second.Content.forEach(function (el, idx, arr) {
                            if (el.Type == 'Category_List_BlueSea') {
                                jsonUrl = conUrl + el.Json_URL;
                                return;
                            }
                        })
                        return;
                    }
                })
            })
        }

        this.initialize = function () {
            var deferred = $q.defer();

            // cached configurations
            if (jsonUrl === configUrl) {
                deferred.resolve();
                return deferred.promise;
            }
            return $http.get(jsonUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = jsonUrl;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var nameKey = 'first_level_name_' + idx;
                    var introduceKey = 'first_level_introduce_' + idx
                    firstLevel.push({
                        nameKey: nameKey,
                        introduceKey: introduceKey,
                        picUrl: conUrl + el.SubContent[0].Picurl,
                        json_Url: conUrl + el.Json_URL
                    });
                    zhStrs[nameKey] = el.Name;
                    enStrs[nameKey] = el.NameEng;
                    zhStrs[introduceKey] = el.SubContent[0].Introduce;
                    enStrs[introduceKey] = el.SubContent[0].IntroduceEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.secondLevel = function (jsonUrl) {
            secondLevel = [];
            return $http.get(jsonUrl).success(function (configJSON) {
                var zhStrs = [], enStrs = [];
                configUrl = jsonUrl;
                var viewTreeIndex = 0, subViewTreeIndex = 0;
                configJSON.Content.forEach(function (el, idx, arr) {
                    var threelevel = [];
                    if (el.SubContent) {
                        el.SubContent.forEach(function (el2, idx2, arr2) {
                            var introduceKey = 'three_level_name_' + subViewTreeIndex;
                            threelevel.push({
                                introduceKey: introduceKey,
                                picurl: conUrl + el2.Picurl
                            });
                            subViewTreeIndex++;
                            zhStrs[introduceKey] = el2.Introduce;
                            enStrs[introduceKey] = el2.IntroduceEng;
                        });
                    }
                    var nameKey = 'second_level_name_' + viewTreeIndex;
                    secondLevel.push({
                        nameKey: nameKey,
                        threelevel: threelevel
                    });
                    viewTreeIndex++;
                    zhStrs[nameKey] = el.Name;
                    enStrs[nameKey] = el.NameEng;
                });
                ResourceManager.addI18NResource({'zh-CN': zhStrs, 'en-US': enStrs});
            });
        };

        this.getTitle = function () {
            return ResourceManager.getLocale().tpl_categroy_list;
        }

        this.getFirstLevel = function () {
            return firstLevel;
        };

        this.getSecondLevel = function () {
            return secondLevel;
        };

        this.getName = function (nameKey) {
            return ResourceManager.getI18NResource().getString(nameKey);
        }

        this.setPicTextDetail = function (title, detail) {
            ResourceManager.setPicTextDetail(title, detail);
        }
    }]);
