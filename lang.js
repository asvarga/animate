
class Node {
	constructor(type, rest) { 
		this.type = type;
		this.rest = Array.from(rest);
	}
}
function isNode(x) { return x instanceof Node; }

_APP 	= Symbol('APP');	APP 	= () => new Node(_APP 	, arguments);
_Q 		= Symbol('Q');		Q 		= () => new Node(_Q 	, arguments);
_VAR 	= Symbol('VAR');	VAR 	= () => new Node(_VAR	, arguments);
_IF		= Symbol('IF');		IF		= () => new Node(_IF	, arguments);
_LAMB 	= Symbol('LAMB');	LAMB	= () => new Node(_LAMB	, arguments);
_LERP 	= Symbol('LERP');	LERP	= () => new Node(_LERP	, arguments);
_LET	= Symbol('LET');	LET	 	= () => new Node(_LET	, arguments);

ADD 	= (x,y) => x+y;
MUL 	= (x,y) => x*y;



var test = LET('x', ADD(4, 5), MUL(VAR('x'), VAR('x')));

function interp(x, env) {
	var env = env || {};
	if (!isNode(x)) { return x; } 
	switch (x.type) {
		case _APP:
			var f = x.rest[0];
			var args = x.slice(1).map(arg => interp(arg, env));
			if (!isNode(f)) { return f.apply(null, args); }
			return interp(f, extend(env, _______))
			return 
	}
}

function extend(base, extension) {
	base = base || {};
	extension = extension || {};
	extension.__proto__ = base;
	return extension;
}

interp(test);



