
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
			return final(this, 1);
		}
		return quintic(ret);
	}
}

class Dual {
	constructor(v0, v1, d) {
		this.v0 = v0;
		this.v1 = v1;
		this.d = d instanceof Object ? d : new Frame(d);
	}
	valueOf() {
		var d = this.d.valueOf();
		if (d >= 1) {
			if (this.d.final) {
				return final(this, this.v1).valueOf();
			}
			return this.v1.valueOf();
		} else if (d <= 0) {
			return this.v0.valueOf();
		} else {
			return this.v0*(1-d) + this.v1*d;
		}
	}
	bind(f) {
		var thiss = this;
		return new Dual({ valueOf: () => f(thiss.v0) }, { valueOf: () => f(thiss.v1) }, thiss.d);
	}
}
function dual(v0, v1, d) { return new Dual(v0, v1, d); }

function final(obj, x) {
	if (x.hasOwnProperty('valueOf')) {
		clear(obj, {
			final: x,
			valueOf: () => {
				if (obj.final.hasOwnProperty('final')) {
					final(obj, obj.final.final);
				}
				return obj.final.valueOf();
			}
		});
	} else {
		clear(obj, {
			final: x,
			valueOf: () => obj.final,
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
	return (x instanceof Dual) ? 1 + Math.max(depth(x.v0), depth(x.v1)) : 0;
}
function size(x) {
	return (x instanceof Dual) ? 1 + depth(x.v0) + depth(x.v1) : 1;
}






