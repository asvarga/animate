
CHOSEN = null;

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
		stage.update();
	}
}

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

	// modes = [id, cubic, quint];
	// modeNames = ['linear', 'cubic', 'quint'];
	// ind = -1;
	// function changeMode() {
	// 	ind = (ind+1)%modes.length;
	// 	alertify.success("Mode: "+modeNames[ind]);
	// }
	// changeMode();

	stage.on("stagemousedown", function(evt) {
		// createjs.Ticker.paused = !createjs.Ticker.paused;
	});

	DOWN = {};
	this.document.onkeydown = function(evt) {
		// console.log(event.keyCode);
		DOWN[event.keyCode] = true;
		switch(event.keyCode) {
			case 80: 	// p	
				createjs.Ticker.paused = !createjs.Ticker.paused;
				break;
			case 77: 	// m	
				changeMode();
				break;
		}
	};
	this.document.onkeyup = function(evt) {
		if (DOWN[event.keyCode]) { delete DOWN[event.keyCode]; }
	}

	// circle = new Circle();
	// circle.x = 100;
	// circle.y = 100;
	// circle.space = 800;

	// createjs.Ticker.paused = true;
	tick();
}

class Circle extends createjs.Shape {
	constructor(par=NOTHING, childs, index) {
		super();
		this.graphics.beginFill(randColor()).drawCircle(0, 0, 20);
		this.par = par;
		this.childs = childs || [];
		this.index = index || 0;
		this.space = par ? NODE(()=>this.par.space/2**(1+this.index)) : 800;
		this.x = NODE(() => this.par.x+this.par.space-2*this.space);
		this.y = NODE(() => this.par.y+100);
		this.on("click", function(evt) {
			var par = destiny(this.par);
			var sibs = destiny(par.childs);
			var index = destiny(this.index);
			var childs = destiny(this.childs);

			if (DOWN[18]) {		// alt
				if (par) {
					var newSibs = [].concat(sibs.slice(0, index), 
											childs, 
											sibs.slice(index+1));
					par.childs = lerp(newSibs, par.childs);
					for (var i=0; i<newSibs.length; i++) {
						newSibs[i].index = lerp(i, newSibs[i].index);
						newSibs[i].par = lerp(par, newSibs[i].par);
					}
					stage.removeChild(this);
				}
			} else if (DOWN[16]) {		// shift
				choose(this);
			} else {
				childs.push(new Circle(this, [], childs.length, index));
			}
		});
		stage.addChild(this);
	}
}
function choose(x) { 
	if (CHOSEN) {
		CHOSEN.scaleX = lerp(1, CHOSEN.scaleX);
		CHOSEN.scaleY = lerp(1, CHOSEN.scaleY);
	}
	if (CHOSEN != x) {
		CHOSEN = x;
		CHOSEN.scaleX = lerp(2, CHOSEN.scaleX);
		CHOSEN.scaleY = lerp(2, CHOSEN.scaleY);
	} else {
		CHOSEN = null;
	}
	console.log(CHOSEN);
	return CHOSEN; 
}

DUR = 1500;
function lerp(to, from) {
	return IF(APP(quint, FRAME(DUR)), to, from);
}

function pause() { createjs.Ticker.paused = true; }









