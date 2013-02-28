/****************************************************************************************
**
** Copyright (C) 2013 Riccardo Ferrazzo <f.riccardo87@gmail.com>.
** All rights reserved.
**
** This program is based on ubuntu-calculator-app created by:
** Dalius Dobravolskas <dalius@sandbox.lt>
** Riccardo Ferrazzo <f.riccardo87@gmail.com>
**
** This file is part of AfroFish Calculator.
** Sailbuntu Calculator is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** AfroFish Calculator is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with AfroFish Calculator.  If not, see <http://www.gnu.org/licenses/>.
**
****************************************************************************************/

.pragma library

// ----------------------------------------
// constants (const keyword is not working)
var MAX_DECIMAL = 13; // Number of maximum decimal positions

var RAD = 0, DEG = 1, GRAD = 2; //Trigonometric functions

// ----------------------------------------
// utils
function stripFloat(number){
    return parseFloat(number.toFixed(MAX_DECIMAL));
}

// ----------------------------------------
// exceptions
function DivisionByZeroError(message){
    this.message = message;
}

DivisionByZeroError.prototype = new Error();

function ParenthesisError(message, missing){
    this.message = message;
    this.missing = missing;
}

ParenthesisError.prototype = new Error();

// ----------------------------------------
// Math customizations
Math._sin = Math.sin;
Math._cos = Math.cos;
Math._tan = Math.tan;
Math._asin = Math.asin;
Math._acos = Math.acos;
Math._atan = Math.atan;

Math.sin = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._sin(x);

    case DEG:
        return Math._sin(x * Math.PI / 180);

    case GRAD:
        return Math._sin(x * Math.PI / 200);
    }
}

Math.cos = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._cos(x);

    case DEG:
        return Math._cos(x * Math.PI / 180);

    case GRAD:
        return Math._cos(x * Math.PI / 200);
    }
}

Math.tan = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._tan(x);

    case DEG:
        return Math._tan(x * Math.PI / 180);

    case GRAD:
        return Math._tan(x * Math.PI / 200);
    }
}

Math.asin = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._asin(x);

    case DEG:
        return Math._asin(x * Math.PI / 180);

    case GRAD:
        return Math._asin(x * Math.PI / 200);
    }
}

Math.acos = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._acos(x);

    case DEG:
        return Math._acos(x * Math.PI / 180);

    case GRAD:
        return Math._acos(x * Math.PI / 200);
    }
}

Math.atan = function(x, mode){
    switch(mode){
    case undefined:
    case RAD:
        return Math._atan(x);

    case DEG:
        return Math._atan(x * Math.PI / 180);

    case GRAD:
        return Math._atan(x * Math.PI / 200);
    }
}

Math.log10 = function(x){
    return Math.log(x) / Math.LN10;
}

Math.log2 = function(x){
    return Math.log(x) / Math.LN2;
}

Math.factorial = function(x){
    var cache = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000]
    var abs_x = Math.abs(x);
    if(abs_x<=20 && abs_x % 1 === 0){
        var res = (abs_x > 0) ? (abs_x/x)*cache[abs_x] : cache[abs_x];
        return res;
    }

    // Lanczos Approximation of the Gamma Function
    // As described in Numerical Recipes in C (2nd ed. Cambridge University Press, 1992)
    var z = x + 1;
    var p = [1.000000000190015, 76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 1.208650973866179E-3, -5.395239384953E-6];

    var d1 = Math.sqrt(2 * Math.PI) / z;
    var d2 = p[0];

    for (var i = 1; i <= 6; ++i)
        d2 += p[i] / (z + i);

    var d3 = Math.pow((z + 5.5), (z + 0.5));
    var d4 = Math.exp(-(z + 5.5));

    return d1 * d2 * d3 * d4;
}

// ----------------------------------------
// tokens
var T_UNMATCHED = 0,
        T_NUMBER      = 1,  // number
        T_IDENT       = 2,  // ident (constant)
        T_FUNCTION    = 4,  // function
        T_POPEN       = 8,  // (
        T_PCLOSE      = 16, // )
        T_COMMA       = 32, // ,
        T_OPERATOR    = 64, // operator
        T_PLUS        = 65, // +
        T_MINUS       = 66, // -
        T_TIMES       = 67, // *
        T_DIV         = 68, // /
        T_MOD         = 69, // %
        T_POW         = 70, // ^
        T_UNARY_PLUS  = 71, // unary +
        T_UNARY_MINUS = 72, // unary -
        T_FACTORIAL   = 73, // ! factorial function
        T_MODE        = 128;// DEG, RAD or GRAD

