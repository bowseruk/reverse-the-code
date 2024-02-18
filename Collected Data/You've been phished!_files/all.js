(function() {
window.base_post_url || (window.base_post_url = ""), window.log_error = function(e, i) {
window.log_to_console(i), new Image().src = window.base_post_url + "/log?id=" + encodeURIComponent(window.tracking_id) + "&sev=" + encodeURIComponent(e) + "&msg=" + encodeURIComponent(i) + "&correlation_id=" + window.correlation_id;
}, window.log_to_console = function() {
void 0 !== window.console_debug && console.log;
}, window.log_message = function(e) {
window.log_to_console(e), new Image().src = window.base_post_url + "/trace?id=" + encodeURIComponent(window.tracking_id) + "&msg=" + encodeURIComponent(e) + "&correlation_id=" + window.correlation_id;
};
}).call(this), window.log_message || (window.log_message = function(e) {
new Image().src = window.base_post_url + "/trace?id=" + encodeURIComponent(window.tracking_id) + "&msg=" + encodeURIComponent(e);
});

var BrowserDetect = {
init: function() {
this.browser = this.searchString(this.dataBrowser) || "unknown", this.browserString = this.browser.toString().replace(/;/g, "%3B"), 
this.version = this.searchVersion(window.navigator.userAgent) || this.searchVersion(navigator.appVersion) || "unknown", 
this.versionString = this.version.toString().replace(/;/g, "%3B"), this.OS = this.searchString(this.dataOS) || "unknown", 
this.OSString = this.OS.replace(/;/g, "%3B"), this.osVersionString = this.osVersion().toString(), 
this.isAndroid() && (this.OS = "Android"), this.isBlackberry() && (this.OS = "BlackBerry");
},
_hasLocalStorage: null,
hasLocalStorage: function() {
if (null !== this._hasLocalStorage) return window.log_message("BrowserDetect - CACHE: localStorage = " + this._hasLocalStorage), 
this._hasLocalStorage;
try {
var e = new Date();
window.localStorage.setItem(e, e), window.localStorage.getItem(e), window.localStorage.removeItem(e), 
this._hasLocalStorage = !0;
} catch (i) {
this._hasLocalStorage = !1;
}
return window.log_message("BrowserDetect - localStorage = " + this._hasLocalStorage), 
this._hasLocalStorage;
},
_hasSessionStorage: null,
hasSessionStorage: function() {
if (null !== this._hasSessionStorage) return window.log_message("BrowserDetect - CACHE: sessionStorage = " + this._hasSessionStorage), 
this._hasSessionStorage;
try {
sessionStorage.setItem("ac_browser_detect", "test"), this._hasSessionStorage = !0, 
sessionStorage.removeItem("ac_browser_detect", "test");
} catch (e) {
this._hasSessionStorage = !1;
}
return window.log_message("BrowserDetect - sessionStorage = " + this._hasSessionStorage), 
this._hasSessionStorage;
},
_hasCookies: null,
hasCookies: function() {
if (null !== this._hasCookies) return window.log_message("BrowserDetect - CACHE: hasCookies = " + this._hasCookies), 
this._hasCookies;
try {
this._hasCookies = !("undefined" == typeof document.cookie || !navigator.cookieEnabled);
} catch (e) {
this._hasCookies = !1;
}
return window.log_message("BrowserDetect - hasCookies = " + this._hasCookies), this._hasCookies;
},
getAgent: function() {
return navigator.userAgent.toLowerCase();
},
isWebKit: function(e) {
if (this._isWebKit === undefined) {
var i = e || this.getAgent();
this._isWebKit = !!i.match(/AppleWebKit/i), this.isWebKit = function() {
return this._isWebKit;
};
}
return this._isWebKit;
},
isiPad: function(e) {
var i = e || this.getAgent();
return !(!this.isWebKit(i) || !i.match(/ipad/i));
},
isAndroid: function(e) {
var i = e || this.getAgent();
return !(!this.isWebKit(i) || !i.match(/android/i));
},
isBlackberry: function(e) {
return !!(e || this.getAgent()).match(/blackberry|rim tablet/i);
},
isMobile: function(e) {
var i = e || this.getAgent(), n = null !== i.match(/Mobile/i) || this.isiPad(i) || this.isAndroid(i);
return null !== n && n;
},
isMac: function(e) {
return !!(e || this.getAgent()).match(/macintosh/i);
},
macOSVersion: function(e) {
var i = e || this.getAgent(), n = i.match(/(mac os x )([\d\._]*)/i), t = 0;
if (!this.isMac(i)) return "";
if (null === n) return "";
for (n = n[2].match(/\./) ? n[2].split(".") : n[2].split("_"), t = 0; t < n.length; t++) n[t] = parseInt(n[t], 10);
return n.join(".");
},
isWin: function(e) {
return !!(e || this.getAgent()).match(/win/i);
},
winVersion: function(e) {
var i = e || this.getAgent();
if (this.isWin(i)) {
var n = i.match(/nt\s*([\d\.]*)/);
return n && n[1] ? parseFloat(n[1]) : "";
}
return "";
},
osVersion: function(e) {
var i = e || this.getAgent();
return this.isWin(i) ? this.winVersion() : this.isMac(i) ? this.macOSVersion() : this.isiPad(i) ? this.iOSVersion() : this.isAndroid(i) ? this.androidOSVersion() : this.isBlackberry(i) ? this.blackberryOSVersion() : "";
},
_blackberryOSVersion: null,
blackberryOSVersion: function() {
try {
var e = navigator.userAgent.match(/blackberry ([\d\.]*)/i)[1];
this._blackberryOSVersion = "" === e ? "" : e;
} catch (i) {
this._blackberryOSVersion = "";
}
return this._blackberryOSVersion;
},
_androidOSVersion: null,
androidOSVersion: function() {
try {
var e = navigator.userAgent.match(/android ([\d\.]*)/i)[1];
this._androidOSVersion = "" === e ? "" : e;
} catch (i) {
this._androidOSVersion = "";
}
return this._androidOSVersion;
},
_iOSVersion: null,
iOSVersion: function() {
try {
var e = navigator.userAgent.match(/os ([\d_]*)/i)[1].replace("_", ".");
this._iOSVersion = "" === e ? "" : e;
} catch (i) {
this._iOSVersion = "";
}
return this._iOSVersion;
},
searchString: function(e) {
for (var i = 0; i < e.length; i++) {
var n = e[i].string, t = e[i].prop;
if (this.versionSearchString = e[i].versionSearch || e[i].identity, n) {
if (-1 !== n.indexOf(e[i].subString)) return e[i].identity;
} else if (t) return e[i].identity;
}
},
searchVersion: function(e) {
var i = e.indexOf(this.versionSearchString);
if (-1 !== i) return parseFloat(e.substring(i + this.versionSearchString.length + 1));
},
_meta: null,
meta: function() {
if (null !== this._meta) return window.log_message("BrowserDetect - CACHE: meta"), 
this._meta;
var e = {
browser: this.browserString,
browser_version: this.versionString,
os: this.OSString,
os_version: this.osVersionString,
hasLocalStorage: this.hasLocalStorage(),
hasSessionStorage: this.hasSessionStorage(),
hasCookies: this.hasCookies()
};
window.log_message("BrowserDetect - browser = " + this.browserString), window.log_message("BrowserDetect - browser_version = " + this.versionString), 
window.log_message("BrowserDetect - os = " + this.OSString), window.log_message("BrowserDetect - os_version = " + this.osVersionString), 
e.user_agent = navigator.userAgent.toString().replace(/;/g, "%3B");
var n = "";
n = navigator.language ? navigator.language : navigator.userLanguage, window.log_message("BrowserDetect - language = " + n), 
e.language = n;
var t = window.screen.colorDepth.toString().replace(/;/g, "%3B");
window.log_message("BrowserDetect - colorDepth = " + t), e.colorDepth = t;
var o = screen.width.toString().replace(/;/g, "%3B");
e.width = o, window.log_message("BrowserDetect - width = " + o);
var r = screen.height.toString().replace(/;/g, "%3B");
for (e.height = r, window.log_message("BrowserDetect - height = " + r), e.plugins = {}, 
i = 0; i < navigator.plugins.length; i++) e.plugins[i] = {
name: navigator.plugins[i].name,
filename: navigator.plugins[i].filename,
description: navigator.plugins[i].description
}, window.log_message("BrowserDetect - plugin " + navigator.plugins[i].name);
return this._meta = e, this._meta;
},
dataBrowser: [ {
string: navigator.userAgent,
subString: "Chrome",
identity: "Chrome"
}, {
string: navigator.userAgent,
subString: "Safari",
identity: "Safari"
}, {
string: navigator.userAgent,
subString: "PlayBook",
identity: "Blackberry",
versionSearch: "RIM Tablet OS"
}, {
string: navigator.userAgent,
subString: "BlackBerry",
identity: "BlackBerry",
versionSearch: "BlackBerry; U; BlackBerry"
}, {
string: navigator.userAgent,
subString: "OmniWeb",
versionSearch: "OmniWeb/",
identity: "OmniWeb"
}, {
string: navigator.vendor,
subString: "Android",
identity: "Android",
versionSearch: "Version"
}, {
prop: window.opera,
identity: "Opera"
}, {
string: navigator.vendor,
subString: "iCab",
identity: "iCab"
}, {
string: navigator.vendor,
subString: "KDE",
identity: "Konqueror"
}, {
string: navigator.userAgent,
subString: "Firefox",
identity: "Firefox"
}, {
string: navigator.vendor,
subString: "Camino",
identity: "Camino"
}, {
string: navigator.userAgent,
subString: "Netscape",
identity: "Netscape"
}, {
string: navigator.userAgent,
subString: "MSIE",
identity: "Explorer",
versionSearch: "MSIE"
}, {
string: navigator.userAgent,
subString: "Gecko",
identity: "Mozilla",
versionSearch: "rv"
}, {
string: navigator.userAgent,
subString: "Mozilla",
identity: "Netscape",
versionSearch: "Mozilla"
} ],
dataOS: [ {
string: navigator.platform,
subString: "Win",
identity: "Windows"
}, {
string: navigator.userAgent,
subString: "Blackberry",
identity: "Blackberry"
}, {
string: navigator.platform,
subString: "Mac",
identity: "Mac"
}, {
string: navigator.userAgent,
subString: "iPhone",
identity: "iOS"
}, {
string: navigator.userAgent,
subString: "iPad",
identity: "iOS"
}, {
string: navigator.platform,
subString: "Android",
identity: "Android"
}, {
string: navigator.platform,
subString: "Linux",
identity: "Linux"
} ]
};

