
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
	resize();
	
	circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	stage.addChild(circle);

	// var L1 = new Point(200, 200);
	// var L2 = new Point(500, 800);
	// D = new Dual(L1, L2);
	// circle.x = D.bind(_.x);
	// circle.y = D.bind(_.y);

	circle.x = 200;
	circle.y = 200;
	stage.on("stagemousedown", function(evt) {
	    circle.x = dual(circle.x, evt.stageX);
	    circle.y = dual(circle.y, evt.stageY);
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
	// console.log(fr+0, fr);
	// circle.x = at(L.x);
	// circle.y = at(L.y);
	stage.update();
}







