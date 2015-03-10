/*jslint devel: true, browser: true, nomen: true*/

/*
BISECTION METHOD EXAMPLE (LIMIT OF ITERATIONS =? 53)
var a = -9007199254740991, b = 9007199254740991, c = a + (b - a) / 2, d, i, j = [c];
for (i = 0; i < 108; i+= 1) {
    d = c + (b - c) / 2;
    if ((b === c || d === b) || c === d) {
        break;
    }
    c = d;
    j.push(c);
}
j;
*/

Function.prototype.addMethods = function addMethods() {
    "use strict";
    var a, as = arguments, l = as.length, i, t, mapper = function mapper(x) {
        //declaring the mapping function outside of a loop,
        //so as to comply with jslint
        this.prototype[x.name] = x;
    };
    for (i = 0; i < l; i += 1) {
        a = as[i];
        if (typeof a === "function") {
            //uncompatible with Opera, probably
            this.prototype[a.name] = a;
        } else if (typeof a === "object") { //if an object or an array
            if (a.constructor.toString().match(/array/i) !== null) {
                a.map(mapper);
            } else {//then use as a name:Function pairs
                for (t in a) {
                    if (a.hasOwnProperty(t)) {
                        this.prototype[t] = a[t];
                    }
                }
            }
        }
    }
};
Function.addMethods(function addMethod(name, func) {
    "use strict";
    this.prototype[name] = func;
    return this;
}, function addGetter(name, func) {
    "use strict";
    this.prototype.__defineGetter__(name, func);
    return this;
}, function addSetter(name, func, funcG) {
    "use strict";
    if (!this.__lookupGetter__(name)) {
        if (!funcG) {
            throw {
                name : "foolError",
                message : "Don't forget to add a Getter for " + name
            };
        }
        this.prototype.__defineGetter__(name, funcG);
    }
    this.prototype.__defineSetter__(name, func);
    return this;
});

Array.addMethod("sum", function sum() {
    "use strict";
    var r = 0,
        t = this,
        l = t.length;
    while (l) {
        l -= 1;
        r += t[l];
    }
    return r;
});

Array.addMethod("add", function add(a) {
    "use strict";
    var t = this,
        l = t.length,
        addA;
    if (a.length) {
        if (a.length !== l) {
            throw {
                name : "LengthError",
                message : "Both arrays are not the same length"
            };
        }
        addA = function addA(x, i) {
            return x + a[i];
        };
    } else {
        addA = function addA(x) {
            return x + a;
        };
    }
    return t.map(addA);
});

Array.addMethod("delta", function delta(a) {
    "use strict";
    var t = this,
        l = t.length,
        deltaA;
    if (a.length) {
        if (a.length !== l) {
            throw {
                name : "LengthError",
                message : "Both arrays are not the same length"
            };
        }
        deltaA = function deltaA(x, i) {
            return x - a[i];
        };
        return t.map(deltaA);
    }
    deltaA = function deltaA(x) {
        return x - a;
    };
    return t.map(deltaA);
});

Number.addGetter("sqrt", function sqrt() {
    "use strict";
    return Math.sqrt(this);
});

Number.addGetter("square", function square() {
    "use strict";
    return this * this;
});

Number.addGetter("doubleFactorial", function doubleFactorial() {
    "use strict";
    if (parseInt(this, 10) !== this) {
        throw {
            name : "IntegerError",
            message : "[doubleFactorial] This function requires (preferrably) positive Integers."
        };
    }
    if (this < -1) {
        if (this % 2 === 0) {
            throw {
                name : "NegativeEvenIntegerError",
                message : "[doubleFactorial] By definition, only odd negative integers are allowed."
            };
        }
        var n = (this + 1) / -2;
        return Math.pow(-1, n) / (2 * n - 1).doubleFactorial;
    }
    if (this === 0 || this === -1) {
        return 1;
    }
    return this >= 2 ? this * (this - 2).doubleFactorial : 1;
});

Number.addGetter("factorial", function factorial() {
    "use strict";
    var n, t, m = Math;
    t = (this * 2) % 2;
    if (t === 1 || t === -1) {
        n = parseInt(this, 10);
        if (this < 0) {    //parseInt will 'round up' when this is negative.
            n -= 1; //-1.5 becomes -1, so we were looking for a -2, definition-wise
        }
        return m.sqrt(m.PI) * (2 * n + 1).doubleFactorial / m.pow(2, n + 1);
    }
    return this ? this * (this - 1).factorial : 1;
});

Number.addGetter("gamma", function gamma() {
    "use strict";
    return (this - 1).factorial;
});

Number.addMethod("pow", function pow(n) {
    "use strict";
    return Math.pow(this, n);
});

Number.addMethod("choose", function choose(k) { //n choose k
    "use strict";
    var n = this, i = 0, t = [];
    if (k < n && k >= 0) {
        do {
            i += 1;
            t.push((n - (k - i)) / i);
        } while (i < k);
        return t.product();
    }
    return 0;
});

Array.addMethod("sqrt", function sqrt() {
    "use strict";
    return this.map(function sqrtA(x) {
        return Math.sqrt(x);
    });
});

Array.addMethod("square", function square() {
    "use strict";
    return this.map(function squareA(x) {
        return x * x;
    });
});

Array.addMethod("pow", function pow(n) {
    "use strict";
    return this.map(function powA(x) {
        return Math.pow(x, n);
    });
});

Array.addMethod("product", function product(a) {
    "use strict";
    var t = this,
        l = t.length,
        productA,
        r;
    if (a) {
        if (a.length) {
            if (a.length !== l) {
                throw {
                    name : "LengthError",
                    message : "Both arrays are not the same length"
                };
            }
            productA = function productA(x, i) {
                return x * a[i];
            };
            r = t.map(productA);
        } else {
            productA = function productA(x) {
                return x * a;
            };
            r = t.map(productA);
        }
    } else {
        productA = 1;
        do {
            l -= 1;
            productA *= t[l];
        } while (l > 0);
        r = productA;
    }
    return r;
});

Array.addMethod("max", function max() {
    "use strict";
    var r = -Infinity,
        t = this,
        l = t.length,
        s;
    while (l) {
        l -= 1;
        s = t[l];
        if (s > r && typeof s === "number") {
            r = s;
        }
    }
    return r;
});

Array.addMethod("min", function min() {
    "use strict";
    var r = Infinity,
        t = this,
        l = t.length,
        s;
    while (l) {
        l -= 1;
        s = t[l];
        if (s < r && typeof s === "number") {
            r = s;
        }
    }
    return r;
});

Array.addMethod("ascending", function ascending() {
    "use strict";
    return this.concat().sort(function asc(a, b) {
        return a - b;
    });
});

Array.addMethod("descending", function descending() {
    "use strict";
    return this.concat().sort(function des(a, b) {
        return b - a;
    });
});

Array.addMethod("onlyNumbers", function onlyNumbers() {
    "use strict";
    var t = this, i, l = t.length, r = [];
    for (i = 0; i < l; i += 1) {
        if (typeof t[i] === "number") {
            r.push(t[i]);
        }
    }
    return r;
});

