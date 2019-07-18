/* 
	瀑布流思路：
	1、用页面视口宽度除以瀑布流中单个盒子的宽度得到瀑布流的列数n；
	2、用一个数组hArr存放每一列的高度，数组的初始值应该是第一行的n个盒子的高度；
	3、对hArr取最小值，并求出是第几列（minHIndex），得到高度最小的列，其高度就是新盒子的起始位置（top）；
	4、从第n+1个盒子开始，将其放到高度最小的那一列，其left就是第minHIndex个盒子的offsetLeft；
	5、之前高度最小的列的高度值加上第新放置的盒子的高度得到该列的新高度值
 */

window.onload = function() {
	waterfall('main', 'box')
}

// 瀑布流函数
function waterfall(container, box) {
	// 用一个var语句声明多个变量，比用多个var语句分别声明快
	var wContainer = document.getElementById(container), // 取得瀑布流容器
		wViewWidth = document.documentElement.clientWidth, // 页面视口总宽度
		wBoxes = document.getElementsByClassName(box), // 取得所有盒子
		wBoxesWidth = wBoxes[0].offsetWidth, // 单个盒子的宽度
		colNum = Math.floor(wViewWidth / wBoxesWidth), // 瀑布流列数
		hArr = [] // 存放每列高度的数组
	// 设置瀑布流容器div宽度并居中显示
	wContainer.style.cssText = 'width:'+wBoxesWidth*colNum+'px;margin:0 auto'
	for (var i = 0; i < wBoxes.length; i++) {
		// 先将第一行盒子的高度存入hArr数组
		if (i < colNum) {
			hArr.push(wBoxes[i].offsetHeight)
			// hArr[i] = wBoxes[i].offsetHeight
		} else {
			// 取得最小高度及其索引值
			var minHeight = Math.min.apply(Math, hArr),
				minHIndex = getMinHIndex(hArr, minHeight)
			console.log(minHeight)
			console.log(hArr)
			console.log(minHIndex)
			// 给新盒子定位
			wBoxes[i].style.position = 'absolute'
			wBoxes[i].style.top = minHeight + 'px'
			wBoxes[i].style.left = wBoxes[minHIndex].offsetLeft + 'px'
			// 新盒子放置的列加上新盒子的高度
			hArr[minHIndex] += wBoxes[i].offsetHeight
		}
	}
}

function getMinHIndex(arr, val) {
	for (var i = 0; i < arr.length; i++) { // 注意这里length拼成lenght是不会在这里报错的
		if (arr[i] == val) {
			console.log(i)
			return i
		}
	}
}