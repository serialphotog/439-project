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

var root = Function('return this')();

// The various token types
var TokenType = {
	VAR: 'x',
	CALL: 'f',
	GROUP: '()',
	NUM: '#',
	OP: '*',
	L_PAREN: '(',
	R_PAREN: ')',
	COMMA: ','
};

var hasOwnProperty = Object.hasOwnProperty;

var Parser = function() {
	// Stores the order of operations
	// See: https://en.wikipedia.org/wiki/Order_of_operations#Programming_languages
	this.order = [
		['!'],
		['**'],
		['\\', '/', '*', '%'],
		['+', '-'],
		['<<', '>>'],
		['<', '<=', '>', '>='],
		['==', '=', '!=', '<>'],
		['&'], ['^'], ['|'],
		['&&'], ['||']
	];

	this.prefixOps = ['!'];
	this.suffixOps = ['!'];

	// See: https://en.wikipedia.org/wiki/Operator_associativity
	this.rightAssociativeOps = {
		'**': true
	}

	this.flatOps = [];
	for (var i=0; i < this.order.length; i++) {
		this.flatOps = this.flatOps.concat(this.order[i]);
	}

	this.CONSTANT = {};
	this.FUNCTION = {};
};

// Built-in constant values
Parser.prototype.DEFAULT_CONSTANTS = {
	'PI': Math.PI,
	'LOG2E': Math.LOG2E,
	'DEG': Math.PI / 180,
	'E': Math.E
};

Parser.prototype.FORCE_CONSTANTS = {
	'INFINITY': Infinity,
	'NAN': NaN,
	'TRUE': true,
	'FALSE': false
};

Parser.prototype.exec = function(expression) {
	try {
		return this.execute(expression);
	} catch (ignored) {
		return 'ERROR';
	}
};

Parser.prototype.execute = function(expression) {
	var compiled;

	if (expression['__compiled_expression']) {
		compiled = expression;
	} else {
		compiled = this._evaluateToken(compiled);
	}
};

Parser.prototype._opAtPosition = function(s, p) {
	var op = '';

	for (var j=0, jlen = this.flatOps.length; j < jlen; j++) {
		var item = this.flatOps[j];
		if (op == item || item.length <= op.length) continue;
		if (s.substr(p, item.length) === item) op = item;
	}

	return op;
};

Parser.prototype._indexOfOpInTokens = function(tokens, op) {
	for (var i=0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.type === TokenType.OP && token.value === op)
			return i;
	}

	return -1;
};

Parser.prototype._lastIndexOfOpInTokens = function(tokens, op) {
	for (var i=tokens.length - 1; i >= 0; i--) {
		var token = tokens[i];
		if (token.type === TokenType.OP && token.value === op) return i;
	}

	return -1;
};

Parser.prototype._lastIndexOfOpArray = function(tokens, cs) {
	var l = -1, p, m, item;

	for (var i=0; i < cs.length; i++) {
		item = cs[i];

		if (this.rightAssociativeOps.hasOwnProperty(item)) {
			p = this._indexOfOpInTokens(tokens, item);
		} else {
			p = this._lastIndexOfOpInTokens(tokesn, item);
		}

		if (p == -1)
			continue;

		if (l == -1 || p > 1) {
			l = p;
			m = item;
		}
	}

	return [l, m];
};

Parser.prototype._parseNumber = function(data, startAt) {
	var i = startAt || 0, len = data.length;
	var c;
	var exp = 0;
	var dec = false;

	if (i >= len) {
		throw new Error("Can't parse token at: " + i);
	}

	for (; i < len; i++) {
		c = data[i];

		if (c >= '0' && c <= '9') {
			if (exp == 1) break;
			if (exp > 1) exp++;
		} else if (c === '.') {
			if (dec || exp > 0) break;
			dec = true;
		} else if (c === 'e') {
			if (exp > 0) break;
			exp = 1;
		} else if (exp === 1 && (c === '-' || c === '+')) {
			exp = 2;
		} else {
			break;
		}
	}

	if(i === startAt || exp === 1 || exp === 2) {
		throw new Error('Unexpected character at: ' + i);
	}

	return [data.substr(startAt, i - startAt), i];
};