Array.addMethod("mean", function mean() {
    "use strict";
    var oN = this.onlyNumbers();
    return oN.sum() / oN.length;
});

Array.addMethod("median", function median() {
    "use strict";
    var a = this.onlyNumbers().ascending(),
        l = a.length,
        s;
    if (l % 2) { //if odd
        s = a[parseInt(l / 2, 10)];
    } else { //if even
        l = parseInt(l / 2, 10) - 1;
        s = (a[l] + a[l + 1]) / 2;
    }
    return s;
});

//from this value to the median, 25% of the data is occupied (25%)
Array.addMethod("lowerQuartile", function lowerQuartile() {
    "use strict";
    var t = this.ascending().slice(0, Math.round(this.length / 2));
    return t.median();
});

//from the median to this value, 25% of the data is occupied (75%)
Array.addMethod("upperQuartile", function upperQuartile() {
    "use strict";
    var t = this.ascending().slice(this.length / 2);
    return t.median();
});

//this range -- the center of which is the median -- covers 50% of the samples
Array.addMethod("iqr", function iqr() {
    "use strict";
    return this.upperQuartile() - this.lowerQuartile();
});

//values lower than these are outliers, 99.7% is covered from this to the higher fence
Array.addMethod("lowerFence", function lowerFence() {
    "use strict";
    return this.lowerQuartile() - 1.5 * this.iqr();
});

//values higher than these are outliers, 99.7% is covered from this to the lower fence
Array.addMethod("upperFence", function upperFence() {
    "use strict";
    return this.upperQuartile() + 1.5 * this.iqr();
});

Array.addMethod("stdev", function stdev() {
    "use strict";
    var t = this,
        l = t.length,
        i = l,
        mean = this.mean(),
        s = 0,
        d;
    if (l < 2) {
        throw {
            name : "LengthError",
            message : "stdev requires having 2 items or more to calculate the standard deviation."
        };
    }
    while (i) {
        i -= 1;
        d = t[i] - mean;
        d *= d;
        s += d;
    }
    s /= l;
    return Math.sqrt(s);
});

//Sum of Square Error
Array.addMethod("SSE", function SSE(yreg) {
    "use strict";
    var y = this,
        l = y.length;
    if (yreg.length !== l) {
        throw {
            name : "LengthError",
            message : "Both arrays are not the same length"
        };
    }
    return y.delta(yreg).square().sum();
});

Array.addMethod("SST", function SST() {
    "use strict";
    var y = this,
        l = y.length;
    if (l < 2) {
        throw {
            name : "LengthError",
            message : "You should have two or more values in the array."
        };
    }
    return y.delta(y.mean()).square().sum();
});

Array.addMethod("R2", function R2(yreg) {
    "use strict";
    var y = this,
        l = y.length;
    if (yreg.length !== l) {
        throw {
            name : "LengthError",
            message : "Both arrays are not the same length"
        };
    }
    return 1 - y.SSE(yreg) / y.SST();
});

Array.addMethod("transpose", function transpose() {
    "use strict";
    var t = this,
        l = t.length,
        mL = t.map(function (x) { //check lengths of all arrays
            return x.length;
        }),
        m = mL.max(),
        sL = m === mL.min(),
        i,
        j,
        r = [],
        p;
    for (j = 0; j < m; j += 1) {
        p = [];
        for (i = 0; i < l; i += 1) {
            //if (t[i][j] !== undefined) { //this may allow for transposing uneven length arrays.
            //}
            if (sL) {
                p.push(t[i][j]);
            }
        }
        r.push(p);
    }
    return r;
});

Array.addMethod("sstdev", function sstdev() {
    "use strict";
    var stdev = this.stdev(), l = this.length;
    return Math.sqrt(stdev * stdev * l / (l - 1));
});

Array.addMethod("unique", function Array_unique() {
    "use strict";
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
});

Array.addMethod("fill", function fill(start, end, by) {
    "use strict";
    var i = start,
        j = 0,
        k = by.toString().match(/\d+/ig), //temp variable
        rP = k.length === 1 ? 0 : k[1].length,
        factor = rP === 0 ? 1 : Math.pow(10, rP),
        mR = Math.round;
    if (rP) {
        while (i <= end) {
            this[j] = i;
            j += 1;
            i = mR(factor * (i + by)) / factor;
        }
    } else {
        while (i <= end) {
            this[j] = i;
            j += 1;
            i += by;
        }
    }
    return this;
});

Array.addMethod("count", function Array_count(a) {
    "use strict";
    var r = 0, t = this, i = t.length;
    while (i) {
        i -= 1;
        r += t[i] === a ? 1 : 0;
    }
    return r;
});

Number.addMethod("hypergeometric", function hypergeometric(a, b, c, returnT) { //2F1
    "use strict";
    var z = this,
        r = 0,
        t,
        n = 0,
        ap,
        bp,
        cp,
        zp,
        nfact,
        m = Math,
        logS = "",
        maxT = z < -1 || z > 1 ? m.sqrt(-(z * (b * 2 - 1))) : undefined,
        msg;
    if (z < -1 || z > 1) {
        msg = "The hypergeometric series won't converge, since z must satisfy -1 < z < 1.\n";
        msg += "z = " + z + ";";
        throw {
            name : "Convergence Error",
            message : msg
        };
    }
    do {
        ap = a.pochhammer(n);
        bp = b.pochhammer(n);
        cp = c.pochhammer(n);
        zp = z.pow(n);
        nfact = n.factorial;
        t = (ap / cp) * (bp / nfact) * zp;
        if (t === Infinity || t === -Infinity || isNaN(t)) { //
            break;
        }
        if (r + t === r) { //convergence
            break;
        }
        r = r + t;
        n += 1;
    } while (n < 42 * 7);
    logS += "a = " + a + ";\n";
    logS += "b = " + b + ";\n";
    logS += "c = " + c + ";\n";
    logS += "z = " + z + ";\n\n";
    logS += "t = ((" + a + ")" + n + " * ";
    logS += "(" + b + ")" + n + " / ";
    logS += "(" + c + ")" + n + ") * ";
    logS += "(" + z + ")^" + n + " / ";
    logS += n + "!;\n";
    logS += "t = " + t + ";\n";
    logS += "r = " + r + ";\n";
    logS += "maxT = " + maxT + ";";
    /*logS += "r += t;\n";
    logS += "r = " + (r + t) + ";";*/
    console.log(logS);
    return returnT ? t : r;
});

// factorials of 0, 1
Math.factorials = [1, 1];

Math.factorial = function Math_factorial(n) {
    "use strict";
    var f = Math.factorials,
        i = f.length,
        k,
        result;
    if (!(f[n] === undefined)) {
        return f[n];
    }
    result = f[i - 1];
    for (k = i; k <= n; k += 1) {
        result = result * k;
        f[k] = result;
    }
    //i = k;
    return result;
};

//due to memoization following line will cache first 15 elements
Math.factorial(15);


