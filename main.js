
function load() {
	canvas = document.getElementById("myCanvas");
	stage = new createjs.Stage("myCanvas");
	stage.enableMouseOver();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);
	resize();

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

	MOUSE = new Point(500, 500);
	stage.on("stagemousemove", function(evt) {
		MOUSE.x = evt.stageX;
		MOUSE.y = evt.stageY;
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

	// var n = 3;
	// for (var i=0; i<n; i++) {
	// 	var circle2 = new createjs.Shape();
	// 	circle2.graphics.beginFill("Red").drawCircle(0, 0, 20);
	// 	stage.addChild(circle2);
	// 	circle2.x = {
	// 		i: i,
	// 		valueOf: function() { return 40*Math.cos(TIME/100+2*Math.PI/n*this.i)+circle.x; }
	// 	};
	// 	circle2.y = {
	// 		i: i,
	// 		valueOf: function() { return 40*Math.sin(TIME/100+2*Math.PI/n*this.i)+circle.y; }
	// 	}
	// }

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