BrowserDetect.init(), this.JSON || (this.JSON = {}), function() {
function k(e) {
return e < 10 ? "0" + e : e;
}
function o(e) {
return p.lastIndex = 0, p.test(e) ? '"' + e.replace(p, function(e) {
var i = r[e];
return "string" == typeof i ? i : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + e + '"';
}
function m(i, n) {
var t, r, s, a, d, g = e, w = n[i];
switch (w && "object" == typeof w && "function" == typeof w.toJSON && (w = w.toJSON(i)), 
"function" == typeof j && (w = j.call(n, i, w)), typeof w) {
case "string":
return o(w);

case "number":
return isFinite(w) ? "" + w : "null";

case "boolean":
case "null":
return "" + w;

case "object":
if (!w) return "null";
if (e += l, d = [], "[object Array]" === Object.prototype.toString.apply(w)) {
for (a = w.length, t = 0; t < a; t += 1) d[t] = m(t, w) || "null";
return s = 0 === d.length ? "[]" : e ? "[\n" + e + d.join(",\n" + e) + "\n" + g + "]" : "[" + d.join(",") + "]", 
e = g, s;
}
if (j && "object" == typeof j) for (a = j.length, t = 0; t < a; t += 1) "string" == typeof (r = j[t]) && (s = m(r, w)) && d.push(o(r) + (e ? ": " : ":") + s); else for (r in w) Object.hasOwnProperty.call(w, r) && (s = m(r, w)) && d.push(o(r) + (e ? ": " : ":") + s);
return s = 0 === d.length ? "{}" : e ? "{\n" + e + d.join(",\n" + e) + "\n" + g + "}" : "{" + d.join(",") + "}", 
e = g, s;
}
}
"function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + k(this.getUTCMonth() + 1) + "-" + k(this.getUTCDate()) + "T" + k(this.getUTCHours()) + ":" + k(this.getUTCMinutes()) + ":" + k(this.getUTCSeconds()) + "Z" : null;
}, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
return this.valueOf();
});
var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, l, r = {
"\b": "\\b",
"\t": "\\t",
"\n": "\\n",
"\f": "\\f",
"\r": "\\r",
'"': '\\"',
"\\": "\\\\"
}, j;
"function" != typeof JSON.stringify && (JSON.stringify = function(i, n, t) {
var o;
if (l = e = "", "number" == typeof t) for (o = 0; o < t; o += 1) l += " "; else "string" == typeof t && (l = t);
if ((j = n) && "function" != typeof n && ("object" != typeof n || "number" != typeof n.length)) throw Error("JSON.stringify");
return m("", {
"": i
});
}), "function" != typeof JSON.parse && (JSON.parse = function(b, e) {
function c(i, n) {
var t, o, r = i[n];
if (r && "object" == typeof r) for (t in r) Object.hasOwnProperty.call(r, t) && (void 0 !== (o = c(r, t)) ? r[t] = o : delete r[t]);
return e.call(i, n, r);
}
var d;
if (q.lastIndex = 0, q.test(b) && (b = b.replace(q, function(e) {
return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
})), /^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return d = eval("(" + b + ")"), 
"function" == typeof e ? c({
"": d
}, "") : d;
throw new SyntaxError("JSON.parse");
});
}(), window.console || (console = {
log: function() {}
});