// values of Gammas of Γ(0), Γ(1)
Math.gammas = [Infinity, 1, 1];

//Gamma function Γ
Math.gamma = function Math_gamma(n) {
    "use strict";
    //if n is an integer
    var m = Math,
        g = m.gammas,
        i = g.length - 1,
        abs = m.abs,
        pow = m.pow,
        exp = m.exp,
        sqrt = m.sqrt,
        fact = m.factorial,
        sqrtPI = sqrt(Math.PI),
        result,
        j,
        index;
    if (!(g[n] === undefined)) {
        return g[n];
    }
    if (n === parseInt(n, 10)) {
        if (n >= 1) {
            result = g[i];
            for (j = i; j <= n; j += 1) {
                result = fact(j - 1);
                g[j] = result;
            }
            //return fact(n - 1);
            return result;
        }
        if (n < 0) {
            return Infinity;
        }
    }
    //if n + or - 0.5
    if (2 * n === parseInt(2 * n, 10)) {
        if (n > 0) {
            index = n;
            n = parseInt(n, 10);
            n = (fact(2 * n) / fact(n)) * (sqrtPI / pow(4, n));
            g[index] = n;
            return n;
        }
        if (n < 0) {
            index = n;
            n = abs(parseInt(n, 10) - 1);
            n = (pow(-4, n) * sqrtPI * fact(n)) / fact(2 * n);
            g[index] = n;
            return n;
        }
    }
    //JS implementation by Rolando Garza of
    //Spouge's approximation of Γ(z+1)
    //http://en.wikipedia.org/wiki/Spouge%27s_approximation
    function gamma_Spouge(z) {
        var precision = 10, //objective of decimal places to compute
            a = Math.ceil(precision / 0.75), //estimation from Wiki page
            k,
            c0 = sqrt(2 * Math.PI),
            sumOfCK_zpk = c0,
            ck,
            resultS = pow(z + a, z + 0.5) * exp(-(z + a));
        for (k = 1; k < a; k += 1) {
            ck = pow(-1, k - 1) / fact(k - 1);
            ck *= pow(-k + a, k - 0.5);
            ck /= (z + k);
            ck *= exp(-k + a);
            sumOfCK_zpk += ck;
        }
        resultS *= sumOfCK_zpk;
        /*if (z > 0 && a > 2) {
            console.log("Relative error of discarding εa(z): " + Math.pow(a, -0.5) * Math.pow((2 * Math.PI), -(a + 0.5)));
        }*/
        return resultS;
    }
    if (n > 0) {
        index = n;
        n = gamma_Spouge(n - 1);
        g[index] = n;
        return n;
    }
};

//due to memoization following line will cache first 15 elements
Math.gamma(15);

Math.risingFactorial = function risingFactorial(x, n) { //(this)n, aka rising factorial
    "use strict";
    var result = 1,
        i;
    if (n >= 0 && n === parseInt(n, 10)) {
        if (n === 0) {
            return 1;
        }
        for (i = x; i <= x + n - 1; i += 1) {
            result *= i;
        }
        return result;
    }
    throw "n must be an integer equal to or larger than 0";
};

Math.fallingFactorial = function fallingFactorial(x, n) { //(this)n, aka rising factorial
    "use strict";
    var result = 1,
        i;
    if (n >= 0 && n === parseInt(n, 10)) {
        if (n === 0) {
            return 1;
        }
        for (i = x - n + 1; i <= x; i += 1) {
            result *= i;
        }
        return result;
    }
    throw "n must be an integer equal to or larger than 0";
};

