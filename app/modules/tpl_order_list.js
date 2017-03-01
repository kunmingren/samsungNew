'use strict';

angular.module('app.tpl_order_list', [])
    .controller('OrderListController', ['$scope', 'ActivityManager', 'COMMON_KEYS','ResourceManager','$http', function ($scope, ActivityManager, COMMON_KEYS,ResourceManager, $http) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);

        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;
        $scope.orderText = i18nText.order;
        $scope.title = $scope.orderText.title;
        $scope.coin = $scope.orderText.coin;

        var mealID = ResourceManager.getMeal().id;
        //根据上一级中选择的mealID请求对应数据

        var LEVEL = 0;
        $scope.foods = [];
        $scope.listTopStyle = 0;
        $scope.selectedIndex = 0;
        $scope.order = [];
        $scope.total = 0;

        var cart = ResourceManager.getCart();
        cart.forEach(function(item,index,array){
            if(item.name){
                $scope.total+=item.num;
                $scope.order[index] = item.num;
            }
        })

        $http.get("http://172.17.173.100/nativevod/now/Main/json/PicText_Category_Order_BlueSea_295.json").success(function (data) {
            data.Content[mealID].SubContent.forEach(function(val,idx,arr){
                var meal = {};
                if(lang == "en-US") {
                     meal = {
                        name: val.NameEng,
                        intro:val.IntroduceEng,
                        img:val.Picurl_abs_path,
                        price:val.price,
                        id:val.id
                    }
                }else{
                     meal = {
                        name: val.Name,
                        intro:val.Introduce,
                        img:val.Picurl_abs_path,
                        price:val.priceEng,
                        id:val.id
                    }
                }
                $scope.foods.push(meal);
            })
            bindFirstLevel(0);
        })

        function bindFirstLevel(num) {
            LEVEL = 1;
            var id = $scope.foods[num].id;
            if($scope.order[id]){
                $scope.copies = $scope.order[id];
            }else{
                $scope.copies = 0;
            }
            $scope.selectedIndex = num;
            $scope.content = {
                img:$scope.foods[num].img,
                intro:$scope.foods[num].intro,
                price:$scope.foods[num].price
            }
        }

        function bindSecondLevel() {
            LEVEL = 2;
            $scope.confirm = 'before';
        }

        function cancelBindSecondLevel(){
            LEVEL = 1;
            bindFirstLevel($scope.selectedIndex);
            $scope.confirm = '';
        }

        function confirm(id,num){
            $scope.order[id] = num;
            var foodName = $scope.foods[$scope.selectedIndex].name;
            var price = $scope.foods[$scope.selectedIndex].price;
            addToCart(id,foodName,num,price);
            sumOrder();
        }

        function addToCart(id,f,n,p){
            ResourceManager.addToCart(id,f,n,p);
        }

        function sumOrder(){
            var sum = 0;
            $scope.order.forEach(function(item,index,array){
                sum += item;
            })
            $scope.total = sum;
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_UP:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex > 0) {
                            $scope.selectedIndex--;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    }else{
                        if($scope.confirm == 'before'){
                            $scope.copies++;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if (LEVEL == 1) {
                        if ($scope.selectedIndex < $scope.foods.length - 1) {
                            $scope.selectedIndex++;
                            bindFirstLevel($scope.selectedIndex);
                        }
                    }else{
                        if($scope.confirm == 'before'){
                            if($scope.copies<=0) {
                                $scope.copies=0;
                            }else{
                                $scope.copies--;
                            }
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }else if($scope.confirm == 'before'){
                        $scope.confirm = 'after';
                    }else if($scope.confirm == 'after'){
                        var foodID = $scope.foods[$scope.selectedIndex].id;
                        if($scope.copies!=0){
                            confirm(foodID,$scope.copies)
                        }
                    }else{
                        var cart = ResourceManager.getCart();
                        activity.finish();
                        ActivityManager.startActivity('tpl_shopping_cart');
                    }
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if (LEVEL == 2) {
                        if($scope.confirm == 'before') {
                            cancelBindSecondLevel();
                            bindFirstLevel($scope.selectedIndex);
                        }else if($scope.confirm == 'cart'){
                            $scope.confirm = 'after';
                        }else{
                            $scope.confirm ='before';
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if (LEVEL == 1) {
                        bindSecondLevel();
                    }else if($scope.confirm == 'before'){
                        $scope.confirm = 'after';
                    }else{
                        $scope.confirm = 'cart'
                    }
                    break;
            }
            if ($scope.selectedIndex > 11) {
                $scope.listTopStyle = (11 - $scope.selectedIndex) * 39;
            } else if ($scope.listTopStyle !== 0) {
                $scope.listTopStyle = 0;
            }
        });
    }]);