'use strict';

angular.module('app.tpl_text', [])
    .controller('TplTextController', ['$scope', '$timeout', '$element', 'ActivityManager', 'COMMON_KEYS', function ($scope, $timeout, $element, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        $scope.texts = []
        for (var i = 0; i < 10; i++) {
            $scope.texts.push({title: i + '、Run a directive after the DOM has finished rendering', content: i + '、To run the directive after the DOM has finished rendering you should postpone the execution, for example using the setTimeout function. AngularJS has a method wrapper for the window.setTimeout function, that is $timeout.'});
        }

        $scope.selectedIndex = 0;
        $scope.preTopStyle = 0;
        $scope.ulTopStyle = 0;
        $scope.title = '新闻';
        $scope.currentPage = 1;
        $scope.totalPage = 0;

        var pageHeight = 100;
        $timeout(function () {
            var totalHeight = $element[0].querySelector('.text-preview-container>pre').offsetHeight;
            $scope.totalPage = Math.ceil(totalHeight / pageHeight);
        }, 0);

        activity.onKeyDown(function (keyCode) {
            var tempIndex = $scope.selectedIndex;
            var pageIndex = $scope.currentPage;
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if (pageIndex > 1) {
                        pageIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (pageIndex < $scope.totalPage) {
                        pageIndex++;
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    if (tempIndex > 0) {
                        tempIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if (tempIndex < $scope.texts.length - 1) {
                        tempIndex++;
                    }
                    break;
            }
            if (tempIndex !== $scope.selectedIndex) {
                $scope.selectedIndex = tempIndex;
                if (tempIndex >= 5) {
                    $scope.ulTopStyle = (4 - tempIndex) * 100;
                } else {
                    $scope.ulTopStyle = 0;
                }
            }
            if (pageIndex !== $scope.currentPage) {
                $scope.currentPage = pageIndex;
            }

        });

    }]);
