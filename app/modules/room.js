'use strict';

angular.module('app.room', [])
    .controller('RoomController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var input = document.getElementById('room');
        input.focus();

        function setRoomNum(){
            var roomNum = document.getElementById('room').value;
            if(roomNum !=''){
                window.localStorage.room = roomNum;
                activity.finish();
                ActivityManager.startActivity('welcome');
            }else{
                alert('不能为空');
            }
        }
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_UP:

                    break;
                case COMMON_KEYS.KEY_DOWN:

                    break;
                case COMMON_KEYS.KEY_ENTER:
                    setRoomNum();
                    break;
                case COMMON_KEYS.KEY_RIGHT:

                    break;
            }
        });

    }]);