Math.K = {
    uniform : function uniform(u) {
        "use strict";
        var k = 1 / 2;
        k *= Math.abs(u) <= 1 ? 1 : 0;
        return k;
    },
    triangular : function triangular(u) {
        "use strict";
        var au = Math.abs(u),
            k = 1 - au;
        k *= au <= 1 ? 1 : 0;
        return k;
    },
    epanechnikov : function epanechnikov(u) {
        "use strict";
        var au = Math.abs(u),
            k = 0.75;
        k *= 1 - u.pow(2);
        k *= au <= 1 ? 1 : 0;
        return k;
    },
    biweight : function biweight(u) {
        "use strict";
        var au = Math.abs(u),
            k = 15 / 16;
        k *= (1 - u.pow(2)).pow(2);
        k *= au <= 1 ? 1 : 0;
        return k;
    },
    triweight : function triweight(u) {
        "use strict";
        var au = Math.abs(u),
            k = 35 / 32;
        k *= (1 - u.pow(2)).pow(3);
        k *= au <= 1 ? 1 : 0;
        return k;
    },
    tricube : function tricube(u) {
        "use strict";
        var au = Math.abs(u),
            k = 70 / 81;
        k *= (1 - au.pow(3)).pow(3);
        k *= au <= 1 ? 1 : 0;
        return k;
    },
    gaussian : function gaussian(u) {
        "use strict";
        var m = Math,
            k = 1 / m.sqrt(2 * m.PI);
        k *= m.exp(-0.5 * u.pow(2));
        return k;
    },
    cosine : function cosine(u) {
        "use strict";
        var m = Math,
            au = m.abs(u),
            piBy2 = m.PI / 2,
            k = piBy2 / 2;
        k *= m.cos(piBy2 * u);
        k *= au <= 1 ? 1 : 0;
        return k;
    }
};
Math.distributions = {
    normal : {
        pdf : function normalPDF(x, mean, stdev) {
            "use strict";
            //Normal Probability Density Function
            if (mean === undefined) {
                mean = 0;
            }
            if (stdev === undefined) {
                stdev = 1;
            }
            var a,
                b,
                c,
                m = Math,
                pow = m.pow;
            c = 2 * pow(stdev, 2);
            a = 1 / m.sqrt(m.PI * c);
            b = pow(x - mean, 2) / c;
            return a * m.exp(-b);
        },
        cdf : function normalCDF(x, mean, stdev) {
            "use strict";
            //Normal Cumulative Distribution Function
            //JS adaptation of "thus spake a.k."'s C++ implementation of Graeme West's improvement of the Hart algorithm
            //http://stackoverflow.com/questions/2328258/cumulative-normal-distribution-function-in-c-c
            //http://www.wilmott.com/pdfs/090721_west.pdf
            if (mean === undefined) {
                mean = 0;
            }
            if (stdev === undefined) {
                stdev = 1;
            }
            x = (x - mean) / stdev;
            var RT2PI = Math.sqrt(2 * Math.PI),
                SPLIT = 7.07106781186547,
                N0 = 220.206867912376,
                N1 = 221.213596169931,
                N2 = 112.079291497871,
                N3 = 33.912866078383,
                N4 = 6.37396220353165,
                N5 = 0.700383064443688,
                N6 = 3.52624965998911e-02,
                M0 = 440.413735824752,
                M1 = 793.826512519948,
                M2 = 637.333633378831,
                M3 = 296.564248779674,
                M4 = 86.7807322029461,
                M5 = 16.064177579207,
                M6 = 1.75566716318264,
                M7 = 8.83883476483184e-02,
                z = Math.abs(x),
                c = 0.0,
                e,
                n,
                d,
                f;
            if (z <= 37) {
                e = Math.exp(-z * z / 2.0);
                if (z < SPLIT) {
                    n = (((((N6 * z + N5) * z + N4) * z + N3) * z + N2) * z + N1) * z + N0;
                    d = ((((((M7 * z + M6) * z + M5) * z + M4) * z + M3) * z + M2) * z + M1) * z + M0;
                    c = e * n / d;
                } else {
                    f = z + 1.0 / (z + 2.0 / (z + 3.0 / (z + 4.0 / (z + 13.0 / 20.0))));
                    c = e / (RT2PI * f);
                }
            }
            return x <= 0.0 ? c : 1 - c;
        },
        ppf : function normalInverseCDF(p, mean, stdev) {
            "use strict";
            //Percent Point Function
            //also known as the inverse of the cumulative distribution function
            //this is a numerical method to estimate the value at which the
            //CDF is equal to a certain probability (between 0 and 1)
            if (mean === undefined) {
                mean = 0;
            }
            if (stdev === undefined) {
                stdev = 1;
            }
            var xA,
                xB,
                xC,
                xD,
                normalCDF = Math.distributions.normal.cdf,
                cdfA,
                cdfB,
                cdfC,
                cdfD,
                i,
                j = [];
            if (p >= 0 && p <= 1) {
                if (p === 0.5) {
                    //if the value es 0.5, then it is right in mean = 0
                    return mean;
                }
                if (p < 0.5) {
                    //it might be a negative number
                    //because of JS precision, CDF(xA) -> tends to be 0 with this value
                    xA = -37.00000000000001;
                    xB = 0;
                    if (p === 0) {
                        return xA * stdev + mean;
                    }
                }
                if (p > 0.5) {
                    //otherwise, it is a positive number
                    //since JS precision is bad, CDF(xB) -> tends to be 1 with this value
                    xA = 0;
                    xB = 8.2923610748646536805495088629;
                    if (p === 1) {
                        return xB * stdev + mean;
                    }
                }
            }
            if (p < 0 || p > 1) {
                throw "Probability must be a value between 0 and 1";
            }
            cdfA = normalCDF(xA);
            cdfB = normalCDF(xB);
            if (cdfA === p) {
                return mean + stdev * xA;
            }
            if (cdfB === p) {
                return mean + stdev * xB;
            }
            for (i = 0; i < 108; i += 1) {
                xC = xA + (xB - xA) / 2;
                cdfC = normalCDF(xC);
                if ((xC === xA || xC === xB) || (xC === xD || cdfC === cdfD)) {
                    break;
                }
                j.push(xC);
                if (cdfA < p && cdfC > p) {
                    xB = xC;
                    cdfB = cdfC;
                } else if (cdfC < p && cdfB > p) {
                    xA = xC;
                    cdfA = cdfC;
                }
                xD = xC;
                cdfD = cdfC;
            }
            console.log(j.length);
            return mean + stdev * xC;
        },
        haz : function normalHazard(x, mean, stdev) {
            "use strict";
            //Normal Hazard Function
            if (mean === undefined) {
                mean = 0;
            }
            if (stdev === undefined) {
                stdev = 1;
            }
            var z = (x - mean) / stdev,
                pdf = Math.distributions.normal.pdf,
                cdf = Math.distributions.normal.cdf,
                survA = 1 - cdf(z),
                survB = cdf(-z);
            if (!(survA === 0 && survB === 0)) {
                //if none of these are 0
                return pdf(z) / (1 - cdf(z));
            }
            if ((survA === 0 || survB === 0) && !(survA === 0 && survB === 0)) {
                //if one of these is 0
                if (survB > survA) {
                    survA = survB;
                }
                return pdf(z) / survA;
            }
            //if both are 0
            throw "The hazard function has tried to divide by 0.";
        },
        cHaz : function normalCumulativeHazard(x, mean, stdev) {
            "use strict";
            //Normal Cumulative Hazard Function
            if (mean === undefined) {
                mean = 0;
            }
            if (stdev === undefined) {
                stdev = 1;
            }
            var z = (x - mean) / stdev,
                cdf = Math.distributions.normal.cdf,
                survA = 1 - cdf(z),
                survB = cdf(-z);
            if (!(survA === 0 && survB === 0)) {
                //if none of these are 0
                return -Math.log(1 - cdf(z));
            }
            if ((survA === 0 || survB === 0) && !(survA === 0 && survB === 0)) {
                //if one of these is 0
                if (survB > survA) {
                    survA = survB;
                }
                return -Math.log(survA);
            }
            //if both are 0
            throw "The cumulative hazard function has tried to compute ln(0).";
        },
        sur : function normalSurvival(x, mean, stdev) {
            "use strict";
            //Normal Survival Function
            return 1 - Math.distributions.normal.cdf(x, mean, stdev);
        },
        iSur : function normalInverseSurvival(p, mean, stdev) {
            "use strict";
            //Inverse Normal Survival Function
            return Math.distributions.normal.ppf(1 - p, mean, stdev);
        }
    },
    uniform : {
        pdf : function uniformPDF(x, a, b) {
            "use strict";
            //Uniform Probability Density Function
            if (a === undefined) {
                a = 0;
            }
            if (b === undefined) {
                b = 1;
            }
            if (x < a || x > b) {
                return 0;
            }
            return 1 / (b - a);
        },
        cdf : function uniformCDF(x, a, b) {
            "use strict";
            //Uniform Cumulative Distribution Function
            if (a === undefined) {
                a = 0;
            }
            if (b === undefined) {
                b = 1;
            }
            if (x < a) {
                return 0;
            }
            if (x > b) {
                return 1;
            }
            return (x - a) / (b - a);
        },
        ppf : function uniformInverseCDF(p, a, b) {
            "use strict";
            //Uniform Inverse Cumulative Distribution Function
            if (a === undefined) {
                a = 0;
            }
            if (b === undefined) {
                b = 1;
            }
            if (p < a) {
                return 0;
            }
            if (p > b) {
                return 1;
            }
            return a + p * (b - a);
        },
        haz : function uniformHazard(x, a, b) {
            "use strict";
            //Uniform Hazard Function
            if (a === undefined) {
                a = 0;
            }
            if (b === undefined) {
                b = 1;
            }
            if (x < a) {
                return 0;
            }
            if (x > b) {
                return 1;
            }
            return 1 / (1 - ((x - a) / (b - a)));
        },
        cHaz : function uniformCumulativeHazard(x, a, b) {
            "use strict";
            //Uniform Cumulative Hazard Function
            if (a === undefined) {
                a = 0;
            }
            if (b === undefined) {
                b = 1;
            }
            return -Math.log(1 - ((x - a) / (b - a)));
        },
        sur : function uniformSurvival(x, a, b) {
            "use strict";
            //Uniform Survival Function
            return 1 - Math.distributions.uniform.cdf(x, a, b);
        },
        iSur : function uniformInverseSurvival(p, a, b) {
            "use strict";
            //Uniform Inverse Survival Function
            return Math.distributions.uniform.ppf(1 - p, a, b);
        }
    },
    student : {
        pdf : function studentPDF(x, v, mean, scale) {
            "use strict";
            //Student Probability Density Function
            if (mean === undefined) {
                mean = 0;
            }
            if (scale === undefined) {
                scale = 1;
            }
            if (v === undefined) {
                throw "Unspecified degrees of freedom.";
            }
            v = parseInt(v, 10);
            if (v === 0 || v < 0) {
                throw "Degrees of freedom must be an integer larger than 0.";
            }
            //this formula will compute
            //gamma((v + 1) / 2) / gamma(v / 2) / sqrt(pi * v)
            function gbg(a) {
                //if the remainder of dividing by two is 0
                var k,
                    result = 1 / Math.sqrt(a),
                    l = (a - 1) / 2,
                    i;
                // if degrees of freedom is even
                if (a % 2 === 0) {
                    k = 3 / 2;
                    result /= 2;
                } else {
                // if degrees of freedom is odd
                    k = 1;
                    result /= Math.PI;
                }
                for (i = k; i <= l; i += 1) {
                    result *= (2 * i) / (2 * i - 1);
                }
                return result;
            }
            var t = (x - mean) / scale;
            if (v === 1) {
                return 1 / (Math.PI * (1 + t * t));
            }
            if (v === 2) {
                return 1 / Math.pow(2 + t * t, 1.5);
            }
            if (v === 3) {
                return 6 * Math.sqrt(3) / (Math.PI * Math.pow(3 + t * t, 2));
            }
            return (gbg(v) / scale) * Math.pow(1 + (t * t) / v, -((v + 1) / 2));
        },
        cdf : function studentCDF(x, v, mean, scale) {
            "use strict";
            if (mean === undefined) {
                mean = 0;
            }
            if (scale === undefined) {
                scale = 1;
            }
            if (v === undefined) {
                throw "Unspecified degrees of freedom.";
            }
            v = parseInt(v, 10);
            if (v === 0 || v < 0) {
                throw "Degrees of freedom must be an integer larger than 0.";
            }
            /* This whole section wasn't useful, since 2F1 doesn't converge very well
            // instead, I'll be using the CDF in terms of the Incomplete Beta Function
                // Hypergeometric Function 2F1(q, b; c; z)
                // for q = 1/2, c = 3/2
                // b = (v + 1) / 2
                // z = -(x^2) / v
                function h2F1(z, d) {
                    "use strict";
                    var i, //will act as the counter for the infinite sum
                        j, //will act as the rising factorial counter for each step of the sum
                        z_abs = z * z / d, //x^2/v without the negative sign
                        b = (d + 1) / 2, //will act as the value of (v+1)/2
                        resultH = 1, //initialization of 2F1
                        prevH = 1, //first previous value of 2F1
                        sign, //a variable to estimate the sign of each iteration
                        tol2 = 1e-36, // square of tolerance; when to break (if growth is small)
                        stepValue; //for each step of n, a new step value
                    if (z === 0) {
                        return 1;
                    }
                    if (z > Math.sqrt(d) * Math.pow(0.9999, d)) {
                        throw "Undefined; will not converge.";
                    }
                    //first iteration is 1, so we skip i = 0
                    //manually set a limit of 100,000 iterations
                    for (i = 1; i < 100000; i += 1) {
                        sign = 1 - (2 * (i % 2)); //sign = -1 when i is odd, else sign = 1
                        stepValue = sign / (2 * i + 1); //start with sign/(2n+1)
                        for (j = 0; j <= i - 1; j += 1) {
                            stepValue /= j + 1;
                            stepValue *= z_abs;
                            stepValue *= b + j;
                        }
                        resultH += stepValue;
                        if ((stepValue * stepValue) < tol2) {
                            console.log("2F1(0.5, " + (d + 1) / 2 + ", 1.5, " + (-z * z / d) + ");");
                            console.log(i + " iterations with an error of " + stepValue);
                            return resultH;
                        }
                        prevH = resultH; //new 'previous' value of the infinite sum
                    }
                    console.log("Stopped at " + i + " iterations with an error of " + stepValue);
                    return resultH;
                }
                //this formula will compute
                //gamma((v + 1) / 2) / gamma(v / 2) / sqrt(pi * v)
                function gbg(a) {
                    //if the remainder of dividing by two is 0
                    var k,
                        result = 1 / Math.sqrt(a),
                        l = (a - 1) / 2,
                        i;
                    // if degrees of freedom is even
                    if (a % 2 === 0) {
                        k = 3 / 2;
                        result /= 2;
                    } else {
                    // if degrees of freedom is odd
                        k = 1;
                        result /= Math.PI;
                    }
                    for (i = k; i <= l; i += 1) {
                        result *= (2 * i) / (2 * i - 1);
                    }
                    return result;
                }
                var t = (x - mean) / scale,
                    res = 1,
                    tlog;
                //gamma is a big limitation, I should try to optimize this function by creating cases
                //so that larger values of v are tolerated
                if (t === 0) {
                    return 0.5;
                }
                if (v === 1) {
                    return 0.5 + Math.atan(t) / Math.PI;
                }
                if (v === 2) {
                    return 0.5 * (1 + t / Math.sqrt(2 + Math.pow(t, 2)));
                }
                tlog = t;
                console.log("t = " + tlog);
                res *= t;
                tlog = h2F1(t, v);
                console.log("h2F1 = " + tlog);
                res *= tlog;
                tlog = gbg(v);
                console.log("Γ((v+1)/2)/sqrt(pi*v)/Γ(v/2)= " + tlog);
                res *= tlog;
                res += 0.5;
                return res;
            */

            //returns the regularized incomplete beta function
            //for a 'z' t-value, and 'd' degrees of freedom
            function incompleteBeta(z, d) {
                //this function will compute
                //gamma((v + 1) / 2) / gamma(v / 2) / sqrt(pi)
                function gbg(a) {
                    //if the remainder of dividing by two is 0
                    var k,
                        result = 1,
                        l = (a - 1) / 2,
                        i;
                    // if degrees of freedom is even
                    if (a % 2 === 0) {
                        k = 3 / 2;
                        result /= 2;
                    } else {
                    // if degrees of freedom is odd
                        k = 1;
                        result /= Math.PI;
                    }
                    for (i = k; i <= l; i += 1) {
                        result *= (2 * i) / (2 * i - 1);
                    }
                    return result;
                }
                var i, //will act as the counter for the infinite sum
                    j, //will act as the rising factorial counter for each step of the sum
                    z_abs = d / (z * z + d), // v/(v+t^2) = x(t) for
                    b = 1 / 2, //for each rising factorial of the incomplete beta function
                    resultH = 2 / d, //initialization of incomplete beta function
                    tol2 = 1e-42, // square of tolerance; when to break (if growth is small)
                    stepValue; //for each step of n, a new step value to be computed
                if (z === 0) {
                    return 1;
                }
                //first iteration is 1, so we skip i = 0
                //manually set a limit of 100,000 iterations
                for (i = 1; i < 100000; i += 1) {
                    stepValue = 1 / (i + d / 2); //starting point: (1 / (n + df/2))
                    for (j = 0; j <= i - 1; j += 1) {
                        stepValue *= z_abs;
                        stepValue *= j + b;
                        stepValue /= j + 1;
                    }
                    resultH += stepValue;
                    if ((stepValue * stepValue) < tol2) {
                        //console.log("Ix(" + d / 2 + ", 1/2);");
                        //console.log(i + " iterations with an error of " + stepValue);
                        resultH *= Math.pow(z_abs, d / 2);
                        resultH *= gbg(d);
                        return resultH;
                    }
                }
                //console.log("Stopped at " + i + " iterations with an error of " + stepValue);
                resultH *= Math.pow(z_abs, d / 2);
                resultH *= gbg(d);
                return resultH;
            }

            var t = (x - mean) / scale,
                res = 1;
            if (t === 0) {
                return 0.5;
            }
            if (v === 1) {
                return 0.5 + Math.atan(t) / Math.PI;
            }
            if (v === 2) {
                return 0.5 * (1 + t / Math.sqrt(2 + Math.pow(t, 2)));
            }
            res -= 0.5 * incompleteBeta(t, v);
            if (t > 0) {
                return res;
            }
            return 1 - res;
        },
        ppf : function studentInverseCDF(p, v, mean, scale) {
            "use strict";
            //Percent Point Function
            //also known as the inverse of the cumulative distribution function
            //this is a numerical method to estimate the value at which the
            //CDF is equal to a certain probability (between 0 and 1)
            if (mean === undefined) {
                mean = 0;
            }
            if (scale === undefined) {
                scale = 1;
            }
            if (v === undefined) {
                throw "Unspecified degrees of freedom.";
            }
            v = parseInt(v, 10);
            if (v === 0 || v < 0) {
                throw "Degrees of freedom must be an integer larger than 0.";
            }
            var xA,
                xB,
                xC,
                xD,
                studentCDF = Math.distributions.student.cdf,
                cdfA,
                cdfB,
                cdfC,
                cdfD,
                i,
                j = [],
                c1,
                c2;
            if (p >= 0 && p <= 1) {
                if (p === 0.5) {
                    //if the value es 0.5, then it is right in mean = 0
                    return mean;
                }
                if (p < 0.5) {
                    //it might be a negative number
                    //because of JS precision, CDF(xA, v) -> tends to be 0 with this values
                    if (v === 1) {
                        xA = -2536144836019041.75;
                        xB = 0;
                    }
                    if (2 <= v && v <= 10) {
                        c1 = 0.2964285788133360;
                        c2 = -34.005724601649;
                        xA = -1 / (c1 * Math.exp(c2 / v));
                        xB = 0;
                        if (studentCDF(xA, v) !== 0) {
                            xA = xA * 1.1;
                        }
                    }
                    if (10 < v) {
                        c1 = 1.04342683380019;
                        c2 = -4.20731635152386;
                        xA = 1 / (c1 * Math.exp(c2 / v));
                        xA = xA * xA;
                        xA = -Math.pow(10, xA);
                        xB = 0;
                        if (studentCDF(xA, v) !== 0) {
                            xA = xA * (1 + 3.1 * (Math.pow(v, -1.4)));
                        }
                    }
                    if (p === 0) {
                        return xA * scale + mean;
                    }
                }
                if (p > 0.5) {
                    //otherwise, it is a positive number
                    //because of JS precision, CDF(xA, v) -> tends to be 0 with this values
                    if (v === 1) {
                        xA = 0;
                        xB = 2536144836019041.75;
                    }
                    if (2 <= v && v <= 10) {
                        c1 = 0.305514291303379;
                        c2 = -34.0952926942464;
                        xA = 0;
                        xB = 1 / (c1 * Math.exp(c2 / v));
                        if (studentCDF(xB, v) !== 1) {
                            xB = xB * 1.1;
                        }
                    }
                    if (10 < v) {
                        c1 = 1.04335554184711;
                        c2 = -4.18907571248324;
                        xA = 0;
                        xB = 1 / (c1 * Math.exp(c2 / v));
                        xB = xB * xB;
                        xB = Math.pow(10, xB);
                        if (studentCDF(xB, v) !== 1) {
                            xB = xB * (1 + 3.1 * (Math.pow(v, -1.4)));
                        }
                    }
                    if (p === 1) {
                        return xB * 1.1 * scale + mean;
                    }
                }
            }
            if (p < 0 || p > 1) {
                throw "Probability must be a value between 0 and 1";
            }
            cdfA = studentCDF(xA, v);
            cdfB = studentCDF(xB, v);
            if (cdfA === p) {
                return mean + scale * xA;
            }
            if (cdfB === p) {
                return mean + scale * xB;
            }
            for (i = 0; i < 108; i += 1) {
                xC = xA + (xB - xA) / 2;
                cdfC = studentCDF(xC, v);
                if ((xC === xA || xC === xB) || (xC === xD || cdfC === cdfD)) {
                    break;
                }
                j.push(xC);
                if (cdfA < p && cdfC > p) {
                    xB = xC;
                    cdfB = cdfC;
                } else if (cdfC < p && cdfB > p) {
                    xA = xC;
                    cdfA = cdfC;
                }
                xD = xC;
                cdfD = cdfC;
            }
            //console.log(j.length);
            return mean + scale * xC;
        },
        haz : function studentHazard(x, v, mean, scale) {
            "use strict";
            //Student Hazard Function
            if (mean === undefined) {
                mean = 0;
            }
            if (scale === undefined) {
                scale = 1;
            }
            if (v === undefined) {
                throw "Unspecified degrees of freedom.";
            }
            v = parseInt(v, 10);
            if (v === 0 || v < 0) {
                throw "Degrees of freedom must be an integer larger than 0.";
            }
            var z = (x - mean) / scale,
                pdf = Math.distributions.student.pdf,
                cdf = Math.distributions.student.cdf,
                survA = 1 - cdf(z),
                survB = cdf(-z);
            if (!(survA === 0 && survB === 0)) {
                //if none of these are 0
                return pdf(z) / (1 - cdf(z));
            }
            if ((survA === 0 || survB === 0) && !(survA === 0 && survB === 0)) {
                //if one of these is 0
                if (survB > survA) {
                    survA = survB;
                }
                return pdf(z) / survA;
            }
            //if both are 0
            throw "The hazard function has tried to divide by 0.";
        },
        cHaz : function studentCumulativeHazard(x, v, mean, scale) {
            "use strict";
            //Student Cumulative Hazard Function
            if (mean === undefined) {
                mean = 0;
            }
            if (scale === undefined) {
                scale = 1;
            }
            if (v === undefined) {
                throw "Unspecified degrees of freedom.";
            }
            v = parseInt(v, 10);
            if (v === 0 || v < 0) {
                throw "Degrees of freedom must be an integer larger than 0.";
            }
            var z = (x - mean) / scale,
                cdf = Math.distributions.student.cdf,
                survA = 1 - cdf(z),
                survB = cdf(-z);
            if (!(survA === 0 && survB === 0)) {
                //if none of these are 0
                return -Math.log(1 - cdf(z));
            }
            if ((survA === 0 || survB === 0) && !(survA === 0 && survB === 0)) {
                //if one of these is 0
                if (survB > survA) {
                    survA = survB;
                }
                return -Math.log(survA);
            }
            //if both are 0
            throw "The cumulative hazard function has tried to compute ln(0).";
        },
        sur : function studentSurvival(x, v, mean, scale) {
            "use strict";
            //Student Survival Function
            return 1 - Math.distributions.student.cdf(x, v, mean, scale);
        },
        iSur : function studentInverseSurvival(p, v, mean, scale) {
            "use strict";
            //Inverse Student Survival Function
            return Math.distributions.student.ppf(1 - p, v, mean, scale);
        }
    }
};