// ----------------------------------------
// token
function Token(value, type) {
    this.value = value;
    this.type  = type;
}

Token.prototype = {
    constructor: Token,

    // if token is a function:
    // save argument-count
    argc: 0
}

// ----------------------------------------
// stack
function Stack() {
    this.index = -1;
}

Stack.prototype = {
    constructor: Stack,

    length: 0,

    push:    Array.prototype.push,
    pop:     Array.prototype.pop,
    shift:   Array.prototype.shift,
    unshift: Array.prototype.unshift,

    first: function first() {
        // this is actualy faster than checking "this.length" everytime.
        // is looks like common jitter are able to optimize
        // array out-of-bounds checks very very well :-)
        return this[0];
    },

    last: function last() {
        // yada yada yada see comment in .first() :-)
        return this[this.length - 1];
    },

    peek: function peek() {
        // yada yada yada see comment in .first() :-)
        return this[this.index + 1];
    },

    next: function next() {
        // yada yada yada see comment in .first() :-)
        return this[++this.index];
    },

    prev: function prev() {
        // yada yada yada see comment in .first() :-)
        return this[--this.index];
    }
}

// ----------------------------------------
// context
function Context() { //function names cannot contain numbers
    this.fnt = {
        '√': Math.sqrt,
        "ln": Math.log,
        "log": Math.log10,
        "sin": Math.sin,
        "cos": Math.cos,
        "tan": Math.tan,
        "asin": Math.asin,
        "acos": Math.acos,
        "atan": Math.atan
    };
    this.cst = {
        'π': Math.PI,
        'E': Math.E
    };
}

Context.prototype = {
    constructor: Context,

    fn: function fn(name, args) {
        if (typeof this.fnt[name] !== 'function')
            throw new SyntaxError('function "' + name + '" is not defined');

        var fnc = this.fnt[name];
        return fnc.apply(fnc, args);
    },

    cs: function cs(name) {
        if (typeof this.cst[name] === 'undefined')
            throw new SyntaxError('constant "' + name + '" is not defined');

        return this.cst[name];
    },

    def: function def(name, value) {
        if (typeof value === 'undefined' && typeof Math[name] === 'function')
            value = Math[name].bind(Math);

        if (typeof value === 'function')
            this.fnt[name] = value;

        else if (typeof value === 'number')
            this.cst[name] = value;

        else throw new SyntaxError('function or number expected');

        return this;
    },

    getFntRegExp: function getFntRegExp(){
        var res = "";
        for(var f in this.fnt){
            res += f+"|";
        }
        return res.substring(0, res.length-1);
    },

    getCstRegExp: function getCstRegExp(){
        var res = "";
        for(var c in this.cst){
            res += "\\"+c;
        }
        return res;
    }
}

// ----------------------------------------
// scanner

