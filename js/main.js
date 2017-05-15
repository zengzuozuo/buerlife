var app = angular.module("ngapp", ["ui.router","scrollBar"]);

//-----------路由------------
app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when("", "/home");

	$stateProvider.state("home", {
		url: "/home",
		templateUrl: "./html/home_page.html",
		controller: "home"
	}).state("my", {
		url: "/my",
		templateUrl : "./html/my_page.html",
		controller: "my"
	}).state("goodsClass", {
		url : "/goodsClass",
		templateUrl: "./html/goodsClass_page.html",
		controller: "goodsClass"
	}).state("shopingCart", {
		url : "/shopingCart",
		templateUrl: "./html/shopingCart_page.html",
		controller: "shopingCart"
	})

}])





$.getJSON("json/goodsClass.json", function(data) {
	console.log(data);
})

//---------主控制器---------
app.controller("main", ["$scope","$location", function($scope,$location){
	$scope.url = "/home";
	$scope.goPage = function(url){
		$location.path(url);
		$scope.url = url;
	}
}]);


//-------home控制器---------
app.controller("home", ["$scope", function($scope) {
	$.getJSON("json/home.json", function(data) {
		console.log(data.data.recComm);
		$scope.bannerImgs = data.data.adBanner;
		$scope.nav = data.data.adCatList;
		//特卖商品
		$scope.bpGoodsList = data.data.saleTag[0];
		//人气推荐
		$scope.recommend = data.data.popularity[0];
		
		//商品列表
		$scope.recCommData = data.data.recComm;
		
		$scope.$apply();
	})

	setTimeout(function() {
		var swiper = new Swiper(".swiper-container", {
			autoplay: 3000,
			loop: true,
			pagination: ".swiper-pagination",
			observer: true,
			autoplayDisableOnInteraction : false
		});
	}, 500)

	//特卖轮播
	setTimeout(function() {
		var myScroll = new IScroll('#goods-wrapper-scroll', {
			eventPassthrough: true,
			scrollX: true,
			scrollY: false,
			preventDefault: false
		});
	}, 100)
	
	
	
	
}]);

//--------goodsClass商品列表控制器------------
app.controller("goodsClass", ["$scope", function($scope){
	$.getJSON("json/goodsClass.json", function(data) {
		console.log(data.data);
		$scope.data = data.data;
		
		$scope.$apply();
		
	})
	//设置菜单栏高度
	setElemHeight("menu-wrap",["goodsClass-header","public-footer"]);
	//点击展示二级菜单
	$("#outer-menu").on("click",".outer-list",function(event){
		$(this).addClass("active").siblings().removeClass("active");
		$(this).find("li:first").addClass("active").siblings().removeClass("active");
		$(this).find(".inside-menu").stop().slideToggle();
		$(this).siblings().find(".inside-menu").stop().slideUp();
	})
	$("#outer-menu").on("click",".indise-list",function(event){
		event.stopPropagation();
		$(this).addClass("active").siblings().removeClass("active");
	})
	
	
	//菜单滚动
	var myscroll;
    function loaded(){
      	setTimeout(function(){
       		myscroll = new IScroll("#menu-wrap",{
       			eventPassthrough: true,
				scrollX: false,
				scrollY: true,
				preventDefault: false,
				vScrollbar: true,
				bounce: true
       		});
        },100 );

    }
    window.addEventListener("load",loaded,false);
    
    
    //设置商品列表盒子高度
    setElemHeight("goodsList-wrap",["goodsClass-header","public-footer","filter"]);
    
    
    //加入购物车
    var addGoodsArr = {};
    $scope.addCart = function($event){
    	console.log($event.target);
    	var imgWrap = $($event.target).parent().siblings("#img-wrap");
    	var imgDom = imgWrap.clone();
    	console.log(imgDom);
    	imgDom.css({position:"fixed","z-index":6,"width":"1.8rem","height":"1.8rem"});
    	imgWrap.parent().append(imgDom);
    	imgDom.animate({"top":"200px","width":"0rem","height":"0rem","top":"100%","right":"100px"},function(){
    		imgDom.remove();
    	})
    	
    	
    	
    	
    	if( sessionStorage.getItem("addGoodsList") ) {
    		addGoodsArr = JSON.parse(sessionStorage.getItem("addGoodsList"));
    	}
    	addGoodsArr[this.item.spuId] = this.item;
    	var jsonStr = JSON.stringify(addGoodsArr);
    	sessionStorage.setItem("addGoodsList",jsonStr);
    }
    
}]);

//---------购物车控制器-------------------
app.controller("shopingCart",["$scope", function($scope){
	if( !sessionStorage.getItem("addGoodsList") || (sessionStorage.getItem("addGoodsList") == "{}") ){
		$("#shopping-content-empty").css({"z-index":3});
	}else{
		$("#shopping-content-empty").css({"z-index":1});
	}
	//动态设置类容区域的高度
	setElemHeight("shopping-content-empty",["shopping-header","public-footer"])
	setElemHeight("shopping-content",["shopping-header","public-footer"])
	//localStorage.clear();
	var addGoodsList = JSON.parse(sessionStorage.getItem("addGoodsList"));
	
	$scope.addGoodsList = addGoodsList;
	
	
	//数量操作
	$scope.amount = 1;
	$scope.addAmount = function($event){
		var spanDom = $($event.target).siblings(".amount");
		var amount = spanDom.html();
		amount ++;
		spanDom.html(amount);
	}
	$scope.minusAmount = function($event){
		var spanDom = $($event.target).siblings(".amount");
		var amount = spanDom.html();
		amount --;
		if(amount < 1){
			var ssObj = JSON.parse(sessionStorage.getItem("addGoodsList"));
			delete ssObj[this.goodsInfo.spuId]
			sessionStorage.setItem("addGoodsList",JSON.stringify(ssObj));
			$scope.addGoodsList = ssObj;
			if( !sessionStorage.getItem("addGoodsList") || (sessionStorage.getItem("addGoodsList") == "{}") ){
				$("#shopping-content-empty").css({"z-index":3});
			}
			return;
		}
		spanDom.html(amount);
	}
}])




//---------my控制器---------
app.controller("my",["$scope",function($scope){
	
}])




//动态设置元素高度
function setElemHeight(elem,otherElem){
	var h = 0;
	for(var i=0,len=otherElem.length;i<len;i++){
		h += $("#" + otherElem[i]).outerHeight();
	}
	$("#" + elem).height($(window).height() - h);
}
