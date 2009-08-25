/** 
 * Math.js
 * http://rolandog.com/math-js/
 *
 * License: Creative Commons Attribution-Share Alike 3.0 Unported.
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * @projectDescription   A library with Mathematical functions.
 * @author               Rolando Garza rolandog@gmail.com
 */

"use strict";

/**
 * An extension to the Array object that filters out repeated values.
 * @return(Array) Returns the filtered array.
 */
if (Array.unique === undefined) {
    Array.prototype.unique = function Array_unique() {
        var a = [], l = this.length, i = 0, j;
        while (i < l) {
            for (j = i + 1; j < l; j += 1) {
                if (this[i] === this[j]) {
                    i += 1;
                    j = i;
                }
            }
            a.push(this[i]);
            i += 1;
        }
        return a;
    };
}

/**
 * An extension to the Array object that returns the last item in the array.
 * @return(Number) The last item.
 */
if (Array.last === undefined) {
    Array.prototype.last = function Array_last() {
        return this[this.length - 1];
    };
}

/**
 * An extension to the Array object that counts the instances of 'a'.
 * @param(Number) a What is to be counted.
 * @return(Number) Counts how many 'a' there are in the Array.
 */
if (Array.count === undefined) {
    Array.prototype.count = function Array_count(a) {
        var r = 0, i;
        for (i = 0; i < this.length; i += 1) {
            r += this[i] === a ? 1 : 0; 
        }
        return r;
    };
}

/**
 * An extension to the Array comparing two different arrays.
 * @param(Array) a Array to which it will be compared.
 * @return(Boolean) Returns true if identical.
 */
if (Array.identicalTo === undefined) {
    Array.prototype.identicalTo = function Array_identicalTo(a) {
        var i;
        if (a.length !== this.length) {
            return false;
        }
        for (i in this) {
            if (this[i] !== a[i]) {
                return false;
            }
        }
        return true;
    };
}

/**
 * An extension to the Array that inserts stuff by slicing and concatenating.
 * @param(Array) a What is to be inserted.
 * @param(Number) p Position of where it is to be inserted.
 * @return(Array) Returns the new Array.
 */
if (Array.insert === undefined) {
    Array.prototype.insert = function Array_insert(a, p) {
        var b, c, d, i;
        b = this.slice(0, p);
        c = this.slice(p);
        d = b.concat(a, c);
        for (i in d) {
            if (d[i] !== undefined) {
                this[i] = d[i];
            }
        }
        return this;
    };
}

/**
 * An extension to the Array object swaps the a'th and b'th items.
 * @param(Number) a Position of the element to be swapped.
 * @param(Number) b Position of the element to be swapped.
 * @return(Array) Returns the array.
 */
if (Array.swap === undefined) {
    Array.prototype.swap = function Array_swap(a, b) {
        if (a !== b) {
            var c = this[b];
            this[b] = this[a];
            this[a] = c;
        }
        return this;
    };
}

/**
 * An extension to the Array object generates permutations. It can return them
 * as an array or a string if isString is true.
 * @param(Boolean) isString So that it returns an Array or a String.
 * @return(Array) Returns the array.
 */
if (Array.permutations === undefined) {
    Array.prototype.permutations = function Array_permutations(isString) {
        var t = Math.js.copy(this);
        function permutations(a) {
            if (a.length === 1) {
                return [a];
            }
            var ps = [], p, i, j, b = a.slice(0), r = [];
            for (i = 0;  i < a.length; i += 1) {
                p = a.splice(i, 1);
                ps = permutations(a);
                for (j = 0; j < ps.length; j += 1) {
                    ps[j] = p.concat(ps[j]);
                }
                r = r.concat(ps);
                a = b.slice(0);
            }
            return r;
        }
        function clean(a) {
            var i;
            for (i = 0; i < a.length; i += 1) {
                a[i] = a[i].join("");
            }
            return a.join();
        }
        return isString ? clean(permutations(t)) : permutations(t);
    };
}

/**
 * An extension to the Array object that returns chunky arrays.
 * @param(Number) n Number of chunks.
 * @return(Array) Returns an array, chunked.
 */
