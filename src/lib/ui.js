import {Calculator} from './engine.js';

export function UI() {
	// The current expression string
	this.expressionStr = "";

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

		btn_eq.addEventListener("click", () => {
			this.solve();
		});
	}

	// Uses the calculator engine to solve an expression
	this.solve = function() {
		var calc = new Calculator();
		var expr = calc.toPostfix(this.expressionStr);
		var res = calc.calc(expr);
		this.expressionStr = res;
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
			default:
				this.expressionStr += op;
				break;
		}

		this.updateDisplay();
	}

	// Updates the display
	this.updateDisplay = function() {
		var display = document.querySelector("#output");
		display.innerHTML = this.expressionStr;
	}

}