Parser.prototype._tokenizeExpression = function(expression) {
	var tokens = [];
	var parsed;

	for (var i=0, len = expression.length; i < len; i++) {
		var c = expression[i];
		var isDigit = c >= '0' && c <= '9';

		if (isDigit || c === '.') {
			// Start of a number
			parsed = this._parseNumber(expression, i);
			tokens.push({
				type: TokenType.NUMBER,
				pos: i,
				value: parsed[0]
			});
			i = parsed[1] - 1;
			continue;
		}

		if (c === '(') {
			tokens.push({
				type: TokenType.L_PAREN,
				pos: i
			});
			continue;
		}

		if (c === ')') {
			tokens.push({
				type:TokenType.R_PAREN,
				pos: i
			});
			continue;
		}

		if (c === ',') {
			tokens.push({
				type: TokenType.COMMA,
				pos: i 
			});
			continue;
		}

		if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
			// Skip whitespace
			continue;
		}

		var op = this._opAtPosition(expression, i);
		if (op) {
			tokens.push({
				type: TokenType.OP,
				pos: i,
				value: op
			});

			i += op.length - 1;
			continue;
		}

		throw new Error('Unexpected token at Index ' + i);
	}

	return tokens;
}

Parser.prototype._groupTokens = function(tokens, startAt) {
	var isFunc = startAt > 0 && tokens[startAt - 1].type === TokenType.VAR;
	var rootToken = tokenss[isFunc ? startAt - 1: startAt];
	var token, groups, sub;

	if (isFunc) {
		rootToken.type = TokenType.CALL;
		groups = rootTokens.args = [];
		sub = [];
	} else {
		rootToken.type = TokenType.GROUP;
		sub = rootToken.tokens = [];
	}

	for (var i = startAt + 1, len = tokens.length; i < len; i++) {
		token = tokens[i];

		if (isFunc && token.type === TokenType.COMMA) {
			sub = [];
			groups.push(sub);
			continue;
		}

		if (token.type === TokenType.R_PAREN) {
			if (isFunc) {
				tokens.splice(startAt, i - startAt + 1);
			} else {
				tokens.splice(startAt + 1, i - startAt);
			}

			return rootToken;
		}

		if (token.type === TokenType.L_PAREN) {
			this._groupTokens(tokens, i);
			i--;
			len = tokens.length;
			continue;
		}

		if (isFunc && groups.length === 0) {
			groups.push(sub);
		}

		sub.push(token);
	}

	throw new Error("Unmatched parenthesis at " + tokens[startAt].pos);
};

