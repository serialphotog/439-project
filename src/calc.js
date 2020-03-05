import {UI} from './lib/ui.js';

window.addEventListener("load", function init(event) {
	// Only run the initialization once
	window.removeEventListener(event.type, init, false);

	// Initialize the UI
	var Interface = new UI();
	Interface.initListeners();
}, false);