if (Array.chunk === undefined) {
    Array.prototype.chunk = function Array_chunk(n, nL) {
        //i is the limit. There is a limit of 16 workers per tab, 64 on total
        //anything created after that is queued
        var chunks = [], t = this, l = t.length, i, s, last;
        function minChunks(l) {
            var a, minMod = Infinity, ma;
            for (a = 16; a >= 2; a -= 1) {
                ma = l % a < minMod ? a : ma;
                minMod = l % a < minMod ? l % a : minMod;
            }
            return ma;
        }
        //if n is undefined, call minChunks else if n is larger than l, use l, else use n.
        n = n !== undefined ? n > l ? l : n : minChunks(l);
        //if nonLinear (will try to do logarithmic)
        if (nL) {
            n += 1;
            s = function s(x) {
                return parseInt(l * Math.log(x + 1) / Math.log(n), 10);
            };
            for (i = 0; i < n - 1; i += 1) {
                chunks.push(t.slice(s(i), s(i + 1)));
            }
        } else {
            //the size of the chunks
            s = parseInt(l / n, 10);
            for (i = 0; i < n; i += 1) {
                chunks.push(t.slice(i * s, (i + 1) * s));
            }
            //this joins the remaining items in the last chunk.
            if (l % n !== 0) {
                last = chunks.pop();
                last = last.concat(t.slice(i * s));
                chunks.push(last);
            }
        }
        return chunks;
    };
}

/**
 * @classDescription Contains some helpful functions.
 */
