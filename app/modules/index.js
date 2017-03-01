'use strict';

angular.module('app.index', [])
    .controller('IndexController', ['$scope','ResourceManager', 'ActivityManager', 'COMMON_KEYS', function ($scope,ResourceManager, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.triggerBottom(true);

        activity.loadI18NResource(function (res) {
            var i18nText = ResourceManager.getLocale();
            $scope.guestName = i18nText.index.guestName + res.getString("guest_name");
            $scope.subWelcomeText = res.getString("welcome_text").replace(/，|。|,|\./g, "\n");
            $scope.roomNumber = i18nText.index.roomNumber + window.localStorage.room;
            $scope.showMenu = true;
        });

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
        });
        
    }]);
