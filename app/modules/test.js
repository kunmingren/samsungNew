'use strict';

angular.module('app.test', [])
    .controller('TestController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        $scope.selectedIndex = 0;
        $scope.selectedIndex2 = 0;
        $scope.count = 0;

        function animate(num,sel,className){
            var target = document.getElementById(sel).children[num];
            if(hasClass(target,className)){
                remove(num);
            }
            addClass(target, className);
        }

        function remove(num,sel,className){
            var target = document.getElementById(sel).children[num];
            removeClass(target,className);
        }

        function addClass(obj, cls) {
            if (!hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        }
        function hasClass(obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        }

        function removeClass(obj, cls) {
            if (hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

        function clearClass(num){
            var target = document.getElementById('test').children[num];
            target.className = '';
        }


        function rotateUp(num){
            if(num == 0) {
                var number = num + 2;
                var target = document.getElementById('test' + number).children;
                for(var i=0;i<target.length;i++){
                    transform(target[i],"rotateX(0deg)");
                    removeClass(target[i], 'opacityReduce');
                    addClass(target[i], 'opacityAdd');
                    target[i].style.top = '0px';
                }
            }else{
                var number = num + 2;
                var target = document.getElementById('test' + number).children;
                for(var i=0;i<target.length;i++){
                    transform(target[i],"rotateX(0deg)");
                    removeClass(target[i], 'opacityReduce');
                    addClass(target[i], 'opacityAdd');
                    target[i].style.top = '0px';
                }
                var number1 = num+1;
                var target1 = document.getElementById('test'+ number1).children;
                for(var i=0;i<target1.length;i++) {
                    transform(target1[i], "rotateX(90deg)");
                    addClass(target1[i], 'opacityReduce');
                    target1[i].style.top = '-115px';
                }
            }
        }


        function rotateDown(num){
            if(num==-1){
                var target = document.getElementsByClassName('rotate_img');
                for(var i=0;i<target.length;i++){
                    transform(target[i],"rotateX(-90deg)");
                    addClass(target[i], 'opacityReduce');
                    target[i].style.top = '100px';
                }
            }else{
                var number1 = num+3;
                var target1 = document.getElementById('test'+ number1).children;
                for(var i=0;i<target1.length;i++) {
                    transform(target1[i], "rotateX(-90deg)");
                    addClass(target1[i], 'opacityReduce');
                    target1[i].style.top = '100px';
                }
                var number = num + 2;
                var target = document.getElementById('test' + number).children;
                for(var i=0;i<target.length;i++){
                    transform(target[i],"rotateX(0deg)");
                    removeClass(target[i], 'opacityReduce');
                    addClass(target[i], 'opacityAdd');
                    target[i].style.top = '0px';
                }
            }
        }

        var transform = function(element, value, key) {
            key = key || "Transform";
            ["Moz", "O", "Ms", "Webkit", ""].forEach(function(prefix) {
                element.style[prefix + key] = value;
            });

            return element;
        }


        function move(){
            var btn = document.getElementById('amt_btn');
            //var pre = parseInt(btn.style.left);
            //btn.style.left = (pre+100)+'px';
            $scope.count +=1;
            transform(btn,"translateX("+($scope.count*100)+"px)")
        }

        function click_btn(){
            var btn = document.getElementById('amt_btn');
            addClass(btn, 'click_amt');
        }

        function unclick_btn(){
            var btn = document.getElementById('amt_btn');
            removeClass(btn, 'click_amt');
        }


        //animate(0,'test','test_animation');
        rotateDown(-1);
        rotateUp(0);
        animate(0,'test1','animation');
        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_DOWN:
                    if ($scope.selectedIndex2 < 2) {
                        $scope.selectedIndex2++;
                    }
                    remove($scope.selectedIndex2-1,'test1','animation');
                    animate($scope.selectedIndex2,'test1','animation');
                    break;
                case COMMON_KEYS.KEY_UP:
                    if ($scope.selectedIndex2 > 0) {
                        $scope.selectedIndex2--;
                    }
                    remove($scope.selectedIndex2+1,'test1','animation');
                    animate($scope.selectedIndex2,'test1','animation');
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    //if ($scope.selectedIndex > 0) {
                    //    $scope.selectedIndex--;
                    //}
                    //remove($scope.selectedIndex+1,'test','test_animation');
                    //animate($scope.selectedIndex,'test','test_animation');
                    if ($scope.selectedIndex > 0) {
                        $scope.selectedIndex--;
                    }
                    rotateDown($scope.selectedIndex);
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    //if ($scope.selectedIndex < 2) {
                    //    $scope.selectedIndex++;
                    //}
                    //remove($scope.selectedIndex-1,'test','test_animation');
                    //animate($scope.selectedIndex,'test','test_animation');
                    if ($scope.selectedIndex < 2) {
                        $scope.selectedIndex++;
                    }
                    rotateUp($scope.selectedIndex);
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    //clearClass($scope.selectedIndex);
                    move();
                    break;
                case COMMON_KEYS.KEY_VOL_UP:
                    click_btn();
                    break;
                case COMMON_KEYS.KEY_VOL_DOWN:
                    unclick_btn();
                    break;
            }
        })

    }]);