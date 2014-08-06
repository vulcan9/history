/**
 * Matrix Play
 *
 * Drag a box around to get the transform css!
 * Version 1.3 - 2012/03/03
 *
 */
(function () {




	/**
	 * Play
	 * 
	 */
	var Play = function () {
		
		this.touch = Client.touchEnabled();
		var handles = $("#ui span");
		$(handles).on(this.touch ? 'touchstart' : 'mousedown', $.proxy(this.handleMousedown, this));
		//$(window).on('hashchange', this.restore.bind(this));

		// transformation mode (handle classname)
		this.mode = null;

		// hash state
		//this.state = 'none';
	};

	Play.prototype = {
		/**
		 * mousedown/touchstart handler
		 *
		 */
		handleMousedown: function (e) {
			e.preventDefault();
			$(document).on(this.touch ? 'touchmove' : 'mousemove', $.proxy(this.handleMousemove, this));
			$(document).on(this.touch ? 'touchend' : 'mouseup', $.proxy(this.handleMouseup, this));

			// jquery wraps the native event, need it for e.touches though
			var ev = this.getTouch(e);

			this.mode = e.target.className;

			this._sx = ev.pageX;
			this._sy = ev.pageY;
		},

		/**
		 * mousemove/touchmove handler
		 *
		 */
		handleMousemove: function (e) {

			// If no current mode, do nothing. Conditional binding would be prettier.
			if (!this.mode) {
				return;
			}

			e.preventDefault();
			var ev = this.getTouch(e);

			var dx = ev.pageX - this._sx;
			var dy = ev.pageY - this._sy;

			this._sx = ev.pageX;
			this._sy = ev.pageY;

			var $target;
			switch (this.mode) {
				
				case 'move':
					
					var $target = $("#moveTarget");
					var x = parseInt($target.css("left"), 10) + dx;
					var y = parseInt($target.css("top"), 10) + dy;

					$target.css({ left: x, top: y });

					break;

				case 'rotate':
					var $target = $("#scale_rotateTarget");
					var transform = $target.css("transform");
					if (!transform || transform == "none") {
						transform = "rotateX(5deg) rotateY(8deg) rotateZ(3deg) scale(1)";
						$target.css({ transform: transform });
					}

					var transFormStr = $target[0].style["transform"];
					console.log(transFormStr);

					var rotateX = transFormStr.match(/rotateX\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateX = getNum(rotateX);// + dx;
					var rotateY = transFormStr.match(/rotateY\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateY = getNum(rotateY);// + dy;
					var rotateZ = transFormStr.match(/rotateZ\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateZ = getNum(rotateZ) + dx;

					var scale = transFormStr.match(/scale\(-?[0-9]+(?:\.[0-9]*)?\)/)[0];
					scale = getNum(scale);

					var css = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg) scale(" + scale + ")";
					$target.css({ transform: css });


					function getNum(str) {
						str = str.match(/\(-?[0-9]+(?:\.[0-9]*)?\)/)[0];
						str = str.match(/-?[0-9]+(?:\.[0-9]*)?/)[0];
						return parseInt(str, 10);
					}
					
					break;

				case 'scale':
					var $target = $("#scale_rotateTarget");
					var transform = $target.css("transform");
					if (!transform || transform == "none") {
						transform = "rotateX(5deg) rotateY(8deg) rotateZ(3deg) scale(1)";
						$target.css({ transform: transform });
					}

					var transFormStr = $target[0].style["transform"];
					console.log(transFormStr);

					var rotateX = transFormStr.match(/rotateX\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateX = getNum(rotateX);
					var rotateY = transFormStr.match(/rotateY\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateY = getNum(rotateY);
					var rotateZ = transFormStr.match(/rotateZ\(-?[0-9]+(?:\.[0-9]*)?deg\)/)[0];
					rotateZ = getNum(rotateZ);

					var scale = transFormStr.match(/scale\(-?[0-9]+(?:\.[0-9]*)?\)/)[0];
					scale = getNum(scale) + dx/10;
					scale = Math.max(scale, 0.5);
					
					var css = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) rotateZ(" + rotateZ + "deg) scale(" + scale + ")";
					$target.css({ transform: css });
					console.log(scale, dx, css);

					function getNum(str) {
						//str = str.match(/\(-?[0-9]+(?:\.[0-9]*)?\)/)[0];
						str = str.match(/-?[0-9]+(?:\.[0-9]*)?/)[0];
						return parseInt(str, 10);
					}

					break;

				case 'skewx':
					/*
					var moved = point.subtract(anchor);
					matrix = matrix.skew(
						new Vector(moved.x / offset.y, 0)
					);
					*/
					break;

				case 'skewy':
					/*
					var moved = point.subtract(anchor);
					matrix = matrix.skew(
						new Vector(0, moved.y / offset.x)
					);
					*/
					break;
			}

			// store and show the current transformation
			//this.current = matrix;
			//this.transform(matrix);
		},

		handleMouseup: function (e) {
			$(document).off(this.touch ? 'touchmove' : 'mousemove', $.proxy(this.handleMousemove, this));
			$(document).off(this.touch ? 'touchend' : 'mouseup', $.proxy(this.handleMouseup, this));

			// yes. I know
			if (!this.mode) {
				return;
			}

			e.preventDefault();

			// clear the mode, update display and output result.
			this.mode = null;
			this.save();
		},

		getTouch: function (e) {
			// multitouch vs mouse
			return e.touches ? e.touches[0] : e;
		},

		//-------------------------
		// Transition
		//-------------------------

		translateCSS: function (t) {
			return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
		},

		// By default the rotations are in X Y Z order that can be reverted by passing `true` as second parameter.
		rotateCSS: function (r, revert) {
			var rX = " rotateX(" + r.x + "deg) ";
			var rY = " rotateY(" + r.y + "deg) ";
			var rZ = " rotateZ(" + r.z + "deg) ";

			return revert ? rZ + rY + rX : rX + rY + rZ;
		},

		scaleCSS: function (s) {
			return " scale(" + s + ") ";
		},

		// `perspective` builds a perspective transform string for given data.
		perspectiveCSS: function (p) {
			return " perspective(" + p + "px) ";
		},














































		/**
		 * send the matrix over to the Style object (see below)
		 *
		 */
		transform: function (matrix) {
			//Style.setTransform(this.play, matrix);
		},

		save: function () {
			this.display = this.current;

			// yeah this looks terrible
			var state = this.current.toArray().map(function (n) {
				return (parseInt(n, 10) !== n) ? n.toFixed(FIXED) : n;
			}).join(',');


			this.render(this.display);
			this.state = state;

			if (!this.mirrored) {
				window.location.hash = state;
			}

		},

		reset: function () {
			var reset = new Matrix();
			this.display = reset;
			this.transform(reset);
			this.render(reset);
			this.state = null;
		},

		/**
		 * Outputs the given matrix to the output area for copy-pasting
		 *
		 */
		render: function (matrix) {
			var css = Style.toCSS(matrix, FIXED);
			this.out.innerHTML = css.substring(css.indexOf("\ntransform"), css.length);
		},

		/**
		 * attempt to restore the display to the given hash
		 *
		 */
		restore: function () {
			var hash = window.location.hash;
			if (hash && hash.length) {
				try {
					var state = hash.substring(1);
					if (state === this.state) {
						// same, skip
						return;
					}

					var input = state.split(',').map(parseFloat);
					if (input.length == 6) {
						var matrix = Matrix.parseArray(input);
						this.display = matrix;
						this.transform(matrix);
						this.render(matrix);
						this.state = state;
					}
				} catch (e) {
					// something went wrong, let's reset it
					this.reset();
				}
			} else {
				// back to initial pageload, no hash
				this.reset();
			}
		}
	};


	/**
	 * 2D vector for prettuer 2D <3 math <3
	 *
	 */
	var Vector = function (x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype = {
		add: function (v) {
			return new Vector(this.x + v.x, this.y + v.y);
		},

		subtract: function (v) {
			return new Vector(this.x - v.x, this.y - v.y);
		},

		multiply: function (v) {
			return new Vector(this.x * v.x, this.y * v.y);
		},

		divide: function (v) {
			return new Vector(this.x / v.x, this.y / v.y);
		},

		// not used
		dot: function (b) {
			var d = this.multiply(b);
			return (d.x + d.y);
		},

		// not used
		magnitude: function () {
			var x = this.x;
			var y = this.y;
			return _sqrt(x * x + y * y);
		},

		// not used
		normalize: function () {
			var m = this.magnitude();
			return new Vector(this.x / m, this.y / m);
		},

		// applies a matrix to this vector for total transformation, not used in this app.
		transform: function (matrix) {
			var m = matrix.base;
			return new Vector(
				m[0] * this.x + m[1] * this.y + m[2],
				m[3] * this.x + m[4] * this.y + m[5]
			);
		}
	};


	/**
	 * Matrix, actually a 3x3 one, but the bottom line would always say 0 0 1, which would cause lots of senseless 0's to be calculated everywhere.
	 *
	 */
	var Matrix = function (base) {
		this.base = base || [1, 0, 0, 0, 1, 0];
	};

	Matrix.prototype = {
		_multiply: function (
			a1, a2, a3, a4, a5, a6,
			b1, b2, b3, b4, b5, b6
		) {
			return new Matrix([
				a1 * b1 + a2 * b4,
				a1 * b2 + a2 * b5,
				a1 * b3 + a2 * b6 + a3, // because of the 0 0 1
				a4 * b1 + a5 * b4,
				a4 * b2 + a5 * b5,
				a4 * b3 + a5 * b6 + a6 // and again
			]);
		},

		multiply: function (b) {
			// apply the concatenated arrays to get 12 arguments, is actually faster.
			return this._multiply.apply(this, this.base.concat(b));
		},

		translate: function (v) {
			return this.multiply([1, 0, v.x, 0, 1, v.y]);
		},

		rotate: function (r) {
			var sin = Math.sin(r);
			var cos = Math.cos(r);
			return this.multiply([cos, sin, 0, -sin, cos, 0]);
		},

		scale: function (v) {
			return this.multiply([v.x, 0, 0, 0, v.y, 0]);
		},

		skew: function (v) {
			return this.multiply([1, v.y || 0, 0, v.x || 0, 1, 0]);
		},

		// CSS puts the translation elsewhere, really a 2x2 matrix with added dx and dy instead of a 3x3
		toArray: function () {
			var b = this.base;
			return [b[0], b[1], b[3], b[4], b[2], b[5]];
		}
	};

	Matrix.parseArray = function (b) {
		// 2x2 vs 3x3
		return new Matrix([
			b[0], b[1], b[4],
			b[2], b[3], b[5]
		]);
	};


	/**
	 * Tiny client check
	 *
	 */
	var ua = navigator.userAgent;
	var Client = {
		touchEnabled: function () {
			return !!('ontouchstart' in window);
		},

		webkit: /webkit\//i.test(ua),
		gecko: /gecko\//i.test(ua),
		trident: /trident\//i.test(ua),
		presto: /presto\//i.test(ua)
	};


	/**
	 * Style
	 *
	 */
	var Style = (function () {

		var prefix =
			Client.webkit ? '-webkit-' :
			Client.gecko ? '-moz-' :
			Client.presto ? '-o-' :
			Client.trident ? '-ms-' : '';

		var csstransition = prefix + 'transition';
		var csstransform = prefix + 'transform';
		var regtransform = /(transform)/g;
		var regreplace = prefix + '$1';

		var PRIORITY = ''; // eg !important

		var unit = function (val) {
			return (typeof val === 'number') ? (val + 'px') : val;
		};

		return {
			// not used
			setTransition: function (node, transition) {
				var value = transition.replace(regtransform, regreplace);
				this.set(node, csstransition, value);
			},

			setTransform: function (node, transform) {
				var value = transform;
				if (transform instanceof Matrix) {
					var array = transform.toArray();

					// mozilla requires units in the matrix's translation
					if (Client.gecko) {
						array[4] += 'px';
						array[5] += 'px';
					}

					value = 'matrix(' + array.join(',') + ')';
				}

				this.set(node, csstransform, value);
			},

			// not used
			setTranslate: function (node, x, y) {
				this.set(node, csstransform,
					'translate(' + unit(x) + ',' + unit(y) + ')');
			},

			set:
				Client.trident ? // IE

				function (node, property, value) {
					node.style[property] = value;
				} :

				function (node, property, value) {
					node.style.setProperty(property, value, PRIORITY);
				},

			// not used
			get: function (node, property) {
				var computed = window.getComputedStyle(node, null);
				var style = node.style;
				var value =
					computed.getPropertyValue(property) ||
					style.getPropertyValue(property) ||
					style[property];

				return value;
			},

			/**
			 * get the CSS of the given matrix
			 *
			 */
			toCSS: function (matrix, fix) {
				var cleaned = matrix.toArray().map(function (n) {
					return (fix && (parseInt(n, 10) !== n)) ? n.toFixed(fix) : n
				});

				var css = cleaned.join(',');
				cleaned[4] += 'px';
				cleaned[5] += 'px';
				var moz = cleaned.join(',');

				return [
					'-webkit-transform: matrix(' + css + ');',
					'-moz-transform: matrix(' + moz + ');',
					'-ms-transform: matrix(' + css + ');',
					'-o-transform: matrix(' + css + ');',
					'transform: matrix(' + css + ');'
				].join('\n');
			}
		};

	}());


	/**
	 * Run!
	 * 
	 */

	addEvent(window, 'DOMContentLoaded', function () {
		var matrix = new Play();
	});



	// decimals of the matrix css output
	var FIXED = 3;

	/**
	 * Various helpers
	 *
	 */

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (scope) {
			var method = this;
			return function () {
				return method.apply(scope, arguments);
			};
		};
	}

	function find(selector) {
		return document.querySelectorAll(selector);
	}

	function closest(nodeName, node) {
		var reg = new RegExp('^' + nodeName + '$', 'i');
		while (node && !reg.test(node.nodeName)) {
			node = node.parentNode;
		}
		return node;
	}

	function addEvent(node, type, listener) {
		node.addEventListener(type, listener, false);
	}

	function addEvents(nodes, type, listener) {
		var i, l = nodes.length;
		for (i = 0; i < l; i++) {
			addEvent(nodes[i], type, listener);
		}
	}
}());












/*
[
  1, 0, 0, 0, 
  0, 1, 0, 0, 
  0, 0, 1, 0, 
  0, 0, 0, 1
]
*/
var M = {};
M.create = function () {
	var dest = [];
	for (var i = 0; i < 4; i++) {
		dest[i] = [];
		for (var j = 0; j < 4; j++) {
			dest[i][j] = (i == j) ? 1 : 0;
		}
	}
	return dest;
};
// mat 값을 가진 새로운 객체를 생성
M.clone = function (mat) {
	var dest = [];
	for (var i = 0; i < mat.length; ++i) {
		dest[i] = mat[i];
	}
	return dest;
};
// mat를 dest에 복사함
M.copy = function (mat, dest) {
	var dest = [];
	for (var i = 0; i < mat.length; ++i) {
		dest[i] = mat[i];
	}
	return dest;
};

// Calculates the determinant of a mat4
M.determinant = function (mat) {
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
					a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
					a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
					a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
					a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
					a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
}
// https://code.google.com/p/stormenginec/source/browse/trunk/stormEngineC_1.1/include/StormEngineC/JigLibJS/geom/glMatrix.js?r=195
M.inverse = function (mat, dest) {
	if (!dest) { dest = mat; }

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	var b00 = a00 * a11 - a01 * a10;
	var b01 = a00 * a12 - a02 * a10;
	var b02 = a00 * a13 - a03 * a10;
	var b03 = a01 * a12 - a02 * a11;
	var b04 = a01 * a13 - a03 * a11;
	var b05 = a02 * a13 - a03 * a12;
	var b06 = a20 * a31 - a21 * a30;
	var b07 = a20 * a32 - a22 * a30;
	var b08 = a20 * a33 - a23 * a30;
	var b09 = a21 * a32 - a22 * a31;
	var b10 = a21 * a33 - a23 * a31;
	var b11 = a22 * a33 - a23 * a32;

	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

	dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
	dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
	dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
	dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
	dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
	dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
	dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
	dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
	dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
	dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
	dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
	dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
	dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
	dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
	dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
	dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

	return dest;
};

M.transpose = function (mat, dest) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if (!dest || mat == dest) {
		var a01 = mat[1], a02 = mat[2], a03 = mat[3];
		var a12 = mat[6], a13 = mat[7];
		var a23 = mat[11];

		mat[1] = mat[4];
		mat[2] = mat[8];
		mat[3] = mat[12];
		mat[4] = a01;
		mat[6] = mat[9];
		mat[7] = mat[13];
		mat[8] = a02;
		mat[9] = a12;
		mat[11] = mat[14];
		mat[12] = a03;
		mat[13] = a13;
		mat[14] = a23;
		return mat;
	}

	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
};
M.multiply = function (mat, mat2, dest) {
	if (!dest) { dest = mat }

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
	var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
	var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
	var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

	dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
	dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
	dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
	dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
	dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
	dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
	dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
	dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
	dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
	dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
	dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
	dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
	dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
	dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
	dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
	dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

	return dest;
};

// Vector
M.normalize = function (vec, dest) {
	if (!dest) { dest = vec; }

	var x = vec[0], y = vec[1], z = vec[2];
	var len = Math.sqrt(x * x + y * y + z * z);

	if (!len) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		return dest;
	} else if (len == 1) {
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		return dest;
	}

	len = 1 / len;
	dest[0] = x * len;
	dest[1] = y * len;
	dest[2] = z * len;
	return dest;
};
M.length = function (vec) {
	var x = vec[0], y = vec[1], z = vec[2];
	return Math.sqrt(x * x + y * y + z * z);
};
M.dot = function (vec, vec2) {
	return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
};
M.combine = function (a, b, ascl, bscl) {
	var result = [];
	result[0] = (ascl * a[0]) + (bscl * b[0])
	result[1] = (ascl * a[1]) + (bscl * b[1])
	result[2] = (ascl * a[2]) + (bscl * b[2])
	return result;
}
M.cross = function (vec, vec2, dest) {
	if (!dest) { dest = vec; }

	var x = vec[0], y = vec[1], z = vec[2];
	var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];

	dest[0] = y * z2 - z * y2;
	dest[1] = z * x2 - x * z2;
	dest[2] = x * y2 - y * x2;
	return dest;
};




















