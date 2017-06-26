

class PlusN {
	constructor(N) {
		this.N = N;
	}
	plusn(x) {
		return new PlusN(x+this.N);
	}
	done() {
		return this.N;
	}
}

class Frame {
	constructor(dt=1, t0=null, t1=null) {
		this.t0 = t0 || createjs.Ticker.getTime(true)/1000.0;
		this.t1 = t1 || this.t0 + dt;
		this.dt = dt || this.t1 - this.t0;	
	}
	progress(t=null) {
		var norm = ((t || createjs.Ticker.getTime(true)/1000)-this.t0)/this.dt;
		return Math.max(0, Math.min(norm, 1));
	}
}

function lerp(v0, v1, dt_or_frame) {
	class Lerp {
		constructor(v0, v1, dt_or_frame) {
			this.v0 = v0;
			this.v1 = v1;
			this.frame = (dt_or_frame instanceof Frame) ? dt_or_frame : new Frame(dt_or_frame);
		}
		at_(t) {
			var v0 = at(this.v0, t);
			var v1 = at(this.v1, t);
			return v0 + (v1-v0)*this.frame.progress(t);
		}
	}
	var handler = {								// proxy handler traps all gets
		get: function(target, name) {
			if (name === "target") { return target; }
			// if (name === "at") { 
			// 	return function () {
			// 		return target[name].apply(target, arguments); 
			// 	}
			// }
			var gotten0 = target.v0[name];		// might want to defer this?
			var gotten1 = target.v1[name];
			if (typeof gotten0 === "function") {
				return function() {
					// console.log(gotten0);
					// console.log(Array.from(arguments));
					// console.log(gotten1);
					// console.log(Array.from(arguments));
					return lerp(gotten0.apply(target.v0, arguments), 
								gotten1.apply(target.v1, arguments), target.frame);
				}
			} else {
				return lerp(gotten0, gotten1, target.frame);
			}
		}
	}
	return new Proxy(new Lerp(v0, v1, dt_or_frame), handler);
}

function at(x, t=null) {
	if (typeof x === 'object') {	// should be a lerp
		return x.target.at_(t || createjs.Ticker.getTime(true));
	} else {
		return x;
	}
}


// var f = new Frame(10, 20);
// console.log(f);
// var p = lerp(new PlusN(3), new PlusN(4), f);
// console.log(p.plusn(10).plusn(100).done().at(23));

// var p = lerp([3], [4]);
// console.log(p[0]);

var f = new Frame(null, 1, 3);
var g = new Frame(null, 2, 4);
var x = lerp(200, lerp(800, 200, g), f);
// console.log(x);
// console.log(x.target);
console.log(at(x, 2.5))
// console.log(x[0]);
// console.log(x.at(2.5));








