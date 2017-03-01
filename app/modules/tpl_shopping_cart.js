'use strict';

angular.module('app.tpl_shopping_cart', [])
    .controller('ShoppingCartController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.cartText = i18nText.cart;
        $scope.title = $scope.cartText.title;
        $scope.priceText = $scope.cartText.price;
        $scope.coin = $scope.cartText.coin;
        var roomNum = window.localStorage.room;

        $scope.listTopStyle = 0;
        $scope.selectedIndex = 0;
        $scope.order = [];

        var cart = ResourceManager.getCart();
        cart.forEach(function(item,index,array){
            if(item.name!=''){
                $scope.order.push(item);
            }
            summary();
        })

        function summary(){
            $scope.total = 0;
            $scope.order.forEach(function(item){
                $scope.total+= (item.price*item.num);
            })
        }

        function deleteOrder(index){
            var ul = document.getElementById('order-list');
            var li = ul.children;
            var target = li[index];
            ul.removeChild(target);
            $scope.order.splice(index,1);
            summary();
        }

        function submit(){
            //提交的订单信息(order数组+total总价)
            console.log($scope.order);
            console.log($scope.total);
            console.log(roomNum);
        }

        function cancel(){
            //取消订单
            ResourceManager.resetCart();
            $scope.order = [];
            activity.finish();
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_UP:
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                            if($scope.menu =='cancel'){
                                $scope.menu = 'submit';
                            }else if($scope.menu == 'submit'){
                                $scope.menu = '';
                            }
                        }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                        if ($scope.selectedIndex < $scope.order.length - 1) {
                            $scope.selectedIndex++;
                        }else if($scope.selectedIndex == $scope.order.length - 1){
                            $scope.selectedIndex++;
                            $scope.menu = 'submit';
                        }else if($scope.menu == 'submit'){
                            $scope.selectedIndex++;
                            $scope.menu = 'cancel';
                        }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if($scope.menu == 'submit'){
                        submit();
                    }else if($scope.menu == 'cancel'){
                        cancel();
                    }
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if($scope.menu == 'submit'){
                        $scope.selectedIndex--;
                        $scope.menu = '';
                    }else if($scope.menu == 'cancel'){
                        $scope.selectedIndex--;
                        $scope.menu = 'submit';
                    }else if($scope.order[$scope.selectedIndex].num<2){
                        deleteOrder($scope.selectedIndex);
                        //$scope.order[$scope.selectedIndex].num = 0;
                    }else{
                        $scope.order[$scope.selectedIndex].num--;
                        summary();
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if($scope.menu == 'submit'){
                        $scope.selectedIndex++;
                        $scope.menu = 'cancel';
                    }else if($scope.menu == 'cancel'){
                        return
                    }else {
                        $scope.order[$scope.selectedIndex].num++;
                        summary();
                    }
                    break;
            }
            if ($scope.selectedIndex > 5 && $scope.menu!='submit' && $scope.menu!='cancel') {
                $scope.listTopStyle = (6 - $scope.selectedIndex) * 39;
            } else if ($scope.selectedIndex <= 5) {
                $scope.listTopStyle = 0;
            }
        });
    }]);