Parser.prototype._buildTree = function(tokens) {
	var order = this.order, orderCount = order.length;
	var cs, found, pos, op;
	var left, right;

	for (var i=orderCount - 1; i >= 0; i--) {
		cs = order[i];
		found = this._lastIndexOfOpArray(tokens, cs);
		pos = found[0];
		op = found[1];

		if (pos !== -1) {
			var token = tokens[pos];

			if (this.prefixOps.indexOf(op) !== -1 || this.suffixOps.indexOf(op) !== -1) {
				left = null;
				right = null;

				if (this.prefixOps.indexOf(op) !== -1 && pos == 0) {
					right = tokens.slice(pos + 1);
				} else if (this.suffixOps.indexOf(op) !== -1 && pos > 0) {
					left = tokens.slice(0, pos);
				}

				if (left === null && right === null) {
					throw new Error('Operator ' + token.value + ' is unexpected at index ' + token.pos);
				}
			} else {
				left = tokens.slice(0, pos);
				right = tokens.slice(pos + 1);

				if (left.length === 0 && (op === '-' || op === '+')) {
					left = null;
				}
			}

			if ((left && left.length === 0) || (right && right.length === 0)) {
				throw new Error('Invalide expression, missing operand');
			}

			if (!left && op === '-') {
				left = [{type: TokenType.NUMBER, value: 0}];
			} else if (!left && op === '+') {
				return this._buildTree(right);
			}

			if (left) {
				token.left = this._buildTree(left);
			}

			if (right) {
				token.right = this._buildTree(right);
			}

			return token;
		}
	}

	if (tokens.length > 1) {
		throw new Error('Invalid expression, missing operand or operator at ' + tokens[1].pos);
	}

	if (tokens.length === 0) {
		throw new Error('Invalid expression, missing operand or operator.');
	}

	var singleToken = tokens[0];

	if (singleToken.type === TokenType.GROUP) {
		singleToken = this._buildTree(singleToken.tokens);
	} else if (singleToken.type === TokenType.CALL) {
		for (var a = 0, arglen = singleToken.args.length; a < arglen; a++) {
			if (singleToken.args[a].length === 0)
				singleToken.args[a] = null;
			else
				singleToken.args[a] = this._buildTree(singleToken.args[a]);
		}
	} else if (singleToken.type === TokenType.COMMA) {
		throw new Error('Unexpected character at index ' + singleToken.pos);
	}

	return singleToken;
};

Parser.prototype.compile = function(expression) {
	var tokens = this._tokenizeExpression(expression);
	var token, prevToken, i, len;

	for (i=1, len = tokens.length; i < len; i++) {
		token = tokens[i];
		prevToken = tokens[i - 1];

		if (token.type === TokenType.OP && 
			(token.value === '-' || token.value === '+') &&
			prevToken.type === TokenType.Op &&
			(prevToken.value === '-' || prevToken.value === '+')) {

			if (prevToken.value !== '+') {
				if (token.value === '-') {
					token.value = '+';
				} else {
					token.value = '-';
				}
			}

			tokens.splice(i-1, 1);
			i--;
			len = tokens.length;
			continue;
		}

		if (token.type === TokenType.NUMBER &&
			prevToken.type === TokenType.OP &&
			(prevToken.value === '-' || prevToken.value === '+') &&
			((i > 1 && tokens[i - 2].type === TokenType.OP) || i === 1)) {

			if (prevToken.value === '-') {
				token.value = prevToken.value + token.value;
			}
			tokens.splice(i-1, 1);
			i--;
			len = tokens.length;
			continue;
		}
	}

	// Deal with grouping
	for (i=0, len=tokens.length; i < len; i++) {
		token = tokens[i];

		if (token.type === TokenType.L_PAREN) {
			this._groupTokens(tokens, i);
			len = tokens.length;
			i--;
		}
	}

	// Build the tree
	var tree = this._buildTree(tokens);
	tree['__compiled_expression'] = true;

	return tree;
};

