!function(a, b) {
    if (a.JSON) if ("function" == typeof define && define.amd) define(function() {
        return b(a);
    }); else if ("object" == typeof module && "object" == typeof module.exports) module.exports = b(a); else {
        var c = !a.Nette || !a.Nette.noInit;
        a.Nette = b(a), c && a.Nette.initOnLoad();
    }
}("undefined" != typeof window ? window : this, function(window) {
    "use strict";
    function getHandler(a) {
        return function(b) {
            return a.call(this, b);
        };
    }
    var Nette = {};
    Nette.formErrors = [], Nette.version = "2.4", Nette.addEvent = function(a, b, c) {
        a.addEventListener ? a.addEventListener(b, c) : "DOMContentLoaded" === b ? a.attachEvent("onreadystatechange", function() {
            "complete" === a.readyState && c.call(this);
        }) : a.attachEvent("on" + b, getHandler(c));
    }, Nette.getValue = function(a) {
        var b;
        if (a) {
            if (a.tagName) {
                if ("radio" === a.type) {
                    var c = a.form.elements;
                    for (b = 0; b < c.length; b++) if (c[b].name === a.name && c[b].checked) return c[b].value;
                    return null;
                }
                if ("file" === a.type) return a.files || a.value;
                if ("select" === a.tagName.toLowerCase()) {
                    var d = a.selectedIndex, e = a.options, f = [];
                    if ("select-one" === a.type) return d < 0 ? null : e[d].value;
                    for (b = 0; b < e.length; b++) e[b].selected && f.push(e[b].value);
                    return f;
                }
                if (a.name && a.name.match(/\[\]$/)) {
                    var c = a.form.elements[a.name].tagName ? [ a ] : a.form.elements[a.name], f = [];
                    for (b = 0; b < c.length; b++) ("checkbox" !== c[b].type || c[b].checked) && f.push(c[b].value);
                    return f;
                }
                return "checkbox" === a.type ? a.checked : "textarea" === a.tagName.toLowerCase() ? a.value.replace("\r", "") : a.value.replace("\r", "").replace(/^\s+|\s+$/g, "");
            }
            return a[0] ? Nette.getValue(a[0]) : null;
        }
        return null;
    }, Nette.getEffectiveValue = function(a, b) {
        var c = Nette.getValue(a);
        if (a.getAttribute && c === a.getAttribute("data-nette-empty-value") && (c = ""), 
        b) {
            var d = {
                value: c
            };
            Nette.validateControl(a, null, !0, d), c = d.value;
        }
        return c;
    }, Nette.validateControl = function(a, b, c, d, e) {
        a = a.tagName ? a : a[0], b = b || Nette.parseJSON(a.getAttribute("data-nette-rules")), 
        d = void 0 === d ? {
            value: Nette.getEffectiveValue(a)
        } : d;
        for (var f = 0, g = b.length; f < g; f++) {
            var h = b[f], i = h.op.match(/(~)?([^?]+)/), j = h.control ? a.form.elements.namedItem(h.control) : a;
            if (h.neg = i[1], h.op = i[2], h.condition = !!h.rules, j) if ("optional" !== h.op) {
                if (!e || h.condition || ":filled" === h.op) {
                    j = j.tagName ? j : j[0];
                    var k = Nette.validateRule(j, h.op, h.arg, a === j ? d : void 0);
                    if (null !== k) if (h.neg && (k = !k), h.condition && k) {
                        if (!Nette.validateControl(a, h.rules, c, d, ":blank" !== h.op && e)) return !1;
                    } else if (!h.condition && !k) {
                        if (Nette.isDisabled(j)) continue;
                        if (!c) {
                            var l = Nette.isArray(h.arg) ? h.arg : [ h.arg ], m = h.msg.replace(/%(value|\d+)/g, function(b, c) {
                                return Nette.getValue("value" === c ? j : a.form.elements.namedItem(l[c].control));
                            });
                            Nette.addError(j, m);
                        }
                        return !1;
                    }
                }
            } else e = !Nette.validateRule(a, ":filled", null, d);
        }
        return !("number" === a.type && !a.validity.valid) || (c || Nette.addError(a, "Please enter a valid value."), 
        !1);
    }, Nette.validateForm = function(a, b) {
        var c = a.form || a, d = !1;
        if (Nette.formErrors = [], c["nette-submittedBy"] && null !== c["nette-submittedBy"].getAttribute("formnovalidate")) {
            var e = Nette.parseJSON(c["nette-submittedBy"].getAttribute("data-nette-validation-scope"));
            if (!e.length) return Nette.showFormErrors(c, []), !0;
            d = new RegExp("^(" + e.join("-|") + "-)");
        }
        var f, g, h = {};
        for (f = 0; f < c.elements.length; f++) if (g = c.elements[f], !g.tagName || g.tagName.toLowerCase() in {
            input: 1,
            select: 1,
            textarea: 1,
            button: 1
        }) {
            if ("radio" === g.type) {
                if (h[g.name]) continue;
                h[g.name] = !0;
            }
            if (!(d && !g.name.replace(/]\[|\[|]|$/g, "-").match(d) || Nette.isDisabled(g) || Nette.validateControl(g, null, b) || Nette.formErrors.length)) return !1;
        }
        var i = !Nette.formErrors.length;
        return Nette.showFormErrors(c, Nette.formErrors), i;
    }, Nette.isDisabled = function(a) {
        if ("radio" === a.type) {
            for (var b = 0, c = a.form.elements; b < c.length; b++) if (c[b].name === a.name && !c[b].disabled) return !1;
            return !0;
        }
        return a.disabled;
    }, Nette.addError = function(a, b) {
        Nette.formErrors.push({
            element: a,
            message: b
        });
    }, Nette.showFormErrors = function(a, b) {
        for (var c, d = [], e = 0; e < b.length; e++) {
            var f = b[e].element, g = b[e].message;
            Nette.inArray(d, g) || (d.push(g), !c && f.focus && (c = f));
        }
        d.length && (alert(d.join("\n")), c && c.focus());
    };
    var preventFiltering = !1;
    return Nette.validateRule = function(a, b, c, d) {
        d = void 0 === d ? {
            value: Nette.getEffectiveValue(a, !0)
        } : d, ":" === b.charAt(0) && (b = b.substr(1)), b = b.replace("::", "_"), b = b.replace(/\\/g, "");
        var e = Nette.isArray(c) ? c.slice(0) : [ c ];
        if (!preventFiltering) {
            preventFiltering = !0;
            for (var f = 0, g = e.length; f < g; f++) if (e[f] && e[f].control) {
                var h = a.form.elements.namedItem(e[f].control);
                e[f] = h === a ? d.value : Nette.getEffectiveValue(h, !0);
            }
            preventFiltering = !1;
        }
        return Nette.validators[b] ? Nette.validators[b](a, Nette.isArray(c) ? e : e[0], d.value, d) : null;
    }, Nette.validators = {
        filled: function(a, b, c) {
            return !("number" !== a.type || !a.validity.badInput) || "" !== c && !1 !== c && null !== c && (!Nette.isArray(c) || !!c.length) && (!window.FileList || !(c instanceof window.FileList) || c.length);
        },
        blank: function(a, b, c) {
            return !Nette.validators.filled(a, b, c);
        },
        valid: function(a) {
            return Nette.validateControl(a, null, !0);
        },
        equal: function(a, b, c) {
            function d(a) {
                return "number" == typeof a || "string" == typeof a ? "" + a : !0 === a ? "1" : "";
            }
            if (void 0 === b) return null;
            c = Nette.isArray(c) ? c : [ c ], b = Nette.isArray(b) ? b : [ b ];
            a: for (var e = 0, f = c.length; e < f; e++) {
                for (var g = 0, h = b.length; g < h; g++) if (d(c[e]) === d(b[g])) continue a;
                return !1;
            }
            return !0;
        },
        notEqual: function(a, b, c) {
            return void 0 === b ? null : !Nette.validators.equal(a, b, c);
        },
        minLength: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.tooShort) return !1;
                if (a.validity.badInput) return null;
            }
            return c.length >= b;
        },
        maxLength: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.tooLong) return !1;
                if (a.validity.badInput) return null;
            }
            return c.length <= b;
        },
        length: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.tooShort || a.validity.tooLong) return !1;
                if (a.validity.badInput) return null;
            }
            return b = Nette.isArray(b) ? b : [ b, b ], (null === b[0] || c.length >= b[0]) && (null === b[1] || c.length <= b[1]);
        },
        email: function(a, b, c) {
            return /^("([ !#-[\]-~]|\\[ -~])+"|[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*)@([0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)+[a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF])?$/i.test(c);
        },
        url: function(a, b, c, d) {
            return /^[a-z\d+.-]+:/.test(c) || (c = "http://" + c), !!/^https?:\/\/((([-_0-9a-z\u00C0-\u02FF\u0370-\u1EFF]+\.)*[0-9a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,61}[0-9a-z\u00C0-\u02FF\u0370-\u1EFF])?\.)?[a-z\u00C0-\u02FF\u0370-\u1EFF]([-0-9a-z\u00C0-\u02FF\u0370-\u1EFF]{0,17}[a-z\u00C0-\u02FF\u0370-\u1EFF])?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[[0-9a-f:]{3,39}\])(:\d{1,5})?(\/\S*)?$/i.test(c) && (d.value = c, 
            !0);
        },
        regexp: function(a, b, c) {
            var d = "string" == typeof b && b.match(/^\/(.*)\/([imu]*)$/);
            try {
                return d && new RegExp(d[1], d[2].replace("u", "")).test(c);
            } catch (a) {}
        },
        pattern: function(a, b, c) {
            try {
                return "string" == typeof b ? new RegExp("^(?:" + b + ")$").test(c) : null;
            } catch (a) {}
        },
        integer: function(a, b, c) {
            return ("number" !== a.type || !a.validity.badInput) && /^-?[0-9]+$/.test(c);
        },
        float: function(a, b, c, d) {
            return ("number" !== a.type || !a.validity.badInput) && (c = c.replace(" ", "").replace(",", "."), 
            !!/^-?[0-9]*[.,]?[0-9]+$/.test(c) && (d.value = c, !0));
        },
        min: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.rangeUnderflow) return !1;
                if (a.validity.badInput) return null;
            }
            return null === b || parseFloat(c) >= b;
        },
        max: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.rangeOverflow) return !1;
                if (a.validity.badInput) return null;
            }
            return null === b || parseFloat(c) <= b;
        },
        range: function(a, b, c) {
            if ("number" === a.type) {
                if (a.validity.rangeUnderflow || a.validity.rangeOverflow) return !1;
                if (a.validity.badInput) return null;
            }
            return Nette.isArray(b) ? (null === b[0] || parseFloat(c) >= b[0]) && (null === b[1] || parseFloat(c) <= b[1]) : null;
        },
        submitted: function(a) {
            return a.form["nette-submittedBy"] === a;
        },
        fileSize: function(a, b, c) {
            if (window.FileList) for (var d = 0; d < c.length; d++) if (c[d].size > b) return !1;
            return !0;
        },
        image: function(a, b, c) {
            if (window.FileList && c instanceof window.FileList) for (var d = 0; d < c.length; d++) {
                var e = c[d].type;
                if (e && "image/gif" !== e && "image/png" !== e && "image/jpeg" !== e) return !1;
            }
            return !0;
        },
        static: function(a, b, c) {
            return b;
        }
    }, Nette.toggleForm = function(a, b) {
        var c;
        for (Nette.toggles = {}, c = 0; c < a.elements.length; c++) a.elements[c].tagName.toLowerCase() in {
            input: 1,
            select: 1,
            textarea: 1,
            button: 1
        } && Nette.toggleControl(a.elements[c], null, null, !b);
        for (c in Nette.toggles) Nette.toggle(c, Nette.toggles[c], b);
    }, Nette.toggleControl = function(a, b, c, d, e) {
        b = b || Nette.parseJSON(a.getAttribute("data-nette-rules")), e = void 0 === e ? {
            value: Nette.getEffectiveValue(a)
        } : e;
        for (var f, g = !1, h = [], i = function() {
            Nette.toggleForm(a.form, a);
        }, j = 0, k = b.length; j < k; j++) {
            var l = b[j], m = l.op.match(/(~)?([^?]+)/), n = l.control ? a.form.elements.namedItem(l.control) : a;
            if (n) {
                if (f = c, !1 !== c) {
                    if (l.neg = m[1], l.op = m[2], null === (f = Nette.validateRule(n, l.op, l.arg, a === n ? e : void 0))) continue;
                    l.neg && (f = !f), l.rules || (c = f);
                }
                if (l.rules && Nette.toggleControl(a, l.rules, f, d, e) || l.toggle) {
                    if (g = !0, d) for (var o = !document.addEventListener, p = n.tagName ? n.name : n[0].name, q = n.tagName ? n.form.elements : n, r = 0; r < q.length; r++) q[r].name !== p || Nette.inArray(h, q[r]) || (Nette.addEvent(q[r], o && q[r].type in {
                        checkbox: 1,
                        radio: 1
                    } ? "click" : "change", i), h.push(q[r]));
                    for (var s in l.toggle || []) Object.prototype.hasOwnProperty.call(l.toggle, s) && (Nette.toggles[s] = Nette.toggles[s] || (l.toggle[s] ? f : !f));
                }
            }
        }
        return g;
    }, Nette.parseJSON = function(s) {
        return "{op" === (s || "").substr(0, 3) ? eval("[" + s + "]") : JSON.parse(s || "[]");
    }, Nette.toggle = function(a, b, c) {
        var d = document.getElementById(a);
        d && (d.style.display = b ? "" : "none");
    }, Nette.initForm = function(a) {
        Nette.toggleForm(a), a.noValidate || (a.noValidate = !0, Nette.addEvent(a, "submit", function(b) {
            Nette.validateForm(a) || (b && b.stopPropagation ? (b.stopPropagation(), b.preventDefault()) : window.event && (event.cancelBubble = !0, 
            event.returnValue = !1));
        }));
    }, Nette.initOnLoad = function() {
        Nette.addEvent(document, "DOMContentLoaded", function() {
            for (var a = 0; a < document.forms.length; a++) for (var b = document.forms[a], c = 0; c < b.elements.length; c++) if (b.elements[c].getAttribute("data-nette-rules")) {
                Nette.initForm(b);
                break;
            }
            Nette.addEvent(document.body, "click", function(a) {
                for (var b = a.target || a.srcElement; b; ) {
                    if (b.form && b.type in {
                        submit: 1,
                        image: 1
                    }) {
                        b.form["nette-submittedBy"] = b;
                        break;
                    }
                    b = b.parentNode;
                }
            });
        });
    }, Nette.isArray = function(a) {
        return "[object Array]" === Object.prototype.toString.call(a);
    }, Nette.inArray = function(a, b) {
        if ([].indexOf) return a.indexOf(b) > -1;
        for (var c = 0; c < a.length; c++) if (a[c] === b) return !0;
        return !1;
    }, Nette.webalize = function(a) {
        a = a.toLowerCase();
        var b, c, d = "";
        for (b = 0; b < a.length; b++) c = Nette.webalizeTable[a.charAt(b)], d += c || a.charAt(b);
        return d.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }, Nette.webalizeTable = {
        "á": "a",
        "ä": "a",
        "č": "c",
        "ď": "d",
        "é": "e",
        "ě": "e",
        "í": "i",
        "ľ": "l",
        "ň": "n",
        "ó": "o",
        "ô": "o",
        "ř": "r",
        "š": "s",
        "ť": "t",
        "ú": "u",
        "ů": "u",
        "ý": "y",
        "ž": "z"
    }, Nette;
});