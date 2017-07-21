
var handler = {
	get: function(target, name, receiver) {
		// console.log(name);
		if (name === "target") { return target; }
		if (name === "valueOf" || name === Symbol.toPrimitive || name === "toString") { return target[name]; }
		if (target.type === "If") {
			return IF(	target.cond, 
						maybe(target.conseq[name]),
						maybe(target.altern[name]) 	).valueOf();
		}
		if (target.type === "Nothing") { return NOTHING; }
		return maybe(target[name]);
	},
	apply: function(target, thisArg, argumentsList) {
		if (target.type === "If") {
			// console.log(target.conseq);
			return IF(	target.cond, 
						target.conseq.apply(thisArg, argumentsList),
						target.altern.apply(thisArg, argumentsList) ).valueOf();
		}
		if (target.type === "Nothing") { return NOTHING; }
		return target.apply(thisArg, argumentsList);
	}
}

function destiny(x) {
	if (not(x)) { return x; }
	var target = x.target;
	if (!not(target) && target.type === "If") { return destiny(target.conseq); }
	return x.valueOf();
}

function lift(x) {
	if (x.type) { return x; }
	if (not(x)) { return NOTHING; }
	return VAL(x);
}
function maybe(x) {
	return not(x) ? NOTHING : x;
}

class Node extends Function {
	constructor(valueOf) {
		super();
		this.valueOf = valueOf;
		this.type = "Node";
	}
}
function NODE(f) { return new Node(f); }

_NOTHING = new Node(()=>0);
_NOTHING.type = "Nothing";
NOTHING = new Proxy(_NOTHING, handler);

function Val(x) { 
	return { 
		val: x, 
		valueOf: function() { return this.val; },
		type: "Val"
	};
}
function VAL(x) { return new Proxy(Val(x), handler); }
VAL_1 = VAL(1);

function App() { 
	var args = Array.from(arguments);
	var pure = !!args[0];
	if (!pure) { args = args.slice(1); }
	return { 
		cache: {t: null, val: null}, 
		pure: pure,
		f: args[0], args: args.slice(1).map(lift),
		valueOf: function() { 
			var t = time();
			if (this.target.cache.t != t) {
				// console.log("work:", this.target);
				this.target.cache = { t: t, val: this.target.f.apply(null, this.target.args.map(x => x.valueOf())) };
				if (this.target.pure && this.target.args.every(x => x.type === 'Val')) {
					clear(this.target, Val(this.target.cache.val));
					return this.target.val;
				}
			}
			return this.target.cache.val;
		},
		type: "App"
	};
}
function APP() { return new Proxy(App.apply(null, arguments), handler); }

function Frame(dt=1500, t0, t1) {
	t0 = t0 || createjs.Ticker.getTime(true);
	t1 = t1 || t0 + dt;
	dt = dt || t1 - t0;
	return {
		t0: t0, t1: t1, dt: dt,
		valueOf: function() { 
			var t = time();
			if (t > this.target.t1) {
				clear(this.target, VAL_1);
				return 1;
			}
			return Math.max(0, (t-this.target.t0)/this.target.dt); 
		},
		type: "Frame"
	}
}
function FRAME() { return new Proxy(Frame.apply(null, arguments), handler); }

function If(cond, conseq, altern) { 
	// var ret =
	return {
		cache: {t: null, val: null}, 
		cond: cond, conseq: conseq, altern: altern,
		valueOf: function() { 
			// console.log(this.target);
			var t = time();
			if (this.target.cache.t != t) {
				var c = this.target.cond.valueOf();
				if (c >= 1) { 
					// console.log(this.target.conseq);
					clear(this.target, Val(this.target.conseq));
					// createjs.Ticker.paused = true;
					return this.target.valueOf();
				}
				if (c <= 0) { 
					this.target.cache = { t: t, val: this.target.altern.valueOf() };
					return this.target.cache.val;
				}
				// if (!this.target.conseq) {
				// 	console.log(this.target.valueOf());
				// }
				var con = this.target.conseq.valueOf();
				var alt = this.target.altern.valueOf();
				if (isNum(con) && isNum(alt)) { 
					// console.log("work:", this.target);
					this.target.cache = { t: t, val: c*con + (1-c)*alt };
					return this.target.cache.val;
				}
				return this;
				// return new Proxy(this.target, handler);
			}
			return this.target.cache.val;
		},
		type: "If"
	}
	// ret.target = ret;
	// return ret;
}
function IF() { return new Proxy(If.apply(null, arguments), handler); }



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