function Scanner(term, context) {
    this.tokens = new Stack;
    this.context = context;
    this.mode = RAD;

    var prev = { type: T_OPERATOR }; // dummy
    var match, token, type;
    var RE_PATTERN = new RegExp("^([!,\\+\\-\\*\\/\\^%\\(\\)"
                                +context.getCstRegExp()
                                +"]|DEG|RAD|GRAD"
                                +"|\\d*(\\.\\d+)?e[-+]\\d+|\\d*\\.\\d+|\\d+\\.\\d*|\\d+|"
                                +context.getFntRegExp()
                                +"|[ \\t]+)");

    while (term.length) {
        if (!(match = term.match(RE_PATTERN)))
            throw new SyntaxError('error near `' + term.substr(0, 10) + '``');

        if ((token = match[1]).length === 0)
            throw new SyntaxError('empty token matched. abort');

        term = term.substr(token.length);

        if ((token = token.trim()).length === 0)
            continue; // whitespace

        if (!isNaN(token)) {
            if(prev.type === T_IDENT || prev.type === T_PCLOSE)
                this.tokens.push(new Token('*', T_TIMES));
            this.tokens.push(prev = new Token(parseFloat(token), T_NUMBER));
            continue;
        }

        switch (type = this.lookup[token] || T_UNMATCHED) {
        case T_PLUS:
            if ((prev.type & T_OPERATOR && prev.type != T_FACTORIAL) || prev.type === T_POPEN) type = T_UNARY_PLUS;
            break;

        case T_MINUS:
            if ((prev.type & T_OPERATOR &&prev.type != T_FACTORIAL)|| prev.type === T_POPEN) type = T_UNARY_MINUS;
            break;

        case T_IDENT:
        case T_UNMATCHED:
            switch (prev.type){
            case T_IDENT:
            case T_PCLOSE:
            case T_NUMBER:
                this.tokens.push(new Token('*', T_TIMES));
                break;
            }
            break;

        case T_POPEN:
            switch (prev.type) {
            case T_UNMATCHED:
                prev.type = T_FUNCTION;
                break;

            case T_NUMBER:
            case T_PCLOSE:
            case T_IDENT:
                this.tokens.push(new Token('*', T_TIMES));
                break;
            }
            break;

        case T_MODE:
            switch(token){
            case "DEG":
                this.mode = DEG;
                break;
            case "RAD":
                this.mode = RAD;
                break;
            case "GRAD":
                this.mode = GRAD;
                break;
            }
            continue;
        }


        this.tokens.push(prev = new Token(token, type));
    }
}

Scanner.prototype = {
    constructor: Scanner,

    lookup: {
        '+': T_PLUS,
        '-': T_MINUS,
        '*': T_TIMES,
        '/': T_DIV,
        '%': T_MOD,
        '^': T_POW,
        '(': T_POPEN,
        ')': T_PCLOSE,
        ',': T_COMMA,
        '!': T_FACTORIAL,
        'π': T_IDENT,
        'E': T_IDENT,
        'DEG': T_MODE,
        'RAD': T_MODE,
        'GRAD': T_MODE
    },

    prev: function prev() { return this.tokens.prev(); },
    next: function next() { return this.tokens.next(); },
    peek: function peek() { return this.tokens.peek(); }
}

// ----------------------------------------
// parser

function Parser(scanner) {
    this.scanner = scanner;

    this.queue = new Stack;
    this.stack = new Stack;

    var token;

    while ((token = this.scanner.next()) !== undefined)
        this.handle(token);

    while ((token = this.stack.pop()) !== undefined) {
        if (token.type === T_POPEN)
            throw new ParenthesisError('unmatched parentheses', ')');
        if (token.type === T_PCLOSE)
            throw new ParenthesisError('unmatched parentheses', '(');
        this.queue.push(token);
    }
}