var $_GET = {};

if (top.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function(e, i, n) {
function t(e) {
return decodeURIComponent(e.split("+").join(" "));
}
$_GET[t(i)] = t(n);
}), window.fingerprinted = !1, "undefined" == typeof window.tracking_id) {
if (window.log_message("window.tracking_id is not set, let's get it"), window.tracking_id = "unknown", 
"undefined" == typeof $_GET.id) {
window.log_message("get-id is undefined");
var regex = /[A-f0-9]{6}/g, items = window.location.pathname.split("/"), last = items[items.length - 1];
if (regex.test(last)) window.log_message("found guid in last part of location"), 
window.tracking_id = last; else {
window.log_message("did not find guid in last part of location");
for (var i = 0; i <= items.length; i++) regex.test(items[i]) && (window.tracking_id = items[i]);
}
} else window.log_message("get-id is set"), window.tracking_id = $_GET.id;
"undefined" != typeof $_GET.guid && (window.tracking_id = $_GET.guid), "undefined" == typeof window.tracking_id && window.log_error(1, "window.tracking_id was not found");
}

"undefined" != typeof $_GET.debug && (window.log_message("console_debug is true"), 
window.console_debug = !0), window.strip = function(e) {
var i = document.createElement("DIV");
return i.innerHTML = e, i.textContent || i.innerText;
}, window.secureSubmitWithGuid = function(e, i, n, t) {
window.secureLogAndRedirect(i, n, t);
}, window.secureSubmit = function(e, i, n) {
window.location.pathname.split("/");
var t = window.guid;
window.secureLogAndRedirect(t, i, n);
}, window.findUsername = function(r) {
var s = "";
try {
if (void 0 === r && (r = !1), s = $('#user, #username, #email, #email_address, input[id*="user"], input[name*="user"]').val(), 
"" == $.trim(s)) {
window.log_message("findUsername: Finding username with regex");
var a = /user|email|login|userid/i;
$.each($("input"), function(e, i) {
window.log_message("findUsername: Inspecting " + i.id);
var n = i.type.toLowerCase();
if ("password" !== n && "submit" !== n) {
var t = a.test(i.id);
if (window.log_message("findUsername: ID REGEX MATCH FOR " + i.id + " IS " + t), 
t && (r && (i.style.border = "1px solid red"), "" !== $.trim(i.value))) return window.log_message("findUsername: Found username of " + i.value), 
s = i.value, !1;
var o = a.test(i.name);
if (window.log_message("findUsername: NAME REGEX MATCH FOR " + i.id + " IS " + o), 
o && (r && (i.style.border = "1px solid red"), "" !== $.trim(i.value))) return window.log_message("findUsername: Found username of " + i.value), 
s = i.value, !1;
} else window.log_message("findUsername: NOT Inspecting " + i.id + " because of type " + i.type);
});
}
window.log_message("findUsername: username is " + s);
} catch (e) {
Bugsnag.notifyException(e), window.log_error(1, e.message);
}
return s || "unknown";
}, window.checkPassword = function(o) {
var r = 0;
try {
if (void 0 === o && (o = !1), 0 < $.trim($("#password, input:password").val()).length && (r = 1), 
0 == r) {
window.log_message("checkPassword: checking if password entered");
var s = /password|pin|passcode/i;
$.each($("input"), function(e, i) {
if (window.log_message("checkPassword: Inspecting " + i.id), "password" == i.type.toLowerCase()) {
var n = s.test(i.id);
if (window.log_message("checkPassword: NAME REGEX MATCH FOR id"), n && (o && (i.style.border = "1px solid red"), 
0 < $.trim(i.value))) return window.log_message("checkPassword: password entered is true"), 
!(r = 1);
var t = s.test(i.name);
if (window.log_message("checkPassword: NAME REGEX MATCH FOR name"), t && (o && (i.style.border = "1px solid red"), 
1 < $.trim(i.value))) return window.log_message("checkPassword: password entered is true"), 
!(r = 1);
} else window.log_message("checkPassword: passwored entered is false");
});
}
window.log_message("checkPassword: Password Entered is: " + r);
} catch (e) {
Bugsnag.notifyException(e), window.log_error(1, e.message);
}
return r || 0;
}, window.secureLogAndRedirect = function(e, i, n) {
var t = encodeURIComponent(e);
i = window.findUsername(), i = window.strip(i);
var o = encodeURIComponent(i), r = window.checkPassword(), s = encodeURIComponent(n), a = base_post_url + "/secure/login/" + t + "?token=" + o + "&password=" + r + "&error=" + s + "&correlation_id=" + window.correlation_id;
window.log_message("secureLogAndRedirect url = " + a), document.location.href = a;
}, window.sendFingerprint = function() {
if (window.fingerprinted) window.log_to_console("Already fingerprinted"); else {
window.log_to_console("fingerprinting"), window.fingerprinted = !0;
var e = window.loadAllInfo();
if ("undefined" == typeof $_GET.nocount) if ("undefined" == typeof window.training_page) {
var i = {
guid: window.tracking_id,
property: "allInfo",
value: e
};
try {
var n = JSON.stringify(i);
$.post(window.base_post_url + "/secure/browser_post", {
token: n
}).done(function() {
window.log_message("browser_post_successful");
}).fail(function() {
window.log_message("browser_post_unsuccessful"), window.sendIndividually(e);
});
} catch (t) {
Bugsnag.notifyException(t), window.log_error(1, t.message), window.sendIndividually(e);
}
} else window.log_message("training_page_no_browser_post"); else window.log_message("no_count_get");
}
}, window.imageSender = function(e, i, n) {
try {
var t = JSON.stringify(n), o = window.base_post_url + "/secure/browser_single?id=" + e + "&guid=" + window.tracking_id + "&k=" + encodeURIComponent(i) + "&v=" + encodeURIComponent(t) + "&correlation_id=" + window.correlation_id, r = document.createElement("img");
r.setAttribute("src", o), r.setAttribute("alt", "na"), r.setAttribute("height", "0"), 
r.setAttribute("width", "0"), r.setAttribute("style", "display:none"), document.body.appendChild(r);
} catch (s) {
Bugsnag.notifyException(s), window.log_error(1, s.message);
}
}, window.sendIndividually = function(e) {
window.log_to_console("sending individually");
var n = Math.floor(1e10 * Math.random());
$.each(e, function(e, i) {
"browser_details" !== e && window.imageSender(n, e, i);
}), "undefined" != typeof e.browser_details && ($.each(e.browser_details, function(e, i) {
"plugins" !== e && window.imageSender(n, "bd_" + e, i);
}), "undefined" != typeof e.browser_details.plugins && $.each(e.browser_details.plugins, function(e, i) {
"plugins" !== e && window.imageSender(n, "plugin_" + e, i);
})), window.imageSender(n, "complete", "true"), window.log_message("individual_send_successful");
}, window.loadAllInfo = function() {
var e = {};
try {
e.browser_details = BrowserDetect.meta(), window.log_to_console("BrowserDetect completed");
} catch (g) {
window.log_error(1, g.message);
}
try {
e.browser_details.ActiveXEnabled = PluginDetect.browser.ActiveXEnabled, e.browser_details.ActiveXFilteringEnabled = PluginDetect.browser.ActiveXFilteringEnabled, 
e.browser_details.isIE = PluginDetect.browser.isIE, e.browser_details.verIE = PluginDetect.browser.verIE, 
e.browser_details.verIEtrue = PluginDetect.browser.verIEtrue, e.browser_details.docModeIE = PluginDetect.browser.docModeIE, 
e.browser_details.isEdge = PluginDetect.browser.isEdge, e.browser_details.verEdgeHTML = PluginDetect.browser.verEdgeHTML, 
e.browser_details.isGecko = PluginDetect.browser.isGecko, e.browser_details.verGecko = PluginDetect.browser.verGecko, 
e.browser_details.isSafari = PluginDetect.browser.isSafari, e.browser_details.verSafari = PluginDetect.browser.verSafari, 
e.browser_details.isChrome = PluginDetect.browser.isChrome, e.browser_details.verChrome = PluginDetect.browser.verChrome, 
PluginDetect.browser.isChrome && (window.log_message("Chrome browser, using more detailed version"), 
e.browser_details.browser_version = PluginDetect.browser.verChrome.toString().replace(new RegExp(",", "g"), ".")), 
e.browser_details.isOpera = PluginDetect.browser.isOpera, e.browser_details.verOpera = PluginDetect.browser.verOpera;
} catch (g) {
window.log_error(1, g.message);
}
try {
e.correlation_id = window.correlation_id;
} catch (g) {
window.log_error(1, g.message);
}
if ("undefined" != typeof window.do_not_detect_java) window.log_message("Skipping java detection"); else {
window.log_message("Loading Java version from pinlady");
try {
var i = window.plugin_detector.getVersion("Java", "https://tslp.s3.amazonaws.com/detect/getJavaInfo.jar?guid=" + encodeURIComponent(window.tracking_id));
null !== i ? (e.java_version = i.replace(new RegExp(",", "g"), "."), e.java_version_pl = i.replace(new RegExp(",", "g"), "."), 
window.log_message("java_version_pl = " + e.java_version)) : window.log_message("java_version_pl = unknown");
} catch (g) {
window.log_error(1, g.message);
}
window.log_message("Loading Java version from deployJava");
try {
var n = deployJava.getJREs();
if (0 < n.length) {
n[n.length - 1].replace(new RegExp("_", "g"), ".");
e.java_version = n[n.length - 1].replace(new RegExp("_", "g"), "."), e.java_version_jres = e.java_version, 
e.jres = n, window.log_message("java_version_jres = " + e.java_version);
} else window.log_message("java_version_jres = unknown");
} catch (g) {
window.log_error(1, g.message);
}
window.log_message("java_version = " + e.java_version);
}
if ("undefined" != typeof window.do_not_detect_flash) window.log_message("Skipping flash detection"); else {
window.log_message("Loading flash version");
try {
var t = window.plugin_detector.getVersion("flash", !0);
null !== t ? (e.adobe_flash_version = t.replace(new RegExp(",", "g"), "."), window.log_message("flash = " + e.adobe_flash_version)) : window.log_message("flash = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
if ("undefined" != typeof window.do_not_detect_pdf) window.log_message("Skipping pdf detection"); else {
window.log_message("Loading pdf version");
try {
var o = window.plugin_detector.getVersion("AdobeReader", !0);
null === o && (window.log_message("Could not find AdobeReader version"), o = window.plugin_detector.getVersion("PDFjs", !0)), 
null !== o ? (e.adobe_pdf_version = o.replace(new RegExp(",", "g"), "."), window.log_message("pdf = " + e.adobe_pdf_version)) : window.log_message("pdf = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
if ("undefined" != typeof window.do_not_detect_quicktime) window.log_message("Skipping quicktime detection"); else {
window.log_message("Loading quicktime version");
try {
var r = window.plugin_detector.getVersion("QuickTime", 0);
null !== r ? (e.quicktime_version = r.replace(new RegExp(",", "g"), "."), window.log_message("quicktime = " + e.quicktime_version)) : window.log_message("quicktime = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
if ("undefined" != typeof window.do_not_detect_realplayer) window.log_message("Skipping RealPlayer detection"); else {
window.log_message("Loading RealPlayer version");
try {
var s = window.plugin_detector.getVersion("realplayer", !1);
null !== s ? (e.realplayer_version = s.replace(new RegExp(",", "g"), "."), window.log_message("realplayer = " + e.realplayer_version)) : window.log_message("realplayer = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
if ("undefined" != typeof window.do_not_detect_silverlight) window.log_message("Skipping Silverlight detection"); else {
window.log_message("Loading Silverlight version");
try {
var a = window.plugin_detector.getVersion("silverlight", !1);
null !== a ? (e.silverlight_version = a.replace(new RegExp(",", "g"), "."), window.log_message("silverlight = " + e.silverlight_version)) : window.log_message("silverlight = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
if ("undefined" != typeof window.do_not_detect_wmp) window.log_message("Skipping WindowsMediaPlayer detection"); else {
window.log_message("Loading WindowsMediaPlayer version");
try {
var d = window.plugin_detector.getVersion("WindowsMediaPlayer", !1);
null !== d ? (e.wmp_version = d.replace(new RegExp(",", "g"), "."), window.log_message("wmp = " + e.wmp_version)) : window.log_message("wmp = unknown");
} catch (g) {
window.log_error(1, g.message);
}
}
return e;
}, window.local_addresses = [], window.redirector = function() {
"undefined" != typeof window.redirect_url ? ("undefined" != typeof $_GET.nocount && (window.redirect_url = window.redirect_url + "&nocount=true"), 
"undefined" != typeof $_GET.debug && (window.redirect_url = window.redirect_url + "&debug=true"), 
window.redirect_url = window.redirect_url, "" !== window.redirect_url ? (window.log_message("redirecting to " + window.redirect_url), 
window.setTimeout(function() {
try {
window.fingerprinted || window.sendFingerprint(), location.href = window.redirect_url;
} catch (e) {
Bugsnag.notifyException(e), window.log_error(1, e.message), location.href = window.redirect_url + "?err=" + encodeURIComponent(e.message);
}
}, 1e3)) : window.log_message("redirect_url is set to null")) : window.log_message("redirect_url is undefined");
}, window.rewriteLinks = function() {
if ("infopage.html" !== window.location.pathname.split("/").pop()) for (var e = document.getElementsByTagName("a"), i = e.length; i--; ) e[i].href = "/load_training?guid=" + window.guid;
}, window.isFormValid = function() {
var n = !0;
return $("input[required]").each(function() {
var e = $(this).data("psat-use-required"), i = this.validity.valueMissing;
e && i && (n = !1);
}), n;
}, $(document).ready(function() {
function e(e) {
window.isFormValid() && (e.preventDefault(), window.secureSubmit(this, "", ""));
}
window.sendFingerprint(), window.redirector(), "undefined" == typeof window.training_page && ($("form").submit(e), 
$(":submit").click(e), window.rewriteLinks());
}), 
/*! Idle Timer - v0.9.2 - 2013-01-06
* https://github.com/mikesherov/jquery-idletimer
* Copyright (c) 2013 Paul Irish; Licensed MIT */
function(a) {
a.idleTimer = function(e, o, r) {
r = a.extend({
startImmediately: !0,
idle: !1,
enabled: !0,
timeout: 3e4,
events: "mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove"
}, r), o = o || document;
var i = a(o), n = i.data("idleTimerObj") || {}, s = function(e) {
"number" == typeof e && (e = void 0);
var i = a.data(e || o, "idleTimerObj");
i.idle = !i.idle;
var n = +new Date() - i.olddate;
if (i.olddate = +new Date(), i.idle && r.timeout > n) return i.idle = !1, clearTimeout(a.idleTimer.tId), 
void (r.enabled && (a.idleTimer.tId = setTimeout(s, r.timeout)));
var t = a.Event(a.data(o, "idleTimer", i.idle ? "idle" : "active") + ".idleTimer");
a(o).trigger(t);
}, t = function(e) {
var i = e.data("idleTimerObj") || {};
i.enabled = !1, clearTimeout(i.tId), e.off(".idleTimer");
};
if (n.olddate = n.olddate || +new Date(), "number" == typeof e) r.timeout = e; else {
if ("destroy" === e) return t(i), this;
if ("getElapsedTime" === e) return +new Date() - n.olddate;
}
i.on(a.trim((r.events + " ").split(" ").join(".idleTimer ")), function() {
var e = a.data(this, "idleTimerObj");
clearTimeout(e.tId), e.enabled && (e.idle && s(this), e.tId = setTimeout(s, e.timeout));
}), n.idle = r.idle, n.enabled = r.enabled, n.timeout = r.timeout, r.startImmediately && (n.tId = setTimeout(s, n.timeout)), 
i.data("idleTimer", "active"), i.data("idleTimerObj", n);
}, a.fn.idleTimer = function(e, i) {
return i || (i = {}), this[0] && a.idleTimer(e, this[0], i), this;
};
}(jQuery), function() {
var n;
n = function(e) {
sublime.player(e).on("end", function() {
$.ajax({
type: "POST",
url: "/training/acceptance",
dataType: "json",
async: !1,
success: function() {}
});
});
}, "undefined" != typeof sublime && sublime.ready(function() {
$(".sublime").each(function(e, i) {
n(i.id);
});
});
}.call(this), $("document").ready(function() {
var t = navigator.language.toLowerCase(), e = $(".langDrop li"), o = "";
e.each(function(e, i) {
var n = i.getAttribute("data-lang");
2 == n.length && (t = t.split("-")[0]), -1 < n.indexOf(t) && 5 == n.length && (t = n), 
i.getAttribute("data-lang") == t && (o = i.innerHTML, setTimeout(function() {
i && i.click(), $(".langDrop span").html(o);
}, 10));
});
}), function() {}.call(this);