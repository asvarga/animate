
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);
	resize();
	
	circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	circle.x = {
		valueOf: function() {
			return createjs.Ticker.getTime(true)/1000.0;
		}
	};
	circle.y = 100;
	stage.addChild(circle);
	stage.update();



}
function resize() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var s = Math.min(w, h)-15;
	canvas.style.position = "absolute";
	canvas.style.left = (w-s)/2+"px";
	canvas.style.top = (h-s)/2+"px";
	canvas.style.width = s+"px";
	canvas.style.height = s+"px";
}

function tick() {

}