Parser.prototype = {
    constructor: Parser,

    reduce: function reduce(ctx) {
        this.stack = new Stack;
        var len = 0, token;

        // While there are input tokens left
        // Read the next token from input.
        while ((token = this.queue.shift()) !== undefined) {
            switch (token.type) {
            case T_NUMBER:
            case T_IDENT:
                // evaluate constant
                if (token.type === T_IDENT)
                    token = new Token(ctx.cs(token.value), T_NUMBER);

                // If the token is a value or identifier
                // Push it onto the stack.
                this.stack.push(token);
                ++len;
                break;

            case T_PLUS:
            case T_MINUS:
            case T_UNARY_PLUS:
            case T_UNARY_MINUS:
            case T_FACTORIAL:
            case T_TIMES:
            case T_DIV:
            case T_MOD:
            case T_POW:
                // It is known a priori that the operator takes n arguments.
                var argc = this.argc(token);

                // If there are fewer than n values on the stack
                if (len < argc)
                    throw new SyntaxError('too few arguments for operator `' + token.value + '`');

                var rhs = this.stack.pop(),
                        lhs = null;

                if (argc === 2) lhs = this.stack.pop();

                len -= (argc - 1);

                // Push the returned results, if any, back onto the stack.
                this.stack.push(new Token(this.op(token.type, lhs, rhs), T_NUMBER));
                break;

            case T_FUNCTION:
                // function
                var argc = token.argc,
                        argv = [];

                len -= (argc - 1);

                for (; argc > 0; --argc)
                    argv.unshift(this.stack.pop().value);

                if (token.value == "sin" || token.value == "cos" || token.value == "tan" ||
                        token.value == "asin" || token.value == "acos" || token.value == "atan"){
                    argv.push(this.scanner.mode);
                }

                // Push the returned results, if any, back onto the stack.
                this.stack.push(new Token(stripFloat(ctx.fn(token.value, argv)), T_NUMBER));
                break;

            default:
                throw new SyntaxError('unexpected token "' + token.value + '"');
            }
        }

        // If there is only one value in the stack
        // That value is the result of the calculation.
        if (this.stack.length === 1)
            return this.stack.pop().value;

        // If there are more values in the stack
        // (Error) The user input has too many values.
        console.log(this.queue.length)
        throw new Error('runtime error: too many values');
    },

    op: function op(type, lhs, rhs) {
        if (lhs !== null) {
            switch (type) {
            case T_PLUS:
                return stripFloat(lhs.value + rhs.value);

            case T_MINUS:
                return stripFloat(lhs.value - rhs.value);

            case T_TIMES:
                return stripFloat(lhs.value * rhs.value);

            case T_DIV:
                return stripFloat(lhs.value / rhs.value);

            case T_MOD:
                if (rhs.value === 0.)
                    throw new DivisionByZeroError('modulo division by zero');

                return lhs.value % rhs.value;

            case T_POW:
                return Math.pow(lhs.value, rhs.value);
            }

            // throw?
            return 0.;
        }

        switch (type) {
        case T_UNARY_MINUS:
            return -rhs.value;

        case T_UNARY_PLUS:
            return +rhs.value;

        case T_FACTORIAL:
            return stripFloat(Math.factorial(rhs.value));
        }

        // throw?
        return 0.;
    },

    argc: function argc(token) {
        switch (token.type) {
        case T_PLUS:
        case T_MINUS:
        case T_TIMES:
        case T_DIV:
        case T_MOD:
        case T_POW:
            return 2;
        }

        return 1;
    },

    fargs: function fargs(fn) {
        this.handle(this.scanner.next()); // '('

        var argc = 0,
                next = this.scanner.peek();

        if (next !== undefined && next.type !== T_PCLOSE) {
            argc = 1;

            while ((next = this.scanner.next()) !== undefined) {
                this.handle(next);

                if (next.type === T_PCLOSE)
                    break;

                if (next.type === T_COMMA)
                    ++argc;
            }
        }

        fn.argc = argc;
    },

    handle: function handle(token) {
        switch (token.type) {
        case T_NUMBER:
        case T_IDENT:
            // If the token is a number (identifier), then add it to the output queue.
            this.queue.push(token);
            break;

        case T_FUNCTION:
            // If the token is a function token, then push it onto the stack.
            this.stack.push(token);
            this.fargs(token);
            break;


        case T_COMMA:
            // If the token is a function argument separator (e.g., a comma):
            var pe = false;

            while ((token = this.stack.last()) !== undefined) {
                if (token.type === T_POPEN) {
                    pe = true;
                    break;
                }

                // Until the token at the top of the stack is a left parenthesis,
                // pop operators off the stack onto the output queue.
                this.queue.push(this.stack.pop());
            }

            // If no left parentheses are encountered, either the separator was misplaced
            // or parentheses were mismatched.
            if (pe !== true)
                throw new Error('parser error: misplaced `,` or unmatched parentheses');

            break;

            // If the token is an operator, op1, then:
        case T_PLUS:
        case T_MINUS:
        case T_UNARY_PLUS:
        case T_UNARY_MINUS:
        case T_FACTORIAL:
        case T_TIMES:
        case T_DIV:
        case T_MOD:
        case T_POW:
            var token2;

            both: while ((token2 = this.stack.last()) !== undefined) {
                // While there is an operator token, o2, at the top of the stack
                // op1 is left-associative and its precedence is less than or equal to that of op2,
                // or op1 has precedence less than that of op2,
                // Let + and ^ be right associative.
                // Correct transformation from 1^2+3 is 12^3+
                // The differing operator priority decides pop / push
                // If 2 operators have equal priority then associativity decides.
                switch (token2.type) {
                default: break both;

                case T_PLUS:
                case T_MINUS:
                case T_UNARY_PLUS:
                case T_UNARY_MINUS:
                case T_FACTORIAL:
                case T_TIMES:
                case T_DIV:
                case T_MOD:
                case T_POW:
                    var p1 = this.preced(token),
                            p2 = this.preced(token2);

                    if (!((this.assoc(token) === 1 && (p1 <= p2)) || (p1 < p2)))
                        break both;

                    // Pop o2 off the stack, onto the output queue;
                    this.queue.push(this.stack.pop());
                }
            }

            // push op1 onto the stack.
            this.stack.push(token);
            break;

        case T_POPEN:
            // If the token is a left parenthesis, then push it onto the stack.
            this.stack.push(token);
            break;

            // If the token is a right parenthesis:
        case T_PCLOSE:
            var pe = false;

            // Until the token at the top of the stack is a left parenthesis,
            // pop operators off the stack onto the output queue
            while ((token = this.stack.pop()) !== undefined) {
                if (token.type === T_POPEN) {
                    // Pop the left parenthesis from the stack, but not onto the output queue.
                    pe = true;
                    break;
                }

                this.queue.push(token);
            }

            // If the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
            if (pe !== true)
                throw new ParenthesisError('unmatched parentheses', '(');

            // If the token at the top of the stack is a function token, pop it onto the output queue.
            if ((token = this.stack.last()) !== undefined && token.type === T_FUNCTION)
                this.queue.push(this.stack.pop());

            break;

        default:
            throw new SyntaxError('unknown token "' + token.value + '"');
        }
    },

    assoc: function assoc(token) {
        switch (token.type) {
        case T_TIMES:
        case T_DIV:
        case T_MOD:

        case T_PLUS:
        case T_MINUS:
            return 1; //ltr

        case T_UNARY_PLUS:
        case T_UNARY_MINUS:

        case T_POW:
            return 2; //rtl
        }

        // ggf. erweitern :-)
        return 0; //nassoc
    },

    preced: function preced(token) {
        switch (token.type) {
        case T_UNARY_PLUS:
        case T_UNARY_MINUS:
        case T_FACTORIAL:
            return 4;

        case T_POW:
            return 3;

        case T_TIMES:
        case T_DIV:
        case T_MOD:
            return 2;

        case T_PLUS:
        case T_MINUS:
            return 1;
        }

        return 0;
    }
}

