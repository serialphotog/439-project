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

		// Removes one or more occurences of whitespace globally
		expression = expression.replace(/\s+/g, "");
		// Searches for operators and splits the expression on them
		expression = expression.split(/([\+\-\*\/\^\(\)])/).clean();

		// Parse the expression
		for (var i=0; i < expression.length; i++) {
			var token = expression[i];

			if (token.isNumeric()) {
				out += token + " ";
			} else if ("^*/+-".indexOf(token) !== -1) {
				// This is an operator token
				var a = token;
				var b = stack[stack.length - 1];

				while ("^*/+-".indexOf(b) !== -1 && ((operators[a].associativity == "left" && operators[a].precedence <= operators[b].precedence) || 
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
				}
			}
		}

		if (stack.length > 1) {
			return "Syntax Error";
		} else {
			return stack.pop();
		}
	}

}