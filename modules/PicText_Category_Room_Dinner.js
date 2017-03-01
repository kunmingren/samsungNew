'use strict';

angular.module('app.food', [])
    .controller('FoodController', ['$scope', 'ActivityManager','ResourceManager', 'COMMON_KEYS','MenuService','$http','BtnService', function ($scope, ActivityManager,ResourceManager, COMMON_KEYS,MenuService,$http,BtnService) {
        var activity = ActivityManager.getActiveActivity();
        activity.initialize($scope);
        var data = ResourceManager.getService();
        $scope.serviceName = data.name;
        $scope.iconUrl = data.icon;
        activity.loadI18NResource(function (res) {
            var toolvarData = MenuService.getLanguage().toolbar;
            $scope.select = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_select.png',
                right: toolvarData.selsct
            };
            $scope.ok = {
                left: toolvarData.left,
                icon: 'assets/images/icon_toolbar_menu1.png',
                right: toolvarData.ok
            };
            $scope.menu = {
                // left: toolvarData.left,
                // icon: 'assets/images/icon_toolbar_menu.png',
                // right: toolvarData.menu
            };
        });

        //$scope.$watch('$viewContentLoaded', function() {
        //    ActivityManager.hideLoading();
        //});
        if(document.readyState=="complete"){
            ActivityManager.hideLoading(500);
        }


        var i18nText = ResourceManager.getLocale();
        var lang = i18nText.lang;

        $scope.listRightStyle = 0;
        $scope.pieces = 1;
        $scope.foods = [];
        $scope.order = [];
        $scope.total = 0;
        $scope.position = 'right';
        var mealID = 0;
        var mealUrl;
        $scope.LEVEL = 1;
        //var mealID = ResourceManager.getMeal().id;
        //根据上一级中选择的mealID请求对应数据
        var conUrl = ResourceManager.getConfigurations().serverUrl();
        var mealUrl;
        $http.get(conUrl + '/Main/json/MainMenu_4.json').success(function (data) {
            data.Content.forEach(function (el, idx, arr) {
                if (el.NameEng == "Room Service") {
                    mealUrl = el.Second.Content[mealID].Json_URL;
                    return;
                }
            })
            //mealUrl = data.Content[6].Second.Content[mealID].Json_URL;
            $http.get(conUrl+mealUrl).success(function (data1) {
                data1.Content.forEach(function(val,idx,arr){
                    var meal = {};
                        if(lang == "en-US") {
                            meal = {
                                name: val.name_eng,
                                introduce:val.introduce_eng,
                                img:conUrl+val.picurl,
                                price:val.category_dollor,
                                id:val.id
                            };
                            $scope.money = '$';
                            $scope.addText = 'Add Order';
                            $scope.tipText = 'Succeed!'
                        }else{
                            meal = {
                                name: val.name,
                                introduce:val.introduce,
                                img:conUrl+val.picurl,
                                price:val.category_yuan,
                                id:val.id
                            };
                            $scope.money = '￥';
                            $scope.addText = '加入订单';
                            $scope.tipText = '成功加入订单!'
                        }
                    $scope.foods.push(meal);
                });
                $scope.selectIndex = 0;
                $scope.food = $scope.foods[$scope.selectIndex];
                setPiece($scope.selectIndex);
            });
        });


        var cart = ResourceManager.getCart();
        cart.forEach(function(item,index,array){
            if(item.name){
                $scope.total+=item.num;
                $scope.order[index] = item.num;
            }
        });
        function confirm(id,num){
            $scope.order[id] = num;
            var foodName = $scope.foods[$scope.selectIndex].name;
            var price = $scope.foods[$scope.selectIndex].price;
            addToCart(id,foodName,num,price);
            sumOrder();
            console.log(cart);
        }

        function addToCart(id,f,n,p){
            ResourceManager.addToCart(id,f,n,p);
        }

        function sumOrder(){
            var sum = 0;
            $scope.order.forEach(function(item,index,array){
                sum += item;
            });
            $scope.total = sum;
        }

        function setPiece(num){
            var id = $scope.foods[num].id;
            if($scope.order[id]){
                $scope.pieces = $scope.order[id];
            }else{
                $scope.pieces = 1;
            }
        }

        function move(direction){
            var btn = document.getElementById('food_border');
            switch (direction){
                case 'left':
                    activity.transform(btn,"translateX(-233px)");
                    break;
                case 'right':
                    activity.transform(btn,"translateX(0px)");
                    break;
                case 'bottom':
                    if($scope.position=='left'){
                        activity.transform(btn,'translateX(0)');
                        activity.removeClass(btn,'foodTop');
                        activity.addClass(btn,'foodBot');
                    }else{
                        activity.transform(btn,'translateX(0)');
                        activity.removeClass(btn,'foodTop');
                        activity.addClass(btn,'foodBot');
                    }
                    break;
                case 'up':
                    activity.removeClass(btn,'foodBot');
                    activity.addClass(btn,'foodTop');
                    break;
                case 'clear':
                    activity.transform(btn,"translateX(0px)");
                    activity.removeClass(btn,'foodTop');
            }
        }

        activity.onKeyDown(function (keyCode) {
            switch (keyCode) {
                case COMMON_KEYS.KEY_MENU:
                    ActivityManager.startActivity('menu');
                    break;
                case COMMON_KEYS.KEY_BACK:
                    activity.finish();
                    break;
                case COMMON_KEYS.KEY_LEFT:
                    if($scope.LEVEL==1) {
                        if ($scope.selectIndex > 0) {
                            $scope.selectIndex -= 1;
                            $scope.food = $scope.foods[$scope.selectIndex];
                            setPiece($scope.selectIndex);
                        }
                    }else if($scope.LEVEL==2){
                        if($scope.position != 'left'){
                            move('left');
                            $scope.position = 'left';
                        }
                        //border左动画
                    }
                    break;
                case COMMON_KEYS.KEY_RIGHT:
                    if($scope.LEVEL==1) {
                        if ($scope.selectIndex < $scope.foods.length - 1) {
                            $scope.selectIndex += 1;
                            $scope.food = $scope.foods[$scope.selectIndex];
                            setPiece($scope.selectIndex);
                        }
                    }else if($scope.LEVEL==2){
                        if($scope.position != 'right'){
                            move('right');
                            $scope.position = 'right';
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_ENTER:
                    if($scope.LEVEL==3) {
                        var foodID = $scope.foods[$scope.selectIndex].id;
                        if ($scope.pieces != 0) {
                            BtnService.clickBtn('food-btn-submit');
                            confirm(foodID, $scope.pieces);
                            activity.showTip($scope.tipText);
                        }
                    }else if($scope.LEVEL==2){
                        if($scope.position=='left' && $scope.pieces>1){
                            BtnService.clickBtn('food-btn-sub');
                            $scope.pieces-=1;
                        }else if($scope.position=='right'){
                            BtnService.clickBtn('food-btn-add');
                            $scope.pieces+=1;
                        }
                    }
                    break;
                case COMMON_KEYS.KEY_UP:
                    if($scope.LEVEL==3){
                        $scope.LEVEL-=1;
                        $scope.position = 'right';
                        move('up');
                    }else if($scope.LEVEL==2){
                        if($scope.position = 'left'){
                            $scope.position = 'right';
                            move('clear');
                        }
                        $scope.LEVEL-=1;

                    }
                    break;
                case COMMON_KEYS.KEY_DOWN:
                    if($scope.LEVEL==1){
                        $scope.LEVEL+=1;
                    }else if($scope.LEVEL==2){
                        $scope.LEVEL+=1;
                        move('bottom');
                    }
                    break;
            }
            if ($scope.selectIndex > 3) {
                $scope.listRightStyle = (3 - $scope.selectIndex) * 285;
            } else if ($scope.listRightStyle !== 0) {
                $scope.listRightStyle = 0;
            }
        });
    }]);