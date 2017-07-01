
function load() {
	this.document.onkeydown = function(evt) {
		// console.log(event.keyCode);

	};
	
}

function total(L) {
	return isObj(L) ? L.map(total).reduce((a,b)=>a+b, 0) : L;
}



