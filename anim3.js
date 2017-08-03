
function time() { return Math.round(createjs.Ticker.getTime(true)); }

var handler = {
	get: function(target, name, receiver) {
		switch (name) {
			case "target": 		return target;
			case "become": 		return function(obj) { clear(target, wrap(obj)); }
			case Symbol.toPrimitive: 	// ...
			case "toString": 			// ...
			case "valueOf": 	return () => _now(target);
			default: 			return maybe(target.get(target, name));
		}
	},
	apply: function(target, thisArg, argumentsList) {
		if (target.maker) {
			return maybe(target.app(target, argumentsList));
		}
		return target.apply(target, argumentsList);
	}
}

function _now(x, t) { 
	var cache = x.cache;
	t = t || time();
	if (cache) {
		if (cache.t != t) {
			// cache.val = 0;	cache.t = t;	// prevents infinite loops
			cache.val = x.at(x, t, now);
			cache.t = t;
		}
		return cache.val;
	}
	return x.at(x, t, now);
}
function now(x, t) { return x.target ? _now(x.target, t) : x; }
function at(x, t) { return x.target ? x.target.at(x.target, t, at) : x; }
function end(x) { return x.target ? x.target.at(x.target, Infinity, end) : x; }

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
NOTHING = new Proxy(Nothing(), handler);
noop = ()=>NOTHING;

function Just(x) { 
	return { 
		maker: Just,
		x: x, 
		at: function(me, t, at) { return me.x; },	// TODO: `return x;` makes things flash?
		get: function(me, key) { return me.x[key]; },
		app: function(me, args) { return me.x.apply(me.x, args); }
	};
}
function JUST() { return new Proxy(Just.apply(null, arguments), handler); }
ZERO = JUST(0); ONE = JUST(1); TWO = JUST(2); THREE = JUST(3); INF = JUST(Infinity);

function Lerp(cond, conseq, altern) { 
	return {
		maker: Lerp,
		cache: {t: null, val: null}, 
		cond: cond, conseq: wrap(conseq), altern: wrap(altern),
		at: function(me, t, at) { 
			var c = at(me.cond, t);
			if (c >= 1) { 
				if (c.maker === Just) { me.become(me.conseq); }
				return at(me.conseq, t);
			}
			if (c <= 0) { 
				if (c.maker === Just) { me.become(me.altern); }
				return at(me.altern, t);
			}
			var con = at(me.conseq, t);
			var alt = at(me.altern, t);
			if (isNum(con) && isNum(alt)) { 
				return c*con + (1-c)*alt;
			}
			return me;
		},
		get: function(me, key) {
			return LERP(me.cond,
						me.conseq[key],
						me.altern[key]);
		},
		app: function(me, args) {
			return LERP(me.cond, 
						me.conseq.apply(me.conseq, args),
						me.altern.apply(me.altern, args));
		},
	}
}
function LERP() { return new Proxy(Lerp.apply(null, arguments), handler); }

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
		at: function(me, t, at) { 
			console.log(me.f);
			var ret = me.f.apply(null, me.args.map(x => at(x, t)));
			if (me.cache && me.args.every(x => x.maker === Just)) {
				me.become(ret);
			}
			return at(ret, t);
		},
		get: function(me, key) {
			// TODO: ?
		},
		app: function(me, args) {
			// TODO: ?
		},
	};
}
function APP() { return new Proxy(App.apply(null, arguments), handler); }

function Frame(dt=1500, t0, t1) {
	t0 = t0 || time();
	t1 = t1 || t0 + dt;
	dt = dt || t1 - t0;
	return {
		maker: Frame,
		t0: t0, t1: t1, dt: dt,
		at: function(me, t, at) { 
			var t = time();
			if (t > me.t1) {
				me.become(ONE);
				return 1;
			}
			if (t < me.t0) { return 0; }
			return (t-me.t0)/me.dt; 
		},
		get: function(me, key) {
			// TODO: ?
		},
		app: function(me, args) {
			// TODO: ?
		},
	}
}
function FRAME() { return new Proxy(Frame.apply(null, arguments), handler); }

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
x = APP(add, TIME, TIME);
// x.target.args[1] = x
console.log(x);
// x = LERP()
// x = wrap(add);
// console.log(x(4,5));

// prog = LERP(0.5, 4, 5);
// // prog = APP(add, 4, 5);
// prog2 = APP(mul, prog, prog);
// console.log(prog2+0);





