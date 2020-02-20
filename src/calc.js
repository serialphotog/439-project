import {UI} from './lib/ui.js';

window.addEventListener("load", function init(event) {
	// Only run the initialization once
	window.removeEventListener(event.type, init, false);

	// Initialize the UI
	var Interface = new UI();
	Interface.initListeners();
}, false);

// Testing shit
/*var c = new Calculator();
var a = c.toPostfix("5 + 3");
console.log(a);
console.log("Soliving...");
var res = c.calc(a);
console.log(res);*/