Math.rand = function Math_rand(a, b, by) {
    "use strict";
    var m = Math, c = 9007199254740991, f = m.floor, r = m.random();
    c = f((c + 1) * r) / c;
    r = c;
    if (a === undefined) {
        a = 0;
        b = 1;
    } else if (b === undefined) {
        b = a;
        a = 0;
    }
    if (by) {
        return by * f((c * (b - a + by) + a) / by);
    }
    return c * (b - a) + a;
};

//Normal number generator
Math.randNormal = function randNormal(mean, stdev, by) {
    "use strict";
    mean = mean || 0;
    stdev = stdev || 1;
    var s;
    //adapted from http://www.protonfish.com/jslib/boxmuller.shtml
    function rnd_bmt() {
        var x = 0,
            y = 0,
            rds,
            c,
            m = Math,
            r = m.rand,
            ret,
            sqrt = m.sqrt,
            log = m.log;
        // Get two random numbers from -1 to 1.
        // If the radius is zero or greater than 1, throw them out and pick two new ones
        // Rejection sampling throws away about 20% of the pairs.
        do {
            x = r(-1, 1);
            y = r(-1, 1);
            rds = x * x + y * y;
        } while (rds === 0 || rds > 1);
        // This magic is the Box-Muller Transform
        c = sqrt(-2 * log(rds) / rds);
        // It always creates a pair of numbers. I'll return them in an array.
        // This function is quite efficient so don't be afraid to throw one away if you don't need both.
        ret = [x * c, y * c];
        ret = ret[r(0, 1, 1)];
        return ret;
    }
    s = rnd_bmt() * stdev + mean;
    return by ? Math.round(s / by) * by : s;
};

