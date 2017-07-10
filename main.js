
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	stage.enableMouseOver();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
	resize();

	MOUSE = new Point(500, 500);
	stage.on("stagemousemove", function(evt) {
		MOUSE.x = evt.stageX;
		MOUSE.y = evt.stageY;
	});

	modes = [id, cubic, quint];
	modeNames = ['linear', 'cubic', 'quint'];
	ind = -1;
	function changeMode() {
		ind = (ind+1)%modes.length;
		alertify.success("Mode: "+modeNames[ind]);
	}
	changeMode();

	stage.on("stagemousedown", function(evt) {
		createjs.Ticker.paused = !createjs.Ticker.paused;
	});

	this.document.onkeydown = function(evt) {
		// console.log(event.keyCode);
		switch(event.keyCode) {
			// case 80: 	// p	
			// 	createjs.Ticker.paused = !createjs.Ticker.paused;
			// 	break;
			case 77: 	// m	
				changeMode();
				break;
		}
	};

	circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 20);
	stage.addChild(circle);
	circle.x = 500;
	circle.y = 500;


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

function tick(evt={}) {
	if (!evt.paused) {
		circle.x = IF(APP(modes[ind], FRAME()), MOUSE.x, circle.x);
		circle.y = IF(APP(modes[ind], FRAME()), MOUSE.y, circle.y);
		stage.update();
	}
}







