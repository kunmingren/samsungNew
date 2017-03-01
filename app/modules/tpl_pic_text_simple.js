'use strict';

angular.module('app.tpl_pic_text_simple', [])
    .controller('TplPicTextSimpleController', ['$scope', 'ActivityManager', 'COMMON_KEYS', 'TplPicTextSimpleService', function ($scope, ActivityManager, COMMON_KEYS, TplPicTextSimpleService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        //activity.loadI18NResource(function (res) {
        //    $scope.title = '酒店介绍/酒店/上海四季酒店';
        //});

        var detailData = TplPicTextSimpleService.getPicTextDetail();
        var content = [];
        for (var i = 0; i < detailData.detail.length; i++) {
            content.push({
                src: detailData.detail[i].picurl,
                text: TplPicTextSimpleService.getName(detailData.detail[i].introduceKey),
                title: detailData.title
            })
        }

        $scope.previous = null;
        $scope.current = content[0];
        $scope.next = content[1];
        $scope.title = content[0].title;

        var selectedIndex = 0;

        activity.onKeyDown(function (keyCode) {
            var tempIndex = selectedIndex;
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                    if (tempIndex > 0 && activity.triggerBottom() == false) {
                        tempIndex--;
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (tempIndex < content.length - 1 && activity.triggerBottom() == false) {
                        tempIndex++;
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    activity.triggerBottom(false);
                    $scope.$broadcast('triggerBottom.change', false);
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    activity.triggerBottom(true);
                    $scope.$broadcast('triggerBottom.change', true);
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
            }
            if (tempIndex !== selectedIndex) {
                selectedIndex = tempIndex;
                $scope.previous = content[selectedIndex - 1];
                $scope.current = content[selectedIndex];
                $scope.next = content[selectedIndex + 1];
                $scope.title = content[selectedIndex].title;
            }
        });

    }])
    .service('TplPicTextSimpleService', ['$q', '$http', 'ResourceManager', function ($q, $http, ResourceManager) {
        this.getName = function (nameKey) {
            return ResourceManager.getI18NResource().getString(nameKey);
        }

        this.getPicTextDetail = function () {
            return ResourceManager.getPicTextDetail();
        }


    }]);
