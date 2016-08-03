/**
 * Created by 83471 on 2016/8/2.
 */
'use strict';
angular.module('app',[
    'app.activity',
    'app.resource',
    'app.welcome',
    'app.zh-CN',
    'app.en-US',
    'app.room'
])
    .run(['$rootScope', '$http', 'ActivityManager','ResourceManager', function ($rootScope, $http, ActivityManager,ResourceManager) {

                //判断localStorage中房间号是否存在，不存在则跳转至home页面设置房间号
                //if(!window.localStorage.room){
                //    ActivityManager.startActivity('room');
                //}else {
                //    ActivityManager.startActivity('welcome');
                //}
        // 获取主配置文件
        var cfg = ResourceManager.getConfigurations();
        $http.get(cfg.mainConfigUrl()).success(function (mainJSON) {

            // 获取目录配置文件
            var menuConfigUrl = cfg.serverUrl() + mainJSON.MainView_Json_URL;
            $http.get(menuConfigUrl).success(function (menuJSON) {
                ResourceManager.initialize(typeof mainJSON === 'string' ? JSON.parse(mainJSON) : mainJSON,
                    typeof menuJSON === 'string' ? JSON.parse(menuJSON) : menuJSON);

                //判断localStorage中房间号是否存在，不存在则跳转至home页面设置房间号
                if(!window.localStorage.room){
                    ActivityManager.startActivity('room');
                }else {
                    ActivityManager.startActivity('welcome');
                }
            });
        });

    }])
        .controller('RootController',['$scope', 'ActivityManager', 'COMMON_KEYS', function ($scope, ActivityManager, COMMON_KEYS) {
        /* browser environment */
        var keyMapping = {
            37: COMMON_KEYS.KEY_LEFT,
            38: COMMON_KEYS.KEY_UP,
            39: COMMON_KEYS.KEY_RIGHT,
            40: COMMON_KEYS.KEY_DOWN,
            13: COMMON_KEYS.KEY_ENTER,
            81: COMMON_KEYS.KEY_BACK,
            84: COMMON_KEYS.KEY_TV,
            77: COMMON_KEYS.KEY_MENU,
            104: COMMON_KEYS.KEY_VOL_UP,
            98: COMMON_KEYS.KEY_VOL_DOWN,
            101: COMMON_KEYS.KEY_MUTE
        };

        /* production environment */
        if (Common.API) {
            var tvKey = new Common.API.TVKeyValue();
            keyMapping[tvKey.KEY_LEFT] = COMMON_KEYS.KEY_LEFT;
            keyMapping[tvKey.KEY_RIGHT] = COMMON_KEYS.KEY_RIGHT;
            keyMapping[tvKey.KEY_UP] = COMMON_KEYS.KEY_UP;
            keyMapping[tvKey.KEY_DOWN] = COMMON_KEYS.KEY_DOWN;
            keyMapping[tvKey.KEY_ENTER] = COMMON_KEYS.KEY_ENTER;
            keyMapping[tvKey.KEY_1] = COMMON_KEYS.KEY_MENU;
            keyMapping[tvKey.KEY_2] = COMMON_KEYS.KEY_BACK;
            keyMapping[tvKey.KEY_VOL_UP] = COMMON_KEYS.KEY_VOL_UP;
            keyMapping[tvKey.KEY_VOL_DOWN] = COMMON_KEYS.KEY_VOL_DOWN;
            keyMapping[tvKey.KEY_MUTE] = COMMON_KEYS.KEY_MUTE;
        }

        $scope.onkeydown = function (ev) {
            var key = keyMapping[ev.keyCode];
            if (key === COMMON_KEYS.KEY_MENU) {
                if (ActivityManager.getActiveActivity().shouldDisplayMenu()) {
                    $scope.showMenu = !$scope.showMenu;
                    $scope.$broadcast('menu.toggle', $scope.showMenu);
                }
            } else if (key === COMMON_KEYS.KEY_ENTER && ActivityManager.getActiveActivity().triggerBottom() && $scope.showMenu == false) {
                $scope.showMenu = !$scope.showMenu;
                $scope.$broadcast('menu.toggle', $scope.showMenu);
            } else if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyDown(key);
            } else {
                $scope.$broadcast('menu.keydown', key);
            }
        };

        $scope.onkeyup = function (ev) {
            var key = keyMapping[ev.keyCode];
            if (!$scope.showMenu) {
                ActivityManager.getActiveActivity().keyUp(key);
            }
        }

        $scope.activityStack = ActivityManager.getActivityStack();
    }])
    .constant('COMMON_KEYS', {
        KEY_LEFT    : 0,
        KEY_RIGHT   : 1,
        KEY_UP      : 2,
        KEY_DOWN    : 3,
        KEY_ENTER   : 4,
        KEY_BACK    : 5,
        KEY_TV      : 6,
        KEY_MENU    : 7,
        KEY_VOL_UP  : 8,
        KEY_VOL_DOWN: 9,
        KEY_MUTE    :10
    });