//method to generate normal random data
Math.normal = function normal(mean, stdev, by) {
	"use strict";
	mean = mean || 0;
	stdev = stdev || 1;
	var s;
	//adapted from http://www.protonfish.com/jslib/boxmuller.shtml
	function rnd_bmt() {
		var x = 0, y = 0, rds, c, m = Math, r = m.rand, sqrt = m.sqrt, log = m.log;
		// Get two random numbers from -1 to 1.
		// If the radius is zero or greater than 1, throw them out and pick two new ones
		// Rejection sampling throws away about 20% of the pairs.
		do {
			x = r(-1, 1);
			y = r(-1, 1);
			rds = x * x + y * y;
		} while (rds === 0 || rds > 1);
		// This magic is the Box-Muller Transform
		c = sqrt(-2 * log(rds) / rds);
		// It always creates a pair of numbers. I'll return them in an array.
		// This function is quite efficient so don't be afraid to throw one away if you don"t need both.
		return [x * c, y * c][r(0, 1, 1)];
	}
	s = rnd_bmt() * stdev + mean;
	return by ? Math.round(s / by) * by : s;
};

// a +- b (not a to b)
Math.uniform = function uniform(a, b, by) {
    "use strict";
    a = a === undefined ? 0 : a;
    b = b === undefined ? 1 : b;
    var c = a - b;
    b = a + b;
    a = c;
    return Math.rand(a, b, by);
};

