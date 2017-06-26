
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
	resize();
	
	circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	stage.addChild(circle);

	L = new Point(200, 200);
	stage.on("stagemousedown", function(evt) {
	    L = lerp(prune(L), new Point(evt.stageX, evt.stageY), 1500);
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







