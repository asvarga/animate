
_ = new Proxy(() => 0, {
	get:   function(t, name) { return (x) => x[name] },
	apply: function(t, thisArg, args) { return (x) => x.apply(thisArg, args) },
});

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function isObj(x) { return x !== null && typeof x === 'object'; }
function isDef(x) { return typeof x !== 'undefined'; }
function isNum(x) { return !isNaN(parseFloat(x)) && isFinite(x); }

function clear(obj, obj2) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			delete obj[key];
		}
	}
	for (var key in obj2) {
		if (obj2.hasOwnProperty(key)) {
			obj[key] = obj2[key];
		}
	}
	return obj;
}

function randColor() {
	return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function not(x) {
	return x === null || x === undefined;
}