/*
translate3d(), rotate3d(), scale3d()
"perspective(0px) translate3d(120px, 260px, 50px) rotate3d(0, 0, 1, 0deg) scale3d(1, 1, 1) skew(0deg, 0deg)"
(예) perspective(500px) translate3d(120px, 260px, 50px) rotate3d(0, 0, 1, 0deg) scale3d(1, 1, 1) skew(0deg, 0deg)
matrix3d()
matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 120, 260, 50, 1)
(예) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.002, 120, 260, 50, 0.9)

4x4 matrix (http://www.w3.org/TR/css3-transforms/#PerspectiveDefined)
matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)

https://developer.apple.com/library/safari/documentation/AudioVideo/Reference/WebKitCSSMatrixClassReference/WebKitCSSMatrix/WebKitCSSMatrix.html#//apple_ref/doc/uid/TP40009363
*/

$(function () {
	var el = $("#matrixbox1")[0];

	console.log("transform : ", $("#matrixbox1")[0].style["transform"]);
	var mStr = matrix3DString(el);
	console.log("matrix3DToArray : ", mStr);
	var mArry = matrix3DToArray(mStr);
	console.log("matrix3DToArray : ", mArry);

	//20.3.1 Decomposing a 3D matrix
	//mArry = M.create();

	//console.log("PARSE----------------*");
	var matrix = toMatrix(mArry);
	console.log(matrix);

	unmatrix(matrix);


	//console.log(parseMatrix(mStr));

	var transform = getTransform(el);
	console.log(transform);
	console.log(transform.rotate);
	console.log(transform.translate);

	var style = getComputedStyle(el, null);
	console.log(getComputedStyle(el, null));














	/* Returns the rotation and translation components of an element
	---------------------------------------------------------------- */

	function getTransform(elem) {
		var computedStyle = getComputedStyle(elem, null),
			val = computedStyle.transform ||
				computedStyle.webkitTransform ||
				computedStyle.MozTransform ||
				computedStyle.msTransform,
			matrix = parseMatrix(val),
			rotateY = Math.asin(-matrix.m13) * 180 / Math.PI,
			rotateX,
			rotateZ;

		rotateX = Math.atan2(matrix.m23, matrix.m33)*180/Math.PI;
		rotateZ = Math.atan2(matrix.m12, matrix.m11) * 180 / Math.PI;

		/*if (Math.cos(rotateY) !== 0) {
			rotateX = Math.atan2(matrix.m23, matrix.m33);
			rotateZ = Math.atan2(matrix.m12, matrix.m11);
		} else {
			rotateX = Math.atan2(-matrix.m31, matrix.m22);
			rotateZ = 0;
		}*/

		return {
			transformStyle: val,
			matrix: matrix,
			rotate: {
				x: rotateX,
				y: rotateY,
				z: rotateZ
			},
			translate: {
				x: matrix.m41,
				y: matrix.m42,
				z: matrix.m43
			}
		};
	}





	/* Parses a matrix string and returns a 4x4 matrix
	---------------------------------------------------------------- */

	function parseMatrix(matrixString) {
		var c = matrixString.split(/\s*[(),]\s*/).slice(1, -1),
			matrix;

		if (c.length === 6) {
			// 'matrix()' (3x2)
			matrix = {
				m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
				m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
				m13: 0, m23: 0, m33: 1, m43: 0,
				m14: 0, m24: 0, m34: 0, m44: 1
			};
		} else if (c.length === 16) {
			// matrix3d() (4x4)
			matrix = {
				m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
				m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
				m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
				m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
			};

		} else {
			// handle 'none' or invalid values.
			matrix = {
				m11: 1, m21: 0, m31: 0, m41: 0,
				m12: 0, m22: 1, m32: 0, m42: 0,
				m13: 0, m23: 0, m33: 1, m43: 0,
				m14: 0, m24: 0, m34: 0, m44: 1
			};
		}
		return matrix;
	}









});























