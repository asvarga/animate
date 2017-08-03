
function time() { return Math.round(createjs.Ticker.getTime(true)); }

var handler = {
	get: function(target, name, receiver) {
		switch (name) {
			case "target": 		return target;
			case "become": 		return function(obj) { return clear(target, obj.target||obj); }
			case Symbol.toPrimitive: 	// ...
			case "toString": 			// ...
			case "valueOf": 	return () => _now(target);
			default: 			return maybe(target.get(name));
			// default: 			return target.get(name) || receiver;
		}
	},
	apply: function(target, thisArg, argumentsList) {
		// console.log(argumentsList);
		return maybe(target.app(argumentsList));
		// return target.app(argumentsList) || thisArg;
	}
}

function _now(x, t) { 
	var cache = x.cache;
	t = t || time();
	if (cache) {
		if (cache.t != t) {
			// cache.val = 0;	cache.t = t;	// prevents infinite loops
			cache.val = x.at(t, now);
			cache.t = t;
		}
		return cache.val;
	}
	return x.at(x, t, now);
}
function now(x, t) { return x.target ? _now(x.target, t) : x; }
function at(x, t) { return x.target ? x.target.at(t, at) : x; }
function end(x) { return x.target ? x.target.at(Infinity, end) : x; }

function wrap(x) {
	if (x.maker) { return x; }
	if (not(x)) { return NOTHING; }
	return JUST(x);
}
function maybe(x) {
	return not(x) ? NOTHING : x;
}

////

function Nothing() {
	return {
		maker: Nothing,
		at: () => 0,
		get: () => NOTHING,
		app: () => NOTHING,
	}
}
NOTHING = new Proxy(update(()=>null, Nothing()), handler);
noop = ()=>NOTHING;

function Just(x) { 
	return { 
		maker: Just,
		x: x, 
		at: function(t, at) { return this.x; },	// TODO: `return x;` makes things flash?
		get: function(key) { return this.x[key]; },
		app: function(args) { 
			console.log(this.x);		// TODO: WHAAAAAAAAT????
			return this.x.apply(this.x, args); }
	};
}
function JUST() { return new Proxy(update(()=>null, Just.apply(null, arguments)), handler); }
ZERO = JUST(0); ONE = JUST(1); TWO = JUST(2); THREE = JUST(3); INF = JUST(Infinity);

function Lerp(cond, conseq, altern) { 
	return {
		maker: Lerp,
		cache: {t: null, val: null}, 
		cond: cond, conseq: wrap(conseq), altern: wrap(altern),
		at: function(t, at) { 
			var c = at(this.cond, t);
			if (c >= 1) { 
				if (c.maker === Just) { this.become(this.conseq); }
				return at(this.conseq, t);
			}
			if (c <= 0) { 
				if (c.maker === Just) { this.become(this.altern); }
				return at(this.altern, t);
			}
			var con = at(this.conseq, t);
			var alt = at(this.altern, t);
			if (isNum(con) && isNum(alt)) { 
				return c*con + (1-c)*alt;
			}
			return new Proxy(this, handler);		// TODO: should be returning the outer proxy, not this
		},
		get: function(key) {
			return LERP(this.cond,
						this.conseq[key],
						this.altern[key]);
		},
		app: function(args) {
			return LERP(this.cond, 
						this.conseq.apply(this.conseq, args),
						this.altern.apply(this.altern, args));
		},
	}
}
function LERP() { return new Proxy(update(()=>null, Lerp.apply(null, arguments)), handler); }

function Js() {
	var args = Array.from(arguments);
	var pure = !!args[0];
	if (!pure) { args = args.slice(1); }
	return {
		maker: Js,
		cache: pure ? {t: null, val: null} : null,
		at: args[0] || noop,
		get: args[1] || noop,
		app: args[2] || noop,
	};
}
function JS() { return new Proxy(Js.apply(null, arguments), handler); }
TIME = JS(false, time);		// caching would waste time...

function App() { 
	var args = Array.from(arguments);
	var pure = !!args[0];
	if (!pure) { args = args.slice(1); }
	return { 
		maker: App,
		cache: pure ? {t: null, val: null} : null,
		f: args[0], args: args.slice(1).map(wrap),
		at: function(t, at) { 
			// console.log(this.f);
			// console.log(at(this.f, t));
			// var ret = this.f.apply(at(this.f, t), this.args.map(x => at(x, t)));
			// var f = at(this.f, t);
			var ret = this.f.apply(this.f, this.args.map(x => at(x, t)));
			// if (this.cache && this.args.every(x => x.maker === Just)) {
			// 	this.become(ret);
			// }
			return ret;
			// return at(ret, t);
		},
		get: function(key) {
			// TODO: ?
		},
		app: function(args) {
			// TODO: ?
		},
	};
}
function APP() { return new Proxy(update(()=>null, App.apply(null, arguments)), handler); }

function Frame(dt=1500, t0, t1) {
	t0 = t0 || time();
	t1 = t1 || t0 + dt;
	dt = dt || t1 - t0;
	return {
		maker: Frame,
		t0: t0, t1: t1, dt: dt,
		at: function(t, at) { 
			var t = time();
			if (t > this.t1) {
				this.become(ONE);
				return 1;
			}
			if (t < this.t0) { return 0; }
			return (t-this.t0)/this.dt; 
		},
		get: function(key) {
			// TODO: ?
		},
		app: function(args) {
			// TODO: ?
		},
	}
}
function FRAME() { return new Proxy(update(()=>null, Frame.apply(null, arguments)), handler); }

////

add 	= (x,y) => x+y;							
mul 	= (x,y) => x*y;							
sub 	= (x,y) => x-y;							
div 	= (x,y) => x/y;			
id 		= (x) => x;				
cubic	= (x) => x*x*(3-2*x);					
quint	= (x) => x*x*x*(6*x*x - 15*x + 10);		
eq		= (x,y) => x==y;					

////////

// x = APP(x=>x/1000, TIME);
// x = APP(add, TIME, TIME);
// x = APP(mul, x, x);
// x.target.args[1] = x
// x = LERP()
// x = wrap(add);
// console.log(x(4,5));

// x = LERP(0.5, 4, 5);
// // prog = APP(add, 4, 5);
// prog2 = APP(mul, prog, prog);
// console.log(prog2+0);

x = APP(LERP(0.5, add, mul), 2, 10);
console.log(x.valueOf());
// console.log(LERP(0.5, add, mul)(2, 10)+0);