Math.js = {
    /**
     * Duplicates argument objects or arrays, and returns them as arrays.
     * @param(Object) as An Object or an Array.
     * @return(Array) A duplicated array.
     */
    copy: function Math_js_copy(as) {
        var a = 0, r = [];
        try {
            while (a < as.length) {
                r.push(as[a]);
                a += 1;
            }
        } catch (e) {
            for (a in as) {
                if (as.hasOwnProperty(a) && as[a]) {
                    r.push(a);
                }
            }
        }
        return r;
    },
    /**
     * Sorts an array of numbers in ascending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    ascending: function Math_js_ascending(a, b) {
        return a - b;
    },
    /**
     * Sorts an array of numbers in descending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    descending: function Math_js_descending(a, b) {
        return b - a;
    },
    primes: [2, 3]
};

/**
 * An extension to the Array object that returns the position of a number with a
 * value closest to a. The array must be sorted numerically:
 * You can use Array.sort(Math.js.ascending)
 * @return(Array) Returns the array.
 */
if (Array.closeTo === undefined) {
    Array.prototype.closeTo = function Array_closeTo(a) {
        var t = this, i, m = Infinity, mp = 0;
        if (t.indexOf(a) === -1) {
            for (i = 0; i < t.length; i += 1) {
                mp = Math.abs(a - t[i]) < m ? i : mp;
                m = Math.abs(a - t[i]) < m ? Math.abs(a - t[i]) : m;
                if (Math.abs(a - t[i]) > m) {
                    //if there is a growing difference, get out!
                    return mp;
                }
            }
        } else {
            return t.indexOf(a);
        }
        return mp;
    };
}

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the sum of all numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the sum of all numbers.
 */
Math.sum = function Math_sum(a) {
    var r = 0;
    a = a.length ? a:Math.js.copy(arguments);
    while (a.length) {
        r += a.shift();
    }
    return r;
};

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the product of all numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the product of all numbers.
 */
Math.product = function Math_product(a) {
    var r = 1, b = [];
    a = Math.js.copy(arguments);
    while (a.length) {
        b = b.concat(a.shift());
    }
    while (b.length) {
        r *= b.shift();
    }
    return r;
};

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the quotient of the first by the second numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the quotient of all numbers.
 */
Math.quotient = function Math_quotient(a) {
    a = Math.js.copy(arguments);
    var r = Math.product(a.shift());
    while (a.length) {
        r /= Math.product(a.shift());
    }
    return r;
};

/**
 * An extension to the Math object that accepts Numbers as an argument
 * and returns the quotient of the first by the second numbers, with many
 * decimal places, as much as specified.
 * @param(Number) numerator An Integer.
 * @param(Number) denominator An Integer.
 * @param(Number) numerator A positive Integer.
 * @return(String) Returns the quotient of the numerator by the denominator.
 */
Math.divide = function Math_divide(numerator, denominator, decimalPlaces) {
    var remainder, quotient, decimalString;
    remainder = numerator % denominator;
    quotient = parseInt(numerator / denominator, 10);
    decimalString = "" + quotient;
    decimalPlaces = decimalPlaces === undefined ? 20 : decimalPlaces;
    decimalString += decimalPlaces ? "." : "";
    while (decimalPlaces > 0) {
        numerator = remainder * 10;
        quotient = parseInt(numerator / denominator, 10);
        remainder = numerator % denominator;
        decimalString += quotient;
        decimalPlaces -= 1;
    }
    return decimalString.replace(/0+$/, "");
};

/**
 * As long as the proportion between numerator and denominator is less than 1e7
 * or 1e-7, it will return the decimal representation. Example:
 * Math.decimalRepresentation(1, 6) = "0.1(6)"
 * @return(String) Returns the decimal representation.
 */
Math.decimalRepresentation = function Math_decimalRepresentation(numerator, denominator) {
    var remainder, quotient, number = [], decimals = [], remainders = [];
    remainder = numerator % denominator;
    quotient = parseInt(numerator / denominator, 10);
    number.push(quotient);
    if (remainder) {
        number.push(".");
        while (remainder && remainders.count(remainder * 10) === 0) {
            numerator = remainder * 10;
            remainders.push(numerator);
            quotient = parseInt(numerator / denominator, 10);
            decimals.push(quotient);
            remainder = numerator % denominator;
        }
        if (remainder) {
            numerator = remainder * 10;
            quotient = parseInt(numerator / denominator, 10);
            decimals.insert("(", decimals.indexOf(quotient));
            decimals.push(")");
        }
        number = number.concat(decimals);
    }
    return number.join(""); //.replace(/0+$/, "");
};

/**
 * An extension to the Math object that accepts a Number
 * and returns the factorial.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the product of all numbers.
 */
Math.factorial = function Math_factorial(a) {
    return (a <= 1) ? 1 : a * Math.factorial(a - 1);
};

/**
 * Returns the Greatest Common Divisor using Euclid's algorithm.
 * @param(Array) a An Array of integers.
 * @return(Number) Returns the Greatest Common Divisor.
 */
Math.gcd = function Math_gcd(a) {
    a = a.length ? a:Math.js.copy(arguments);
    var l = a.length;
    if (l < 2) {
        throw "Error: Must have at least two integers.";
    }
    while (l - 2) {
        a.push(Math.gcd(a.shift(), a.shift()));
        l = a.length;
    }
    return a[1] === 0 ? a[0] : Math.gcd(a[1], a[0] % a[1]);
};

/**
 * Returns the Least Common Multiple.
 * @param(Array) a An integer or an Array of integers.
 * @return(Number) Returns the Least Common Multiple.
 */
Math.lcm = function Math_lcm(a) {
    a = a.length ? a:Math.js.copy(arguments);
    var l = a.length;
    while (l - 2) {
        a.unshift(Math.lcm(a.shift(), a.shift()));
        l = a.length;
    }
    return a[0] * a[1] / Math.gcd(a[0], a[1]);
};

/**
 * Determines if a number is prime.
 * @param(Number) a An integer.
 * @return(Boolean) true if a number is prime.
 */
Math.isPrime = function Math_isPrime(n) {
    var i, j, p = Math.js.primes, l, isPrime;
    //if it's in the array, we don't need to do anything else
    if (p.indexOf(n) !== -1) {
        return true;
    }
    //if it's an even number that is not 2, it's not a prime
    if (n % 2 === 0 && n !== 2) {
        return false;
    }
    //a useful limit is the sqrt of n, so that we don't try to divide until 'n'
    l = Math.ceil(Math.sqrt(n));
    //its best to round up, and make it an odd number
    l += l % 2 === 0 ? 1 : 0;
    //if the biggest prime number in the array is less than the rounded sqrt,
    //the list needs to be populated.
    if (p.last() < l) {
        //generates new primes for the array. If the last one is 3, start from 5
        for (i = p.last() + 2; i <= l; i += 2) {
            isPrime = true;
            //if i is divisible by any of the primes, then it isn't a prime number
            for (j = 1; j < p.length && isPrime; j += 1) {
                isPrime = i % p[j] === 0 ? false : isPrime;
            }
            if (isPrime) {
                p.push(i);
            }
        }
    }
    //now that the list is populated, we're gonna check if it is a prime
    l = p.closeTo(l);
    for (i = 0; i < l; i += 1) {
        if (n % p[i] === 0) {
            return false;
        }
    }
    return true;
};

/**
 * Returns the factors of a number in an array.
 * @param(Number) a An integer.
 * @return(Array) Returns the factors of 'a' in an array.
 */
Math.factors = function Math_factors(a) {
    var n = Math.abs(a), r = Math.ceil(Math.sqrt(n)), i = 2, f = [];
    while (i <= n && i <= r) {
        if (n % i === 0) {
            f.push(i);
            n /= i;
        }
        else {
            i += 1;
        }
    }
    if (a !== Math.abs(a)) {
        f.unshift(-1);
    }
    return f;
};

/**
 * Returns the divisors of a number in an array.
 * @param(Number) a An integer.
 * @param(Boolean) b If true, returns the 'proper' divisors.
 * @return(Array) Returns the divisors of 'a' in an array.
 */
Math.divisors = function Math_divisors(a, b) {
    var n = Math.abs(a), r = Math.sqrt(n), i = 1, d = [];
    while (i <= r) {
        if (a % i === 0) {
            d.push(i);
            if (i !== r) {
                d.push(a / i);
            }
        }
        i += 1;
    }
    d = d.sort(Math.js.ascending);
    if (b) {
        d.pop();
    }
    return d;
};

/**
 * Returns a Fibonacci sequence in an array.
 * @param(Number) l The upper limit.
 * @param(Number) a The starting value.
 * @param(Number) b The next value in the sequence.
 * @return(Array) Returns the sequence of Fibonacci numbers.
 */
Math.fibonacci = function Math_fibonacci(l, a, b) {
    a = a === undefined ? 1:a;
    b = b === undefined ? 2:b;
    var r = [a, b];
    while (r.last() < l) {
        r.push(r[r.length - 1] + r[r.length - 2]);
    }
    return r;
};

/**
 * @classDescription Some big Integer functions
 */
Math.bigInt = {};

/**
 * Returns big Integer factorial numbers
 * @param(Number) a An Integer. * @return(String) Returns the evaluated factorial number.
 */
Math.bigInt.factorial = function Math_bigInt_factorial(a) {
    var b = a.toString(), i, j, k, l, o, t, c;
    b = b.split("").reverse();
    for (i = 0; i < b.length; i += 1) {
        b[i] = +b[i];
    }
    for (i = a - 1; i >= 2; i -= 1) {
        l = b.length;
        for (j = 0; j < l; j += 1) {
            b[j] *= i;
        }
        for (j = 0; j < l; j += 1) {
            t = b[j].toString().split("").reverse().join("");
            o = t.length;
            for (k = 0; k < o; k += 1) {
                c = +t.charAt(k);
                b[j + k] = b[j + k] ? (k ? b[j + k] : 0) + c:c;
            }
        }
    }
    return b.reverse().join("");
};

/**
 * Returns the sum of big integers
 * @param(String) a An Integer. * @return(String) Returns the evaluated sum.
 */
Math.bigInt.sum = function Math_bigInt_sum(a) {
    function flip(z) {
        z = typeof(z) === "string" ? z : "" + z;
        z = z.split("").reverse();
        for (var i = 0; i < z.length; i += 1) {
            z[i] = +z[i];
        }
        return z;
    }
    function sum(A, B) {
        var C = [], i, l = Math.max(A.length, B.length);
        for (i = 0; i < l; i += 1) {
            C[i] = (A[i] ? A[i] :0) + (B[i] ? B[i]: 0) + (C[i] ? C[i]: 0);
            if (C[i] >= 10) {
                C[i] -= 10;
                C[i + 1] = C[i + 1] ? C[i + 1] + 1 : 1;
            }
        }
        return C;
    }
    a = a.length && typeof(a) !== "string" ? a:Math.js.copy(arguments);
    var b = a.shift();
    b = flip(b);
    while (a.length) {
        b = sum(b, flip(a.shift()));
    }
    return b.reverse().join("");
};

/**
 * Returns the product of big integers
 * @param(String) a An Integer. * @return(String) Returns the evaluated multiplication.
 */
Math.bigInt.multiply = function Math_bigInt_multiply(a) {
    function toInt(z) {
        for (var i = 0; i < z.length; i += 1) {
            z[i] = +z[i];
        }
        return z;
    }
    function check(x) {
        var i, t, z = Math.js.copy(x).reverse();
        for (i = 0; i < z.length; i += 1) {
            if (z[i] >= 10) {
                t = Math.floor(z[i] / 10);
                z[i] = z[i] % 10;
                z[i + 1] = z[i + 1] !== undefined ? z[i + 1] + t : t;
            }
        }
        z.reverse();
        while (z[0] === 0) {
            z.shift();
        }
        return z.length !== 0 ? z : [0];
    }
    function fillz(z) {
        var r = [];
        while (z > 0) {
            r.push(0);
            z -= 1;
        }
        return r;
    }
    function product(f, g) {
        var i, j, r = [], t, u, z;
        for (j = g.length - 1; j >= 0; j -= 1) {
            t = [];
            //multiplies everything
            for (i = f.length - 1; i >= 0; i -= 1) {
                t[i] = f[i] * g[j];
            }
            //fills an array with zeros, according to the magnitude order of the number
            z = fillz(g.length - j - 1);
            //checks that every number in the array is below 10.
            u = check(t);
            //joins the number array and the zeros, and converts to string.
            t = u.concat(z);
            t = t.join("");
            r.unshift(t);
        }
        return toInt(Math.bigInt.sum(r).split(""));
    }
    a = a.length && typeof(a) !== "string" ? a:Math.js.copy(arguments);
    var b = a.shift(), c;
    b = toInt(("" + b).split(""));
    while (a.length) {
        c = toInt(("" + a.shift()).split(""));
        b = product(b, c);
    }
    return b.length ? b.join("") : "0";
};

/**
 * Returns an integer to a specified power
 * @param(String) a An Integer. * @return(String) Returns the evaluated multiplication.
 */
Math.bigInt.pow = function Math_bigInt_pow(n, p) {
    var r = [], i;
    for (i = 0; i < p; i += 1) {
        r[i] = n;
    }
    return p === 0 ? 1 : Math.bigInt.multiply(r);
};

/**
 * Returns the textual representation of a number.
 * @param(String) a An Integer. * @return(String) Converts the number to text (British English).
 */
Math.toText = function Math_toText(n) {
    n = (typeof(n) !== "string" ? "" + n : n).split("");
    var segs = [], l = n.length, i, r = [], terms = ["", "thousand", "million"];
    terms.push("billion", "trillion", "quadrillion", "quintillion", "sextillion");
    terms.push("septillion", "octillion", "nonillion", "decillion");
    terms.push("undecillion", "duodecillion", "tredecillion");
    while (l > 0) {
        if (l >= 3) {
            segs.push(+n.splice(l - 3, 3).join(""));
            l -= 3;
        } else {
            segs.push(+n.splice(0, l).join(""));
            l = 0;
        }
    }
    if (segs.length === 1 && segs[0] === 0) {
        return "zero";
    }
    function toText(z) {
        function t(a) {
            var r;
            r = a === 1 ? "one" : a === 2 ? "two" : a === 3 ? "three" : "";
            r = a === 4 ? "four" : a === 5 ? "five" : a === 6 ? "six" : "";
            r = a === 7 ? "seven" : a === 8 ? "eight" : a === 9 ? "nine" : "";
            r = a === 11 ? "eleven" : a === 12 ? "twelve" : a === 13 ? "thir" : "";
            r = a === 14 ? "four" : a === 15 ? "fif" : a === 16 ? "six" : "";
            r = a === 17 ? "seven" : a === 18 ? "eigh" : a === 19 ? "nine" : "";
            r += a > 12 && a < 20 ? "teen" : "";
            r = a === 10 ? "ten" : a === 20 ? "twenty" : a === 30 ? "thirty" : "";
            r = a === 40 ? "forty" : a === 50 ? "fifty" : a === 60 ? "sixty" : "";
            r = a === 70 ? "seventy" : a === 80 ? "eighty" : a === 90 ? "ninety" : "";
            return r;
        }
        var a, b, c, d = z % 100, r = "";
        a = Math.floor(z / 100);
        b = Math.floor(d / 10);
        c = d % 10;
        r = a === 0 ? "" : t(a) + " hundred";
        r += a !== 0 && d !== 0 ? " and " : "";
        r += (b !== 0 && c === 0) || d < 20 ? t(d) : t(b * 10) + "-" + t(c);
        return r;
    }
    for (i = 0; i < segs.length; i += 1) {
        if (segs[i] !== 0) {
            r.push(toText(segs[i]) + (terms[i] !== "" ? " " + terms[i] : ""));
        }
    }
    r.reverse();
    return r.join(" ");
};

Math.is = {
	Number: function Math_is_Number(a) {
		return typeof(a) === 'number' ? true : typeof(a) === 'object' ? a.constructor.toString().match(/Number|BigInt/) !== null : false;
	},
	Natural: function Math_is_Natural(a) {
	    
    },
    Integer: function Math_is_Integer(a) {
        return parseInt(a, 10) === a;
    },
    Real: function Math_is_Real(a) {
        return parseInt(a, 10) !== a;
    },
    Even: function Math_is_Even(a) {
        return a % 2 === 0;
    },
    Odd: function Math_is_Odd(a) {
        return a % 2 !== 0;
    }
};

Math.type = {
	of: function Math_type_of(a) {
		for (var i in Math.is) {
			if (Math.is[i](a)) {
				return i.toLowerCase();
			}
		}
	}
};

function BigInt(a) {
    return true;
}
//The limit of integer precision: Math.toText(9007199254740994);
