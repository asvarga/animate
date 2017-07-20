
var VAL = Symbol('VAL');
function Ptr(thing) {
	var wrapped = ()=>null;
	wrapped.thing = thing;
	return new Proxy(wrapped, {
		get: function(target, name, receiver) { 
			if (name === VAL) {
				return target.thing;
			} else if (name === 'valueOf' || name === Symbol.toPrimitive) {
				console.log(target);
				return ()=>target.thing.valueOf();
			} else {
				return target.thing[name];
			}
		},
		set: function(target, name, value, receiver) {
			if (name === VAL) {
				target.thing = value;
			} else {
				target.thing[name] = value;
			}
		},
		apply: function(target, thisArg, argumentsList) {
			return target.thing.apply(thisArg, argumentsList);
  		}
	});
}

// x = Ptr(5);
// console.log(x);
// console.log(x+10);
// console.log(x[VAL]);
// x[VAL] = 6;
// console.log(x);
// console.log(x+10);
// console.log(x[VAL]);
// x[VAL] += 100;
// console.log(x);
// console.log(x+10);
// console.log(x[VAL]);

// add = (x,y)=>x+y;
// console.log(add(3,4));
// padd = Ptr(add);
// console.log(padd(3,4));

class Multi extends Function {}

class Nothing extends Multi {
	// constuctor() {
	// 	this.valueOf = ()=>0;
	// 	this[Symbol.toPrimitive]
	// }
	valueOf() { return 0; }
}
NOTHING = new Proxy(new Nothing(), {
	get: function() { return NOTHING; },
	apply: function() { return NOTHING; }
});
P_NOTHING = Ptr(NOTHING);

// class Just extends Multi {
// 	constuctor(val) {
// 		super();
// 		this.val
// 	}
// }

// console.log(P_NOTHING);
console.log(P_NOTHING[2] === NOTHING);
// console.log(P_NOTHING(3));
// console.log(P_NOTHING(3,4,5)[6]);
// console.log(P_NOTHING(3,4,5)[6]+10);







