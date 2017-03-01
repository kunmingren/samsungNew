'use strict';

angular.module('app.room', [])
    .controller('RoomController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var input = document.getElementById('room');
        input.focus();
        //var room_num = ResourceManager.getCookie('room');
        var room_num = localStorage.room;
        if(room_num){
            $scope.number = room_num;
        }else {
            $scope.number = '';
        }
        changeRoomNum();
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(1000);
        };
        function setRoomNum(){
            var roomNum = document.getElementById('room').value;
            if(roomNum !=''){
                localStorage.room = roomNum;
                //ResourceManager.setCookie('room',roomNum,365);
                //$cookies.put('room', roomNum);
                //$.cookie('room', roomNum);
                activity.finish();
                ActivityManager.showLoading();
                ActivityManager.startActivity('welcome','welcome');
            }else{
                alert('不能为空');
            }
        };
        function changeRoomNum(){
            //var roomNumber = parseInt($scope.number);
            document.getElementById('room').value = $scope.number;
        }
        $scope.number = '';
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    $scope.number = '';
                    changeRoomNum();
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
                case COMMON_KEYS.KEY_0:
                    $scope.number += '0';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_1:
                    $scope.number += '1';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_2:
                    $scope.number += '2';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_3:
                    $scope.number += '3';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_4:
                    $scope.number += '4';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_5:
                    $scope.number += '5';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_6:
                    $scope.number += '6';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_7:
                    $scope.number += '7';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_8:
                    $scope.number += '8';
                    changeRoomNum();
                    break;
                case COMMON_KEYS.KEY_9:
                    $scope.number += '9';
                    changeRoomNum();
                    break;
            }
        });

    }]);