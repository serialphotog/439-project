import {Calculator} from './engine.js';

export function UI() {
	// The current expression string
	this.expressionStr = "";

	// Tracks if the display is set to a result
	this.displayingResult = false;

	// Initializes the UI event listeners
	this.initListeners = function() {
		// Load the buttons
		var btn_ac = document.querySelector("#btn_ac");
		var btn_del = document.querySelector("#btn_del");
		var btn_div = document.querySelector("#btn_div");
		var btn_one = document.querySelector("#btn_one");
		var btn_two = document.querySelector("#btn_two");
		var btn_three = document.querySelector("#btn_three");
		var btn_mul = document.querySelector("#btn_mul");
		var btn_four = document.querySelector("#btn_four");
		var btn_five = document.querySelector("#btn_five");
		var btn_six = document.querySelector("#btn_six");
		var btn_plus = document.querySelector("#btn_plus");
		var btn_seven = document.querySelector("#btn_seven");
		var btn_eight = document.querySelector("#btn_eight");
		var btn_nine = document.querySelector("#btn_nine");
		var btn_min = document.querySelector("#btn_min");
		var btn_dec = document.querySelector("#btn_dec");
		var btn_zero = document.querySelector("#btn_zero");
		var btn_eq = document.querySelector("#btn_equ");
		var btn_sin = document.querySelector("#btn_sin");
        var btn_cos = document.querySelector("#btn_cos");
        var btn_tan = document.querySelector("#btn_tan");
        var btn_log = document.querySelector("#btn_log");
        var btn_pi = document.querySelector("#btn_pi");
        var btn_sqrt = document.querySelector("#btn_sqrt");
        var btn_factorial = document.querySelector("#btn_factorial");
        var btn_lparen = document.querySelector("#btn_lparen");
        var btn_rparen = document.querySelector("#btn_rparen");
        var btn_squared = document.querySelector("#btn_squared");
        var btn_power = document.querySelector("#btn_power");
        var btn_cube = document.querySelector("#btn_cube");

		// Add the listeners
		btn_ac.addEventListener("click", () => {
			this.updateExpression("AC");
		});
		btn_del.addEventListener("click", () => {
			this.updateExpression("DEL");
		});
		btn_div.addEventListener("click", () => {
			this.updateExpression("/");
		});
		btn_one.addEventListener("click", () => {
			this.updateExpression("1");
		});
		btn_two.addEventListener("click", () => {
			this.updateExpression("2");
		});
		btn_three.addEventListener("click", () => {
			this.updateExpression("3");
		});
		btn_mul.addEventListener("click", () => {
			this.updateExpression("*");
		});
		btn_four.addEventListener("click", () => {
			this.updateExpression("4");
		});
		btn_five.addEventListener("click", () => {
			this.updateExpression("5");
		});
		btn_six.addEventListener("click", () => {
			this.updateExpression("6");
		});
		btn_plus.addEventListener("click", () => {
			this.updateExpression("+");
		});
		btn_seven.addEventListener("click", () => {
			this.updateExpression("7");
		});
		btn_eight.addEventListener("click", () => {
			this.updateExpression("8");
		});
		btn_nine.addEventListener("click", () => {
			this.updateExpression("9");
		});
		btn_dec.addEventListener("click", () => {
			this.updateExpression(".");
		});
		btn_min.addEventListener("click", () => {
			this.updateExpression("-");
		});
		btn_zero.addEventListener("click", () => {
			this.updateExpression("0");
		});

		// Click handlers for mathematical functions
		btn_eq.addEventListener("click", () => {
			this.solve();
		});
		btn_sin.addEventListener("click", () => {
            this.updateExpression("sin(");
        });
        btn_cos.addEventListener("click", () => {
            this.updateExpression("cos(");
        });
        btn_tan.addEventListener("click", () => {
            this.updateExpression("tan(");
        });
        btn_pi.addEventListener("click", () => {
            this.updateExpression("&pi;");
        });
        btn_sqrt.addEventListener("click", () => {
            this.updateExpression("sqrt(");
        });
        btn_log.addEventListener("click", () => {
            this.updateExpression("log(");
        });
        btn_factorial.addEventListener("click", () => {
        	this.updateExpression("!");
        });
        btn_lparen.addEventListener("click", () => {
        	this.updateExpression("(");
        });
        btn_rparen.addEventListener("click", () => {
        	this.updateExpression(")");
        });
        btn_squared.addEventListener("click", () => {
        	this.updateExpression("^2");
        });
        btn_cube.addEventListener("click", () => {
        	this.updateExpression("^3");
        })
        btn_power.addEventListener("click", () => {
        	this.updateExpression("^");
        });
	}

	// Uses the calculator engine to solve an expression
	this.solve = function() {
		var calc = new Calculator();
		var expr = calc.toPostfix(this.expressionStr);
		var res = calc.calc(expr);
		this.expressionStr = res;
		this.displayingResult = true;
		this.updateDisplay();
	}

	// Updates the expression
	this.updateExpression = function(op) {
		switch (op) {
			case "AC":
				this.expressionStr = "";
				break;
			case "DEL": 
				if (this.expressionStr != null)
					this.expressionStr = this.expressionStr.substring(0, this.expressionStr.length - 1);
				break;
			case "+":
			case "*":
			case "/":
			case "-":
				this.expressionStr += op;
				break;
			default:
				if (this.displayingResult)
					this.expressionStr = "";
				this.expressionStr += op;
				break;
		}

		this.displayingResult = false;
		this.updateDisplay();
	}

	// Updates the display
	this.updateDisplay = function() {
		var display = document.querySelector("#output");
		display.innerHTML = this.expressionStr;
	}

	this.handleKeyPress = function(e) {
		switch (e.code) {
			case "Numpad0":
			case "Digit0":
				if (e.shiftKey)
					this.updateExpression(")");
				else
					this.updateExpression(0);
				break;
			case "Numpad1":
			case "Digit1":
				this.updateExpression(1);
				break;
			case "Numpad2":
			case "Digit2":
				this.updateExpression(2);
				break;
			case "Numpad3":
			case "Digit3":
				this.updateExpression(3);
				break;
			case "Numpad4":
			case "Digit4":
				this.updateExpression(4);
				break;
			case "Numpad5":
			case "Digit5":
				this.updateExpression(5);
				break;
			case "Numpad6":
			case "Digit6":
				this.updateExpression(6);
				break;
			case "Numpad7":
			case "Digit7":
				this.updateExpression(7);
				break;
			case "Numpad8":
			case "Digit8":
				this.updateExpression(8);
				break;
			case "Numpad9":
			case "Digit9":
				if (e.shiftKey)
					this.updateExpression("(");
				else
					this.updateExpression(9);
				break;
			case "Escape":
				this.updateExpression("AC");
				break;
			case "Backspace":
				this.updateExpression("DEL");
				break;
			case "Slash":
			case "NumpadDivide":
				this.updateExpression("/");
				break;
			case "Minus":
			case "NumpadSubtract":
				this.updateExpression("-");
				break;
			case "NumpadAdd":
				this.updateExpression("+");
				break;
			case "NumpadMultiply":
				this.updateExpression("*");
				break;
			case "NumpadEnter":
				this.solve();
				break;
			case "Equal":
				if (e.shiftKey)
					this.updateExpression("+");
				else
					this.solve();
				break;
		}	
	}

}