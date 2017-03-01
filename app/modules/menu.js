'use strict';

angular.module('app.menu', [])
    //.directive('menu', ['$interval', 'ResourceManager', 'COMMON_KEYS', 'ActivityManager', function ($interval, ResourceManager, COMMON_KEYS, ActivityManager) {
    //    return {
    //        restrict: 'EA',
    //        replace: true,
    //        transclude: true,
    //        scope: {},
    //        templateUrl: 'partials/menu.html',
    //        link: function (scope, element, attrs) {
    //            var treeView = ResourceManager.getConfigurations().viewTree();
    //            scope.menuItems = [];
    //            for (var i = 0; i < treeView.length; i++) {
    //                var menuName = ResourceManager.getI18NResource().getString(treeView[i].nameKey);
    //                scope.menuItems.push({
    //                    name: menuName,
    //                    icon: treeView[i].icon,
    //                    activityId: getActivityId(treeView[i].type)
    //                });
    //            }
    //            scope.selectedMenuItemIndex = 0;
    //            scope.guestName = ResourceManager.getI18NResource().getString("guest_name").replace(/:/g, "");
    //            scope.roomNumber = window.localStorage.room;
    //
    //            scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
    //            scope.menuStyleWidth = scope.menuItems.length * 100 + 1000 + 'px';
    //            scope.showMenu = false;
    //            scope.$on('menu.toggle', function (ev, visible) {
    //                scope.showMenu = visible;
    //                scope.selectedMenuItemIndex = 0;
    //                scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
    //            });
    //
    //            scope.$on('menu.keydown', function (ev, key) {
    //                switch (key) {
    //                    case COMMON_KEYS.KEY_LEFT:
    //                        if (scope.selectedMenuItemIndex > 0 && scope.showMenu == true) {
    //                            scope.selectedMenuItemIndex--;
    //                            scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
    //                        }
    //                        break;
    //                    case COMMON_KEYS.KEY_RIGHT:
    //                        if (scope.selectedMenuItemIndex < scope.menuItems.length - 1 && scope.showMenu == true) {
    //                            scope.selectedMenuItemIndex++;
    //                            scope.menuStyleLeft = (231 - scope.selectedMenuItemIndex * 100) + 'px';
    //                        }
    //                        break;
    //                    case COMMON_KEYS.KEY_BACK:
    //                        if (scope.showMenu == false) {
    //                            scope.selectedMenuItemIndex = 0;
    //                        }
    //                        break;
    //
    //                    case COMMON_KEYS.KEY_ENTER:
    //                        var activity = ActivityManager.getActiveActivity();
    //                        activity.finish();
    //                        ActivityManager.go(scope.menuItems[scope.selectedMenuItemIndex].activityId, 2);
    //                        scope.$emit('activity.created');
    //                        break;
    //                }
    //            });
    //
    //            function getActivityId(type) {
    //                switch (type) {
    //                    case 'Live_blue':
    //                        return 'live';
    //                        break;
    //                    case 'Billing_blue':
    //                        return 'bill';
    //                        break;
    //                    case 'Weather_blue':
    //                        return 'weather';
    //                        break;
    //                    case 'Message_blue':
    //                        return 'message';
    //                        break;
    //                    case 'DND_blue':
    //                        return 'dnd';
    //                        break;
    //                    case 'Category_List_BlueSea':
    //                        return 'tpl_category_list';
    //                        break;
    //                    case 'PicText_Category_Order_BlueSea':
    //                        return 'order';
    //                        break;
    //                    case 'Movie_Category':
    //                        return 'movie';
    //                        break;
    //                }
    //            }
    //
    //            function updateClock() {
    //                var date = new Date();
    //                var houues = format(date.getHours());
    //                var minutes = format(date.getMinutes());
    //                var seconds = format(date.getSeconds());
    //                scope.dateString = [date.getFullYear(), format(date.getMonth() + 1), format(date.getDate())].join('.');
    //                scope.timeString = [houues, minutes, seconds].join(':');
    //                function format(time) {
    //                    if (time < 10) {
    //                        return "0" + time;
    //                    } else {
    //                        return time;
    //                    }
    //                }
    //            }
    //
    //            updateClock();
    //            $interval(updateClock, 1000);
    //        }
    //    }
    //}])
    .controller('MenuController', ['$scope', '$http', '$interval', 'ActivityManager', 'COMMON_KEYS', 'ResourceManager', function ($scope, $http, $interval, ActivityManager, COMMON_KEYS, ResourceManager) {
        $scope.$on('menu.load', function (ev) {
            if ($scope.menuItems.length == 0) {
                menuBind();
            }
        })

        $scope.$on('menu.keydown', function (ev, key) {
            switch (key) {
                case COMMON_KEYS.KEY_LEFT:
                    if ($scope.selectedMenuItemIndex > 0) {
                        $scope.selectedMenuItemIndex--;
                        $scope.menuStyleLeft = (231 - $scope.selectedMenuItemIndex * 100) + 'px';
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if ($scope.selectedMenuItemIndex < $scope.menuItems.length - 1) {
                        $scope.selectedMenuItemIndex++;
                        $scope.menuStyleLeft = (231 - $scope.selectedMenuItemIndex * 100) + 'px';
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    ActivityManager.go($scope.menuItems[$scope.selectedMenuItemIndex].activityId, 2);
                    $scope.$emit('activity.created');
                    break;
            }
        });

        function menuBind() {
            var treeView = ResourceManager.getConfigurations().viewTree();
            $scope.menuItems = [];
            for (var i = 0; i < treeView.length; i++) {
                var menuName = ResourceManager.getI18NResource().getString(treeView[i].nameKey);
                $scope.menuItems.push({
                    name: menuName,
                    icon: treeView[i].icon,
                    activityId: getActivityId(treeView[i].type)
                });
            }
            $scope.selectedMenuItemIndex = 0;
            $scope.guestName = ResourceManager.getI18NResource().getString("guest_name").replace(/:/g, "");
            $scope.roomNumber = window.localStorage.room;

            $scope.menuStyleLeft = (231 - $scope.selectedMenuItemIndex * 100) + 'px';
            $scope.menuStyleWidth = $scope.menuItems.length * 100 + 1000 + 'px';
        }

        function getActivityId(type) {
            switch (type) {
                case 'Live_blue':
                    return 'live';
                    break;
                case 'Billing_blue':
                    return 'bill';
                    break;
                case 'Weather_blue':
                    return 'weather';
                    break;
                case 'Message_blue':
                    return 'message';
                    break;
                case 'DND_blue':
                    return 'dnd';
                    break;
                case 'Category_List_BlueSea':
                    return 'tpl_category_list';
                    break;
                case 'PicText_Category_Order_BlueSea':
                    return 'order';
                    break;
                case 'Movie_Category':
                    return 'movie';
                    break;
            }
        }

        function updateClock() {
            var date = new Date();
            var houues = format(date.getHours());
            var minutes = format(date.getMinutes());
            var seconds = format(date.getSeconds());
            $scope.dateString = [date.getFullYear(), format(date.getMonth() + 1), format(date.getDate())].join('.');
            $scope.timeString = [houues, minutes, seconds].join(':');
            function format(time) {
                if (time < 10) {
                    return "0" + time;
                } else {
                    return time;
                }
            }
        }

        updateClock();
        $interval(updateClock, 1000);

    }])
    .service('MenuService', ['ResourceManager', function (ResourceManager) {
        this.getMenu = function () {
            return ResourceManager.getI18NResource();
        }
    }]);;
