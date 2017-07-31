
function time() { return createjs.Ticker.getTime(true); }

var handler = {
	get: function(target, name, receiver) {
		switch (name) {
			case "target": return target;
			case "become": return function(obj) { clear(target, wrap(obj)); }
			case Symbol.toPrimitive: 	// ...
			case "toString": 			// ...
			case "valueOf":
				if (target.maker) {
					if (target.cache) {
						var t = time();
						if (target.cache.t != t) {
							target.cache = {t: t, at: wrap(target.val(target))};
						}
						return target.cache.val;
					}
					return wrap(target.val(target));
				}
				return target[name];	
			default:
				if (target.maker) { return wrap(target.get(name)); }
				return target[name];
		}
	},
	apply: function(target, thisArg, argumentsList) {
		if (target.maker) {
			return wrap(target.app(target, argumentsList));
		}
		return target.apply(target, argumentsList);
	}
}

function at(x, t) 	{ return x.maker ? x.at : x; }
function now(x) 	{ return at(x, time); }
function end(x) 	{ return at(x, Infinity); }

// function destiny(x) {
// 	if (not(x)) { return x; }
// 	var target = x.target;
// 	if (!not(target) && target.maker === "Lerp") { return destiny(target.conseq); }
// 	return x.valueOf();
// }

// TODO: are these both necessary/correct?
function wrap(x) {
	if (x.maker) { return x; }
	if (not(x)) { return NOTHING; }
	return JUST(x);
}
// function maybe(x) {
// 	return not(x) ? NOTHING : x;
// }

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
		at: function(me, t) { return me.x; },	// TODO: `return x;` makes things flash?
		get: function(me, key) { return me.x[key]; },
		app: function(me, args) { return me.x.apply(me.x, args); }
	};
}
function JUST() { return new Proxy(Just.apply(null, arguments), handler); }
ZERO = JUST(0); ONE = JUST(1); TWO = JUST(2); THREE = JUST(3); INF = JUST(Infinity);

/*



REPLACE VALUEOF WITH AT


*/



function Lerp(cond, conseq, altern) { 
	return {
		maker: Lerp,
		cache: {t: null, at: null}, 
		cond: wrap(cond), conseq: wrap(conseq), altern: wrap(altern),
		at: function(me, t) { 
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
		pure: pure, cache: pure ? {t: null, at: null} : null,
		at: args[0] || noop,
		get: args[1] || noop,
		app: args[2] || noop,
	};
}
function JS() { return new Proxy(Js.apply(null, arguments), handler); }
TIME = JS(time);

function App() { 
	var args = Array.from(arguments);
	var pure = !!args[0];
	if (!pure) { args = args.slice(1); }
	return { 
		maker: App,
		pure: pure, cache: pure ? {t: null, at: null} : null,
		f: args[0], args: args.slice(1).map(wrap),
		at: function(me, t) { 
			var ret = me.f.apply(null, me.args.map(x => x.valueOf()));
			if (me.pure && me.args.every(x => x.maker === Just)) {
				me.become(ret);
			}
			return ret.valueOf();
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
		at: function(me, t) { 
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

// prog = LERP(0.5, 4, 5);
// // prog = APP(add, 4, 5);
// prog2 = APP(mul, prog, prog);
// console.log(prog2+0);





