!function r(c,a,o){function u(t,e){if(!a[t]){if(!c[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(p)return p(t,!0);var s=new Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}var i=a[t]={exports:{}};c[t][0].call(i.exports,function(e){return u(c[t][1][e]||e)},i,i.exports,r,c,a,o)}return a[t].exports}for(var p="function"==typeof require&&require,e=0;e<o.length;e++)u(o[e]);return u}({1:[function(e,t,n){"use strict";var s=e("./lib/ui.js");window.addEventListener("load",function e(t){window.removeEventListener(t.type,e,!1);var n=new s.UI;n.initListeners(),document.addEventListener("keyup",function(e){n.handleKeyPress(e)})},!1)},{"./lib/ui.js":3}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.Calculator=function(){function o(e){return e<0?-1:0==e?1:e*o(e-1)}this.toPostfix=function(e){var t="",n=[],s={"^":{precedence:4,associativity:"right"},"!":{precedence:4,associativity:"right"},"/":{precedence:3,associativity:"left"},"*":{precedence:3,associativity:"left"},"+":{precedence:2,associativity:"left"},"-":{precedence:2,associativity:"left"}};e=(e=(e=e.replace(/&pi;/,Math.PI)).replace(/\s+/g,"")).split(/([\+\-\*\/\^\(\)\!])/).clean();for(var i=0;i<e.length;i++){var r=e[i];if("sqrt"==r?n.push("sqrt("):"sin"==r?n.push("sin("):"cos"==r?n.push("cos("):"tan"==r?n.push("tan("):"log"==r&&n.push("log("),r.isNumeric())t+=r+" ";else if(-1!=="^*/+-!".indexOf(r)){for(var c=r,a=n[n.length-1];-1!=="^*/+-!".indexOf(a)&&("left"==s[c].associativity&&s[c].precedence<=s[a].precedence||"right"==s[c].associativity&&s[a].precedence<s[a].precedence);)t+=n.pop()+" ",a=n[n.length-1];n.push(c)}else if("("==r)n.push(r);else if(")"==r){for(;"("!==n[n.length-1];)t+=n.pop()+" ";n.pop()}}for(;0<n.length;)t+=n.pop()+" ";return t},this.calc=function(e){var t,n,s=[];e=e.split(" ").clean();for(var i=0;i<e.length;i++)if(e[i].isNumeric())s.push(e[i]);else{var r=s.pop(),c=s.pop();"+"===e[i]?s.push(parseFloat(r)+parseFloat(c)):"-"===e[i]?s.push(parseFloat(c)-parseFloat(r)):"*"===e[i]?s.push(parseFloat(r)*parseFloat(c)):"/"===e[i]?s.push(parseFloat(c)/parseFloat(r)):"^"===e[i]?s.push(Math.pow(parseFloat(c),parseFloat(r))):"!"==e[i]?s.push(o(r)):"sqrt("==e[i]?s.push(Math.sqrt(r)):"sin("==e[i]?s.push(Math.sin(r*Math.PI/180)):"cos("==e[i]?s.push(Math.cos(r*Math.PI/180)):"tan("==e[i]?s.push(Math.tan(r*Math.PI/180)):"log("==e[i]&&s.push((t=r,n=10,Math.log(t)/Math.log(n)))}if(1<s.length)return"Syntax Error";var a=s.pop();return"NaN"!=a&&!isNaN(a)||(a="Syntax Error!"),a}},String.prototype.isNumeric=function(){return!isNaN(parseFloat(this))&&isFinite(this)},Array.prototype.clean=function(){for(var e=0;e<this.length;e++)""===this[e]&&this.splice(e,1);return this}},{}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.UI=function(){this.expressionStr="",this.displayingResult=!1,this.initListeners=function(){var e=this,t=document.querySelector("#btn_ac"),n=document.querySelector("#btn_del"),s=document.querySelector("#btn_div"),i=document.querySelector("#btn_one"),r=document.querySelector("#btn_two"),c=document.querySelector("#btn_three"),a=document.querySelector("#btn_mul"),o=document.querySelector("#btn_four"),u=document.querySelector("#btn_five"),p=document.querySelector("#btn_six"),d=document.querySelector("#btn_plus"),l=document.querySelector("#btn_seven"),h=document.querySelector("#btn_eight"),E=document.querySelector("#btn_nine"),f=document.querySelector("#btn_min"),x=document.querySelector("#btn_dec"),v=document.querySelector("#btn_zero"),y=document.querySelector("#btn_equ"),b=document.querySelector("#btn_sin"),m=document.querySelector("#btn_cos"),k=document.querySelector("#btn_tan"),S=document.querySelector("#btn_log"),q=document.querySelector("#btn_pi"),g=document.querySelector("#btn_sqrt"),L=document.querySelector("#btn_factorial"),_=document.querySelector("#btn_lparen"),N=document.querySelector("#btn_rparen"),D=document.querySelector("#btn_squared"),M=document.querySelector("#btn_power"),w=document.querySelector("#btn_cube");t.addEventListener("click",function(){e.updateExpression("AC")}),n.addEventListener("click",function(){e.updateExpression("DEL")}),s.addEventListener("click",function(){e.updateExpression("/")}),i.addEventListener("click",function(){e.updateExpression("1")}),r.addEventListener("click",function(){e.updateExpression("2")}),c.addEventListener("click",function(){e.updateExpression("3")}),a.addEventListener("click",function(){e.updateExpression("*")}),o.addEventListener("click",function(){e.updateExpression("4")}),u.addEventListener("click",function(){e.updateExpression("5")}),p.addEventListener("click",function(){e.updateExpression("6")}),d.addEventListener("click",function(){e.updateExpression("+")}),l.addEventListener("click",function(){e.updateExpression("7")}),h.addEventListener("click",function(){e.updateExpression("8")}),E.addEventListener("click",function(){e.updateExpression("9")}),x.addEventListener("click",function(){e.updateExpression(".")}),f.addEventListener("click",function(){e.updateExpression("-")}),v.addEventListener("click",function(){e.updateExpression("0")}),y.addEventListener("click",function(){e.solve()}),b.addEventListener("click",function(){e.updateExpression("sin(")}),m.addEventListener("click",function(){e.updateExpression("cos(")}),k.addEventListener("click",function(){e.updateExpression("tan(")}),q.addEventListener("click",function(){e.updateExpression("&pi;")}),g.addEventListener("click",function(){e.updateExpression("sqrt(")}),S.addEventListener("click",function(){e.updateExpression("log(")}),L.addEventListener("click",function(){e.updateExpression("!")}),_.addEventListener("click",function(){e.updateExpression("(")}),N.addEventListener("click",function(){e.updateExpression(")")}),D.addEventListener("click",function(){e.updateExpression("^2")}),w.addEventListener("click",function(){e.updateExpression("^3")}),M.addEventListener("click",function(){e.updateExpression("^")})},this.solve=function(){var e=new s.Calculator,t=e.toPostfix(this.expressionStr),n=e.calc(t);this.expressionStr=n,this.displayingResult=!0,this.updateDisplay()},this.updateExpression=function(e){switch(e){case"AC":this.expressionStr="";break;case"DEL":null!=this.expressionStr&&(this.expressionStr=this.expressionStr.substring(0,this.expressionStr.length-1));break;case"+":case"*":case"/":case"-":this.expressionStr+=e;break;default:this.displayingResult&&(this.expressionStr=""),this.expressionStr+=e}this.displayingResult=!1,this.updateDisplay()},this.updateDisplay=function(){document.querySelector("#output").innerHTML=this.expressionStr},this.handleKeyPress=function(e){switch(e.code){case"Numpad0":case"Digit0":e.shiftKey?this.updateExpression(")"):this.updateExpression(0);break;case"Numpad1":case"Digit1":this.updateExpression(1);break;case"Numpad2":case"Digit2":this.updateExpression(2);break;case"Numpad3":case"Digit3":this.updateExpression(3);break;case"Numpad4":case"Digit4":this.updateExpression(4);break;case"Numpad5":case"Digit5":this.updateExpression(5);break;case"Numpad6":case"Digit6":this.updateExpression(6);break;case"Numpad7":case"Digit7":this.updateExpression(7);break;case"Numpad8":case"Digit8":this.updateExpression(8);break;case"Numpad9":case"Digit9":e.shiftKey?this.updateExpression("("):this.updateExpression(9);break;case"Escape":this.updateExpression("AC");break;case"Backspace":this.updateExpression("DEL");break;case"Slash":case"NumpadDivide":this.updateExpression("/");break;case"Minus":case"NumpadSubtract":this.updateExpression("-");break;case"NumpadAdd":this.updateExpression("+");break;case"NumpadMultiply":this.updateExpression("*");break;case"NumpadEnter":this.solve();break;case"Equal":e.shiftKey?this.updateExpression("+"):this.solve()}}};var s=e("./engine.js")},{"./engine.js":2}]},{},[1]);
//# sourceMappingURL=calc.js.map
