var scroll = angular.module("scrollBar", []);

scroll.directive('inertiaScroll', function() {
	return {
		restrict: 'ACEM',
		scope: {},
		link: function($scope, $element, $attrs) {
			var elem = $element[0];
			var startY, endY, startTime, endTime;
			var speedDecay = 0.02; //速度衰减量  
			var lastMoveTime, secondLastMoveTime; //最后次手指停止移动的时间和倒数第二次手指停止移动的时间（测试的时发现有时候最后一次移动时间不准确，故而选用倒数第二次停止移动的时间）  
			var stopMoveInterval; //手指停止滑动的时间  

			var stopInertiaMove = false; //停止惯性滚动的标识位  

			elem.addEventListener('touchstart', function(e) {
				stopInertiaMove = true; //当惯性滑动过程中再次触碰到屏幕的时候应该立即停止惯性滑动  
				startY = e.touches[0].pageY;
				startTime = Date.now();
			});

			elem.addEventListener('touchmove', function(e) {
				//这个事件主要用来记录最后一次停止滑动的时间，当停止滑动时间超过一定量就不执行惯性滑动  
				secondLastMoveTime = lastMoveTime;
				lastMoveTime = Date.now();
			});

			elem.addEventListener('touchend', function(e) {
				endY = e.changedTouches[0].pageY;
				endTime = Date.now();
				if(secondLastMoveTime) {
					stopMoveInterval = endTime - secondLastMoveTime;
				} else {
					stopMoveInterval = endTime - lastMoveTime;
				}

				//计算速度，距离除以时间  
				var speed = (endY - startY) / (endTime - startTime);
				var speedAbs = Math.abs(speed);

				/** 
				 * 惯性移动的递归方法 
				 */
				function inertiaMove() {
					if(speedAbs < 0 || stopInertiaMove) {
						//如果速度绝对值小于0了，则结束惯性滚动  
						return;
					}

					//设置每次惯性滑动时间为20毫秒  
					var distance = speedAbs * 20;

					if(speed < 0) {
						//如果速度是负数，则是手指向上滑动。继续惯性滚动，则scrollTop的值会增加  
						elem.scrollTop += distance;
						//console.log('向上惯性滚动' + distance);  
					} else {
						//如果速度是正数，则是手指向下滑动。继续惯性滚动，则scrollTop的值会减少  
						elem.scrollTop -= distance;
						//console.log('向下惯性滚动' + distance);  
					}
					console.log($(elem).scrollTop());
					//速度衰减  
					speedAbs -= speedDecay;

					setTimeout(inertiaMove, 10);
				}

				if(stopMoveInterval < 100) {
					//手指停止滑动超过0.1秒的就不执行惯性滑动了  
					stopInertiaMove = false;
					inertiaMove();
				}
			});

		}
	};
})