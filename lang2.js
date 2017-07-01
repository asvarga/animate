
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
	}
	return x;
}

function extend(base, vars, args) {
	var extension = {};
	for (var i=0; i<vars.length; i++) {
		extension[vars[i]] = args[i];
	}
	extension.__proto__ = base;
	return extension;
}

////////

var test = APP(FUNC('f', ['x'], APP(mul, VAR('x'), VAR('x'))), APP(add, 4, 5));
// var test = APP(add, 4, 5);
console.log(interp(test));











