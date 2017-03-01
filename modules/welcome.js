'use strict';

angular.module('app.welcome', [])
    .controller('WelcomeController', ['$scope', 'ResourceManager', 'ActivityManager', 'COMMON_KEYS', function ($scope, ResourceManager, ActivityManager, COMMON_KEYS) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        activity.isMenu(true);
        $scope.password = 0;
        activity.loadI18NResource(function (res) {
            var i18nText;
            if(ResourceManager.getLocale()){
                i18nText  = ResourceManager.getLocale();
                $scope.language = i18nText.lang;
            }else{
                $scope.language = 'zh-CN';
                ResourceManager.setLocale($scope.language);
                i18nText = ResourceManager.getLocale();
            }
            $scope.guestNameText = i18nText.welcome.guestName;
            $scope.guestName = ResourceManager.getI18NResource().getString("guest_name");
            $scope.welcomeText = ResourceManager.getI18NResource().getString("welcome_text");
            $scope.press1 = i18nText.welcome.press1;
            $scope.press2 = i18nText.welcome.press2;
            $scope.logo = ResourceManager.getConfigurations().logoUrl();
            $scope.poster = ResourceManager.getConfigurations().welcomeBgImageUrl();


            // var fileSystemObj = new FileSystem();
            // var usbPath = '$USB_DIR' + "/";
            //
            // var arrFiles = fileSystemObj.readDir(usbPath)
            // if (arrFiles) {
            //     for (var i=0; i < arrFiles.length; i++) {
            //         alert(arrFiles[i].name);
            //         alert(arrFiles[i].isDir);
            //         $scope.test += arrFiles[i].name+"/";
            //     }
            // }

        });
        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if(document.readyState=="complete"){
           ActivityManager.hideLoading(2000);
        };
        ActivityManager.hideLoading(5000);
        var languages = ['zh-CN', 'en-US'],
            languageIndex = 0;

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_LEFT:
                case COMMON_KEYS.KEY_RIGHT:
                    $scope.password = 0;
                    languageIndex ^= 1;
                    $scope.language = languages[languageIndex];
                    ResourceManager.setLocale($scope.language);
                    break;
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('','menu','menu');
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if($scope.password==3){
                        ActivityManager.startActivity('','room','room');
                    }else {
                        ActivityManager.showLoading();
                        ActivityManager.startActivity('', 'menu', 'menu');
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    break;
                case COMMON_KEYS.KEY_0:
                    if($scope.password == 2){
                        $scope.password = 3;
                    }else{
                        $scope.password = 0;
                    }
                    break;
                case COMMON_KEYS.KEY_1:
                    if($scope.password==0) {
                        $scope.password = 1;
                    }else if($scope.password==1){
                        $scope.password = 2;
                    }else{
                        $scope.password = 0;
                    }
                    break;
                case COMMON_KEYS.KEY_2:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_3:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_4:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_5:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_6:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_7:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_8:
                    $scope.password=0;
                    break;
                case COMMON_KEYS.KEY_9:
                    $scope.password=0;
                    break;
            }
        });
    }]);
