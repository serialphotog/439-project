import {Calculator} from './lib/engine.js';

// Testing shit
var c = new Calculator();
var a = c.toPostfix("5 + 3");
console.log(a);
console.log("Soliving...");
var res = c.calc(a);
console.log(res);