
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
	resize();
	
	circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	stage.addChild(circle);

	// var f = new Frame(null, 1000, 4000);
	// var g = new Frame(null, 2000, 5000);
	// var h = new Frame(null, 3000, 6000);
	var A = new Point(200, 200);
	// var B = new Point(800, 200);
	// var C = new Point(800, 800);
	// var D = new Point(200, 800);
	// L = lerp(A, C, f);
	// L = lerp(A, lerp(B, lerp(C, D, h), g), f);
	// L = lerp(200, lerp(800, 200, f), f);

	L = A;
	stage.on("stagemousedown", function(evt) {
	    L = lerp(L, new Point(evt.stageX, evt.stageY), 1500);
	    console.log(depth(L));
	});


	tick();
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
	circle.x = at(L.x);
	circle.y = at(L.y);
	stage.update();
}







