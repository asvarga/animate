
class App {
	constructor(all) {
		this.f = all[0];
		this.args = all.slice(1);
	}
}
function APP() { return new App(Array.from(arguments)); }

class Var {
	constructor(name) {
		this.name = name;
	}
}
function VAR(name) { return new Var(name); }

class If {
	constructor(cond, conseq, altern) {
		this.cond = cond;
		this.conseq = conseq;
		this.altern = altern;
	}
}
function IF(cond, conseq, altern) { return new If(cond, conseq, altern); }

class Func {
	constructor(name, vars, body, env) {
		this.name = name;
		this.vars = vars;
		this.body = body;
		if (env) { this.env = env; }
	}
}
function FUNC(name, vars, body, env) { return new Func(name, vars, body, env); }

add 	= (x,y) => x+y;
mul 	= (x,y) => x*y;
sub 	= (x,y) => x-y;
div 	= (x,y) => x/y;
quint	= (x) => x*x*x*(6*x*x - 15*x + 10);
eq		= (x,y) => x==y;
time 	= () => createjs.Ticker.getTime(true);

function extend(base, vars, args) {
	var extension = {};
	for (var i=0; i<vars.length; i++) {
		extension[vars[i]] = args[i];
	}
	extension.__proto__ = base;
	return extension;
}

////////

function interp(x, env) {
	var env = env || {};
	if (x instanceof App) {
		var f = interp(x.f, env);
		var args = x.args.map(arg => interp(arg, env));
		if (f instanceof Func) { 
			return interp(f.body, extend(f.env, [f.name].concat(f.vars), [f].concat(args))); 
		}
		return f.apply(null, args);
	} else if (x instanceof Func) {
		return FUNC(x.name, x.vars, x.body, env);
	} else if (x instanceof Var) {
		return env[x.name];
	} else if (x instanceof If) {
		var c = interp(x.cond, env);
		if (c >= 1) { return interp(x.conseq, env); }
		if (c <= 0) { return interp(x.altern, env); }
		return c*interp(x.conseq, env) + (1-c)*interp(x.altern, env);
	}
	return x;
}

function interp2(x, env) {
	var env = env || {};
	if (x instanceof App) {
		var f = interp2(x.f, env);
		var args = x.args.map(arg => interp2(arg, env));
		if (f instanceof Func) { 
			return interp2(f.body, extend(f.env, [f.name].concat(f.vars), [f].concat(args))); 
		}
		return f.apply(null, args);
	} else if (x instanceof Func) {
		return FUNC(x.name, x.vars, x.body, env);
	} else if (x instanceof Var) {
		return env[x.name];
	} else if (x instanceof If) {
		var c = interp2(x.cond, env);
		if (c >= 1) { return interp2(x.conseq, env); }
		if (c <= 0) { return interp2(x.altern, env); }
		return c*interp2(x.conseq, env) + (1-c)*interp2(x.altern, env);
	}
	return x;
}


// TODO: make Frame a new type for easier pruning


////////

// var prog = APP(FUNC('f', ['x'], APP(mul, VAR('x'), VAR('x'))), APP(add, 4, 5));
// var prog = APP(add, 4, 5);
var prog = IF(APP(mul, APP(time), 0.001), 800, 200);
console.log(interp(prog));
console.log(JSON.stringify(prog));










