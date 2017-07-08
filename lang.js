
var _TYPE = Symbol("_TYPE");
var _APP = Symbol("_APP");
var _VAR = Symbol("_VAR");
var _IF = Symbol("_IF");
var _FUNC = Symbol("_FUNC");
var _TIME = Symbol("_TIME");

var _TSENS = Symbol("_TSENS"); 		// time sensitive

// var INC = Symbol("INC"); 		// monotonically increasing function

function APP() { 
	var args = Array.from(arguments);
	ret = { f: args[0], args: args.slice(1) };
	ret[_TYPE] = _APP;
	return ret;
}
function VAR(name) { 
	ret = { name: name };
	ret[_TYPE] = _VAR;
	return ret;
}
function IF(cond, conseq, altern) { 
	ret = { cond: cond, conseq: conseq, altern: altern };
	ret[_TYPE] = _IF;
	return ret;
}
function FUNC(name, vars, body, env) { 
	ret = { name: name, vars: vars, body: body, env: env };
	ret[_TYPE] = _FUNC;
	return ret;
}
TIME = {};
TIME[_TYPE] = _TIME;

add 	= (x,y) => x+y;							
mul 	= (x,y) => x*y;							
sub 	= (x,y) => x-y;							
div 	= (x,y) => x/y;							
cubic	= (x) => x*x*(3-2*x);					
quint	= (x) => x*x*x*(6*x*x - 15*x + 10);		
eq		= (x,y) => x==y;						
// time 	= () => createjs.Ticker.getTime(true);

function extend(base, vars, args) {
	var extension = {};
	for (var i=0; i<vars.length; i++) {
		extension[vars[i]] = args[i];
	}
	extension.__proto__ = base;
	return extension;
}

////////

function run(x, env) {
	var env = env || {};
	switch (x[_TYPE]) {
		case _APP:
			var f = run(x.f, env);
			var args = x.args.map(arg => run(arg, env));
			if (f[_TYPE] === _FUNC) { 
				return run(f.body, extend(f.env, [f.name].concat(f.vars), [f].concat(args))); 
			}
			return f.apply(null, args);
		case _FUNC:
			return _FUNC(x.name, x.vars, x.body, env);
		case _VAR:
			return env[x.name];
		case _IF:
			var c = run(x.cond, env);
			if (c >= 1) { return run(x.conseq, env); }
			if (c <= 0) { return run(x.altern, env); }
			return c*run(x.conseq, env) + (1-c)*run(x.altern, env);
		case _TIME:
			return createjs.Ticker.getTime(true)/1000;
		default:
			return x;
	}
}

function pruneRun(x, env) {
	var env = env || {};
	var ret = x;
	switch (x[_TYPE]) {
		case _APP:
			var f = run(x.f, env);
			var args = x.args.map(arg => run(arg, env));
			if (f[_TYPE] === _FUNC) { 
				ret = run(f.body, extend(f.env, [f.name].concat(f.vars), [f].concat(args))); 
			} else {
				ret = f.apply(null, args);
			}
			x[_TSENS] = x.f[_TSENS] || x.args.some(_[_TSENS]);
			// // if f is pure and no args are expressions, replace x with the result
			// if (x.f[PURE] && x.args.every(arg => typeof arg[_TYPE] === "undefined")) {
			// 	clear(x, ret);
			// }
			break;
		case _FUNC:
			ret = _FUNC(x.name, x.vars, x.body, env);
			break;
		case _VAR:
			ret = env[x.name];
			break;
		case _IF:
			var c = run(x.cond, env);
			if (c >= 1) { 
				ret = run(x.conseq, env); 
				if (x.cond[_TYPE] === "undefined") { clear(x, x.conseq); }
			} else if (c <= 0) { 
				ret = run(x.altern, env); 
				if (x.cond[_TYPE] === "undefined") { clear(x, x.altern); }
			} else {
				ret = c*run(x.conseq, env) + (1-c)*run(x.altern, env);
			}
			break;
		case _TIME:
			ret = createjs.Ticker.getTime(true)/1000;
			break;
	}
	return ret;
}

////////

// var prog = _APP(_FUNC('f', ['x'], _APP(mul, _VAR('x'), _VAR('x'))), _APP(add, 4, 5));
var prog = IF(1, APP(add, 4, 5), 123);

// var prog = IF(APP(mul, APP(time), 0.001), 800, 200);
// console.log(JSON.stringify(prog));
console.log(prog);
console.log(pruneRun(prog));
console.log(prog);










