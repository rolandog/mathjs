/** 
 * math.js
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
if (Array.unique !== undefined) {
    Array.prototype.unique = function () {
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
 * An extension to the Array object that counts the instances of 'a'.
 * @return(Number) Counts how many 'a' there are in the Array.
 */
if (Array.count !== undefined) {
    Array.prototype.count = function (a) {
        var r = 0, i;
        for (i = 0; i < this.length; i += 1) {
            r += this[i] === a ? 1 : 0; 
        }
        return r;
    };
}

/**
 * @classDescription Contains some helpful functions.
 */
Math.js = {
    /**
     * Converts argument objects into arrays.
     * @param(Object) as The arguments Object in a function.
     * @return(Array) An array with the arguments of a function.
     */
    argsToArray: function (as) {
        var a = 0, r = [];
        while (a < as.length) {
            r.push(as[a]);
            a += 1;
        }
        return r;
    },
    /**
     * Sorts an array of numbers in ascending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    ascending: function (a, b) {
        return a - b;
    },
    /**
     * Sorts an array of numbers in descending order properly.
     * @param(Number) a A Number.
     * @param(Number) b A Number.
     * @return(Number) The comparison between those numbers.
     */
    descending: function (a, b) {
        return b - a;
    }
};

/**
 * An extension to the Math object that accepts Arrays or Numbers
 * as an argument and returns the sum of all numbers.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the sum of all numbers.
 */
Math.sum = function (a) {
    var r = 0;
    a = a.length ? a:Math.js.argsToArray(arguments);
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
Math.product = function (a) {
    var r = 1;
    a = a.length ? a:Math.js.argsToArray(arguments);
    while (a.length) {
        r *= a.shift();
    }
    return r;
};

/**
 * An extension to the Math object that accepts a Number
 * and returns the factorial.
 * @param(Array) a A Number or an Array of numbers.
 * @return(Number) Returns the product of all numbers.
 */
Math.factorial = function (a) {
    return (a <= 1) ? 1 : a * Math.factorial(a - 1);
};

/**
 * Returns the Greatest Common Divisor using Euclid's algorithm.
 * @param(Array) a An Array of integers.
 * @return(Number) Returns the Greatest Common Divisor.
 */
Math.gcd = function (a) {
    a = a.length ? a:Math.js.argsToArray(arguments);
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
Math.lcm = function (a) {
    a = a.length ? a:Math.js.argsToArray(arguments);
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
Math.isPrime = function (n) {
    if (n !== Math.floor(n) || n <= 1 || (n % 2 === 0 && n !== 2)) {
        return false;
    }
    if (n > 4) {
        var i, r = Math.ceil(Math.sqrt(n));
        for (i = 3; i <= r; i += 2) {
            if (n % i === 0) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Returns the factors of a number in an array.
 * @param(Number) a An integer.
 * @return(Array) Returns the factors of 'a' in an array.
 */
Math.factors = function (a) {
    var n = Math.abs(a), r = Math.floor(Math.sqrt(n)), i = 2, f = [];
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
Math.divisors = function (a, b) {
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
Math.Fibonacci = function (l, a, b) {
    a = a === undefined ? 1:a;
    b = b === undefined ? 2:b;
    var r = [a, b];
    while (r[r.length - 1] < l) {
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
 */
Math.bigInt.factorial = function (a) {
    var b = a.toString(), i, j, k, l, o, t, c;
    b = b.split("").reverse();
    for (i = 0; i < b.length; i += 1) {
        b[i] = parseInt(b[i], 10);
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
                c = parseInt(t.charAt(k), 10);
                b[j + k] = b[j + k] ? (k ? b[j + k] : 0) + c:c;
            }
        }
    }
    return b.reverse().join("");
};

/**
 * Returns the sum of big Integers
 */
Math.bigInt.sum = function (a) {
    a = a.length && typeof(a) !== "string" ? a:Math.js.argsToArray(arguments);
    var b = a.shift();
    function flip(z) {
        z = typeof(z) === "string" ? z : "" + z;
        z = z.split("").reverse();
        for (var i = 0; i < z.length; i += 1) {
            z[i] = parseInt(z[i], 10);
        }
        return z;
    }
    function sum(A, B) {
        var C = [], i, l = Math.max(A.length, B.length);
        for (i = 0; i < l; i += 1) {
            C[i] = (A[i]?A[i]:0) + (B[i]?B[i]:0) + (C[i]?C[i]:0);
            if (C[i] >= 10) {
                C[i] -= 10;
                C[i + 1] = C[i + 1] ? C[i + 1] + 1 : 1;
            }
        }
        return C;
    }
    b = flip(b);
    while (a.length) {
        b = sum(b, flip(a.shift()));
    }
    return b.reverse().join("");
};

Math.bigInt.multiply = function (a) {
    a = a.length ? a:Math.js.argsToArray(arguments);
    var b = a.shift(), i, j, k, l, o, t, c;
    try {
        b = b.toString();
    } catch (e) {
        e = e;
    }
    b = b.split("").reverse();
    for (i = 0; i < b.length; i += 1) {
        b[i] = parseInt(b[i], 10);
    }
    for (i = 0; i < a.length; i += 1) {
        l = b.length;
        for (j = 0; j < l; j += 1) {
            b[j] *= a[i];
        }
        for (j = 0; j < l; j += 1) {
            t = b[j].toString().split("").reverse().join("");
            o = t.length;
            for (k = 0; k < o; k += 1) {
                c = parseInt(t.charAt(k), 10);
                b[j + k] = b[j + k] ? (k ? b[j + k] : 0) + c:c;
            }
        }
    }
    return b.reverse().join("");
};

//The limit of integer precision: parseInt("9007199254740994", 10)
