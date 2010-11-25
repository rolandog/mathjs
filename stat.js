"use strict";
/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, regexp: true, newcap: true, immed: true */
/*global google */
Function.prototype.addMethod = function addMethod(name, func) {
    this.prototype[name] = func;
    return this;
};

Function.prototype.addGetter = function addGetter(name, func) {
    this.prototype.__defineGetter__(name, func);
    return this;
};

Number.addGetter("sqrt", function sqrt() {
    return Math.sqrt(this);
});

Function.prototype.addSetter = function addSetter(name, func, funcG) {
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
};

Array.addGetter("sum", function sum() {
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
        return t.map(addA);
    }
    addA = function addA(x) {
        return x + a;
    };
    return t.map(addA);
});

Array.addMethod("delta", function delta(a) {
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
    return Math.sqrt(this);
});

Number.addGetter("square", function square() {
    return this * this;
});

Number.addMethod("pow", function pow(n) {
    return Math.pow(this, n);
});

Array.addGetter("sqrt", function sqrt() {
    return this.map(function sqrtA(x) {
        return Math.sqrt(x);
    });
});

Array.addGetter("square", function square() {
    return this.map(function squareA(x) {
        return x * x;
    });
});

Array.addMethod("pow", function pow(n) {
    return this.map(function powA(x) {
        return Math.pow(x, n);
    });
});

Array.addMethod("product", function product(a) {
    var t = this,
    l = t.length,
    productA;
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
        return t.map(productA);
    }
    productA = function productA(x) {
        return x * a;
    };
    return t.map(productA);
});

Array.addGetter("max", function max() {
    var r = -Infinity,
    t = this,
    l = t.length,
    s;
    while (l) {
        l -= 1;
        s = t[l];
        if (s > r) {
            r = s;
        }
    }
    return r;
});

Array.addGetter("min", function min() {
    var r = Infinity,
    t = this,
    l = t.length,
    s;
    while (l) {
        l -= 1;
        s = t[l];
        if (s < r) {
            r = s;
        }
    }
    return r;
});

Array.addGetter("ascending", function ascending() {
    return this.concat().sort(function asc(a, b) {
        return a - b;
    });
});

Array.addGetter("descending", function descending() {
    return this.concat().sort(function des(a, b) {
        return b - a;
    });
});

Array.addGetter("mean", function mean() {
    return this.sum / this.length;
});

Array.addGetter("median", function median() {
    var l = this.length, s, a = this.ascending;
    if (l % 2) { //if odd
        s = a[l / 2 | 0];
    } else { //if even
        l = (l / 2 | 0) - 1;
        s = (a[l] + a[l + 1]) / 2;
    }
    return s;
});

Array.addGetter("stdev", function stdev() {
    var t = this,
    l = t.length,
    i = l,
    mean = this.mean,
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

Array.addGetter("sstdev", function sstdev() {
    var stdev = this.stdev, l = this.length;
    return Math.sqrt(stdev * stdev * l / (l - 1));
});

Array.addGetter("unique", function Array_unique() {
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

Array.addMethod("fill", function fill(a, b) {
    while (a <= b) {
        this.push(a);
        a += 1;
    }
    return this;
});

Array.addMethod("count", function Array_count(a) {
    var r = 0, t = this, i = t.length;
    while (i) {
        i -= 1;
        r += t[i] === a ? 1 : 0;
    }
    return r;
});


Math.rand = function Math_rand(a, b) {
    var m = Math, c = 9007199254740991;
    if (a === undefined) {
        a = 0;
        b = 1;
    } else if (b === undefined) {
        b = a;
        a = 0;
    }
    return (m.randInt(c) / c) * (b - a) + a;
};
Math.pdf = {
    normal : function normal(x, mean, stdev) {
        mean = mean || 0;
        stdev = stdev === undefined ? 1 : stdev;
        var a, b, c, m = Math, pow = m.pow;
        c = 2 * pow(stdev, 2);
        a = 1 / m.sqrt(m.PI * c);
        b = pow(x - mean, 2) / c;
        return a * m.exp(-b);
    }
};
Math.randInt = function Math_randInt(a, b) {
    var m = Math, r = m.random;
    if (a === undefined) {
        a = 0;
        b = 9007199254740991;
    } else if (b === undefined) {
        b = a;
        a = 0;
    }
    return m.floor(r() * (b - a + 1) + a);
};

Math.normal = function normal(mean, stdev, isInt) {
    mean = mean === undefined ? 0 : mean;
    stdev = stdev === undefined ? 1 : stdev;
    isInt = isInt || false;
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
        // It always creates a pair of numbers. I"ll return them in an array.
        // This function is quite efficient so don"t be afraid to throw one away if you don"t need both.
        return [x * c, y * c][m.randInt(0, 1)];
    }
    s = rnd_bmt() * stdev + mean;
    return isInt ? Math.round(s) : s;
};

// a +- b (not a to b)
Math.uniform = function uniform(a, b, isInt) {
    a = a === undefined ? 0 : a;
    b = b === undefined ? 1 : b;
    isInt = isInt || false;
    var c = a - b;
    b = a + b;
    a = c;
    return isInt ? Math.randInt(a, b) : Math.rand(a, b);
};

Array.addMethod("populate", function populate(type, p1, p2, l, isInt) {
    var t = this,
    rand = Math[type];
    l = l || 42 * 42;
    while (l) {
        l -= 1;
        t.push(rand(p1, p2, isInt));
    }
    return this;
});

// This function applies color formatting to a bar chart,
// by calculating the color of each bar based on the data.
// use in http://code.google.com/apis/ajax/playground/?type=visualization#image_multicolor_bar_chart
function drawVisualization() {
    // Create and populate the data table.
    var data = new google.visualization.DataTable(), pob = [], uni, hist, red, green, yellow, colors, i, value, color, options, l, mean, stdev;
    data.addColumn("string");
    data.addColumn("number");
    pob.populate("normal", 5, 3, 15000, true);
    uni = pob.ascending.unique;
    mean = pob.mean;
    stdev = pob.stdev;
    hist = uni.map(function count(x) {
        return pob.count(x);
    });
    uni.forEach(function (x, idx) {
        data.addRow(['' + x, hist[idx]]);
    });
  
    red = "ff0000";
    green = "00ff00";
    yellow = "ffff00";
  
    // Loop over the data table to create the color specification.
    colors = [];
    l = data.getNumberOfRows();
    for (i = 0; i < l; i += 1) {
        value = Math.abs((data.getValue(i, 0) - mean) / stdev);
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
}