Array.addMethod("populate", function populate(type, p1, p2, l, by) {
    "use strict";
    var t = this,
        rand = Math[type];
    l = l || 42 * 42 * 42;
    by = by || (this.groupBy || 0);
    while (l) {
        l -= 1;
        t.push(rand(p1, p2, by));
    }
    return this;
});

Array.addMethod("group", function group(standard, by) {
    "use strict";
    var t = this.ascending(), f, l = t.length, m = t.mean(), s = t.isSample ? t.sstdev() : t.stdev(), u, h, r;
    by = by || (this.groupBy || s / 42);
    r = Math.floor;
    if (by) {
        f = function f(x) {
            return r(x / by) * by;
        };
        t = t.map(f);
    }
    u = t.unique();
    h = u.map(function count(x) {
        return t.count(x);
    });
    if (standard) {
        f = function f(x) {
            return (x - m) / s;
        };
        u = u.map(f);
        h = h.map(function p(x) {
            return 100 * x / l;
        });
    }
    return [u, h];
});

Array.addMethod("histogram", function histogram(options) {
    "use strict";
    //length
    var n = this.length,
        //smallest member of the array
        min = this.min(),
        //largest member of the array
        max = this.max(),
        //biggest difference
        delta = max - min,
        //minimum Interval = (are they different) ? if true, delta /100
        // otherwise, max / 100.
        minInt = ((max - min) > 0 ? delta : max) / 100;
        //the mean of the data
        //mean = this.mean(),
        //the median of the data
        //median = this.median(),
        //number of bins for the histogram
        //k = n > 10 ? 10 - 1 : n - 1,
        //bin width
        //h = delta / k;
    //if the user provided an interval, and the interval is smaller than the minimum
    //then, throw an error
    if (options.interval && options.interval < minInt) {
        throw {
            name : "Interval Error",
            message : "For your data range, your interval must be greater than " + minInt.toPrecision(4)
        };
    }
    if (n < 2) {
        throw {
            name : "Size Error",
            message : "You must have 2 or more items in your data set."
        };
    }
});

