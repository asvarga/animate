
console.log(new Lerp(200, 800));
console.log(new Lerp(200, 800, 2));
console.log(new Lerp(200, 800, null, null, 4));
console.log(new Lerp(200, 800, null, 1, 4));

//

class PlusN {
	constructor(N) {
		this.N = N;
	}
	plusn(x) {
		return x+this.N;
	}
}

var handler = {
	get: function(target, name) {
		var gotten = target[name];
		return function() {
			console.log(gotten);
			console.log(Array.from(arguments));
			return gotten.apply(target, arguments);
		}
	}
}

var p = new Proxy(new PlusN(5), handler);
console.log(p.plusn(10));

//

function pair(v0, v1) {
	class Pair {
		constructor(v0, v1) {
			this.v0 = v0;
			this.v1 = v1;
		}
	}
	var handler = {								// proxy handler traps all gets
		get: function(target, name) {
			var gotten0 = target.v0[name];		// might want to defer this?
			var gotten1 = target.v1[name];
			return function() {
				// console.log(gotten0);
				// console.log(Array.from(arguments));
				// console.log(gotten1);
				// console.log(Array.from(arguments));
				return new Proxy(new Pair(gotten0.apply(target.v0, arguments), 
										  gotten1.apply(target.v1, arguments)), handler);
			}
		}
	}
	return new Proxy(new Pair(v0, v1), handler);
}

//

var f = new Frame(null, 10, 20);
console.log(f.progress(3));
console.log(f.progress(13));
console.log(f.progress(23));

//

			// var gotten0 = target.v0[name];		// might want to defer this?
			// var gotten1 = target.v1[name];

			// // CAN GREATLY SIMPLIFY THIS BY ALSO TRAPPING APPLICATION
			// if (typeof gotten0 === "function") {
			// 	return function() {
			// 		return lerp(gotten0.apply(target.v0, arguments), 
			// 					gotten1.apply(target.v1, arguments), target.frame);
			// 	}
			// } else {
			// 	return lerp(gotten0, gotten1, target.frame);
			// }

	// var f = new Frame(null, 1000, 4000);
	// var g = new Frame(null, 2000, 5000);
	// var h = new Frame(null, 3000, 6000);
	// var A = new Point(200, 200);
	// var B = new Point(800, 200);
	// var C = new Point(800, 800);
	// var D = new Point(200, 800);
	// L = lerp(A, C, f);
	// L = lerp(A, lerp(B, lerp(C, D, h), g), f);
	// L = lerp(200, lerp(800, 200, f), f);







