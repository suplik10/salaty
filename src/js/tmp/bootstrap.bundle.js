var bootstrap = function(a, b) {
    "use strict";
    function c(a, b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[c];
            d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), 
            Object.defineProperty(a, d.key, d);
        }
    }
    function d(a, b, d) {
        return b && c(a.prototype, b), d && c(a, d), a;
    }
    function e(a, b) {
        a.prototype = Object.create(b.prototype), a.prototype.constructor = a, a.__proto__ = b;
    }
    function f(a) {
        var b = !1, c = 0, d = document.createElement("span");
        return new MutationObserver(function() {
            a(), b = !1;
        }).observe(d, {
            attributes: !0
        }), function() {
            b || (b = !0, d.setAttribute("x-index", c), c += 1);
        };
    }
    function g(a) {
        var b = !1;
        return function() {
            b || (b = !0, setTimeout(function() {
                b = !1, a();
            }, ua));
        };
    }
    function h(a) {
        var b = {};
        return a && "[object Function]" === b.toString.call(a);
    }
    function i(a, b) {
        if (1 !== a.nodeType) return [];
        var c = window.getComputedStyle(a, null);
        return b ? c[b] : c;
    }
    function j(a) {
        return "HTML" === a.nodeName ? a : a.parentNode || a.host;
    }
    function k(a) {
        if (!a || -1 !== [ "HTML", "BODY", "#document" ].indexOf(a.nodeName)) return window.document.body;
        var b = i(a), c = b.overflow, d = b.overflowX;
        return /(auto|scroll)/.test(c + b.overflowY + d) ? a : k(j(a));
    }
    function l(a) {
        var b = a && a.offsetParent, c = b && b.nodeName;
        return c && "BODY" !== c && "HTML" !== c ? -1 !== [ "TD", "TABLE" ].indexOf(b.nodeName) && "static" === i(b, "position") ? l(b) : b : window.document.documentElement;
    }
    function m(a) {
        var b = a.nodeName;
        return "BODY" !== b && ("HTML" === b || l(a.firstElementChild) === a);
    }
    function n(a) {
        return null !== a.parentNode ? n(a.parentNode) : a;
    }
    function o(a, b) {
        if (!(a && a.nodeType && b && b.nodeType)) return window.document.documentElement;
        var c = a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING, d = c ? a : b, e = c ? b : a, f = document.createRange();
        f.setStart(d, 0), f.setEnd(e, 0);
        var g = f.commonAncestorContainer;
        if (a !== g && b !== g || d.contains(e)) return m(g) ? g : l(g);
        var h = n(a);
        return h.host ? o(h.host, b) : o(a, n(b).host);
    }
    function p(a) {
        var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "top", c = "top" === b ? "scrollTop" : "scrollLeft", d = a.nodeName;
        if ("BODY" === d || "HTML" === d) {
            var e = window.document.documentElement;
            return (window.document.scrollingElement || e)[c];
        }
        return a[c];
    }
    function q(a, b) {
        var c = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], d = p(b, "top"), e = p(b, "left"), f = c ? -1 : 1;
        return a.top += d * f, a.bottom += d * f, a.left += e * f, a.right += e * f, a;
    }
    function r(a, b) {
        var c = "x" === b ? "Left" : "Top", d = "Left" === c ? "Right" : "Bottom";
        return +a["border" + c + "Width"].split("px")[0] + +a["border" + d + "Width"].split("px")[0];
    }
    function s(a, b, c, d) {
        return Math.max(b["offset" + a], b["scroll" + a], c["client" + a], c["offset" + a], c["scroll" + a], za() ? c["offset" + a] + d["margin" + ("Height" === a ? "Top" : "Left")] + d["margin" + ("Height" === a ? "Bottom" : "Right")] : 0);
    }
    function t() {
        var a = window.document.body, b = window.document.documentElement, c = za() && window.getComputedStyle(b);
        return {
            height: s("Height", a, b, c),
            width: s("Width", a, b, c)
        };
    }
    function u(a) {
        return Da({}, a, {
            right: a.left + a.width,
            bottom: a.top + a.height
        });
    }
    function v(a) {
        var b = {};
        if (za()) try {
            b = a.getBoundingClientRect();
            var c = p(a, "top"), d = p(a, "left");
            b.top += c, b.left += d, b.bottom += c, b.right += d;
        } catch (a) {} else b = a.getBoundingClientRect();
        var e = {
            left: b.left,
            top: b.top,
            width: b.right - b.left,
            height: b.bottom - b.top
        }, f = "HTML" === a.nodeName ? t() : {}, g = f.width || a.clientWidth || e.right - e.left, h = f.height || a.clientHeight || e.bottom - e.top, j = a.offsetWidth - g, k = a.offsetHeight - h;
        if (j || k) {
            var l = i(a);
            j -= r(l, "x"), k -= r(l, "y"), e.width -= j, e.height -= k;
        }
        return u(e);
    }
    function w(a, b) {
        var c = za(), d = "HTML" === b.nodeName, e = v(a), f = v(b), g = k(a), h = i(b), j = +h.borderTopWidth.split("px")[0], l = +h.borderLeftWidth.split("px")[0], m = u({
            top: e.top - f.top - j,
            left: e.left - f.left - l,
            width: e.width,
            height: e.height
        });
        if (m.marginTop = 0, m.marginLeft = 0, !c && d) {
            var n = +h.marginTop.split("px")[0], o = +h.marginLeft.split("px")[0];
            m.top -= j - n, m.bottom -= j - n, m.left -= l - o, m.right -= l - o, m.marginTop = n, 
            m.marginLeft = o;
        }
        return (c ? b.contains(g) : b === g && "BODY" !== g.nodeName) && (m = q(m, b)), 
        m;
    }
    function x(a) {
        var b = window.document.documentElement, c = w(a, b), d = Math.max(b.clientWidth, window.innerWidth || 0), e = Math.max(b.clientHeight, window.innerHeight || 0), f = p(b), g = p(b, "left");
        return u({
            top: f - c.top + c.marginTop,
            left: g - c.left + c.marginLeft,
            width: d,
            height: e
        });
    }
    function y(a) {
        var b = a.nodeName;
        return "BODY" !== b && "HTML" !== b && ("fixed" === i(a, "position") || y(j(a)));
    }
    function z(a, b, c, d) {
        var e = {
            top: 0,
            left: 0
        }, f = o(a, b);
        if ("viewport" === d) e = x(f); else {
            var g = void 0;
            "scrollParent" === d ? (g = k(j(a)), "BODY" === g.nodeName && (g = window.document.documentElement)) : g = "window" === d ? window.document.documentElement : d;
            var h = w(g, f);
            if ("HTML" !== g.nodeName || y(f)) e = h; else {
                var i = t(), l = i.height, m = i.width;
                e.top += h.top - h.marginTop, e.bottom = l + h.top, e.left += h.left - h.marginLeft, 
                e.right = m + h.left;
            }
        }
        return e.left += c, e.top += c, e.right -= c, e.bottom -= c, e;
    }
    function A(a) {
        return a.width * a.height;
    }
    function B(a, b, c, d, e) {
        var f = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0;
        if (-1 === a.indexOf("auto")) return a;
        var g = z(c, d, f, e), h = {
            top: {
                width: g.width,
                height: b.top - g.top
            },
            right: {
                width: g.right - b.right,
                height: g.height
            },
            bottom: {
                width: g.width,
                height: g.bottom - b.bottom
            },
            left: {
                width: b.left - g.left,
                height: g.height
            }
        }, i = Object.keys(h).map(function(a) {
            return Da({
                key: a
            }, h[a], {
                area: A(h[a])
            });
        }).sort(function(a, b) {
            return b.area - a.area;
        }), j = i.filter(function(a) {
            var b = a.width, d = a.height;
            return b >= c.clientWidth && d >= c.clientHeight;
        }), k = j.length > 0 ? j[0].key : i[0].key, l = a.split("-")[1];
        return k + (l ? "-" + l : "");
    }
    function C(a, b, c) {
        return w(c, o(b, c));
    }
    function D(a) {
        var b = window.getComputedStyle(a), c = parseFloat(b.marginTop) + parseFloat(b.marginBottom), d = parseFloat(b.marginLeft) + parseFloat(b.marginRight);
        return {
            width: a.offsetWidth + d,
            height: a.offsetHeight + c
        };
    }
    function E(a) {
        var b = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };
        return a.replace(/left|right|bottom|top/g, function(a) {
            return b[a];
        });
    }
    function F(a, b, c) {
        c = c.split("-")[0];
        var d = D(a), e = {
            width: d.width,
            height: d.height
        }, f = -1 !== [ "right", "left" ].indexOf(c), g = f ? "top" : "left", h = f ? "left" : "top", i = f ? "height" : "width", j = f ? "width" : "height";
        return e[g] = b[g] + b[i] / 2 - d[i] / 2, e[h] = c === h ? b[h] - d[j] : b[E(h)], 
        e;
    }
    function G(a, b) {
        return Array.prototype.find ? a.find(b) : a.filter(b)[0];
    }
    function H(a, b, c) {
        if (Array.prototype.findIndex) return a.findIndex(function(a) {
            return a[b] === c;
        });
        var d = G(a, function(a) {
            return a[b] === c;
        });
        return a.indexOf(d);
    }
    function I(a, b, c) {
        return (void 0 === c ? a : a.slice(0, H(a, "name", c))).forEach(function(a) {
            a.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
            var c = a.function || a.fn;
            a.enabled && h(c) && (b.offsets.popper = u(b.offsets.popper), b.offsets.reference = u(b.offsets.reference), 
            b = c(b, a));
        }), b;
    }
    function J() {
        if (!this.state.isDestroyed) {
            var a = {
                instance: this,
                styles: {},
                arrowStyles: {},
                attributes: {},
                flipped: !1,
                offsets: {}
            };
            a.offsets.reference = C(this.state, this.popper, this.reference), a.placement = B(this.options.placement, a.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), 
            a.originalPlacement = a.placement, a.offsets.popper = F(this.popper, a.offsets.reference, a.placement), 
            a.offsets.popper.position = "absolute", a = I(this.modifiers, a), this.state.isCreated ? this.options.onUpdate(a) : (this.state.isCreated = !0, 
            this.options.onCreate(a));
        }
    }
    function K(a, b) {
        return a.some(function(a) {
            var c = a.name;
            return a.enabled && c === b;
        });
    }
    function L(a) {
        for (var b = [ !1, "ms", "Webkit", "Moz", "O" ], c = a.charAt(0).toUpperCase() + a.slice(1), d = 0; d < b.length - 1; d++) {
            var e = b[d], f = e ? "" + e + c : a;
            if (void 0 !== window.document.body.style[f]) return f;
        }
        return null;
    }
    function M() {
        return this.state.isDestroyed = !0, K(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), 
        this.popper.style.left = "", this.popper.style.position = "", this.popper.style.top = "", 
        this.popper.style[L("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), 
        this;
    }
    function N(a, b, c, d) {
        var e = "BODY" === a.nodeName, f = e ? window : a;
        f.addEventListener(b, c, {
            passive: !0
        }), e || N(k(f.parentNode), b, c, d), d.push(f);
    }
    function O(a, b, c, d) {
        c.updateBound = d, window.addEventListener("resize", c.updateBound, {
            passive: !0
        });
        var e = k(a);
        return N(e, "scroll", c.updateBound, c.scrollParents), c.scrollElement = e, c.eventsEnabled = !0, 
        c;
    }
    function P() {
        this.state.eventsEnabled || (this.state = O(this.reference, this.options, this.state, this.scheduleUpdate));
    }
    function Q(a, b) {
        return window.removeEventListener("resize", b.updateBound), b.scrollParents.forEach(function(a) {
            a.removeEventListener("scroll", b.updateBound);
        }), b.updateBound = null, b.scrollParents = [], b.scrollElement = null, b.eventsEnabled = !1, 
        b;
    }
    function R() {
        this.state.eventsEnabled && (window.cancelAnimationFrame(this.scheduleUpdate), this.state = Q(this.reference, this.state));
    }
    function S(a) {
        return "" !== a && !isNaN(parseFloat(a)) && isFinite(a);
    }
    function T(a, b) {
        Object.keys(b).forEach(function(c) {
            var d = "";
            -1 !== [ "width", "height", "top", "right", "bottom", "left" ].indexOf(c) && S(b[c]) && (d = "px"), 
            a.style[c] = b[c] + d;
        });
    }
    function U(a, b) {
        Object.keys(b).forEach(function(c) {
            !1 !== b[c] ? a.setAttribute(c, b[c]) : a.removeAttribute(c);
        });
    }
    function V(a) {
        return T(a.instance.popper, a.styles), U(a.instance.popper, a.attributes), a.arrowElement && Object.keys(a.arrowStyles).length && T(a.arrowElement, a.arrowStyles), 
        a;
    }
    function W(a, b, c, d, e) {
        var f = C(e, b, a), g = B(c.placement, f, b, a, c.modifiers.flip.boundariesElement, c.modifiers.flip.padding);
        return b.setAttribute("x-placement", g), T(b, {
            position: "absolute"
        }), c;
    }
    function X(a, b) {
        var c = b.x, d = b.y, e = a.offsets.popper, f = G(a.instance.modifiers, function(a) {
            return "applyStyle" === a.name;
        }).gpuAcceleration;
        void 0 !== f && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
        var g = void 0 !== f ? f : b.gpuAcceleration, h = l(a.instance.popper), i = v(h), j = {
            position: e.position
        }, k = {
            left: Math.floor(e.left),
            top: Math.floor(e.top),
            bottom: Math.floor(e.bottom),
            right: Math.floor(e.right)
        }, m = "bottom" === c ? "top" : "bottom", n = "right" === d ? "left" : "right", o = L("transform"), p = void 0, q = void 0;
        if (q = "bottom" === m ? -i.height + k.bottom : k.top, p = "right" === n ? -i.width + k.right : k.left, 
        g && o) j[o] = "translate3d(" + p + "px, " + q + "px, 0)", j[m] = 0, j[n] = 0, j.willChange = "transform"; else {
            var r = "bottom" === m ? -1 : 1, s = "right" === n ? -1 : 1;
            j[m] = q * r, j[n] = p * s, j.willChange = m + ", " + n;
        }
        var t = {
            "x-placement": a.placement
        };
        return a.attributes = Da({}, t, a.attributes), a.styles = Da({}, j, a.styles), a.arrowStyles = Da({}, a.offsets.arrow, a.arrowStyles), 
        a;
    }
    function Y(a, b, c) {
        var d = G(a, function(a) {
            return a.name === b;
        }), e = !!d && a.some(function(a) {
            return a.name === c && a.enabled && a.order < d.order;
        });
        if (!e) {
            var f = "`" + b + "`", g = "`" + c + "`";
            console.warn(g + " modifier is required by " + f + " modifier in order to work, be sure to include it before " + f + "!");
        }
        return e;
    }
    function Z(a, b) {
        if (!Y(a.instance.modifiers, "arrow", "keepTogether")) return a;
        var c = b.element;
        if ("string" == typeof c) {
            if (!(c = a.instance.popper.querySelector(c))) return a;
        } else if (!a.instance.popper.contains(c)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), 
        a;
        var d = a.placement.split("-")[0], e = a.offsets, f = e.popper, g = e.reference, h = -1 !== [ "left", "right" ].indexOf(d), j = h ? "height" : "width", k = h ? "Top" : "Left", l = k.toLowerCase(), m = h ? "left" : "top", n = h ? "bottom" : "right", o = D(c)[j];
        g[n] - o < f[l] && (a.offsets.popper[l] -= f[l] - (g[n] - o)), g[l] + o > f[n] && (a.offsets.popper[l] += g[l] + o - f[n]);
        var p = g[l] + g[j] / 2 - o / 2, q = i(a.instance.popper, "margin" + k).replace("px", ""), r = p - u(a.offsets.popper)[l] - q;
        return r = Math.max(Math.min(f[j] - o, r), 0), a.arrowElement = c, a.offsets.arrow = {}, 
        a.offsets.arrow[l] = Math.round(r), a.offsets.arrow[m] = "", a;
    }
    function $(a) {
        return "end" === a ? "start" : "start" === a ? "end" : a;
    }
    function _(a) {
        var b = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], c = Fa.indexOf(a), d = Fa.slice(c + 1).concat(Fa.slice(0, c));
        return b ? d.reverse() : d;
    }
    function aa(a, b) {
        if (K(a.instance.modifiers, "inner")) return a;
        if (a.flipped && a.placement === a.originalPlacement) return a;
        var c = z(a.instance.popper, a.instance.reference, b.padding, b.boundariesElement), d = a.placement.split("-")[0], e = E(d), f = a.placement.split("-")[1] || "", g = [];
        switch (b.behavior) {
          case Ga.FLIP:
            g = [ d, e ];
            break;

          case Ga.CLOCKWISE:
            g = _(d);
            break;

          case Ga.COUNTERCLOCKWISE:
            g = _(d, !0);
            break;

          default:
            g = b.behavior;
        }
        return g.forEach(function(h, i) {
            if (d !== h || g.length === i + 1) return a;
            d = a.placement.split("-")[0], e = E(d);
            var j = a.offsets.popper, k = a.offsets.reference, l = Math.floor, m = "left" === d && l(j.right) > l(k.left) || "right" === d && l(j.left) < l(k.right) || "top" === d && l(j.bottom) > l(k.top) || "bottom" === d && l(j.top) < l(k.bottom), n = l(j.left) < l(c.left), o = l(j.right) > l(c.right), p = l(j.top) < l(c.top), q = l(j.bottom) > l(c.bottom), r = "left" === d && n || "right" === d && o || "top" === d && p || "bottom" === d && q, s = -1 !== [ "top", "bottom" ].indexOf(d), t = !!b.flipVariations && (s && "start" === f && n || s && "end" === f && o || !s && "start" === f && p || !s && "end" === f && q);
            (m || r || t) && (a.flipped = !0, (m || r) && (d = g[i + 1]), t && (f = $(f)), a.placement = d + (f ? "-" + f : ""), 
            a.offsets.popper = Da({}, a.offsets.popper, F(a.instance.popper, a.offsets.reference, a.placement)), 
            a = I(a.instance.modifiers, a, "flip"));
        }), a;
    }
    function ba(a) {
        var b = a.offsets, c = b.popper, d = b.reference, e = a.placement.split("-")[0], f = Math.floor, g = -1 !== [ "top", "bottom" ].indexOf(e), h = g ? "right" : "bottom", i = g ? "left" : "top", j = g ? "width" : "height";
        return c[h] < f(d[i]) && (a.offsets.popper[i] = f(d[i]) - c[j]), c[i] > f(d[h]) && (a.offsets.popper[i] = f(d[h])), 
        a;
    }
    function ca(a, b, c, d) {
        var e = a.match(/((?:\-|\+)?\d*\.?\d*)(.*)/), f = +e[1], g = e[2];
        if (!f) return a;
        if (0 === g.indexOf("%")) {
            var h = void 0;
            switch (g) {
              case "%p":
                h = c;
                break;

              case "%":
              case "%r":
              default:
                h = d;
            }
            return u(h)[b] / 100 * f;
        }
        if ("vh" === g || "vw" === g) {
            return ("vh" === g ? Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * f;
        }
        return f;
    }
    function da(a, b, c, d) {
        var e = [ 0, 0 ], f = -1 !== [ "right", "left" ].indexOf(d), g = a.split(/(\+|\-)/).map(function(a) {
            return a.trim();
        }), h = g.indexOf(G(g, function(a) {
            return -1 !== a.search(/,|\s/);
        }));
        g[h] && -1 === g[h].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
        var i = /\s*,\s*|\s+/, j = -1 !== h ? [ g.slice(0, h).concat([ g[h].split(i)[0] ]), [ g[h].split(i)[1] ].concat(g.slice(h + 1)) ] : [ g ];
        return j = j.map(function(a, d) {
            var e = (1 === d ? !f : f) ? "height" : "width", g = !1;
            return a.reduce(function(a, b) {
                return "" === a[a.length - 1] && -1 !== [ "+", "-" ].indexOf(b) ? (a[a.length - 1] = b, 
                g = !0, a) : g ? (a[a.length - 1] += b, g = !1, a) : a.concat(b);
            }, []).map(function(a) {
                return ca(a, e, b, c);
            });
        }), j.forEach(function(a, b) {
            a.forEach(function(c, d) {
                S(c) && (e[b] += c * ("-" === a[d - 1] ? -1 : 1));
            });
        }), e;
    }
    function ea(a, b) {
        var c = b.offset, d = a.placement, e = a.offsets, f = e.popper, g = e.reference, h = d.split("-")[0], i = void 0;
        return i = S(+c) ? [ +c, 0 ] : da(c, f, g, h), "left" === h ? (f.top += i[0], f.left -= i[1]) : "right" === h ? (f.top += i[0], 
        f.left += i[1]) : "top" === h ? (f.left += i[0], f.top -= i[1]) : "bottom" === h && (f.left += i[0], 
        f.top += i[1]), a.popper = f, a;
    }
    function fa(a, b) {
        var c = b.boundariesElement || l(a.instance.popper);
        a.instance.reference === c && (c = l(c));
        var d = z(a.instance.popper, a.instance.reference, b.padding, c);
        b.boundaries = d;
        var e = b.priority, f = a.offsets.popper, g = {
            primary: function(a) {
                var c = f[a];
                return f[a] < d[a] && !b.escapeWithReference && (c = Math.max(f[a], d[a])), Ca({}, a, c);
            },
            secondary: function(a) {
                var c = "right" === a ? "left" : "top", e = f[c];
                return f[a] > d[a] && !b.escapeWithReference && (e = Math.min(f[c], d[a] - ("right" === a ? f.width : f.height))), 
                Ca({}, c, e);
            }
        };
        return e.forEach(function(a) {
            var b = -1 !== [ "left", "top" ].indexOf(a) ? "primary" : "secondary";
            f = Da({}, f, g[b](a));
        }), a.offsets.popper = f, a;
    }
    function ga(a) {
        var b = a.placement, c = b.split("-")[0], d = b.split("-")[1];
        if (d) {
            var e = a.offsets, f = e.reference, g = e.popper, h = -1 !== [ "bottom", "top" ].indexOf(c), i = h ? "left" : "top", j = h ? "width" : "height", k = {
                start: Ca({}, i, f[i]),
                end: Ca({}, i, f[i] + f[j] - g[j])
            };
            a.offsets.popper = Da({}, g, k[d]);
        }
        return a;
    }
    function ha(a) {
        if (!Y(a.instance.modifiers, "hide", "preventOverflow")) return a;
        var b = a.offsets.reference, c = G(a.instance.modifiers, function(a) {
            return "preventOverflow" === a.name;
        }).boundaries;
        if (b.bottom < c.top || b.left > c.right || b.top > c.bottom || b.right < c.left) {
            if (!0 === a.hide) return a;
            a.hide = !0, a.attributes["x-out-of-boundaries"] = "";
        } else {
            if (!1 === a.hide) return a;
            a.hide = !1, a.attributes["x-out-of-boundaries"] = !1;
        }
        return a;
    }
    function ia(a) {
        var b = a.placement, c = b.split("-")[0], d = a.offsets, e = d.popper, f = d.reference, g = -1 !== [ "left", "right" ].indexOf(c), h = -1 === [ "top", "left" ].indexOf(c);
        return e[g ? "left" : "top"] = f[c] - (h ? e[g ? "width" : "height"] : 0), a.placement = E(b), 
        a.offsets.popper = u(e), a;
    }
    b = b && b.hasOwnProperty("default") ? b.default : b;
    for (var ja = function() {
        function a(a) {
            return {}.toString.call(a).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
        function c() {
            return {
                bindType: g.end,
                delegateType: g.end,
                handle: function(a) {
                    if (b(a.target).is(this)) return a.handleObj.handler.apply(this, arguments);
                }
            };
        }
        function d() {
            if (window.QUnit) return !1;
            var a = document.createElement("bootstrap");
            for (var b in i) if (void 0 !== a.style[b]) return {
                end: i[b]
            };
            return !1;
        }
        function e(a) {
            var c = this, d = !1;
            return b(this).one(j.TRANSITION_END, function() {
                d = !0;
            }), setTimeout(function() {
                d || j.triggerTransitionEnd(c);
            }, a), this;
        }
        function f() {
            g = d(), b.fn.emulateTransitionEnd = e, j.supportsTransitionEnd() && (b.event.special[j.TRANSITION_END] = c());
        }
        var g = !1, h = 1e6, i = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        }, j = {
            TRANSITION_END: "bsTransitionEnd",
            getUID: function(a) {
                do {
                    a += ~~(Math.random() * h);
                } while (document.getElementById(a));
                return a;
            },
            getSelectorFromElement: function(a) {
                var c = a.getAttribute("data-target");
                c && "#" !== c || (c = a.getAttribute("href") || "");
                try {
                    return b(document).find(c).length > 0 ? c : null;
                } catch (a) {
                    return null;
                }
            },
            reflow: function(a) {
                return a.offsetHeight;
            },
            triggerTransitionEnd: function(a) {
                b(a).trigger(g.end);
            },
            supportsTransitionEnd: function() {
                return Boolean(g);
            },
            isElement: function(a) {
                return (a[0] || a).nodeType;
            },
            typeCheckConfig: function(b, c, d) {
                for (var e in d) if (Object.prototype.hasOwnProperty.call(d, e)) {
                    var f = d[e], g = c[e], h = g && j.isElement(g) ? "element" : a(g);
                    if (!new RegExp(f).test(h)) throw new Error(b.toUpperCase() + ': Option "' + e + '" provided type "' + h + '" but expected type "' + f + '".');
                }
            }
        };
        return f(), j;
    }(), ka = d, la = e, ma = function() {
        var a = "alert", c = "4.0.0-beta.2", d = "bs.alert", e = "." + d, f = ".data-api", g = b.fn[a], h = 150, i = {
            DISMISS: '[data-dismiss="alert"]'
        }, j = {
            CLOSE: "close" + e,
            CLOSED: "closed" + e,
            CLICK_DATA_API: "click" + e + f
        }, k = {
            ALERT: "alert",
            FADE: "fade",
            SHOW: "show"
        }, l = function() {
            function a(a) {
                this._element = a;
            }
            var e = a.prototype;
            return e.close = function(a) {
                a = a || this._element;
                var b = this._getRootElement(a);
                this._triggerCloseEvent(b).isDefaultPrevented() || this._removeElement(b);
            }, e.dispose = function() {
                b.removeData(this._element, d), this._element = null;
            }, e._getRootElement = function(a) {
                var c = ja.getSelectorFromElement(a), d = !1;
                return c && (d = b(c)[0]), d || (d = b(a).closest("." + k.ALERT)[0]), d;
            }, e._triggerCloseEvent = function(a) {
                var c = b.Event(j.CLOSE);
                return b(a).trigger(c), c;
            }, e._removeElement = function(a) {
                var c = this;
                if (b(a).removeClass(k.SHOW), !ja.supportsTransitionEnd() || !b(a).hasClass(k.FADE)) return void this._destroyElement(a);
                b(a).one(ja.TRANSITION_END, function(b) {
                    return c._destroyElement(a, b);
                }).emulateTransitionEnd(h);
            }, e._destroyElement = function(a) {
                b(a).detach().trigger(j.CLOSED).remove();
            }, a._jQueryInterface = function(c) {
                return this.each(function() {
                    var e = b(this), f = e.data(d);
                    f || (f = new a(this), e.data(d, f)), "close" === c && f[c](this);
                });
            }, a._handleDismiss = function(a) {
                return function(b) {
                    b && b.preventDefault(), a.close(this);
                };
            }, ka(a, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            } ]), a;
        }();
        return b(document).on(j.CLICK_DATA_API, i.DISMISS, l._handleDismiss(new l())), b.fn[a] = l._jQueryInterface, 
        b.fn[a].Constructor = l, b.fn[a].noConflict = function() {
            return b.fn[a] = g, l._jQueryInterface;
        }, l;
    }(), na = function() {
        var a = "button", c = "4.0.0-beta.2", d = "bs.button", e = "." + d, f = ".data-api", g = b.fn[a], h = {
            ACTIVE: "active",
            BUTTON: "btn",
            FOCUS: "focus"
        }, i = {
            DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
            DATA_TOGGLE: '[data-toggle="buttons"]',
            INPUT: "input",
            ACTIVE: ".active",
            BUTTON: ".btn"
        }, j = {
            CLICK_DATA_API: "click" + e + f,
            FOCUS_BLUR_DATA_API: "focus" + e + f + " blur" + e + f
        }, k = function() {
            function a(a) {
                this._element = a;
            }
            var e = a.prototype;
            return e.toggle = function() {
                var a = !0, c = !0, d = b(this._element).closest(i.DATA_TOGGLE)[0];
                if (d) {
                    var e = b(this._element).find(i.INPUT)[0];
                    if (e) {
                        if ("radio" === e.type) if (e.checked && b(this._element).hasClass(h.ACTIVE)) a = !1; else {
                            var f = b(d).find(i.ACTIVE)[0];
                            f && b(f).removeClass(h.ACTIVE);
                        }
                        if (a) {
                            if (e.hasAttribute("disabled") || d.hasAttribute("disabled") || e.classList.contains("disabled") || d.classList.contains("disabled")) return;
                            e.checked = !b(this._element).hasClass(h.ACTIVE), b(e).trigger("change");
                        }
                        e.focus(), c = !1;
                    }
                }
                c && this._element.setAttribute("aria-pressed", !b(this._element).hasClass(h.ACTIVE)), 
                a && b(this._element).toggleClass(h.ACTIVE);
            }, e.dispose = function() {
                b.removeData(this._element, d), this._element = null;
            }, a._jQueryInterface = function(c) {
                return this.each(function() {
                    var e = b(this).data(d);
                    e || (e = new a(this), b(this).data(d, e)), "toggle" === c && e[c]();
                });
            }, ka(a, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            } ]), a;
        }();
        return b(document).on(j.CLICK_DATA_API, i.DATA_TOGGLE_CARROT, function(a) {
            a.preventDefault();
            var c = a.target;
            b(c).hasClass(h.BUTTON) || (c = b(c).closest(i.BUTTON)), k._jQueryInterface.call(b(c), "toggle");
        }).on(j.FOCUS_BLUR_DATA_API, i.DATA_TOGGLE_CARROT, function(a) {
            var c = b(a.target).closest(i.BUTTON)[0];
            b(c).toggleClass(h.FOCUS, /^focus(in)?$/.test(a.type));
        }), b.fn[a] = k._jQueryInterface, b.fn[a].Constructor = k, b.fn[a].noConflict = function() {
            return b.fn[a] = g, k._jQueryInterface;
        }, k;
    }(), oa = (function() {
        var a = "carousel", c = "4.0.0-beta.2", d = "bs.carousel", e = "." + d, f = ".data-api", g = b.fn[a], h = 600, i = 37, j = 39, k = 500, l = {
            interval: 5e3,
            keyboard: !0,
            slide: !1,
            pause: "hover",
            wrap: !0
        }, m = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean"
        }, n = {
            NEXT: "next",
            PREV: "prev",
            LEFT: "left",
            RIGHT: "right"
        }, o = {
            SLIDE: "slide" + e,
            SLID: "slid" + e,
            KEYDOWN: "keydown" + e,
            MOUSEENTER: "mouseenter" + e,
            MOUSELEAVE: "mouseleave" + e,
            TOUCHEND: "touchend" + e,
            LOAD_DATA_API: "load" + e + f,
            CLICK_DATA_API: "click" + e + f
        }, p = {
            CAROUSEL: "carousel",
            ACTIVE: "active",
            SLIDE: "slide",
            RIGHT: "carousel-item-right",
            LEFT: "carousel-item-left",
            NEXT: "carousel-item-next",
            PREV: "carousel-item-prev",
            ITEM: "carousel-item"
        }, q = {
            ACTIVE: ".active",
            ACTIVE_ITEM: ".active.carousel-item",
            ITEM: ".carousel-item",
            NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
            INDICATORS: ".carousel-indicators",
            DATA_SLIDE: "[data-slide], [data-slide-to]",
            DATA_RIDE: '[data-ride="carousel"]'
        }, r = function() {
            function f(a, c) {
                this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, 
                this._isSliding = !1, this.touchTimeout = null, this._config = this._getConfig(c), 
                this._element = b(a)[0], this._indicatorsElement = b(this._element).find(q.INDICATORS)[0], 
                this._addEventListeners();
            }
            var g = f.prototype;
            return g.next = function() {
                this._isSliding || this._slide(n.NEXT);
            }, g.nextWhenVisible = function() {
                !document.hidden && b(this._element).is(":visible") && "hidden" !== b(this._element).css("visibility") && this.next();
            }, g.prev = function() {
                this._isSliding || this._slide(n.PREV);
            }, g.pause = function(a) {
                a || (this._isPaused = !0), b(this._element).find(q.NEXT_PREV)[0] && ja.supportsTransitionEnd() && (ja.triggerTransitionEnd(this._element), 
                this.cycle(!0)), clearInterval(this._interval), this._interval = null;
            }, g.cycle = function(a) {
                a || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), 
                this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval));
            }, g.to = function(a) {
                var c = this;
                this._activeElement = b(this._element).find(q.ACTIVE_ITEM)[0];
                var d = this._getItemIndex(this._activeElement);
                if (!(a > this._items.length - 1 || a < 0)) {
                    if (this._isSliding) return void b(this._element).one(o.SLID, function() {
                        return c.to(a);
                    });
                    if (d === a) return this.pause(), void this.cycle();
                    var e = a > d ? n.NEXT : n.PREV;
                    this._slide(e, this._items[a]);
                }
            }, g.dispose = function() {
                b(this._element).off(e), b.removeData(this._element, d), this._items = null, this._config = null, 
                this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, 
                this._activeElement = null, this._indicatorsElement = null;
            }, g._getConfig = function(c) {
                return c = b.extend({}, l, c), ja.typeCheckConfig(a, c, m), c;
            }, g._addEventListeners = function() {
                var a = this;
                this._config.keyboard && b(this._element).on(o.KEYDOWN, function(b) {
                    return a._keydown(b);
                }), "hover" === this._config.pause && (b(this._element).on(o.MOUSEENTER, function(b) {
                    return a.pause(b);
                }).on(o.MOUSELEAVE, function(b) {
                    return a.cycle(b);
                }), "ontouchstart" in document.documentElement && b(this._element).on(o.TOUCHEND, function() {
                    a.pause(), a.touchTimeout && clearTimeout(a.touchTimeout), a.touchTimeout = setTimeout(function(b) {
                        return a.cycle(b);
                    }, k + a._config.interval);
                }));
            }, g._keydown = function(a) {
                if (!/input|textarea/i.test(a.target.tagName)) switch (a.which) {
                  case i:
                    a.preventDefault(), this.prev();
                    break;

                  case j:
                    a.preventDefault(), this.next();
                    break;

                  default:
                    return;
                }
            }, g._getItemIndex = function(a) {
                return this._items = b.makeArray(b(a).parent().find(q.ITEM)), this._items.indexOf(a);
            }, g._getItemByDirection = function(a, b) {
                var c = a === n.NEXT, d = a === n.PREV, e = this._getItemIndex(b), f = this._items.length - 1;
                if ((d && 0 === e || c && e === f) && !this._config.wrap) return b;
                var g = a === n.PREV ? -1 : 1, h = (e + g) % this._items.length;
                return -1 === h ? this._items[this._items.length - 1] : this._items[h];
            }, g._triggerSlideEvent = function(a, c) {
                var d = this._getItemIndex(a), e = this._getItemIndex(b(this._element).find(q.ACTIVE_ITEM)[0]), f = b.Event(o.SLIDE, {
                    relatedTarget: a,
                    direction: c,
                    from: e,
                    to: d
                });
                return b(this._element).trigger(f), f;
            }, g._setActiveIndicatorElement = function(a) {
                if (this._indicatorsElement) {
                    b(this._indicatorsElement).find(q.ACTIVE).removeClass(p.ACTIVE);
                    var c = this._indicatorsElement.children[this._getItemIndex(a)];
                    c && b(c).addClass(p.ACTIVE);
                }
            }, g._slide = function(a, c) {
                var d, e, f, g = this, i = b(this._element).find(q.ACTIVE_ITEM)[0], j = this._getItemIndex(i), k = c || i && this._getItemByDirection(a, i), l = this._getItemIndex(k), m = Boolean(this._interval);
                if (a === n.NEXT ? (d = p.LEFT, e = p.NEXT, f = n.LEFT) : (d = p.RIGHT, e = p.PREV, 
                f = n.RIGHT), k && b(k).hasClass(p.ACTIVE)) return void (this._isSliding = !1);
                if (!this._triggerSlideEvent(k, f).isDefaultPrevented() && i && k) {
                    this._isSliding = !0, m && this.pause(), this._setActiveIndicatorElement(k);
                    var r = b.Event(o.SLID, {
                        relatedTarget: k,
                        direction: f,
                        from: j,
                        to: l
                    });
                    ja.supportsTransitionEnd() && b(this._element).hasClass(p.SLIDE) ? (b(k).addClass(e), 
                    ja.reflow(k), b(i).addClass(d), b(k).addClass(d), b(i).one(ja.TRANSITION_END, function() {
                        b(k).removeClass(d + " " + e).addClass(p.ACTIVE), b(i).removeClass(p.ACTIVE + " " + e + " " + d), 
                        g._isSliding = !1, setTimeout(function() {
                            return b(g._element).trigger(r);
                        }, 0);
                    }).emulateTransitionEnd(h)) : (b(i).removeClass(p.ACTIVE), b(k).addClass(p.ACTIVE), 
                    this._isSliding = !1, b(this._element).trigger(r)), m && this.cycle();
                }
            }, f._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this).data(d), e = b.extend({}, l, b(this).data());
                    "object" == typeof a && b.extend(e, a);
                    var g = "string" == typeof a ? a : e.slide;
                    if (c || (c = new f(this, e), b(this).data(d, c)), "number" == typeof a) c.to(a); else if ("string" == typeof g) {
                        if (void 0 === c[g]) throw new Error('No method named "' + g + '"');
                        c[g]();
                    } else e.interval && (c.pause(), c.cycle());
                });
            }, f._dataApiClickHandler = function(a) {
                var c = ja.getSelectorFromElement(this);
                if (c) {
                    var e = b(c)[0];
                    if (e && b(e).hasClass(p.CAROUSEL)) {
                        var g = b.extend({}, b(e).data(), b(this).data()), h = this.getAttribute("data-slide-to");
                        h && (g.interval = !1), f._jQueryInterface.call(b(e), g), h && b(e).data(d).to(h), 
                        a.preventDefault();
                    }
                }
            }, ka(f, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return l;
                }
            } ]), f;
        }();
        return b(document).on(o.CLICK_DATA_API, q.DATA_SLIDE, r._dataApiClickHandler), b(window).on(o.LOAD_DATA_API, function() {
            b(q.DATA_RIDE).each(function() {
                var a = b(this);
                r._jQueryInterface.call(a, a.data());
            });
        }), b.fn[a] = r._jQueryInterface, b.fn[a].Constructor = r, b.fn[a].noConflict = function() {
            return b.fn[a] = g, r._jQueryInterface;
        }, r;
    }()), pa = function() {
        var a = "collapse", c = "4.0.0-beta.2", d = "bs.collapse", e = "." + d, f = ".data-api", g = b.fn[a], h = 600, i = {
            toggle: !0,
            parent: ""
        }, j = {
            toggle: "boolean",
            parent: "(string|element)"
        }, k = {
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            CLICK_DATA_API: "click" + e + f
        }, l = {
            SHOW: "show",
            COLLAPSE: "collapse",
            COLLAPSING: "collapsing",
            COLLAPSED: "collapsed"
        }, m = {
            WIDTH: "width",
            HEIGHT: "height"
        }, n = {
            ACTIVES: ".show, .collapsing",
            DATA_TOGGLE: '[data-toggle="collapse"]'
        }, o = function() {
            function e(a, c) {
                this._isTransitioning = !1, this._element = a, this._config = this._getConfig(c), 
                this._triggerArray = b.makeArray(b('[data-toggle="collapse"][href="#' + a.id + '"],[data-toggle="collapse"][data-target="#' + a.id + '"]'));
                for (var d = b(n.DATA_TOGGLE), e = 0; e < d.length; e++) {
                    var f = d[e], g = ja.getSelectorFromElement(f);
                    null !== g && b(g).filter(a).length > 0 && this._triggerArray.push(f);
                }
                this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), 
                this._config.toggle && this.toggle();
            }
            var f = e.prototype;
            return f.toggle = function() {
                b(this._element).hasClass(l.SHOW) ? this.hide() : this.show();
            }, f.show = function() {
                var a = this;
                if (!this._isTransitioning && !b(this._element).hasClass(l.SHOW)) {
                    var c, f;
                    if (this._parent && (c = b.makeArray(b(this._parent).children().children(n.ACTIVES)), 
                    c.length || (c = null)), !(c && (f = b(c).data(d)) && f._isTransitioning)) {
                        var g = b.Event(k.SHOW);
                        if (b(this._element).trigger(g), !g.isDefaultPrevented()) {
                            c && (e._jQueryInterface.call(b(c), "hide"), f || b(c).data(d, null));
                            var i = this._getDimension();
                            b(this._element).removeClass(l.COLLAPSE).addClass(l.COLLAPSING), this._element.style[i] = 0, 
                            this._triggerArray.length && b(this._triggerArray).removeClass(l.COLLAPSED).attr("aria-expanded", !0), 
                            this.setTransitioning(!0);
                            var j = function() {
                                b(a._element).removeClass(l.COLLAPSING).addClass(l.COLLAPSE).addClass(l.SHOW), a._element.style[i] = "", 
                                a.setTransitioning(!1), b(a._element).trigger(k.SHOWN);
                            };
                            if (!ja.supportsTransitionEnd()) return void j();
                            var m = i[0].toUpperCase() + i.slice(1), o = "scroll" + m;
                            b(this._element).one(ja.TRANSITION_END, j).emulateTransitionEnd(h), this._element.style[i] = this._element[o] + "px";
                        }
                    }
                }
            }, f.hide = function() {
                var a = this;
                if (!this._isTransitioning && b(this._element).hasClass(l.SHOW)) {
                    var c = b.Event(k.HIDE);
                    if (b(this._element).trigger(c), !c.isDefaultPrevented()) {
                        var d = this._getDimension();
                        if (this._element.style[d] = this._element.getBoundingClientRect()[d] + "px", ja.reflow(this._element), 
                        b(this._element).addClass(l.COLLAPSING).removeClass(l.COLLAPSE).removeClass(l.SHOW), 
                        this._triggerArray.length) for (var e = 0; e < this._triggerArray.length; e++) {
                            var f = this._triggerArray[e], g = ja.getSelectorFromElement(f);
                            if (null !== g) {
                                var i = b(g);
                                i.hasClass(l.SHOW) || b(f).addClass(l.COLLAPSED).attr("aria-expanded", !1);
                            }
                        }
                        this.setTransitioning(!0);
                        var j = function() {
                            a.setTransitioning(!1), b(a._element).removeClass(l.COLLAPSING).addClass(l.COLLAPSE).trigger(k.HIDDEN);
                        };
                        if (this._element.style[d] = "", !ja.supportsTransitionEnd()) return void j();
                        b(this._element).one(ja.TRANSITION_END, j).emulateTransitionEnd(h);
                    }
                }
            }, f.setTransitioning = function(a) {
                this._isTransitioning = a;
            }, f.dispose = function() {
                b.removeData(this._element, d), this._config = null, this._parent = null, this._element = null, 
                this._triggerArray = null, this._isTransitioning = null;
            }, f._getConfig = function(c) {
                return c = b.extend({}, i, c), c.toggle = Boolean(c.toggle), ja.typeCheckConfig(a, c, j), 
                c;
            }, f._getDimension = function() {
                return b(this._element).hasClass(m.WIDTH) ? m.WIDTH : m.HEIGHT;
            }, f._getParent = function() {
                var a = this, c = null;
                ja.isElement(this._config.parent) ? (c = this._config.parent, void 0 !== this._config.parent.jquery && (c = this._config.parent[0])) : c = b(this._config.parent)[0];
                var d = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';
                return b(c).find(d).each(function(b, c) {
                    a._addAriaAndCollapsedClass(e._getTargetFromElement(c), [ c ]);
                }), c;
            }, f._addAriaAndCollapsedClass = function(a, c) {
                if (a) {
                    var d = b(a).hasClass(l.SHOW);
                    c.length && b(c).toggleClass(l.COLLAPSED, !d).attr("aria-expanded", d);
                }
            }, e._getTargetFromElement = function(a) {
                var c = ja.getSelectorFromElement(a);
                return c ? b(c)[0] : null;
            }, e._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this), f = c.data(d), g = b.extend({}, i, c.data(), "object" == typeof a && a);
                    if (!f && g.toggle && /show|hide/.test(a) && (g.toggle = !1), f || (f = new e(this, g), 
                    c.data(d, f)), "string" == typeof a) {
                        if (void 0 === f[a]) throw new Error('No method named "' + a + '"');
                        f[a]();
                    }
                });
            }, ka(e, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return i;
                }
            } ]), e;
        }();
        return b(document).on(k.CLICK_DATA_API, n.DATA_TOGGLE, function(a) {
            "A" === a.currentTarget.tagName && a.preventDefault();
            var c = b(this), e = ja.getSelectorFromElement(this);
            b(e).each(function() {
                var a = b(this), e = a.data(d), f = e ? "toggle" : c.data();
                o._jQueryInterface.call(a, f);
            });
        }), b.fn[a] = o._jQueryInterface, b.fn[a].Constructor = o, b.fn[a].noConflict = function() {
            return b.fn[a] = g, o._jQueryInterface;
        }, o;
    }(), qa = [ "native code", "[object MutationObserverConstructor]" ], ra = function(a) {
        return qa.some(function(b) {
            return (a || "").toString().indexOf(b) > -1;
        });
    }, sa = "undefined" != typeof window, ta = [ "Edge", "Trident", "Firefox" ], ua = 0, va = 0; va < ta.length; va += 1) if (sa && navigator.userAgent.indexOf(ta[va]) >= 0) {
        ua = 1;
        break;
    }
    var wa = sa && ra(window.MutationObserver), xa = wa ? f : g, ya = void 0, za = function() {
        return void 0 === ya && (ya = -1 !== navigator.appVersion.indexOf("MSIE 10")), ya;
    }, Aa = function(a, b) {
        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
    }, Ba = function() {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), 
                Object.defineProperty(a, d.key, d);
            }
        }
        return function(b, c, d) {
            return c && a(b.prototype, c), d && a(b, d), b;
        };
    }(), Ca = function(a, b, c) {
        return b in a ? Object.defineProperty(a, b, {
            value: c,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : a[b] = c, a;
    }, Da = Object.assign || function(a) {
        for (var b = 1; b < arguments.length; b++) {
            var c = arguments[b];
            for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
        }
        return a;
    }, Ea = [ "auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start" ], Fa = Ea.slice(3), Ga = {
        FLIP: "flip",
        CLOCKWISE: "clockwise",
        COUNTERCLOCKWISE: "counterclockwise"
    }, Ha = {
        shift: {
            order: 100,
            enabled: !0,
            fn: ga
        },
        offset: {
            order: 200,
            enabled: !0,
            fn: ea,
            offset: 0
        },
        preventOverflow: {
            order: 300,
            enabled: !0,
            fn: fa,
            priority: [ "left", "right", "top", "bottom" ],
            padding: 5,
            boundariesElement: "scrollParent"
        },
        keepTogether: {
            order: 400,
            enabled: !0,
            fn: ba
        },
        arrow: {
            order: 500,
            enabled: !0,
            fn: Z,
            element: "[x-arrow]"
        },
        flip: {
            order: 600,
            enabled: !0,
            fn: aa,
            behavior: "flip",
            padding: 5,
            boundariesElement: "viewport"
        },
        inner: {
            order: 700,
            enabled: !1,
            fn: ia
        },
        hide: {
            order: 800,
            enabled: !0,
            fn: ha
        },
        computeStyle: {
            order: 850,
            enabled: !0,
            fn: X,
            gpuAcceleration: !0,
            x: "bottom",
            y: "right"
        },
        applyStyle: {
            order: 900,
            enabled: !0,
            fn: V,
            onLoad: W,
            gpuAcceleration: void 0
        }
    }, Ia = {
        placement: "bottom",
        eventsEnabled: !0,
        removeOnDestroy: !1,
        onCreate: function() {},
        onUpdate: function() {},
        modifiers: Ha
    }, Ja = function() {
        function a(b, c) {
            var d = this, e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            Aa(this, a), this.scheduleUpdate = function() {
                return requestAnimationFrame(d.update);
            }, this.update = xa(this.update.bind(this)), this.options = Da({}, a.Defaults, e), 
            this.state = {
                isDestroyed: !1,
                isCreated: !1,
                scrollParents: []
            }, this.reference = b.jquery ? b[0] : b, this.popper = c.jquery ? c[0] : c, this.options.modifiers = {}, 
            Object.keys(Da({}, a.Defaults.modifiers, e.modifiers)).forEach(function(b) {
                d.options.modifiers[b] = Da({}, a.Defaults.modifiers[b] || {}, e.modifiers ? e.modifiers[b] : {});
            }), this.modifiers = Object.keys(this.options.modifiers).map(function(a) {
                return Da({
                    name: a
                }, d.options.modifiers[a]);
            }).sort(function(a, b) {
                return a.order - b.order;
            }), this.modifiers.forEach(function(a) {
                a.enabled && h(a.onLoad) && a.onLoad(d.reference, d.popper, d.options, a, d.state);
            }), this.update();
            var f = this.options.eventsEnabled;
            f && this.enableEventListeners(), this.state.eventsEnabled = f;
        }
        return Ba(a, [ {
            key: "update",
            value: function() {
                return J.call(this);
            }
        }, {
            key: "destroy",
            value: function() {
                return M.call(this);
            }
        }, {
            key: "enableEventListeners",
            value: function() {
                return P.call(this);
            }
        }, {
            key: "disableEventListeners",
            value: function() {
                return R.call(this);
            }
        } ]), a;
    }();
    Ja.Utils = ("undefined" != typeof window ? window : global).PopperUtils, Ja.placements = Ea, 
    Ja.Defaults = Ia;
    var Ka = function() {
        if (void 0 === Ja) throw new Error("Bootstrap dropdown require Popper.js (https://popper.js.org)");
        var a = "dropdown", c = "4.0.0-beta.2", d = "bs.dropdown", e = "." + d, f = ".data-api", g = b.fn[a], h = 27, i = 32, j = 9, k = 38, l = 40, m = 3, n = new RegExp(k + "|" + l + "|" + h), o = {
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            CLICK: "click" + e,
            CLICK_DATA_API: "click" + e + f,
            KEYDOWN_DATA_API: "keydown" + e + f,
            KEYUP_DATA_API: "keyup" + e + f
        }, p = {
            DISABLED: "disabled",
            SHOW: "show",
            DROPUP: "dropup",
            MENURIGHT: "dropdown-menu-right",
            MENULEFT: "dropdown-menu-left"
        }, q = {
            DATA_TOGGLE: '[data-toggle="dropdown"]',
            FORM_CHILD: ".dropdown form",
            MENU: ".dropdown-menu",
            NAVBAR_NAV: ".navbar-nav",
            VISIBLE_ITEMS: ".dropdown-menu .dropdown-item:not(.disabled)"
        }, r = {
            TOP: "top-start",
            TOPEND: "top-end",
            BOTTOM: "bottom-start",
            BOTTOMEND: "bottom-end"
        }, s = {
            offset: 0,
            flip: !0
        }, t = {
            offset: "(number|string|function)",
            flip: "boolean"
        }, u = function() {
            function f(a, b) {
                this._element = a, this._popper = null, this._config = this._getConfig(b), this._menu = this._getMenuElement(), 
                this._inNavbar = this._detectNavbar(), this._addEventListeners();
            }
            var g = f.prototype;
            return g.toggle = function() {
                if (!this._element.disabled && !b(this._element).hasClass(p.DISABLED)) {
                    var a = f._getParentFromElement(this._element), c = b(this._menu).hasClass(p.SHOW);
                    if (f._clearMenus(), !c) {
                        var d = {
                            relatedTarget: this._element
                        }, e = b.Event(o.SHOW, d);
                        if (b(a).trigger(e), !e.isDefaultPrevented()) {
                            var g = this._element;
                            b(a).hasClass(p.DROPUP) && (b(this._menu).hasClass(p.MENULEFT) || b(this._menu).hasClass(p.MENURIGHT)) && (g = a), 
                            this._popper = new Ja(g, this._menu, this._getPopperConfig()), "ontouchstart" in document.documentElement && !b(a).closest(q.NAVBAR_NAV).length && b("body").children().on("mouseover", null, b.noop), 
                            this._element.focus(), this._element.setAttribute("aria-expanded", !0), b(this._menu).toggleClass(p.SHOW), 
                            b(a).toggleClass(p.SHOW).trigger(b.Event(o.SHOWN, d));
                        }
                    }
                }
            }, g.dispose = function() {
                b.removeData(this._element, d), b(this._element).off(e), this._element = null, this._menu = null, 
                null !== this._popper && this._popper.destroy(), this._popper = null;
            }, g.update = function() {
                this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate();
            }, g._addEventListeners = function() {
                var a = this;
                b(this._element).on(o.CLICK, function(b) {
                    b.preventDefault(), b.stopPropagation(), a.toggle();
                });
            }, g._getConfig = function(c) {
                return c = b.extend({}, this.constructor.Default, b(this._element).data(), c), ja.typeCheckConfig(a, c, this.constructor.DefaultType), 
                c;
            }, g._getMenuElement = function() {
                if (!this._menu) {
                    var a = f._getParentFromElement(this._element);
                    this._menu = b(a).find(q.MENU)[0];
                }
                return this._menu;
            }, g._getPlacement = function() {
                var a = b(this._element).parent(), c = r.BOTTOM;
                return a.hasClass(p.DROPUP) ? (c = r.TOP, b(this._menu).hasClass(p.MENURIGHT) && (c = r.TOPEND)) : b(this._menu).hasClass(p.MENURIGHT) && (c = r.BOTTOMEND), 
                c;
            }, g._detectNavbar = function() {
                return b(this._element).closest(".navbar").length > 0;
            }, g._getPopperConfig = function() {
                var a = this, c = {};
                "function" == typeof this._config.offset ? c.fn = function(c) {
                    return c.offsets = b.extend({}, c.offsets, a._config.offset(c.offsets) || {}), c;
                } : c.offset = this._config.offset;
                var d = {
                    placement: this._getPlacement(),
                    modifiers: {
                        offset: c,
                        flip: {
                            enabled: this._config.flip
                        }
                    }
                };
                return this._inNavbar && (d.modifiers.applyStyle = {
                    enabled: !this._inNavbar
                }), d;
            }, f._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this).data(d), e = "object" == typeof a ? a : null;
                    if (c || (c = new f(this, e), b(this).data(d, c)), "string" == typeof a) {
                        if (void 0 === c[a]) throw new Error('No method named "' + a + '"');
                        c[a]();
                    }
                });
            }, f._clearMenus = function(a) {
                if (!a || a.which !== m && ("keyup" !== a.type || a.which === j)) for (var c = b.makeArray(b(q.DATA_TOGGLE)), e = 0; e < c.length; e++) {
                    var g = f._getParentFromElement(c[e]), h = b(c[e]).data(d), i = {
                        relatedTarget: c[e]
                    };
                    if (h) {
                        var k = h._menu;
                        if (b(g).hasClass(p.SHOW) && !(a && ("click" === a.type && /input|textarea/i.test(a.target.tagName) || "keyup" === a.type && a.which === j) && b.contains(g, a.target))) {
                            var l = b.Event(o.HIDE, i);
                            b(g).trigger(l), l.isDefaultPrevented() || ("ontouchstart" in document.documentElement && b("body").children().off("mouseover", null, b.noop), 
                            c[e].setAttribute("aria-expanded", "false"), b(k).removeClass(p.SHOW), b(g).removeClass(p.SHOW).trigger(b.Event(o.HIDDEN, i)));
                        }
                    }
                }
            }, f._getParentFromElement = function(a) {
                var c, d = ja.getSelectorFromElement(a);
                return d && (c = b(d)[0]), c || a.parentNode;
            }, f._dataApiKeydownHandler = function(a) {
                if (!(!n.test(a.which) || /button/i.test(a.target.tagName) && a.which === i || /input|textarea/i.test(a.target.tagName) || (a.preventDefault(), 
                a.stopPropagation(), this.disabled || b(this).hasClass(p.DISABLED)))) {
                    var c = f._getParentFromElement(this), d = b(c).hasClass(p.SHOW);
                    if (!d && (a.which !== h || a.which !== i) || d && (a.which === h || a.which === i)) {
                        if (a.which === h) {
                            var e = b(c).find(q.DATA_TOGGLE)[0];
                            b(e).trigger("focus");
                        }
                        return void b(this).trigger("click");
                    }
                    var g = b(c).find(q.VISIBLE_ITEMS).get();
                    if (g.length) {
                        var j = g.indexOf(a.target);
                        a.which === k && j > 0 && j--, a.which === l && j < g.length - 1 && j++, j < 0 && (j = 0), 
                        g[j].focus();
                    }
                }
            }, ka(f, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return s;
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return t;
                }
            } ]), f;
        }();
        return b(document).on(o.KEYDOWN_DATA_API, q.DATA_TOGGLE, u._dataApiKeydownHandler).on(o.KEYDOWN_DATA_API, q.MENU, u._dataApiKeydownHandler).on(o.CLICK_DATA_API + " " + o.KEYUP_DATA_API, u._clearMenus).on(o.CLICK_DATA_API, q.DATA_TOGGLE, function(a) {
            a.preventDefault(), a.stopPropagation(), u._jQueryInterface.call(b(this), "toggle");
        }).on(o.CLICK_DATA_API, q.FORM_CHILD, function(a) {
            a.stopPropagation();
        }), b.fn[a] = u._jQueryInterface, b.fn[a].Constructor = u, b.fn[a].noConflict = function() {
            return b.fn[a] = g, u._jQueryInterface;
        }, u;
    }(), La = function() {
        var a = "modal", c = "4.0.0-beta.2", d = "bs.modal", e = "." + d, f = ".data-api", g = b.fn[a], h = 300, i = 150, j = 27, k = {
            backdrop: !0,
            keyboard: !0,
            focus: !0,
            show: !0
        }, l = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            focus: "boolean",
            show: "boolean"
        }, m = {
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            FOCUSIN: "focusin" + e,
            RESIZE: "resize" + e,
            CLICK_DISMISS: "click.dismiss" + e,
            KEYDOWN_DISMISS: "keydown.dismiss" + e,
            MOUSEUP_DISMISS: "mouseup.dismiss" + e,
            MOUSEDOWN_DISMISS: "mousedown.dismiss" + e,
            CLICK_DATA_API: "click" + e + f
        }, n = {
            SCROLLBAR_MEASURER: "modal-scrollbar-measure",
            BACKDROP: "modal-backdrop",
            OPEN: "modal-open",
            FADE: "fade",
            SHOW: "show"
        }, o = {
            DIALOG: ".modal-dialog",
            DATA_TOGGLE: '[data-toggle="modal"]',
            DATA_DISMISS: '[data-dismiss="modal"]',
            FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
            STICKY_CONTENT: ".sticky-top",
            NAVBAR_TOGGLER: ".navbar-toggler"
        }, p = function() {
            function f(a, c) {
                this._config = this._getConfig(c), this._element = a, this._dialog = b(a).find(o.DIALOG)[0], 
                this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, 
                this._originalBodyPadding = 0, this._scrollbarWidth = 0;
            }
            var g = f.prototype;
            return g.toggle = function(a) {
                return this._isShown ? this.hide() : this.show(a);
            }, g.show = function(a) {
                var c = this;
                if (!this._isTransitioning && !this._isShown) {
                    ja.supportsTransitionEnd() && b(this._element).hasClass(n.FADE) && (this._isTransitioning = !0);
                    var d = b.Event(m.SHOW, {
                        relatedTarget: a
                    });
                    b(this._element).trigger(d), this._isShown || d.isDefaultPrevented() || (this._isShown = !0, 
                    this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), b(document.body).addClass(n.OPEN), 
                    this._setEscapeEvent(), this._setResizeEvent(), b(this._element).on(m.CLICK_DISMISS, o.DATA_DISMISS, function(a) {
                        return c.hide(a);
                    }), b(this._dialog).on(m.MOUSEDOWN_DISMISS, function() {
                        b(c._element).one(m.MOUSEUP_DISMISS, function(a) {
                            b(a.target).is(c._element) && (c._ignoreBackdropClick = !0);
                        });
                    }), this._showBackdrop(function() {
                        return c._showElement(a);
                    }));
                }
            }, g.hide = function(a) {
                var c = this;
                if (a && a.preventDefault(), !this._isTransitioning && this._isShown) {
                    var d = b.Event(m.HIDE);
                    if (b(this._element).trigger(d), this._isShown && !d.isDefaultPrevented()) {
                        this._isShown = !1;
                        var e = ja.supportsTransitionEnd() && b(this._element).hasClass(n.FADE);
                        e && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), 
                        b(document).off(m.FOCUSIN), b(this._element).removeClass(n.SHOW), b(this._element).off(m.CLICK_DISMISS), 
                        b(this._dialog).off(m.MOUSEDOWN_DISMISS), e ? b(this._element).one(ja.TRANSITION_END, function(a) {
                            return c._hideModal(a);
                        }).emulateTransitionEnd(h) : this._hideModal();
                    }
                }
            }, g.dispose = function() {
                b.removeData(this._element, d), b(window, document, this._element, this._backdrop).off(e), 
                this._config = null, this._element = null, this._dialog = null, this._backdrop = null, 
                this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, 
                this._scrollbarWidth = null;
            }, g.handleUpdate = function() {
                this._adjustDialog();
            }, g._getConfig = function(c) {
                return c = b.extend({}, k, c), ja.typeCheckConfig(a, c, l), c;
            }, g._showElement = function(a) {
                var c = this, d = ja.supportsTransitionEnd() && b(this._element).hasClass(n.FADE);
                this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), 
                this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), 
                this._element.scrollTop = 0, d && ja.reflow(this._element), b(this._element).addClass(n.SHOW), 
                this._config.focus && this._enforceFocus();
                var e = b.Event(m.SHOWN, {
                    relatedTarget: a
                }), f = function() {
                    c._config.focus && c._element.focus(), c._isTransitioning = !1, b(c._element).trigger(e);
                };
                d ? b(this._dialog).one(ja.TRANSITION_END, f).emulateTransitionEnd(h) : f();
            }, g._enforceFocus = function() {
                var a = this;
                b(document).off(m.FOCUSIN).on(m.FOCUSIN, function(c) {
                    document === c.target || a._element === c.target || b(a._element).has(c.target).length || a._element.focus();
                });
            }, g._setEscapeEvent = function() {
                var a = this;
                this._isShown && this._config.keyboard ? b(this._element).on(m.KEYDOWN_DISMISS, function(b) {
                    b.which === j && (b.preventDefault(), a.hide());
                }) : this._isShown || b(this._element).off(m.KEYDOWN_DISMISS);
            }, g._setResizeEvent = function() {
                var a = this;
                this._isShown ? b(window).on(m.RESIZE, function(b) {
                    return a.handleUpdate(b);
                }) : b(window).off(m.RESIZE);
            }, g._hideModal = function() {
                var a = this;
                this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), 
                this._isTransitioning = !1, this._showBackdrop(function() {
                    b(document.body).removeClass(n.OPEN), a._resetAdjustments(), a._resetScrollbar(), 
                    b(a._element).trigger(m.HIDDEN);
                });
            }, g._removeBackdrop = function() {
                this._backdrop && (b(this._backdrop).remove(), this._backdrop = null);
            }, g._showBackdrop = function(a) {
                var c = this, d = b(this._element).hasClass(n.FADE) ? n.FADE : "";
                if (this._isShown && this._config.backdrop) {
                    var e = ja.supportsTransitionEnd() && d;
                    if (this._backdrop = document.createElement("div"), this._backdrop.className = n.BACKDROP, 
                    d && b(this._backdrop).addClass(d), b(this._backdrop).appendTo(document.body), b(this._element).on(m.CLICK_DISMISS, function(a) {
                        if (c._ignoreBackdropClick) return void (c._ignoreBackdropClick = !1);
                        a.target === a.currentTarget && ("static" === c._config.backdrop ? c._element.focus() : c.hide());
                    }), e && ja.reflow(this._backdrop), b(this._backdrop).addClass(n.SHOW), !a) return;
                    if (!e) return void a();
                    b(this._backdrop).one(ja.TRANSITION_END, a).emulateTransitionEnd(i);
                } else if (!this._isShown && this._backdrop) {
                    b(this._backdrop).removeClass(n.SHOW);
                    var f = function() {
                        c._removeBackdrop(), a && a();
                    };
                    ja.supportsTransitionEnd() && b(this._element).hasClass(n.FADE) ? b(this._backdrop).one(ja.TRANSITION_END, f).emulateTransitionEnd(i) : f();
                } else a && a();
            }, g._adjustDialog = function() {
                var a = this._element.scrollHeight > document.documentElement.clientHeight;
                !this._isBodyOverflowing && a && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), 
                this._isBodyOverflowing && !a && (this._element.style.paddingRight = this._scrollbarWidth + "px");
            }, g._resetAdjustments = function() {
                this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
            }, g._checkScrollbar = function() {
                var a = document.body.getBoundingClientRect();
                this._isBodyOverflowing = a.left + a.right < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth();
            }, g._setScrollbar = function() {
                var a = this;
                if (this._isBodyOverflowing) {
                    b(o.FIXED_CONTENT).each(function(c, d) {
                        var e = b(d)[0].style.paddingRight, f = b(d).css("padding-right");
                        b(d).data("padding-right", e).css("padding-right", parseFloat(f) + a._scrollbarWidth + "px");
                    }), b(o.STICKY_CONTENT).each(function(c, d) {
                        var e = b(d)[0].style.marginRight, f = b(d).css("margin-right");
                        b(d).data("margin-right", e).css("margin-right", parseFloat(f) - a._scrollbarWidth + "px");
                    }), b(o.NAVBAR_TOGGLER).each(function(c, d) {
                        var e = b(d)[0].style.marginRight, f = b(d).css("margin-right");
                        b(d).data("margin-right", e).css("margin-right", parseFloat(f) + a._scrollbarWidth + "px");
                    });
                    var c = document.body.style.paddingRight, d = b("body").css("padding-right");
                    b("body").data("padding-right", c).css("padding-right", parseFloat(d) + this._scrollbarWidth + "px");
                }
            }, g._resetScrollbar = function() {
                b(o.FIXED_CONTENT).each(function(a, c) {
                    var d = b(c).data("padding-right");
                    void 0 !== d && b(c).css("padding-right", d).removeData("padding-right");
                }), b(o.STICKY_CONTENT + ", " + o.NAVBAR_TOGGLER).each(function(a, c) {
                    var d = b(c).data("margin-right");
                    void 0 !== d && b(c).css("margin-right", d).removeData("margin-right");
                });
                var a = b("body").data("padding-right");
                void 0 !== a && b("body").css("padding-right", a).removeData("padding-right");
            }, g._getScrollbarWidth = function() {
                var a = document.createElement("div");
                a.className = n.SCROLLBAR_MEASURER, document.body.appendChild(a);
                var b = a.getBoundingClientRect().width - a.clientWidth;
                return document.body.removeChild(a), b;
            }, f._jQueryInterface = function(a, c) {
                return this.each(function() {
                    var e = b(this).data(d), g = b.extend({}, f.Default, b(this).data(), "object" == typeof a && a);
                    if (e || (e = new f(this, g), b(this).data(d, e)), "string" == typeof a) {
                        if (void 0 === e[a]) throw new Error('No method named "' + a + '"');
                        e[a](c);
                    } else g.show && e.show(c);
                });
            }, ka(f, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return k;
                }
            } ]), f;
        }();
        return b(document).on(m.CLICK_DATA_API, o.DATA_TOGGLE, function(a) {
            var c, e = this, f = ja.getSelectorFromElement(this);
            f && (c = b(f)[0]);
            var g = b(c).data(d) ? "toggle" : b.extend({}, b(c).data(), b(this).data());
            "A" !== this.tagName && "AREA" !== this.tagName || a.preventDefault();
            var h = b(c).one(m.SHOW, function(a) {
                a.isDefaultPrevented() || h.one(m.HIDDEN, function() {
                    b(e).is(":visible") && e.focus();
                });
            });
            p._jQueryInterface.call(b(c), g, this);
        }), b.fn[a] = p._jQueryInterface, b.fn[a].Constructor = p, b.fn[a].noConflict = function() {
            return b.fn[a] = g, p._jQueryInterface;
        }, p;
    }(), Ma = function() {
        if (void 0 === Ja) throw new Error("Bootstrap tooltips require Popper.js (https://popper.js.org)");
        var a = "tooltip", c = "4.0.0-beta.2", d = "bs.tooltip", e = "." + d, f = b.fn[a], g = 150, h = "bs-tooltip", i = new RegExp("(^|\\s)" + h + "\\S+", "g"), j = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "(number|string)",
            container: "(string|element|boolean)",
            fallbackPlacement: "(string|array)"
        }, k = {
            AUTO: "auto",
            TOP: "top",
            RIGHT: "right",
            BOTTOM: "bottom",
            LEFT: "left"
        }, l = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: 0,
            container: !1,
            fallbackPlacement: "flip"
        }, m = {
            SHOW: "show",
            OUT: "out"
        }, n = {
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            INSERTED: "inserted" + e,
            CLICK: "click" + e,
            FOCUSIN: "focusin" + e,
            FOCUSOUT: "focusout" + e,
            MOUSEENTER: "mouseenter" + e,
            MOUSELEAVE: "mouseleave" + e
        }, o = {
            FADE: "fade",
            SHOW: "show"
        }, p = {
            TOOLTIP: ".tooltip",
            TOOLTIP_INNER: ".tooltip-inner",
            ARROW: ".arrow"
        }, q = {
            HOVER: "hover",
            FOCUS: "focus",
            CLICK: "click",
            MANUAL: "manual"
        }, r = function() {
            function f(a, b) {
                this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, 
                this._popper = null, this.element = a, this.config = this._getConfig(b), this.tip = null, 
                this._setListeners();
            }
            var r = f.prototype;
            return r.enable = function() {
                this._isEnabled = !0;
            }, r.disable = function() {
                this._isEnabled = !1;
            }, r.toggleEnabled = function() {
                this._isEnabled = !this._isEnabled;
            }, r.toggle = function(a) {
                if (this._isEnabled) if (a) {
                    var c = this.constructor.DATA_KEY, d = b(a.currentTarget).data(c);
                    d || (d = new this.constructor(a.currentTarget, this._getDelegateConfig()), b(a.currentTarget).data(c, d)), 
                    d._activeTrigger.click = !d._activeTrigger.click, d._isWithActiveTrigger() ? d._enter(null, d) : d._leave(null, d);
                } else {
                    if (b(this.getTipElement()).hasClass(o.SHOW)) return void this._leave(null, this);
                    this._enter(null, this);
                }
            }, r.dispose = function() {
                clearTimeout(this._timeout), b.removeData(this.element, this.constructor.DATA_KEY), 
                b(this.element).off(this.constructor.EVENT_KEY), b(this.element).closest(".modal").off("hide.bs.modal"), 
                this.tip && b(this.tip).remove(), this._isEnabled = null, this._timeout = null, 
                this._hoverState = null, this._activeTrigger = null, null !== this._popper && this._popper.destroy(), 
                this._popper = null, this.element = null, this.config = null, this.tip = null;
            }, r.show = function() {
                var a = this;
                if ("none" === b(this.element).css("display")) throw new Error("Please use show on visible elements");
                var c = b.Event(this.constructor.Event.SHOW);
                if (this.isWithContent() && this._isEnabled) {
                    b(this.element).trigger(c);
                    var d = b.contains(this.element.ownerDocument.documentElement, this.element);
                    if (c.isDefaultPrevented() || !d) return;
                    var e = this.getTipElement(), g = ja.getUID(this.constructor.NAME);
                    e.setAttribute("id", g), this.element.setAttribute("aria-describedby", g), this.setContent(), 
                    this.config.animation && b(e).addClass(o.FADE);
                    var h = "function" == typeof this.config.placement ? this.config.placement.call(this, e, this.element) : this.config.placement, i = this._getAttachment(h);
                    this.addAttachmentClass(i);
                    var j = !1 === this.config.container ? document.body : b(this.config.container);
                    b(e).data(this.constructor.DATA_KEY, this), b.contains(this.element.ownerDocument.documentElement, this.tip) || b(e).appendTo(j), 
                    b(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new Ja(this.element, e, {
                        placement: i,
                        modifiers: {
                            offset: {
                                offset: this.config.offset
                            },
                            flip: {
                                behavior: this.config.fallbackPlacement
                            },
                            arrow: {
                                element: p.ARROW
                            }
                        },
                        onCreate: function(b) {
                            b.originalPlacement !== b.placement && a._handlePopperPlacementChange(b);
                        },
                        onUpdate: function(b) {
                            a._handlePopperPlacementChange(b);
                        }
                    }), b(e).addClass(o.SHOW), "ontouchstart" in document.documentElement && b("body").children().on("mouseover", null, b.noop);
                    var k = function() {
                        a.config.animation && a._fixTransition();
                        var c = a._hoverState;
                        a._hoverState = null, b(a.element).trigger(a.constructor.Event.SHOWN), c === m.OUT && a._leave(null, a);
                    };
                    ja.supportsTransitionEnd() && b(this.tip).hasClass(o.FADE) ? b(this.tip).one(ja.TRANSITION_END, k).emulateTransitionEnd(f._TRANSITION_DURATION) : k();
                }
            }, r.hide = function(a) {
                var c = this, d = this.getTipElement(), e = b.Event(this.constructor.Event.HIDE), f = function() {
                    c._hoverState !== m.SHOW && d.parentNode && d.parentNode.removeChild(d), c._cleanTipClass(), 
                    c.element.removeAttribute("aria-describedby"), b(c.element).trigger(c.constructor.Event.HIDDEN), 
                    null !== c._popper && c._popper.destroy(), a && a();
                };
                b(this.element).trigger(e), e.isDefaultPrevented() || (b(d).removeClass(o.SHOW), 
                "ontouchstart" in document.documentElement && b("body").children().off("mouseover", null, b.noop), 
                this._activeTrigger[q.CLICK] = !1, this._activeTrigger[q.FOCUS] = !1, this._activeTrigger[q.HOVER] = !1, 
                ja.supportsTransitionEnd() && b(this.tip).hasClass(o.FADE) ? b(d).one(ja.TRANSITION_END, f).emulateTransitionEnd(g) : f(), 
                this._hoverState = "");
            }, r.update = function() {
                null !== this._popper && this._popper.scheduleUpdate();
            }, r.isWithContent = function() {
                return Boolean(this.getTitle());
            }, r.addAttachmentClass = function(a) {
                b(this.getTipElement()).addClass(h + "-" + a);
            }, r.getTipElement = function() {
                return this.tip = this.tip || b(this.config.template)[0], this.tip;
            }, r.setContent = function() {
                var a = b(this.getTipElement());
                this.setElementContent(a.find(p.TOOLTIP_INNER), this.getTitle()), a.removeClass(o.FADE + " " + o.SHOW);
            }, r.setElementContent = function(a, c) {
                var d = this.config.html;
                "object" == typeof c && (c.nodeType || c.jquery) ? d ? b(c).parent().is(a) || a.empty().append(c) : a.text(b(c).text()) : a[d ? "html" : "text"](c);
            }, r.getTitle = function() {
                var a = this.element.getAttribute("data-original-title");
                return a || (a = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), 
                a;
            }, r._getAttachment = function(a) {
                return k[a.toUpperCase()];
            }, r._setListeners = function() {
                var a = this;
                this.config.trigger.split(" ").forEach(function(c) {
                    if ("click" === c) b(a.element).on(a.constructor.Event.CLICK, a.config.selector, function(b) {
                        return a.toggle(b);
                    }); else if (c !== q.MANUAL) {
                        var d = c === q.HOVER ? a.constructor.Event.MOUSEENTER : a.constructor.Event.FOCUSIN, e = c === q.HOVER ? a.constructor.Event.MOUSELEAVE : a.constructor.Event.FOCUSOUT;
                        b(a.element).on(d, a.config.selector, function(b) {
                            return a._enter(b);
                        }).on(e, a.config.selector, function(b) {
                            return a._leave(b);
                        });
                    }
                    b(a.element).closest(".modal").on("hide.bs.modal", function() {
                        return a.hide();
                    });
                }), this.config.selector ? this.config = b.extend({}, this.config, {
                    trigger: "manual",
                    selector: ""
                }) : this._fixTitle();
            }, r._fixTitle = function() {
                var a = typeof this.element.getAttribute("data-original-title");
                (this.element.getAttribute("title") || "string" !== a) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), 
                this.element.setAttribute("title", ""));
            }, r._enter = function(a, c) {
                var d = this.constructor.DATA_KEY;
                return c = c || b(a.currentTarget).data(d), c || (c = new this.constructor(a.currentTarget, this._getDelegateConfig()), 
                b(a.currentTarget).data(d, c)), a && (c._activeTrigger["focusin" === a.type ? q.FOCUS : q.HOVER] = !0), 
                b(c.getTipElement()).hasClass(o.SHOW) || c._hoverState === m.SHOW ? void (c._hoverState = m.SHOW) : (clearTimeout(c._timeout), 
                c._hoverState = m.SHOW, c.config.delay && c.config.delay.show ? void (c._timeout = setTimeout(function() {
                    c._hoverState === m.SHOW && c.show();
                }, c.config.delay.show)) : void c.show());
            }, r._leave = function(a, c) {
                var d = this.constructor.DATA_KEY;
                if (c = c || b(a.currentTarget).data(d), c || (c = new this.constructor(a.currentTarget, this._getDelegateConfig()), 
                b(a.currentTarget).data(d, c)), a && (c._activeTrigger["focusout" === a.type ? q.FOCUS : q.HOVER] = !1), 
                !c._isWithActiveTrigger()) {
                    if (clearTimeout(c._timeout), c._hoverState = m.OUT, !c.config.delay || !c.config.delay.hide) return void c.hide();
                    c._timeout = setTimeout(function() {
                        c._hoverState === m.OUT && c.hide();
                    }, c.config.delay.hide);
                }
            }, r._isWithActiveTrigger = function() {
                for (var a in this._activeTrigger) if (this._activeTrigger[a]) return !0;
                return !1;
            }, r._getConfig = function(c) {
                return c = b.extend({}, this.constructor.Default, b(this.element).data(), c), "number" == typeof c.delay && (c.delay = {
                    show: c.delay,
                    hide: c.delay
                }), "number" == typeof c.title && (c.title = c.title.toString()), "number" == typeof c.content && (c.content = c.content.toString()), 
                ja.typeCheckConfig(a, c, this.constructor.DefaultType), c;
            }, r._getDelegateConfig = function() {
                var a = {};
                if (this.config) for (var b in this.config) this.constructor.Default[b] !== this.config[b] && (a[b] = this.config[b]);
                return a;
            }, r._cleanTipClass = function() {
                var a = b(this.getTipElement()), c = a.attr("class").match(i);
                null !== c && c.length > 0 && a.removeClass(c.join(""));
            }, r._handlePopperPlacementChange = function(a) {
                this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(a.placement));
            }, r._fixTransition = function() {
                var a = this.getTipElement(), c = this.config.animation;
                null === a.getAttribute("x-placement") && (b(a).removeClass(o.FADE), this.config.animation = !1, 
                this.hide(), this.show(), this.config.animation = c);
            }, f._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this).data(d), e = "object" == typeof a && a;
                    if ((c || !/dispose|hide/.test(a)) && (c || (c = new f(this, e), b(this).data(d, c)), 
                    "string" == typeof a)) {
                        if (void 0 === c[a]) throw new Error('No method named "' + a + '"');
                        c[a]();
                    }
                });
            }, ka(f, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return l;
                }
            }, {
                key: "NAME",
                get: function() {
                    return a;
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return d;
                }
            }, {
                key: "Event",
                get: function() {
                    return n;
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return e;
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return j;
                }
            } ]), f;
        }();
        return b.fn[a] = r._jQueryInterface, b.fn[a].Constructor = r, b.fn[a].noConflict = function() {
            return b.fn[a] = f, r._jQueryInterface;
        }, r;
    }(), Na = function() {
        var a = "popover", c = "4.0.0-beta.2", d = "bs.popover", e = "." + d, f = b.fn[a], g = "bs-popover", h = new RegExp("(^|\\s)" + g + "\\S+", "g"), i = b.extend({}, Ma.Default, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }), j = b.extend({}, Ma.DefaultType, {
            content: "(string|element|function)"
        }), k = {
            FADE: "fade",
            SHOW: "show"
        }, l = {
            TITLE: ".popover-header",
            CONTENT: ".popover-body"
        }, m = {
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            INSERTED: "inserted" + e,
            CLICK: "click" + e,
            FOCUSIN: "focusin" + e,
            FOCUSOUT: "focusout" + e,
            MOUSEENTER: "mouseenter" + e,
            MOUSELEAVE: "mouseleave" + e
        }, n = function(f) {
            function n() {
                return f.apply(this, arguments) || this;
            }
            la(n, f);
            var o = n.prototype;
            return o.isWithContent = function() {
                return this.getTitle() || this._getContent();
            }, o.addAttachmentClass = function(a) {
                b(this.getTipElement()).addClass(g + "-" + a);
            }, o.getTipElement = function() {
                return this.tip = this.tip || b(this.config.template)[0], this.tip;
            }, o.setContent = function() {
                var a = b(this.getTipElement());
                this.setElementContent(a.find(l.TITLE), this.getTitle()), this.setElementContent(a.find(l.CONTENT), this._getContent()), 
                a.removeClass(k.FADE + " " + k.SHOW);
            }, o._getContent = function() {
                return this.element.getAttribute("data-content") || ("function" == typeof this.config.content ? this.config.content.call(this.element) : this.config.content);
            }, o._cleanTipClass = function() {
                var a = b(this.getTipElement()), c = a.attr("class").match(h);
                null !== c && c.length > 0 && a.removeClass(c.join(""));
            }, n._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this).data(d), e = "object" == typeof a ? a : null;
                    if ((c || !/destroy|hide/.test(a)) && (c || (c = new n(this, e), b(this).data(d, c)), 
                    "string" == typeof a)) {
                        if (void 0 === c[a]) throw new Error('No method named "' + a + '"');
                        c[a]();
                    }
                });
            }, ka(n, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return i;
                }
            }, {
                key: "NAME",
                get: function() {
                    return a;
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return d;
                }
            }, {
                key: "Event",
                get: function() {
                    return m;
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return e;
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return j;
                }
            } ]), n;
        }(Ma);
        return b.fn[a] = n._jQueryInterface, b.fn[a].Constructor = n, b.fn[a].noConflict = function() {
            return b.fn[a] = f, n._jQueryInterface;
        }, n;
    }(), Oa = function() {
        var a = "scrollspy", c = "4.0.0-beta.2", d = "bs.scrollspy", e = "." + d, f = ".data-api", g = b.fn[a], h = {
            offset: 10,
            method: "auto",
            target: ""
        }, i = {
            offset: "number",
            method: "string",
            target: "(string|element)"
        }, j = {
            ACTIVATE: "activate" + e,
            SCROLL: "scroll" + e,
            LOAD_DATA_API: "load" + e + f
        }, k = {
            DROPDOWN_ITEM: "dropdown-item",
            DROPDOWN_MENU: "dropdown-menu",
            ACTIVE: "active"
        }, l = {
            DATA_SPY: '[data-spy="scroll"]',
            ACTIVE: ".active",
            NAV_LIST_GROUP: ".nav, .list-group",
            NAV_LINKS: ".nav-link",
            NAV_ITEMS: ".nav-item",
            LIST_ITEMS: ".list-group-item",
            DROPDOWN: ".dropdown",
            DROPDOWN_ITEMS: ".dropdown-item",
            DROPDOWN_TOGGLE: ".dropdown-toggle"
        }, m = {
            OFFSET: "offset",
            POSITION: "position"
        }, n = function() {
            function f(a, c) {
                var d = this;
                this._element = a, this._scrollElement = "BODY" === a.tagName ? window : a, this._config = this._getConfig(c), 
                this._selector = this._config.target + " " + l.NAV_LINKS + "," + this._config.target + " " + l.LIST_ITEMS + "," + this._config.target + " " + l.DROPDOWN_ITEMS, 
                this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, 
                b(this._scrollElement).on(j.SCROLL, function(a) {
                    return d._process(a);
                }), this.refresh(), this._process();
            }
            var g = f.prototype;
            return g.refresh = function() {
                var a = this, c = this._scrollElement !== this._scrollElement.window ? m.POSITION : m.OFFSET, d = "auto" === this._config.method ? c : this._config.method, e = d === m.POSITION ? this._getScrollTop() : 0;
                this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), 
                b.makeArray(b(this._selector)).map(function(a) {
                    var c, f = ja.getSelectorFromElement(a);
                    if (f && (c = b(f)[0]), c) {
                        var g = c.getBoundingClientRect();
                        if (g.width || g.height) return [ b(c)[d]().top + e, f ];
                    }
                    return null;
                }).filter(function(a) {
                    return a;
                }).sort(function(a, b) {
                    return a[0] - b[0];
                }).forEach(function(b) {
                    a._offsets.push(b[0]), a._targets.push(b[1]);
                });
            }, g.dispose = function() {
                b.removeData(this._element, d), b(this._scrollElement).off(e), this._element = null, 
                this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, 
                this._targets = null, this._activeTarget = null, this._scrollHeight = null;
            }, g._getConfig = function(c) {
                if (c = b.extend({}, h, c), "string" != typeof c.target) {
                    var d = b(c.target).attr("id");
                    d || (d = ja.getUID(a), b(c.target).attr("id", d)), c.target = "#" + d;
                }
                return ja.typeCheckConfig(a, c, i), c;
            }, g._getScrollTop = function() {
                return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
            }, g._getScrollHeight = function() {
                return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            }, g._getOffsetHeight = function() {
                return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
            }, g._process = function() {
                var a = this._getScrollTop() + this._config.offset, b = this._getScrollHeight(), c = this._config.offset + b - this._getOffsetHeight();
                if (this._scrollHeight !== b && this.refresh(), a >= c) {
                    var d = this._targets[this._targets.length - 1];
                    return void (this._activeTarget !== d && this._activate(d));
                }
                if (this._activeTarget && a < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, 
                void this._clear();
                for (var e = this._offsets.length; e--; ) {
                    this._activeTarget !== this._targets[e] && a >= this._offsets[e] && (void 0 === this._offsets[e + 1] || a < this._offsets[e + 1]) && this._activate(this._targets[e]);
                }
            }, g._activate = function(a) {
                this._activeTarget = a, this._clear();
                var c = this._selector.split(",");
                c = c.map(function(b) {
                    return b + '[data-target="' + a + '"],' + b + '[href="' + a + '"]';
                });
                var d = b(c.join(","));
                d.hasClass(k.DROPDOWN_ITEM) ? (d.closest(l.DROPDOWN).find(l.DROPDOWN_TOGGLE).addClass(k.ACTIVE), 
                d.addClass(k.ACTIVE)) : (d.addClass(k.ACTIVE), d.parents(l.NAV_LIST_GROUP).prev(l.NAV_LINKS + ", " + l.LIST_ITEMS).addClass(k.ACTIVE), 
                d.parents(l.NAV_LIST_GROUP).prev(l.NAV_ITEMS).children(l.NAV_LINKS).addClass(k.ACTIVE)), 
                b(this._scrollElement).trigger(j.ACTIVATE, {
                    relatedTarget: a
                });
            }, g._clear = function() {
                b(this._selector).filter(l.ACTIVE).removeClass(k.ACTIVE);
            }, f._jQueryInterface = function(a) {
                return this.each(function() {
                    var c = b(this).data(d), e = "object" == typeof a && a;
                    if (c || (c = new f(this, e), b(this).data(d, c)), "string" == typeof a) {
                        if (void 0 === c[a]) throw new Error('No method named "' + a + '"');
                        c[a]();
                    }
                });
            }, ka(f, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            }, {
                key: "Default",
                get: function() {
                    return h;
                }
            } ]), f;
        }();
        return b(window).on(j.LOAD_DATA_API, function() {
            for (var a = b.makeArray(b(l.DATA_SPY)), c = a.length; c--; ) {
                var d = b(a[c]);
                n._jQueryInterface.call(d, d.data());
            }
        }), b.fn[a] = n._jQueryInterface, b.fn[a].Constructor = n, b.fn[a].noConflict = function() {
            return b.fn[a] = g, n._jQueryInterface;
        }, n;
    }(), Pa = function() {
        var a = "tab", c = "4.0.0-beta.2", d = "bs.tab", e = "." + d, f = ".data-api", g = b.fn[a], h = 150, i = {
            HIDE: "hide" + e,
            HIDDEN: "hidden" + e,
            SHOW: "show" + e,
            SHOWN: "shown" + e,
            CLICK_DATA_API: "click" + e + f
        }, j = {
            DROPDOWN_MENU: "dropdown-menu",
            ACTIVE: "active",
            DISABLED: "disabled",
            FADE: "fade",
            SHOW: "show"
        }, k = {
            DROPDOWN: ".dropdown",
            NAV_LIST_GROUP: ".nav, .list-group",
            ACTIVE: ".active",
            ACTIVE_UL: "> li > .active",
            DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
            DROPDOWN_TOGGLE: ".dropdown-toggle",
            DROPDOWN_ACTIVE_CHILD: "> .dropdown-menu .active"
        }, l = function() {
            function a(a) {
                this._element = a;
            }
            var e = a.prototype;
            return e.show = function() {
                var a = this;
                if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && b(this._element).hasClass(j.ACTIVE) || b(this._element).hasClass(j.DISABLED))) {
                    var c, d, e = b(this._element).closest(k.NAV_LIST_GROUP)[0], f = ja.getSelectorFromElement(this._element);
                    if (e) {
                        var g = "UL" === e.nodeName ? k.ACTIVE_UL : k.ACTIVE;
                        d = b.makeArray(b(e).find(g)), d = d[d.length - 1];
                    }
                    var h = b.Event(i.HIDE, {
                        relatedTarget: this._element
                    }), l = b.Event(i.SHOW, {
                        relatedTarget: d
                    });
                    if (d && b(d).trigger(h), b(this._element).trigger(l), !l.isDefaultPrevented() && !h.isDefaultPrevented()) {
                        f && (c = b(f)[0]), this._activate(this._element, e);
                        var m = function() {
                            var c = b.Event(i.HIDDEN, {
                                relatedTarget: a._element
                            }), e = b.Event(i.SHOWN, {
                                relatedTarget: d
                            });
                            b(d).trigger(c), b(a._element).trigger(e);
                        };
                        c ? this._activate(c, c.parentNode, m) : m();
                    }
                }
            }, e.dispose = function() {
                b.removeData(this._element, d), this._element = null;
            }, e._activate = function(a, c, d) {
                var e, f = this;
                e = "UL" === c.nodeName ? b(c).find(k.ACTIVE_UL) : b(c).children(k.ACTIVE);
                var g = e[0], i = d && ja.supportsTransitionEnd() && g && b(g).hasClass(j.FADE), l = function() {
                    return f._transitionComplete(a, g, i, d);
                };
                g && i ? b(g).one(ja.TRANSITION_END, l).emulateTransitionEnd(h) : l(), g && b(g).removeClass(j.SHOW);
            }, e._transitionComplete = function(a, c, d, e) {
                if (c) {
                    b(c).removeClass(j.ACTIVE);
                    var f = b(c.parentNode).find(k.DROPDOWN_ACTIVE_CHILD)[0];
                    f && b(f).removeClass(j.ACTIVE), "tab" === c.getAttribute("role") && c.setAttribute("aria-selected", !1);
                }
                if (b(a).addClass(j.ACTIVE), "tab" === a.getAttribute("role") && a.setAttribute("aria-selected", !0), 
                d ? (ja.reflow(a), b(a).addClass(j.SHOW)) : b(a).removeClass(j.FADE), a.parentNode && b(a.parentNode).hasClass(j.DROPDOWN_MENU)) {
                    var g = b(a).closest(k.DROPDOWN)[0];
                    g && b(g).find(k.DROPDOWN_TOGGLE).addClass(j.ACTIVE), a.setAttribute("aria-expanded", !0);
                }
                e && e();
            }, a._jQueryInterface = function(c) {
                return this.each(function() {
                    var e = b(this), f = e.data(d);
                    if (f || (f = new a(this), e.data(d, f)), "string" == typeof c) {
                        if (void 0 === f[c]) throw new Error('No method named "' + c + '"');
                        f[c]();
                    }
                });
            }, ka(a, null, [ {
                key: "VERSION",
                get: function() {
                    return c;
                }
            } ]), a;
        }();
        return b(document).on(i.CLICK_DATA_API, k.DATA_TOGGLE, function(a) {
            a.preventDefault(), l._jQueryInterface.call(b(this), "show");
        }), b.fn[a] = l._jQueryInterface, b.fn[a].Constructor = l, b.fn[a].noConflict = function() {
            return b.fn[a] = g, l._jQueryInterface;
        }, l;
    }();
    return function() {
        if (void 0 === b) throw new Error("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
        var a = b.fn.jquery.split(" ")[0].split("."), c = 9;
        if (a[0] < 2 && a[1] < c || 1 === a[0] && a[1] === c && a[2] < 1 || a[0] >= 4) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0");
    }(), a.Util = ja, a.Alert = ma, a.Button = na, a.Carousel = oa, a.Collapse = pa, 
    a.Dropdown = Ka, a.Modal = La, a.Popover = Na, a.Scrollspy = Oa, a.Tab = Pa, a.Tooltip = Ma, 
    a;
}({}, $);