function toMatrix(mArry) {
	var mat = M.create();

	mat[0] = [mArry[0], mArry[1], mArry[2], mArry[3]];
	mat[1] = [mArry[4], mArry[5], mArry[6], mArry[7]];
	mat[2] = [mArry[8], mArry[9], mArry[10], mArry[11]];
	mat[3] = [mArry[12], mArry[13], mArry[14], mArry[15]];

	return mat;
}

function matrix3DString(el) {
	var validMatrix = function (o) {
		return !(!o || o === 'none' || o.indexOf('matrix') < 0);
	};

	var $el = $(el);
	var matrix = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
	if (validMatrix($el.css('-webkit-transform'))) matrix = $el.css('-webkit-transform');
	if (validMatrix($el.css('-moz-transform'))) matrix = $el.css('-moz-transform');
	if (validMatrix($el.css('-ms-transform'))) matrix = $el.css('-ms-transform');
	if (validMatrix($el.css('-o-transform'))) matrix = $el.css('-o-transform');
	if (validMatrix($el.css('transform'))) matrix = $el.css('transform');

	return matrix;
}

function matrix3DToArray(str) {
	var ar = str.split('(')[1].split(')')[0].split(',');
	ar.forEach(function (item, index, items) {
		items[index] = Number(item);
		//console.log(items);
	});
	return ar;
}
  
