/**
 * Checks is a string represents a numeric value.
 */
String.prototype.isNumeric = function() {
	return !isNaN(parseFloat(this)) && isFinite(this);
}

/**
 * Cleans empty items from an array.
 */
Array.prototype.clean = function() {
	for (var i=0; i < this.length; i++) {
		if (this[i] === "") {
			this.splice(i, 1);
		}
	}

	return this;
}

export function Calculator() {

	// Converts an infix expression to postfix
	// This is using the Shunting Yard Algorithm
	this.toPostfix = function(expression) {
		var out = ""; // The output queue
		var stack = []; // The operators stack

		// Opeartor definitions
		var operators = {
			"^": {
				precedence: 4,
				associativity: "right"
			},

			"!": {
				precedence: 4,
				associativity: "right"
			},

			"/": {
				precedence: 3,
				associativity: "left"
			}, 

			"*": {
				precedence: 3,
				associativity: "left"
			},

			"+": {
				precedence: 2,
				associativity: "left"
			},

			"-": {
				precedence: 2,
				associativity: "left"
			}
		}

		// Find and replace constants
		expression = expression.replace(/&pi;/, Math.PI);

		// Removes one or more occurences of whitespace globally
		expression = expression.replace(/\s+/g, "");
		// Searches for operators and splits the expression on them
		expression = expression.split(/([\+\-\*\/\^\(\)\!])/).clean();

		// Parse the expression
		for (var i=0; i < expression.length; i++) {
			var token = expression[i];

			if (token == "sqrt") {
				stack.push("sqrt(");
			} else if (token == "sin") {
				stack.push("sin(");
			} else if (token == "cos") {
				stack.push("cos(");
			} else if (token == "tan") {
				stack.push("tan(");
			} else if (token == "log") {
				stack.push("log(");
			}

			if (token.isNumeric()) {
				out += token + " ";
			} else if ("^*/+-!".indexOf(token) !== -1) {
				// This is an operator token
				var a = token;
				var b = stack[stack.length - 1];

				while ("^*/+-!".indexOf(b) !== -1 && ((operators[a].associativity == "left" && operators[a].precedence <= operators[b].precedence) || 
					operators[a].associativity == "right" && operators[b].precedence < operators[b].precedence)) {
					out += stack.pop() + " ";
					b = stack[stack.length - 1];
				}

				stack.push(a);
			} else if (token == "(") {
				stack.push(token);
			} else if (token == ")") {
				while (stack[stack.length - 1] !== "(") {
					out += stack.pop() + " ";
				}

				stack.pop();
			}
		}

		while (stack.length > 0) {
			out += stack.pop() + " ";
		}

		return out;
	}

	function factorialize(num) {
		if (num < 0)
			return -1;
		else if (num == 0)
			return 1;
		else 
			return (num * factorialize(num - 1));
	}

	function logBaseN(num, base) {
		return Math.log(num) / Math.log(base);
	}

	// Given an expression in postifx, solve it
	this.calc = function(postfix) {
		var stack = []; // The result stack

		// Split the postfix on spaces
		postfix = postfix.split(" ").clean();

		// Solve it!
		for (var i=0; i < postfix.length; i++) {
			if (postfix[i].isNumeric()) {
				stack.push(postfix[i]);
			} else { // Operator
				var a = stack.pop();
				var b = stack.pop();

				if (postfix[i] === "+") {
					stack.push(parseFloat(a) + parseFloat(b));
				} else if (postfix[i] === "-") {
					stack.push(parseFloat(b) - parseFloat(a));
				} else if (postfix[i] === "*") {
					stack.push(parseFloat(a) * parseFloat(b));
				} else if (postfix[i] === "/") {
					stack.push(parseFloat(b) / parseFloat(a));
				} else if (postfix[i] === "^") {
					stack.push(Math.pow(parseFloat(b), parseFloat(a)));
				} else if (postfix[i] == "!") {
					stack.push(factorialize(a));
				} else if (postfix[i] == "sqrt(") {
					stack.push(Math.sqrt(a));
				} else if (postfix[i] == "sin(") {
					stack.push(Math.sin(a * Math.PI / 180.0));
				} else if (postfix[i] == "cos(") {
					// Fix for a bug in the way JS calculates the cosine of 90
					if (a == 90)
						stack.push(1);
					else
						stack.push(Math.cos(a * Math.PI / 180.0));
				} else if (postfix[i] == "tan(") {
					// Deal with the edge case of tangent of 90
					if (a == 90)
						stack.push(Infinity);
					else
						stack.push(Math.tan(a * Math.PI / 180.0));
				} else if (postfix[i] == "log(") {
					stack.push(logBaseN(a, 10));
				}
			}
		}

		if (stack.length > 1) {
			return "Syntax Error";
		} else {
			var res = stack.pop();
			if (res == "NaN" || isNaN(res))
				res = "Syntax Error!";
			else if (res == "Infinity")
				res = "&#8734;";
			return res.toString();
		}
	}

}