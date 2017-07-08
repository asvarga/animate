
MONOTONIC = true;

////////

class Frame {
	constructor(dt=1000, t0=null, t1=null) {
		this.t0 = t0 || createjs.Ticker.getTime(true);
		this.t1 = t1 || this.t0 + dt;
		this.dt = dt || this.t1 - this.t0;
	}
	progress(t=null) {
		var norm = ((t || createjs.Ticker.getTime(true))-this.t0)/this.dt;
		return quintic(Math.max(0, Math.min(norm, 1)));
	}
}

class Lerp {
	constructor(v0, v1, dt_or_frame) {
		this.v0 = v0;
		this.v1 = v1;
		this.frame = (dt_or_frame instanceof Frame) ? dt_or_frame : new Frame(dt_or_frame);
		this.done = false;
	}
	at_(t) {
		var progress = this.frame.progress(t);
		if (progress <= 0) { 
			return at(this.v0, t);
		} else if (progress >= 1) { 
			// this.done = MONOTONIC;
			return at(this.v1, t);
		} else {
			var v0 = at(this.v0, t);
			var v1 = at(this.v1, t);
			return v0 + (v1-v0)*progress;
		}
	}
}
function lerp(v0, v1, dt_or_frame) {
	var handler = {								// proxy handler traps all gets
		get: function(target, name) {
			if (name === "target") { return target; }
			return lerp(target.v0[name], target.v1[name], target.frame);
		},
		apply: function(target, thisArg, argumentsList) {
			return lerp(target.v0.apply(thisArg.v0, argumentsList), 
						target.v1.apply(thisArg.v1, argumentsList), target.frame);
		}
	}
	return new Proxy(new Lerp(v0, v1, dt_or_frame), handler);
}
function isLerp(x) {
	return typeof x === 'object' && x.target instanceof Lerp;
}

function at(x, t=null) {
	if (isLerp(x)) {
		return x.target.at_(t || createjs.Ticker.getTime(true));
	} else {
		return x;
	}
}

function prune(x, t=null) {
	t = t || createjs.Ticker.getTime(true);
	if (isLerp(x)) {
		if (t >= x.target.frame.t1) { 
			return x.target.v1;
		} else {
			return lerp(prune(x.target.v0, t), prune(x.target.v1, t), x.target.frame);
		}
	} else {
		return x;
	}
}

////////

function cubic(x) {
	return x*x*(3-2*x);
}
function quintic(x) {
	return x*x*x*(6*x*x - 15*x + 10);
}

function depth(x) {
	if (isLerp(x)) {
		return 1 + Math.max(depth(x.target.v0), depth(x.target.v1));
	} else {
		return 0;
	} 
}





