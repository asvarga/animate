
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

	modes = [id, cubic, quint];
	modeNames = ['linear', 'cubic', 'quint'];
	ind = -1;
	function changeMode() {
		ind = (ind+1)%modes.length;
		alertify.success("Mode: "+modeNames[ind]);
	}
	changeMode();

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

	circle = new Circle();
	circle.x = 100;
	circle.y = 100;
	circle.space = 800;


	tick();
}

class Circle extends createjs.Shape {
	constructor(par, childs) {
		super();
		this.graphics.beginFill(randColor()).drawCircle(0, 0, 20);
		this.par = par;
		this.childs = childs || [];
		var thiss = this;
		this.space = par ? NODE(function() {
			if (thiss.par.childs && thiss.par.childs.indexOf) {
				return thiss.par.space/2**(1+thiss.par.childs.indexOf(thiss));
			} else {
				console.log(thiss.par.childs);
				return 100;
			}
		}) : 800;
		this.x = NODE(() => this.par.x+this.par.space-2*this.space);
		this.y = NODE(() => this.par.y+100);
		this.on("click", function(evt) {
			if (DOWN[18]) {		// alt
				if (this.par) {
					var par = this.par;
					var sibs = par.childs;
					var ind = sibs.indexOf(this);
					par.childs = LERP([].concat(sibs.slice(0, ind), this.childs, sibs.slice(ind+1)), sibs);
					for (var i=0; i<this.childs.length; i++) {
						this.childs[i].par = LERP(par, this);
					}
					// stage.removeChild(this);
				}
			} else {
				this.childs.push(new Circle(this));
			}
		});
		stage.addChild(this);
	}
}

DUR = 1500;
function LERP(to, from) {
	return IF(APP(quint, FRAME(DUR)), to, from);
}