function parse(term, ctx) {
    if (typeof ctx === 'undefined'){
        ctx = new Context;
    }

    return new Parser(new Scanner(term, ctx)).reduce(ctx);
}


// ----------------------------------------
// Get formula texts for visual output
// and engine.
function getFormulaTexts(prev, visual, engine, type, brackets_count) {
    var visual_text = null;
    var engine_text = null;
    var fixed_type = type;

    switch (type) {
        case 'group': {
            if (engine == '(' || (engine == ')' && brackets_count > 0 && prev != null && prev.type != 'operation' && prev.type != 'function')) {
                visual_text = (prev != null ? ' ' : '') + visual + ' '

                engine_text = engine;

                if (engine == '(')
                    brackets_count++;
                else
                    brackets_count--;
            }
            }
            break;
        case 'number': {
            visual_text = visual;
            engine_text = engine;

            if (prev != null && prev.type == 'real')
                fixed_type = prev.type;
            }
            break;
        case 'real': {
            if (prev == null || prev.type != 'real') {
                visual_text = visual;
                engine_text = engine;
            }
            }
            break;
        case 'const': {
            visual_text = visual;
            engine_text = engine;
            }
            break;
        case 'operation': {
            if ((prev == null && (engine == '-' || engine == '+')) ||
                (prev != null && (engine == '-' || engine == '+' || prev.type == 'number' ||
                                  prev.type == 'real' || prev.type == 'const' ||
                                  (prev.type == 'group' && prev.engine == ')') ||
                                  (engine == '!' && prev.engine == '!')))) {
                visual_text = (prev != null ? ' ' : '') + visual + ' ';
                engine_text = engine;
            }
            }
            break;
        case 'function': {
            if (prev != null && (prev.type == 'number' || prev.type == 'real' || prev.type == 'const')) {
                visual_text = ' ' + visual + '( ';
            }
            else {
                visual_text = visual + '( ';
            }
            engine_text = engine+'(';

            brackets_count++;
            }
            break;
    }

    return [visual_text, engine_text, fixed_type, brackets_count];
}
