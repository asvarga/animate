

/*

TODO:
- make val a symbol
- make everything a node
- automatically call valueOf() because everything's a node

*/

class Node {}

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
	return { 
		cache: {t: null, val: null}, 
		f: args[0], args: args.slice(1).map(VAL),
		valueOf: function() { 
			var t = time();
			if (this.cache.t != t) {
				// console.log(this.f);
				this.cache = { t: t, val: this.f.apply(null, this.args) };
			}
			return this.cache.val;
		}
	};
}
function APP() { return clear(new Node(), App.apply(null, arguments)); }

function Frame(dt=1500, t0, t1) {
	t0 = t0 || createjs.Ticker.getTime(true);
	t1 = t1 || this.t0 + dt;
	dt = dt || this.t1 - this.t0;
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

function If(cond, conseq, altern) { 
	return {
		cond: cond, conseq: conseq, altern: altern,
		valueOf: function() { 
			var c = cond.valueOf();
			if (c >= 1) { return this.conseq; }
			if (c <= 0) { return this.altern; }
			return c*this.conseq + (1-c)*this.altern;
		}
	}
}
function IF() { return clear(new Node(), If.apply(null, arguments)); }

function time() { return createjs.Ticker.getTime(true); }
TIME = clear(new Node(), { valueOf: time });

add 	= (x,y) => x+y;							
mul 	= (x,y) => x*y;							
sub 	= (x,y) => x-y;							
div 	= (x,y) => x/y;							
cubic	= (x) => x*x*(3-2*x);					
quint	= (x) => x*x*x*(6*x*x - 15*x + 10);		
eq		= (x,y) => x==y;						

////////


// // var prog = _APP(_FUNC('f', ['x'], _APP(mul, _VAR('x'), _VAR('x'))), _APP(add, 4, 5));
// var prog = IF(1, APP(add, 4, 5), 123);

// // var prog = IF(APP(mul, APP(time), 0.001), 800, 200);
// // console.log(JSON.stringify(prog));
// console.log(prog);
// console.log(pruneRun(prog));
// console.log(prog);


// prog = APP(add, 4, 5);
// prog2 = APP(mul, prog, prog);
// console.log(prog2+0);







