


class Node {
	constructor(valueOf) {
		this.valueOf = valueOf;
	}
}
function NODE(f) { return new Node(f); }

function Val(x) { 
	return { 
		val: x, 
		valueOf: function() { return this.val; }
	};
}
function VAL(x) { return x instanceof Node ? x : clear(new Node(), Val(x)); }
VAL_1 = VAL(1);

function App() { 
	var args = Array.from(arguments);
	var pure = !!args[0];
	if (!pure) { args = args.slice(1); }
	return { 
		cache: {t: null, val: null}, 
		pure: pure,
		f: args[0], args: args.slice(1).map(VAL),
		valueOf: function() { 
			var t = time();
			if (this.cache.t != t) {
				// console.log("work:", this);
				this.cache = { t: t, val: this.f.apply(null, this.args.map(x => x.valueOf())) };
				if (this.pure && this.args.every(x => x instanceof Node && x.hasOwnProperty('val'))) {
					clear(this, Val(this.cache.val));
					return this.val;
				}
			}
			return this.cache.val;
		}
	};
}
function APP() { return clear(new Node(), App.apply(null, arguments)); }

function Frame(dt=1500, t0, t1) {
	t0 = t0 || createjs.Ticker.getTime(true);
	t1 = t1 || t0 + dt;
	dt = dt || t1 - t0;
	return {
		t0: t0, t1: t1, dt: dt,
		valueOf: function() { 
			var t = time();
			if (t > this.t1) {
				clear(this, VAL_1);
				return 1;
			}
			return Math.max(0, (t-this.t0)/this.dt); 
		}
	}
}
function FRAME() { return clear(new Node(), Frame.apply(null, arguments)); }


var if_handler = {
	get: function(target, name, receiver) {
		if (name === "target") { return target; }
		if (name === "valueOf" || name === Symbol.toPrimitive) { return target[name]; }
		// if (!target.conseq) { console.log(name); }
		return IF(target.cond, target.conseq[name], target.altern[name]).valueOf();
	},
	apply: function(target, thisArg, argumentsList) {
		return IF(	target.cond, 
					target.conseq.apply(thisArg.conseq, argumentsList),
					target.altern.apply(thisArg.altern, argumentsList)).valueOf();
	}
}
function If(cond, conseq, altern) { 
	// var ret =
	return {
		cache: {t: null, val: null}, 
		cond: cond, conseq: conseq, altern: altern,
		valueOf: function() { 
			// console.log(this.target);
			var t = time();
			if (this.target.cache.t != t) {
				var c = cond.valueOf();
				if (c >= 1) { 
					var newThis = Val(this.target.conseq);
					if (newThis.hasOwnProperty('cond')) {
						clear(this.target, newThis);
					} else {
						clear(this, newThis);
					}
					// clear(this.target, Val(this.target.conseq));
					// console.log(this.target.cond);
					createjs.Ticker.paused = true;
					// return this.target.val; 
					return newThis.valueOf();
				}
				if (c <= 0) { 
					this.target.cache = { t: t, val: this.target.altern.valueOf() };
					return this.target.cache.val;
				}
				var con = this.target.conseq.valueOf();
				var alt = this.target.altern.valueOf();
				if (isNum(con) && isNum(alt)) { 
					// console.log("work:", this.target);
					this.target.cache = { t: t, val: c*con + (1-c)*alt };
					return this.target.cache.val;
				}
				return this;
				// return new Proxy(this.target, if_handler);
			}
			return this.target.cache.val;
		}
	}
	// ret.target = ret;
	// return ret;
}
function IF() { 
	var inner = clear(new Node(), If.apply(null, arguments));
	var proxy = new Proxy(inner, if_handler); 
	// var outer = new Node(() => proxy)
	return proxy;
}



function time() { return createjs.Ticker.getTime(true); }
TIME = new Node(time);

add 	= (x,y) => x+y;							
mul 	= (x,y) => x*y;							
sub 	= (x,y) => x-y;							
div 	= (x,y) => x/y;			
id 		= (x) => x;				
cubic	= (x) => x*x*(3-2*x);					
quint	= (x) => x*x*x*(6*x*x - 15*x + 10);		
eq		= (x,y) => x==y;						

////////

// prog = IF(0.5, 4, 5);
// // prog = APP(add, 4, 5);
// prog2 = APP(mul, prog, prog);
// console.log(prog2+0);