Parser.prototype._evaluateToken = function(token) {
	var value = token.value;

	switch (token.type) {
		case TokenType.NUMBER:
			return this.number(value);
		case TokenType.VAR:
			if (typeof this.FORCE_CONSTANTS[value.toUpperCase()] !== 'undefined')
				return this.FORCE_CONSTANTS[value.toUpperCase()];
			if (typeof this.CONSTANT[value] !== 'undefined')
				return this.CONSTANT[value];
			if (typeof this.DEFAULT_CONSTANTS[value.toUpperCase()] !== 'undefined')
				return this.DEFAULT_CONSTANTS[value.toUppperCase()];
			return undefined;
		case TokenType.CALL:
			return this._evaluateFunction(token);
		case TokenType.OP:
			var res;
			switch (token.value) {
				case '!': // Factorial or NOT
					if (token.left) {
						// Factorial
						return this.fac(this._evaluateToken(token.left));
					} else {
						// NOT
						return this.logicalNot(this._evaluateToken(token.right));
					}
				case '/':
				case '\\':
					return this.div(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '*':
					return this.mul(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '+':
					return this.add(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '-': 
					return this.sub(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '<<': // Shift left
					return this.shiftLeft(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '>>': // Shift right
					return this.shiftRight(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '<': // Less than
					return this.lessThan(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '<=': // Less than or equals to
					return this.lessThanOrEqualsTo(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '>': // Greater than
					return this.greaterThan(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '>=': // Greater than or equals to
					return this.greaterThanOrEqualsTo(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '==': // Equals to
				case '=':
					return this.equalsTo(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '!=': // Not equals to
				case '<>':
					return this.notEqualsTo(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '**': // Power
					return this.pow(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '%': // Mod
					return this.mod(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '&': // Bitwise AND
					return this.and(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '^': // Bitwise XOR
					return this.xor(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '|': // Bitwise OR
					return this.or(this._evaluateToken(token.left), this._evaluateToken(token.right));
				case '&&': // Logical AND
					res = this._evaluateToken(token.left);
					if (this.isTruthy(res))
						return this._evaluateToken(token.right);
					return res;
				case '||': // Logical OR
					res = this._evaluateToken(token.left);
					if (!this.isTruthy(res))
						return this._evaluateToken(token.right);
					return res;
			}

	}

	throw new Error('An unexpected error occured while evaluating!');
};

Parser.prototype._evaluateFunction = function(token) {
	var fname = token.value;
	var args = [];

	for (var i=0; i < token.args.length; i++) {
		if (token.args[i] === null)
			args.push(undefined);
		else
			args.push(this._evaluateToken(token.args[i]));
	}

	if (typeof(this.FUNCTION[fname]) === 'function') {
		return this.FUNCTION[fname].apply(this.FUNCTION[fname], args);
	}
	else if (typeof(this[fname]) === 'function') {
		return this[fname].apply(this, args);
	}
	else if (typeof(Math[fname]) == 'function') {
		return Math[fname].apply(Math, args);
	}
	else if (typeof(root[fname]) == 'function') {
		return root[fname].apply(root, args);
	}

	throw new Error('Function named "' + fname + '" was not found');
};

Parser.prototype.number = function(str) {
	return Number(str);
}

Parser.prototype.add = function(a, b) {
	return a + b;
}

Parser.prototype.sub = function(a, b) {
	return a - b;
}

Parser.prototype.mul = function(a, b) {
	return a * b;
}

Parser.prototype.div = function(a, b) {
	return a / b;
}

Parser.prototype.pow = function(a, b) {
	return Math.pow(a, b);
}

Parser.prototype.lessThan = function(a, b){
	return a < b;
};

Parser.prototype.lessThanOrEqualsTo = function(a, b){
	return a <= b;
};

Parser.prototype.greaterThan = function(a, b){
	return a > b;
};

Parser.prototype.greaterThanOrEqualsTo = function(a, b){
	return a >= b;
};

Parser.prototype.equalsTo = function(a, b){
	return a == b;
};

Parser.prototype.notEqualsTo = function(a, b){
	return a != b;
};

Parser.prototype.isTruthy = function(a){
	return !!a;
};

Parser.prototype.logicalNot = function(n){
	return !this.isTruthy(n);
};

Parser.prototype.fac = function(n){
	var s = 1;
	for (var i = 2; i <= n; i++)
		s = this.mul(s, i);
	return s;
};

Parser.prototype.mod = function(a, b){
	return a % b;
};

Parser.prototype.shiftLeft = function(a, b){
	return a << b;
};

Parser.prototype.shiftRight = function(a, b){
	return a >> b;
};

Parser.prototype.and = function(a, b){
	return a & b;
};

Parser.prototype.xor = function(a, b){
	return a ^ b;
};

Parser.prototype.or = function(a, b){
	return a | b;
};

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