function arrayToMatrix3D(array) {
	return "matrix(" + array.join(',') + ")";
}
              
function unmatrix(matrix) {
	// Normalize the matrix.
	if (matrix[3][3] == 0) return false;

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			matrix[i][j] /= matrix[3][3];
		}
	}
	console.log("matrix : ", matrix);

	// perspectiveMatrix is used to solve for perspective, 
	// but it also provides an easy way to test for singularity of the upper 3x3 component.
	var perspectiveMatrix = M.clone(matrix);
	for (var i = 0; i < 3; i++) {
		perspectiveMatrix[i][3] = 0;
	}
	perspectiveMatrix[3][3] = 1;

	if (M.determinant(perspectiveMatrix) == 0) return false;

	// First, isolate perspective.
	var rightHandSide = [];
	var perspective = [];
	if (matrix[0][3] != 0 || matrix[1][3] != 0 || matrix[2][3] != 0) {
		// rightHandSide is the right hand side of the equation.
		rightHandSide[0] = matrix[0][3];
		rightHandSide[1] = matrix[1][3];
		rightHandSide[2] = matrix[2][3];
		rightHandSide[3] = matrix[3][3];

		// Solve the equation by inverting perspectiveMatrix 
		// and multiplying rightHandSide by the inverse.
		var inversePerspectiveMatrix = M.inverse(perspectiveMatrix);
		transposedInversePerspectiveMatrix = M.transpose(inversePerspectiveMatrix);
		perspective = M.multiply(rightHandSide, transposedInversePerspectiveMatrix, perspective);
	} else {
		// No perspective.
		perspective[0] = perspective[1] = perspective[2] = 0;
		perspective[3] = 1;
	}

	console.log("perspective: ", perspective);

	// Now get scale and shear. 'row' is a 3 element array of 3 component vectors
	var row = [];
	for (var i = 0; i < 3; i++) {
		row[i] = [];
		row[i][0] = matrix[i][0];
		row[i][1] = matrix[i][1];
		row[i][2] = matrix[i][2];
	}

	var scale = [];
	// Compute X scale factor and normalize first row.
	scale[0] = M.length(row[0]);
	row[0] = M.normalize(row[0])

	var skew = [];
	// Compute XY shear factor and make 2nd row orthogonal to 1st.
	skew[0] = M.dot(row[0], row[1]);
	row[1] = M.combine(row[1], row[0], 1.0, -skew[0]);

	// Now, compute Y scale and normalize 2nd row.
	scale[1] = M.length(row[1]);
	row[1] = M.normalize(row[1]);
	skew[0] /= scale[1];

	// Compute XZ and YZ shears, orthogonalize 3rd row
	skew[1] = M.dot(row[0], row[2]);
	row[2] = M.combine(row[2], row[0], 1.0, -skew[1]);
	skew[2] = M.dot(row[1], row[2]);
	row[2] = M.combine(row[2], row[1], 1.0, -skew[2]);

	// Next, get Z scale and normalize 3rd row.
	scale[2] = M.length(row[2]);
	row[2] = M.normalize(row[2]);
	skew[1] /= scale[2];
	skew[2] /= scale[2];

	// At this point, the matrix (in rows) is orthonormal.
	// Check for a coordinate system flip.
	// If the determinant is -1, then negate the matrix and the scaling factors.
	var pdum3 = M.cross(row[1], row[2]);
	if (M.dot(row[0], pdum3) < 0) {
		for (var i = 0; i < 3; i++) {
			scale[i] *= -1;
			row[i][0] *= -1;
			row[i][1] *= -1;
			row[i][2] *= -1;
		}
	}

	// Next take care of translation
	var translate = [];
	for (var i = 0; i < 3; i++) {
		var d = matrix[3][i];
		//d /= scale[i];
		//translate[i] = Math.round(d);
		translate[i] = d;
	}

	// Now, get the rotations out
	var quaternion = [];
	quaternion[0] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0))
	quaternion[1] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0))
	quaternion[2] = 0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0))
	quaternion[3] = 0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0))

	if (row[2][1] > row[1][2]) quaternion[0] = -quaternion[0];
	if (row[0][2] > row[2][0]) quaternion[1] = -quaternion[1];
	if (row[1][0] > row[0][1]) quaternion[2] = -quaternion[2];

	console.log("* translate : ", translate);
	console.log("* skew : ", skew);
	console.log("* perspective : ", perspective);
	console.log("* scale : ", scale);
	console.log("* quaternion : ", quaternion);
	console.log("* row[0] : ", row[0]);
	console.log("* row[1] : ", row[1]);
	console.log("* row[2] : ", row[2]);
	return true;
}
