/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, regexp: true, newcap: true, immed: true */
/*global google */
Function.prototype.addMethod = function addMethod(name, func) {
	"use strict";
	this.prototype[name] = func;
	return this;
};

Function.prototype.addGetter = function addGetter(name, func) {
	"use strict";
	this.prototype.__defineGetter__(name, func);
	return this;
};

Number.addGetter("sqrt", function sqrt() {
	"use strict";
	return Math.sqrt(this);
});

Function.prototype.addSetter = function addSetter(name, func, funcG) {
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
};

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
		return t.map(addA);
	}
	addA = function addA(x) {
		return x + a;
	};
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

Number.addMethod("pow", function pow(n) {
	"use strict";
	return Math.pow(this, n);
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

Array.addMethod("max", function max() {
	"use strict";
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

Array.addMethod("min", function min() {
	"use strict";
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

Array.addMethod("mean", function mean() {
	"use strict";
	return this.sum() / this.length;
});

Array.addMethod("median", function median() {
	"use strict";
	var l = this.length, s, a = this.ascending();
	if (l % 2) { //if odd
		s = a[l / 2 | 0];
	} else { //if even
		l = (l / 2 | 0) - 1;
		s = (a[l] + a[l + 1]) / 2;
	}
	return s;
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

Array.addMethod("fill", function fill(a, b) {
	"use strict";
	while (a <= b) {
		this.push(a);
		a += 1;
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

Math.pdf = {
	normal : function normal(x, mean, stdev) {
		"use strict";
		mean = mean || 0;
		stdev = stdev === undefined ? 1 : stdev;
		var a, b, c, m = Math, pow = m.pow;
		c = 2 * pow(stdev, 2);
		a = 1 / m.sqrt(m.PI * c);
		b = pow(x - mean, 2) / c;
		return a * m.exp(-b);
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

// This function applies color formatting to a bar chart,
// by calculating the color of each bar based on the data.
// use in http://code.google.com/apis/ajax/playground/?type=visualization#image_multicolor_bar_chart
function drawVisualization() {
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
}

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
}​*/
