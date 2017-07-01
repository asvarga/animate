
MONOTONIC = true;

////////

class Frame {
	constructor(dt=1500, t0, t1) {
		this.t0 = t0 || createjs.Ticker.getTime(true);
		this.t1 = t1 || this.t0 + dt;
		this.dt = dt || this.t1 - this.t0;
	}
	valueOf() {
		var ret = (createjs.Ticker.getTime(true)-this.t0)/this.dt;
		if (ret >= 1) {
			return finalize(this, 1);
		}
		return quintic(ret);
	}
}
function frame(dt, t0, t1) { return new Frame(dt, t0, t1); }

class Dual {
	constructor(v0, v1, c) {
		this.v0 = v0;
		this.v1 = v1;
		this.c = isDef(c) ? c : frame();
	}
	valueOf() {
		var c = this.c.valueOf();
		if (c >= 1) {
			if (this.c.final) {
				return finalize(this, this.v1).valueOf();
			}
			return this.v1.valueOf();
		} else if (c <= 0) {
			return this.v0.valueOf();
		} else {
			return this.v0*(1-c) + this.v1*c;
		}
	}
	bind(f) {
		// var dis = this;	// TODO: might be unnecessary
		return new Dual({ valueOf: () => f(this.v0) }, { valueOf: () => f(this.v1) }, this.c);
	}
}
function dual(v0, v1, c) { return new Dual(v0, v1, c); }

function finalize(dis, x) {
	if (x.hasOwnProperty('valueOf')) {
		clear(dis, {
			final: x,
			valueOf: () => {
				if (dis.final.hasOwnProperty('final')) {
					finalize(dis, dis.final.final);
				}
				return dis.final.valueOf();
			}
		});
	} else {
		clear(dis, {
			final: x,
			valueOf: () => dis.final,
		});
	}
	return x;
}

////////

function cubic(x) {
	return x*x*(3-2*x);
}
function quintic(x) {
	return x*x*x*(6*x*x - 15*x + 10);
}

function depth(x) {
	return (x instanceof Dual) ? 1 + Math.max(depth(x.v0), depth(x.v1), depth(x.final)) : 0;
}
function size(x) {
	return (x instanceof Dual) ? 1 + size(x.v0) + size(x.v1) + size(x.final) : 1;
}