Array.addMethod("kde", function kde(options) {
    "use strict";
    var t = this,
        stDev = t.stdev(), //the standard deviation
        mean = t.mean(), //the mean
        xMin = t.min(), //minimum value
        xMax = t.max(), //maximum value
        //median = t.median(), //the median; test point for the density of the system
        xOrigin, //the starting point for our calculations
        xEnd, //the end point for our calculations
        increment, //the step by which x is incremented
        x, //our Iid (Independent and identically distributed random variable)
        k = Math.K.gaussian, //the kernel function, gaussian by default
        h, //the bandwidth
        f, //the kernel density function
        l = t.length, //this array's length
        i, //counter
        m, //counter
        fTemp, //temporary variable to store the kde's result
        xs, //the x-axis for our plot
        ys, //the y-axis for our plot, the sum of all densities
        points = 299, //how many points do we want in our plot?, 300 by default
        crop, //temp variable to crop the [0, 0, 0, 0]'s in our array
        sum, //scaling so that ys.sum() === 1
        cum = 0, //it's not what you think
        cdf = []; //the cumulative density function
    if (options) { //if the options object was passed
        if (options.normalized) {
            t = t.map(function normalize(xi) { //normalized?
                return (xi - mean) / stDev; // z = (xi - mu) / sigma
            });
            xMin = t.min(); //set the normalized x-min
            xMax = t.max(); //set the normalized x-max
            stDev = t.stdev(); //update the standard deviation
            mean = t.mean(); //re-calculating the mean
            //median = t.median(); //re-calculating the normalized median
        }
        k = options.K ? Math.K[options.K] : k; //use gaussian if not set
        h = options.h; //if not included, leave as undefined, will be set further down
        points = options.points ? options.points - 1 : points; //how many points in our plot?
    }
    h = h || Math.pow(xMax - xMin, 1 / Math.LN10) * 0.42 * 0.42; //some approximation
    xOrigin = xMin - stDev * 2.7; //our starting point
    xEnd = 2.7 * stDev + xMax; //our ending point
    increment = (xEnd - xOrigin) / points; //the step by which we'll calculate each sum of densities
    f = function f(xi, xr, hr, nr) { //our kde function
        var temp = xi - xr;
        temp /= hr; // (xi - x) / h
        temp = k(temp) / hr; // (1 / h) * K(xi - x) / h)
        temp /= nr; // kde / n so that the curve is equal to 1
        return temp;
    };
    xs = []; //define an empty array
    ys = []; //define an empty array
    for (i = 0; i < l; i += 1) { //for every value in our array
        m = 0; //reset counter for the array
        for (x = xOrigin; x < xEnd; x += increment) {
            fTemp = f(x, t[i], h, l);//each value's local density, point by point
            ys[m] = ys[m] === undefined ? fTemp : ys[m] + fTemp; //addition
            m += 1; //for each point
        }
    }
    /*
     * This section is where we crop the beginning of the array (so that we have
     * non-zero values only)
     */
    l = ys.length; //length = points, but, just in case...
    crop = 0; //we'll splice from 0 to crop
    for (i = 0; i < l; i += 1) {
        if (ys[i + 1] === 0) { //leave only one 0 value, for triangular kde
            crop += 1; //if the value is 0, then raise this counter
        } else {
            break; //if a non-zero value is found, stop the iteration
        }
    }
    ys.splice(0, crop); //the actual cropping
    xOrigin += increment * crop; //redefining our origin
    /*
     * This section is where we crop the end of the array (so that we have
     * non-zero values only)
     */
    l = ys.length; //setting our length again
    crop = l - 1; //we'll crop from crop up to (l - 1)
    for (i = l - 1; i > 0; i -= 1) {
        if (ys[i - 1] === 0) { //using this to allow for triangular kde
            crop -= 1; //if zero, then decrease crop
        } else {
            break; //if non-zero, stop the iteration
        }
    }
    ys.splice(crop + 1, l - 1); //the actual splicing
    xEnd -= increment * (l - (crop + 1)); //redefine our end four our x
    l = ys.length; //new length
    increment = (xEnd - xOrigin) / l;
    sum = ys.sum() * increment; //theoretically, it must add to 1
    ys = ys.map(function (y) {
        var r = y / sum;
        cum += r;
        cdf.push(cum);
        return y / sum;
    });
    sum = cdf[cdf.length - 1];
    cdf = cdf.map(function (y) {
        return 100 * y / sum;
    });
    return {
        xs : xs.fill(xOrigin, xEnd, increment),
        ys : ys,
        cdf : cdf,
        start : xOrigin,
        end : xEnd,
        by : increment,
        length : ys.length,
        h : h
    };
});

// This function applies color formatting to a bar chart,
// by calculating the color of each bar based on the data.
// use in http://code.google.com/apis/ajax/playground/?type=visualization#image_multicolor_bar_chart
/*function drawVisualization() {
    "use strict";
    // Create and populate the data table.
    var data = new google.visualization.DataTable(), pob = [], uni, hist, red, green, yellow, colors, i, value, color, options, l, mean, stdev, n;
    data.addColumn("string");
    data.addColumn("number");
    pob.populate("normal", 5, 3, 15000, true);
    mean = pob.mean();
    stdev = pob.stdev();
    n = false;
    pob = pob.group(1, n);
    uni = pob[0];
    hist = pob[1];
    uni.forEach(function (x, idx) {
        data.addRow([String(x), hist[idx]]);
    });
  
    red = "ff0000";
    green = "00ff00";
    yellow = "ffff00";
  
    // Loop over the data table to create the color specification.
    colors = [];
    l = data.getNumberOfRows();
    for (i = 0; i < l; i += 1) {
        value = n ? Math.abs(data.getValue(i, 0)) : Math.abs((data.getValue(i, 0) - mean) / stdev);
        color = value < 1 ? green : (value < 2 ? yellow : red);
        colors.push(color);
    }
    colors = colors.join("|");

    options = {
        cht: "bvs",
        chco: colors
    };

    // Create and draw the visualization.
    (new google.visualization.ImageChart(document.getElementById("visualization"))).draw(data, options);  
}*/

/*
// use in http://code.google.com/apis/ajax/playground/?type=visualization#scatter_chart
function drawVisualization() {
    "use strict";
    // Create and populate the data table.
    var data = new google.visualization.DataTable(), pob1, pob2, uni1, hist1, uni2, hist2, options, standard, m, s, n, t;
    pob1 = [];
    pob2 = [];
    m = 1000;
    s = 5;
    n = 100000;
    pob1.groupBy = s / 20;
    pob2.groupBy = s / 20;
    data.addColumn("number", "Particle Size");
    data.addColumn("number", "StdDev = " + s);
    data.addColumn("number", "StdDev = " + 2 * s);

    pob1.populate("normal", m, s, n);
    pob2.populate("normal", m, 2 * s, n);
    
    standard = false;
    pob1 = pob1.group(standard);
    pob2 = pob2.group(standard);
    uni1 = pob1[0];
    hist1 = pob1[1];
    uni2 = pob2[0];
    hist2 = pob2[1];
    uni1.forEach(function (x, idx) {
        data.addRow([x, hist1[idx], null]);
    });
    uni2.forEach(function (x, idx) {
        data.addRow([x, null, hist2[idx]]);
    });

    options = {
        title : "Histogram, mean = " + m,
        width : 800,
        height : 400,
        vAxis : {
            title : "Frequency",
            titleTextStyle : {
                color : "green"
            },
            minValue : 0
        },
        hAxis: {
            title: "Particle Size",
            titleTextStyle : {
                color : "green"
            }
        }
    };
    
    // Create and draw the visualization
    t = document.getElementById('visualization');
    t = new google.visualization.ScatterChart(t);
    t.draw(data, options);
}*/