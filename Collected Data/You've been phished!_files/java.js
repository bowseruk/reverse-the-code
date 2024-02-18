/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ Java ]
[ isMinVersion getVersion hasMimeType getInfo onDetectionDone ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = PluginDetect;
    var a = {
        Property_names: [],
        Property_values: [],
        Property_values_lock: [],
        JAVATOJSBRIDGE: 0,
        JSTOJAVABRIDGE: 1,
        mimeType: ["application/x-java-applet", "application/x-java-vm", "application/x-java-bean"],
        mimeType_dummy: "application/dummymimejavaapplet",
        classID: "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",
        classID_dummy: "clsid:8AD9C840-044E-11D1-B3E9-BA9876543210",
        navigator: {
            init: function() {
                var q = this,
                    p = a;
                q.mimeObj = j.hasMimeType(p.mimeType);
                if (q.mimeObj) {
                    q.pluginObj = q.mimeObj.enabledPlugin
                }
            },
            a: (function() {
                try {
                    return window.navigator.javaEnabled()
                } catch (p) {}
                return 1
            })(),
            javaEnabled: function() {
                return !!this.a
            },
            mimeObj: 0,
            pluginObj: 0
        },
        OTF: null,
        info: {
            pluginObj: null,
            getPluginObj: function() {
                var p = this;
                if (p.pluginObj === null) {
                    p.pluginObj = a.navMime.pluginObj || a.navigator.pluginObj || 0
                }
                return p.pluginObj
            },
            getNavPluginName: function() {
                var p = this.getPluginObj();
                return p ? p.name || "" : ""
            },
            getNavPluginDescription: function() {
                var p = this.getPluginObj();
                return p ? p.description || "" : ""
            },
            Plugin2Status: 0,
            setPlugin2Status: function(p) {
                if (j.isNum(p)) {
                    this.Plugin2Status = p
                }
            },
            getPlugin2Status: function() {
                var u = this,
                    r, s, p, t, q;
                if (u.Plugin2Status === 0) {
                    s = /Next.*Generation.*Java.*Plug-?in|Java.*Plug-?in\s*2\s/i;
                    p = /Classic.*Java.*Plug-?in/i;
                    t = u.getNavPluginDescription();
                    q = u.getNavPluginName();
                    if (s.test(t) || s.test(q)) {
                        u.setPlugin2Status(1);
                    } else {
                        if (p.test(t) || p.test(q)) {
                            u.setPlugin2Status(-1);
                        } else {
                            if (j.browser.isIE && (/Sun|Oracle/i).test(u.getVendor())) {
                                r = u.isMinJre4Plugin2();
                                if (r > 0) {
                                    u.setPlugin2Status(1);
                                } else {
                                    if (r < 0) {
                                        u.setPlugin2Status(-1);
                                    }
                                }
                            }
                        }
                    }
                }
                return u.Plugin2Status
            },
            isMinJre4Plugin2: function(p) {
                var t = a,
                    u = "",
                    r, s, q = t.applet.getResult()[0];
                if (j.OS == 1) {
                    u = "1,6,0,10"
                } else {
                    if (j.OS == 2) {
                        u = "1,6,0,12"
                    } else {
                        if (j.OS == 3) {
                            u = "1,6,0,10"
                        } else {
                            u = "1,6,0,10"
                        }
                    }
                }
                if (!p) {
                    p = (q && !t.applet.isRange(q) ? q : 0) || t.DTK.version || t.version;
                    r = t.applet.codebase;
                    s = t.WebStart.codebase;
                    p = p || s.version || r.version || (r.min && u ? (r.isMin(u, true) > 0 ? u : "0,0,0,0") : 0);
                }
                p = j.formatNum(j.getNum(p));
                return p ? (j.compareNums(p, u) >= 0 ? 1 : -1) : 0
            },
            BrowserForbidsPlugin2: function() {
                var p = j.browser;
                if (j.OS >= 20) {
                    return 0
                }
                if ((p.isGecko && j.compareNums(p.verGecko, "1,9,0,0") < 0) || (p.isOpera && j.compareNums(p.verOpera, "10,50,0,0") < 0)) {
                    return 1
                }
                return 0
            },
            BrowserRequiresPlugin2: function() {
                var p = j.browser;
                if (j.OS >= 20) {
                    return 0
                }
                if ((p.isGecko && j.compareNums(p.verGecko, "1,9,2,0") >= 0) || p.isChrome || (j.OS == 1 && p.isOpera && j.compareNums(p.verOpera, "10,60,0,0") >= 0)) {
                    return 1
                }
                return 0
            },
            VENDORS: ["Sun Microsystems Inc.", "Apple Computer, Inc.", "Oracle Corporation", "IBM Corporation"],
            VENDORS_reg: [/Sun/i, /Apple/i, /Oracle/i, /IBM/i],
            getNavVendor: function() {
                var t = this,
                    q, r = t.getNavPluginName(),
                    s = t.getNavPluginDescription(),
                    p = "";
                if (r || s) {
                    for (q = 0; q < t.VENDORS.length; q++) {
                        if (t.VENDORS_reg[q].test(r) || t.VENDORS_reg[q].test(s)) {
                            p = t.VENDORS[q];
                            break
                        }
                    }
                }
                return p
            },
            OracleMin: "1,7,0,0",
            OracleOrSun: function(p) {
                var q = this;
                return q.VENDORS[j.compareNums(j.formatNum(p), q.OracleMin) < 0 ? 0 : 2]
            },
            OracleOrApple: function(p) {
                var q = this;
                return q.VENDORS[j.compareNums(j.formatNum(p), q.OracleMin) < 0 ? 1 : 2]
            },
            getVendor: function() {
                var t = this,
                    s = a,
                    u = s.vendor || s.applet.getResult()[1] || "",
                    q, r, p;
                if (!u) {
                    p = s.DTK.version;
                    q = s.applet.codebase;
                    r = s.WebStart.codebase;
                    p = p || r.version || q.version || (q.min ? (q.isMin(t.OracleMin, true) > 0 ? t.OracleMin : "0,0,0,0") : 0);
                    if (p) {
                        u = t.OracleOrSun(p)
                    } else {
                        u = t.getNavVendor() || "";
                        if (u) {} else {
                            if (s.version) {
                                if (j.OS == 2) {
                                    u = t.OracleOrApple(s.version)
                                } else {
                                    if (j.OS == 1 || j.OS == 3) {
                                        u = t.OracleOrSun(s.version)
                                    }
                                }
                            }
                        }
                    }
                }
                return u
            },
            isPlugin2InstalledEnabled: function() {
                var u = this,
                    t = a,
                    p = -1,
                    s = t.installed,
                    w = u.getPlugin2Status(),
                    v = u.BrowserRequiresPlugin2(),
                    r = u.BrowserForbidsPlugin2(),
                    q = u.isMinJre4Plugin2();
                if (s !== null && s >= -0.1) {
                    if (w >= 3) {
                        p = 1
                    } else {
                        if (w <= -3) {} else {
                            if (w == 2) {
                                p = 1
                            } else {
                                if (w == -2) {} else {
                                    if (v && w >= 0 && q > 0) {
                                        p = 1
                                    } else {
                                        if (r && w <= 0 && q < 0) {} else {
                                            if (v) {
                                                p = 1
                                            } else {
                                                if (r) {} else {
                                                    if (w > 0) {
                                                        p = 1
                                                    } else {
                                                        if (w < 0) {} else {
                                                            if (q < 0) {} else {
                                                                p = 0
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return p
            },
            result: {
                getDeploymentToolkitObj: function() {
                    var p = a,
                        r = p.info,
                        q = p.DTK;
                    q.query(1);
                    r.updateResult();
                    return q.status && q.HTML ? q.HTML.obj() : q.status
                }
            },
            updateResult: function() {
                var r = this,
                    q = a,
                    p = q.applet,
                    w, y = q.installed,
                    v = q.DTK,
                    u = p.results,
                    z = r.result;
                z.DeployTK_versions = [].concat(j.isArray(v.VERSIONS) ? v.VERSIONS : []);
                z.vendor = r.getVendor();
                z.isPlugin2 = r.isPlugin2InstalledEnabled();
                z.OTF = q.OTF < 3 ? 0 : (q.OTF == 3 ? 1 : 2);
                z.JavaAppletObj = null;
                for (w = 0; w < u.length; w++) {
                    if (u[w][0] && p.HTML[w] && p.HTML[w].obj()) {
                        z.JavaAppletObj = p.HTML[w].obj();
                        break
                    }
                }
                var t = [null, null, null, null];
                for (w = 0; w < u.length; w++) {
                    if (u[w][0]) {
                        t[w] = 1
                    } else {
                        if (u[w][0] !== null) {
                            if (q.NOTF) {
                                q.NOTF.isAppletActive(w)
                            }
                            if (p.active[w] > 0) {
                                t[w] = 0
                            } else {
                                if (p.allowed[w] >= 1 && q.OTF != 3 && (p.isDisabled.single(w) || y == -0.2 || y == -1 || p.active[w] < 0 || (w == 3 && (/Microsoft/i).test(z.vendor)))) {
                                    t[w] = -1
                                }
                            }
                        } else {
                            if (w == 3 && u[0][0]) {
                                t[w] = 0
                            } else {
                                if (p.isDisabled.single(w)) {
                                    t[w] = -1
                                }
                            }
                        }
                    }
                }
                z.objectTag = t[1];
                z.appletTag = t[2];
                z.objectTagActiveX = t[3];
                z.name = r.getNavPluginName();
                z.description = r.getNavPluginDescription();
                z.All_versions = [].concat((z.DeployTK_versions.length ? z.DeployTK_versions : (j.isString(q.version) ? [q.version] : [])));
                var s = z.All_versions;
                for (w = 0; w < s.length; w++) {
                    s[w] = j.formatNum(j.getNum(s[w]))
                }
                return z
            }
        },
        getInfo: function() {
            var p = this.info;
            p.updateResult();
            return p.result
        },
        getVerifyTagsDefault: function() {
            return [1, this.applet.isDisabled.VerifyTagsDefault_1() ? 0 : 1, 1]
        },
        getVersion: function(x, u, w) {
            var q = this,
                s, p = q.applet,
                v = q.verify,
                y = q.navigator,
                t = null,
                z = null,
                r = null;
            if (q.getVersionDone === null) {
                q.OTF = 0;
                y.init();
                if (v) {
                    v.init()
                }
            }
            p.setVerifyTagsArray(w);
            j.file.save(q, ".jar", u);
            if (q.getVersionDone === 0) {
                if (p.should_Insert_Query_Any()) {
                    s = p.insert_Query_Any(x);
                    q.setPluginStatus(s[0], s[1], t, x)
                }
                return
            }
            if ((!t || j.dbug) && q.navMime.query().version) {
                t = q.navMime.version
            }
            if ((!t || j.dbug) && q.navPlugin.query().version) {
                t = q.navPlugin.version
            }
            if ((!t || j.dbug) && q.DTK.query().version) {
                t = q.DTK.version
            }
            if ((!t || j.dbug) && q.WebStart.query().version) {
                t = q.WebStart.version
            }
            if (q.nonAppletDetectionOk(t)) {
                r = t
            }
            q.setPluginStatus(r, z, t, x);
            if (p.should_Insert_Query_Any()) {
                s = p.insert_Query_Any(x);
                if (s[0]) {
                    r = s[0];
                    z = s[1]
                }
            }
            q.setPluginStatus(r, z, t, x)
        },
        nonAppletDetectionOk: function(q) {
            var t = this,
                p = t.navigator,
                r = j.browser,
                s = 1;
            if (!q || !p.javaEnabled() || (!r.isIE && !p.mimeObj)) {
                s = 0
            }
            return s
        },
        setPluginStatus: function(v, w, p, u) {
            var t = this,
                s, q = 0,
                r = t.applet;
            p = p || t.version0;
            s = r.isRange(v);
            if (s) {
                if (r.setRange(s, u) == v) {
                    q = s
                }
                v = 0
            }
            if (t.OTF < 3) {
                t.installed = q ? (q > 0 ? 0.7 : -0.1) : (v ? 1 : (p ? -0.2 : -1))
            }
            if (t.OTF == 2 && t.NOTF && !t.applet.getResult()[0]) {
                t.installed = p ? -0.2 : -1
            }
            if (t.OTF == 3 && t.installed != -0.5 && t.installed != 0.5) {
                t.installed = (t.NOTF.isJavaActive(1) >= 1 ? 0.5 : -0.5)
            }
            if (t.OTF == 4 && (t.installed == -0.5 || t.installed == 0.5)) {
                if (v) {
                    t.installed = 1
                } else {
                    if (q) {
                        t.installed = q > 0 ? 0.7 : -0.1
                    } else {
                        if (t.NOTF.isJavaActive(1) >= 1) {
                            if (p) {
                                t.installed = 1;
                                v = p
                            } else {
                                t.installed = 0
                            }
                        } else {
                            if (p) {
                                t.installed = -0.2
                            } else {
                                t.installed = -1
                            }
                        }
                    }
                }
            }
            if (p) {
                t.version0 = j.formatNum(j.getNum(p))
            }
            if (v && !q) {
                t.version = j.formatNum(j.getNum(v))
            }
            if (w && j.isString(w)) {
                t.vendor = w
            }
            if (!t.vendor) {
                t.vendor = ""
            }
            if (t.verify && t.verify.isEnabled()) {
                t.getVersionDone = 0
            } else {
                if (t.getVersionDone != 1) {
                    if (t.OTF < 2) {
                        t.getVersionDone = 0
                    } else {
                        t.getVersionDone = t.applet.can_Insert_Query_Any() ? 0 : 1
                    }
                }
            }
        },
        WebStart: {
            hasRun: 0,
            version: "",
            codebase: {
                classID: "clsid:5852F5ED-8BF4-11D4-A245-0080C6F74284",
                isMin: function(q, p) {
                    this.$$ = a;
                    return j.codebase.isMin(this, q, p)
                },
                search: function(p) {
                    this.$$ = a;
                    return j.codebase.search(this, p)
                },
                DIGITMAX: [
                    [12, 4, 2048],
                    [5, 4, 1024]
                ],
                DIGITMIN: [5, 0, 0, 0],
                Upper: ["999", "6"],
                Lower: ["6", "0"],
                convert: [function(r, q) {
                    return q ? [parseInt(r[0], 10) > 1 ? "99" : r[1], r[2], r[3] + "0", "0"] : ["1", r[0], r[1], r[2].substring(0, r[2].length - 1 || 1)]
                }, 1]
            },
            isDisabled: function() {
                var p = this;
                if (!j.browser.isIE || p.hasRun) {
                    return 1
                }
                if (j.dbug) {
                    return 0
                }
                if (!j.DOM.isEnabled.objectTagUsingActiveX() || p.codebase.isMin("1,7,0,0", true) <= 0) {
                    return 1
                }
                return 0
            },
            query: function() {
                var r = this,
                    p = null,
                    q = r.isDisabled();
                r.hasRun = 1;
                if (q) {
                    return r
                }
                p = r.codebase.search();
                if (p) {
                    r.version = p
                }
                return r
            }
        },
        DTK: {
            hasRun: 0,
            status: null,
            VERSIONS: [],
            version: "",
            HTML: null,
            Plugin2Status: null,
            classID: ["clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA", "clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"],
            mimeType: ["application/java-deployment-toolkit", "application/npruntime-scriptable-plugin;DeploymentToolkit"],
            isDisabled: function(p) {
                var q = this;
                if (q.HTML) {
                    return 1
                }
                if (p || j.dbug) {
                    return 0
                }
                if (q.hasRun || !j.DOM.isEnabled.objectTagUsingActiveX()) {
                    return 1
                }
                return 0
            },
            query: function(B) {
                var z = this,
                    t = a,
                    A, v, p = j.DOM.altHTML,
                    u = {},
                    q, s = null,
                    w = null,
                    r = z.isDisabled(B);
                z.hasRun = 1;
                if (r) {
                    return z
                }
                z.status = 0;
                if (j.DOM.isEnabled.objectTagUsingActiveX()) {
                    for (A = 0; A < z.classID.length; A++) {
                        z.HTML = j.DOM.insert("object", ["classid", z.classID[A]], [], p);
                        s = z.HTML.obj();
                        if (j.pd.getPROP(s, "jvms")) {
                            break
                        } else {}
                    }
                } else {
                    v = j.hasMimeType(z.mimeType);
                    if (v && v.type) {
                        z.HTML = j.DOM.insert("object", ["type", v.type], [], p);
                        s = z.HTML.obj()
                    }
                }
                if (s) {
                    try {
                        if (Math.abs(t.info.getPlugin2Status()) < 2) {
                            z.Plugin2Status = s.isPlugin2()
                        }
                    } catch (y) {}
                    if (z.Plugin2Status !== null) {
                        if (z.Plugin2Status) {
                            t.info.setPlugin2Status(2)
                        } else {
                            if (j.DOM.isEnabled.objectTagUsingActiveX() || t.info.getPlugin2Status() <= 0) {
                                t.info.setPlugin2Status(-2)
                            }
                        }
                    }
                    try {
                        q = j.pd.getPROP(s, "jvms");
                        if (q) {
                            w = q.getLength();
                            if (j.isNum(w)) {
                                z.status = w > 0 ? 1 : -1;
                                for (A = 0; A < w; A++) {
                                    v = j.getNum(q.get(w - 1 - A).version);
                                    if (v) {
                                        z.VERSIONS.push(v);
                                        u["a" + j.formatNum(v)] = 1
                                    }
                                }
                            }
                        }
                    } catch (y) {}
                    if (z.VERSIONS.length) {
                        z.version = j.formatNum(z.VERSIONS[0])
                    }
                }
                return z
            }
        },
        navMime: {
            hasRun: 0,
            mimetype: "",
            version: "",
            mimeObj: 0,
            pluginObj: 0,
            regexJPI: /^\s*application\/x-java-applet;jpi-version\s*=\s*(\d.*)$/i,
            isDisabled: function() {
                var p = this,
                    q = a;
                if (p.hasRun || !q.navigator.mimeObj) {
                    return 1
                }
                return 0
            },
            update: function(s) {
                var p = this,
                    r = s ? s.enabledPlugin : 0,
                    q = s && p.regexJPI.test(s.type || "") ? j.formatNum(j.getNum(RegExp.$1)) : 0;
                if (q && r && (r.description || r.name)) {
                    if (j.compareNums(q, p.version || j.formatNum("0")) > 0) {
                        p.version = q;
                        p.mimeObj = s;
                        p.pluginObj = r;
                        p.mimetype = s.type;
                    }
                }
            },
            query: function() {
                var t = this,
                    s = a,
                    w, v, B, A, z, r, q = navigator.mimeTypes,
                    p = t.isDisabled();
                t.hasRun = 1;
                if (p) {
                    return t
                }
                r = q.length;
                if (j.isNum(r)) {
                    for (w = 0; w < r; w++) {
                        B = 0;
                        try {
                            B = q[w]
                        } catch (u) {}
                        t.update(B)
                    }
                }
                if (!t.version || j.dbug) {
                    z = j.isArray(s.mimeType) ? s.mimeType : [s.mimeType];
                    for (w = 0; w < z.length; w++) {
                        B = 0;
                        try {
                            B = q[z[w]]
                        } catch (u) {}
                        A = B ? B.enabledPlugin : 0;
                        r = A ? A.length : null;
                        if (j.isNum(r)) {
                            for (v = 0; v < r; v++) {
                                B = 0;
                                try {
                                    B = A[v]
                                } catch (u) {}
                                t.update(B)
                            }
                        }
                    }
                }
                return t
            }
        },
        navPlugin: {
            hasRun: 0,
            version: "",
            getPlatformNum: function() {
                var q = a,
                    p = 0,
                    r = /Java.*TM.*Platform[^\d]*(\d+)[\.,_]?(\d*)\s*U?(?:pdate)?\s*(\d*)/i,
                    s = j.pd.findNavPlugin({
                        find: r,
                        mimes: q.mimeType,
                        plugins: 1
                    });
                if (s && (r.test(s.name || "") || r.test(s.description || "")) && parseInt(RegExp.$1, 10) >= 5) {
                    p = "1," + RegExp.$1 + "," + (RegExp.$2 ? RegExp.$2 : "0") + "," + (RegExp.$3 ? RegExp.$3 : "0");
                }
                return p
            },
            getPluginNum: function() {
                var s = this,
                    q = a,
                    p = 0,
                    u, t, r, w, v = 0;
                r = /Java[^\d]*Plug-in/i;
                w = j.pd.findNavPlugin({
                    find: r,
                    num: 1,
                    mimes: q.mimeType,
                    plugins: 1,
                    dbug: v
                });
                if (w) {
                    u = s.checkPluginNum(w.description, r);
                    t = s.checkPluginNum(w.name, r);
                    p = u && t ? (j.compareNums(u, t) > 0 ? u : t) : (u || t)
                }
                if (!p) {
                    r = /Java.*\d.*Plug-in/i;
                    w = j.pd.findNavPlugin({
                        find: r,
                        mimes: q.mimeType,
                        plugins: 1,
                        dbug: v
                    });
                    if (w) {
                        u = s.checkPluginNum(w.description, r);
                        t = s.checkPluginNum(w.name, r);
                        p = u && t ? (j.compareNums(u, t) > 0 ? u : t) : (u || t)
                    }
                }
                return p
            },
            checkPluginNum: function(s, r) {
                var p, q;
                p = r.test(s) ? j.formatNum(j.getNum(s)) : 0;
                if (p && j.compareNums(p, j.formatNum("10")) >= 0) {
                    q = p.split(j.splitNumRegx);
                    p = j.formatNum("1," + (parseInt(q[0], 10) - 3) + ",0," + q[1])
                }
                if (p && (j.compareNums(p, j.formatNum("1,3")) < 0 || j.compareNums(p, j.formatNum("2")) >= 0)) {
                    p = 0
                }
                return p
            },
            query: function() {
                var t = this,
                    s = a,
                    r, p = 0,
                    q = t.hasRun || !s.navigator.mimeObj;
                t.hasRun = 1;
                if (q) {
                    return t
                }
                if (!p || j.dbug) {
                    r = t.getPlatformNum();
                    if (r) {
                        p = r
                    }
                }
                if (!p || j.dbug) {
                    r = t.getPluginNum();
                    if (r) {
                        p = r
                    }
                }
                if (p) {
                    t.version = j.formatNum(p)
                }
                return t
            }
        },
        applet: {
            codebase: {
                isMin: function(q, p) {
                    this.$$ = a;
                    return j.codebase.isMin(this, q, p)
                },
                search: function(p) {
                    this.$$ = a;
                    return j.codebase.search(this, p)
                },
                ParamTags: '<param name="code" value="A9999.class" /><param name="codebase_lookup" value="false" />',
                DIGITMAX: [
                    [15, 128],
                    [6, 0, 512], 0, [1, 5, 2, 256], 0, [1, 4, 1, 1],
                    [1, 4, 0, 64],
                    [1, 3, 2, 32]
                ],
                DIGITMIN: [1, 0, 0, 0],
                Upper: ["999", "10", "5,0,20", "1,5,0,20", "1,4,1,20", "1,4,1,2", "1,4,1", "1,4"],
                Lower: ["10", "5,0,20", "1,5,0,20", "1,4,1,20", "1,4,1,2", "1,4,1", "1,4", "0"],
                convert: [function(r, q) {
                    return q ? [parseInt(r[0], 10) > 1 ? "99" : parseInt(r[1], 10) + 3 + "", r[3], "0", "0"] : ["1", parseInt(r[0], 10) - 3 + "", "0", r[1]]
                }, function(r, q) {
                    return q ? [r[1], r[2], r[3] + "0", "0"] : ["1", r[0], r[1], r[2].substring(0, r[2].length - 1 || 1)]
                }, 0, function(r, q) {
                    return q ? [r[0], r[1], r[2], r[3] + "0"] : [r[0], r[1], r[2], r[3].substring(0, r[3].length - 1 || 1)]
                }, 0, 1, function(r, q) {
                    return q ? [r[0], r[1], r[2], r[3] + "0"] : [r[0], r[1], r[2], r[3].substring(0, r[3].length - 1 || 1)]
                }, 1]
            },
            results: [
                [null, null],
                [null, null],
                [null, null],
                [null, null],
                [null, null]
            ],
            active: [0, 0, 0, 0, 0],
            IDforJAVAtoJS: [],
            IDforJStoJAVA: [],
            saveData: function(v, q, w, A, x, t) {
                var s = a,
                    r = s.applet,
                    B = 0,
                    y = -1,
                    p = "",
                    z = "";
                try {
                    y = parseInt(v + "", 10)
                } catch (u) {}
                try {
                    p = j.getNum(w + "")
                } catch (u) {}
                try {
                    z = A + ""
                } catch (u) {}
                x = (x === "true" ? true : (x === "false" ? false : x));
                if (y <= 0 || y >= r.results.length || r.results[y][0]) {} else {
                    if ((q && !s.JSTOJAVABRIDGE) || (!q && !s.JAVATOJSBRIDGE)) {} else {
                        if (!j.isStrNum(p) || (j.dbug && s.OTF < 3)) {} else {
                            r.results[y][0] = p;
                            r.results[y][1] = z;
                            r.results[y][2] = x;
                            if (t) {
                                r.results[y][3] = t
                            }
                            if (x === true) {
                                s.info.setPlugin2Status(3)
                            }
                            if (x === false) {
                                s.info.setPlugin2Status(-3)
                            }
                            r.active[y] = 2;
                            if (q) {
                                r.IDforJStoJAVA.push(y)
                            } else {
                                r.IDforJAVAtoJS.push(y);
                                if (!j.dbug && s.JAVATOJSBRIDGE) {
                                    s.JSTOJAVABRIDGE = 0
                                }
                            }
                            B = 1
                        }
                    }
                }
                return B
            },
            getResult: function() {
                var q = this,
                    s = q.results,
                    p, r = [];
                for (p = s.length - 1; p >= 0; p--) {
                    r = s[p];
                    if (r[0]) {
                        break
                    }
                }
                r = [].concat(r);
                return r
            },
            DummySpanTagHTML: 0,
            HTML: [0, 0, 0, 0, 0],
            DummyObjTagHTML: 0,
            DummyObjTagHTML2: 0,
            allowed: [1, 1, 1, 1, 1],
            VerifyTagsHas: function(q) {
                var r = this,
                    p;
                for (p = 0; p < r.allowed.length; p++) {
                    if (r.allowed[p] === q) {
                        return 1
                    }
                }
                return 0
            },
            saveAsVerifyTagsArray: function(r) {
                var q = this,
                    p;
                if (j.isArray(r)) {
                    for (p = 1; p < q.allowed.length; p++) {
                        if (r.length > p - 1 && j.isNum(r[p - 1])) {
                            if (r[p - 1] < 0) {
                                r[p - 1] = 0
                            }
                            if (r[p - 1] > 3) {
                                r[p - 1] = 3
                            }
                            q.allowed[p] = r[p - 1]
                        }
                    }
                    q.allowed[0] = q.allowed[3];
                }
            },
            setVerifyTagsArray: function(r) {
                var q = this,
                    p = a;
                if (p.getVersionDone === null) {
                    q.saveAsVerifyTagsArray(p.getVerifyTagsDefault())
                }
                if (j.dbug) {
                    q.saveAsVerifyTagsArray([3, 3, 3])
                } else {
                    if (r) {
                        q.saveAsVerifyTagsArray(r)
                    }
                }
            },
            isDisabled: {
                single: function(q) {
                    var p = this;
                    if (p.all()) {
                        return 1
                    }
                    if (q == 1) {
                        return !j.DOM.isEnabled.objectTag()
                    }
                    if (q == 2) {
                        return p.AppletTag()
                    }
                    if (q === 0) {
                        return j.codebase.isDisabled()
                    }
                    if (q == 3) {
                        return !j.DOM.isEnabled.objectTagUsingActiveX()
                    }
                    return 1
                },
                all_: null,
                all: function() {
                    var r = this,
                        t = a,
                        q = t.navigator,
                        p, s = j.browser;
                    if (r.all_ === null) {
                        if ((s.isOpera && j.compareNums(s.verOpera, "13,0,0,0") < 0 && !q.javaEnabled()) || (r.AppletTag() && !j.DOM.isEnabled.objectTag()) || (!q.mimeObj && !s.isIE)) {
                            p = 1
                        } else {
                            p = 0
                        }
                        r.all_ = p
                    }
                    return r.all_
                },
                AppletTag: function() {
                    var q = a,
                        p = q.navigator;
                    return j.browser.isIE ? !p.javaEnabled() : 0
                },
                VerifyTagsDefault_1: function() {
                    var q = j.browser,
                        p = 1;
                    if (q.isIE && !q.ActiveXEnabled) {
                        p = 0
                    }
                    if ((q.isIE && q.verIE < 9) || (q.verGecko && j.compareNums(q.verGecko, j.formatNum("2")) < 0) || (q.isSafari && (!q.verSafari || j.compareNums(q.verSafari, j.formatNum("4")) < 0)) || (q.isOpera && j.compareNums(q.verOpera, j.formatNum("11")) < 0)) {
                        p = 0
                    }
                    return p
                }
            },
            can_Insert_Query: function(s) {
                var q = this,
                    r = q.results[0][0],
                    p = q.getResult()[0];
                if (q.HTML[s] || (s === 0 && r !== null && !q.isRange(r)) || (s === 0 && p && !q.isRange(p))) {
                    return 0
                }
                return !q.isDisabled.single(s)
            },
            can_Insert_Query_Any: function() {
                var q = this,
                    p;
                for (p = 0; p < q.results.length; p++) {
                    if (q.can_Insert_Query(p)) {
                        return 1
                    }
                }
                return 0
            },
            should_Insert_Query: function(s) {
                var r = this,
                    t = r.allowed,
                    q = a,
                    p = r.getResult()[0];
                p = p && (s > 0 || !r.isRange(p));
                if (!r.can_Insert_Query(s) || t[s] === 0) {
                    return 0
                }
                if (t[s] == 3 || (t[s] == 2.8 && !p)) {
                    return 1
                }
                if (!q.nonAppletDetectionOk(q.version0)) {
                    if (t[s] == 2 || (t[s] == 1 && !p)) {
                        return 1
                    }
                }
                return 0
            },
            should_Insert_Query_Any: function() {
                var q = this,
                    p;
                for (p = 0; p < q.allowed.length; p++) {
                    if (q.should_Insert_Query(p)) {
                        return 1
                    }
                }
                return 0
            },
            query: function(s) {
                var p = this,
                    r = a,
                    v = null,
                    y = null,
                    w = null,
                    q, t = p.HTML[s];
                var x = r.NOTF.queryReadyState(s);
                if (x != 1) {
                    return
                }
                q = t.obj();
                try {
                    v = q.getVersion() + "";
                    y = q.getVendor() + "";
                    q.statusbar(j.win.loaded ? " " : " ");
                    w = q.isPlugin2()
                } catch (u) {}
                if (p.saveData(s, 1, v, y, w)) {}
            },
            isRange: function(p) {
                return (/^[<>]/).test(p || "") ? (p.charAt(0) == ">" ? 1 : -1) : 0
            },
            setRange: function(q, p) {
                return (q ? (q > 0 ? ">" : "<") : "") + (j.isString(p) ? p : "")
            },
            insertJavaTag: function(t, C, u, D, B) {
                var z = a,
                    w = 0,
                    G = "A.class",
                    q = j.file.getValid(z),
                    s = q.name + q.ext,
                    F = q.path;
                if (window.top[j.name] !== j) {
                    window.top[j.name] = j
                }
                var x = ["archive", s, "code", G],
                    A = (D ? ["width", D] : []).concat(B ? ["height", B] : []),
                    y = ["mayscript", "true"],
                    E = ["scriptable", "true", "codebase_lookup", "false"].concat(y),
                    v = ["plugindetect", t],
                    p = z.navigator,
                    r = !j.browser.isIE && p.mimeObj && p.mimeObj.type ? p.mimeObj.type : z.mimeType[0];
                if (t == 1) {
                    w = j.browser.isIE ? j.DOM.insert("object", ["type", r].concat(A), ["codebase", F].concat(x).concat(E).concat(v), u, z, 0, C) : j.DOM.insert("object", ["type", r].concat(A), ["codebase", F].concat(x).concat(E).concat(v), u, z, 0, C)
                }
                if (t == 2) {
                    w = j.browser.isIE ? j.DOM.insert("applet", ["alt", u].concat(y).concat(x).concat(A), ["codebase", F].concat(E).concat(v), u, z, 0, C) : j.DOM.insert("applet", ["codebase", F, "alt", u].concat(y).concat(x).concat(A), [].concat(E).concat(v), u, z, 0, C)
                }
                if (t == 3) {
                    w = j.browser.isIE ? j.DOM.insert("object", ["classid", z.classID].concat(A), ["codebase", F].concat(x).concat(E).concat(v), u, z, 0, C) : j.DOM.insert()
                }
                if (t == 4) {
                    w = j.DOM.insert("embed", ["codebase", F].concat(x).concat(["type", r]).concat(E).concat(A).concat(v), [], u, z, 0, C)
                }
                if (w) {
                    w.tagID = t
                } else {
                    w = j.DOM.insert()
                }
                return w
            },
            insertIframe: function(p) {
                return j.DOM.iframe.insert(99, p)
            },
            insert_Query_Any: function(z) {
                var q = this,
                    r = a,
                    B = j.DOM,
                    v = q.results,
                    A = q.HTML,
                    p = B.altHTML,
                    u, t, w = j.file.getValid(r);
                if (q.should_Insert_Query(0)) {
                    if (r.OTF < 2) {
                        r.OTF = 2
                    }
                    v[0] = [0, 0];
                    u = z ? q.codebase.isMin(z, true) : q.codebase.search(true);
                    if (u) {
                        v[0][0] = z ? q.setRange(u, z) : u
                    }
                    q.active[0] = u ? 1.5 : -1
                }
                if (!w) {
                    return q.getResult()
                }
                if (!q.DummySpanTagHTML) {
                    t = q.insertIframe("applet.DummySpanTagHTML");
                    q.DummySpanTagHTML = B.insert("", [], [], p, 0, 0, t);
                    B.iframe.close(t)
                }
                var s = [1, 2],
                    y;
                s = s.concat([3]);
                for (y = 0; y < s.length; y++) {
                    if (q.should_Insert_Query(s[y])) {
                        if (r.OTF < 2) {
                            r.OTF = 2
                        }
                        v[s[y]] = [0, 0];
                        t = q.insertIframe("applet.HTML[" + s[y] + "]");
                        A[s[y]] = q.insertJavaTag(s[y], t, p);
                        B.iframe.close(t);
                        q.query(s[y])
                    }
                }
                if (B.isEnabled.objectTag()) {
                    if (!q.DummyObjTagHTML && (A[1] || A[2])) {
                        t = q.insertIframe("applet.DummyObjTagHTML");
                        q.DummyObjTagHTML = B.insert("object", ["type", r.mimeType_dummy], [], p, 0, 0, t);
                        B.iframe.close(t)
                    }
                    if (!q.DummyObjTagHTML2 && A[3]) {
                        t = q.insertIframe("applet.DummyObjTagHTML2");
                        q.DummyObjTagHTML2 = B.insert("object", ["classid", r.classID_dummy], [], p, 0, 0, t);
                        B.iframe.close(t)
                    }
                }
                r.NOTF.init();
                return q.getResult()
            }
        },
        NOTF: {
            count: 0,
            count2: 0,
            countMax: 25,
            intervalLength: 250,
            init: function() {
                var q = this,
                    p = a;
                if (p.OTF < 3 && q.shouldContinueQuery()) {
                    p.OTF = 3;
                    j.ev.setTimeout(q.onIntervalQuery, q.intervalLength);
                }
            },
            allHTMLloaded: function() {
                return this.allDummyHTMLloaded() && this.allJavaHTMLloaded() ? 1 : 0
            },
            allJavaHTMLloaded: function() {
                var r = a.applet,
                    q, p = r.HTML;
                for (q = 0; q < p.length; q++) {
                    if (p[q] && p[q].loaded !== null && !p[q].loaded) {
                        return 0
                    }
                }
                return 1
            },
            allDummyHTMLloaded: function() {
                var r = a.applet,
                    q, p = [r.DummySpanTagHTML, r.DummyObjTagHTML, r.DummyObjTagHTML2];
                for (q = 0; q < p.length; q++) {
                    if (p[q] && p[q].loaded !== null && !p[q].loaded) {
                        return 0
                    }
                }
                return 1
            },
            queryReadyState: function(t) {
                var y = this,
                    s = a,
                    p = s.applet,
                    u = p.HTML[t],
                    q = p.results[t],
                    w, r, v, A = 0,
                    x = 0;
                var D = 10,
                    B = 5;
                if (q[0]) {
                    return 2
                }
                if (!u || !y.allHTMLloaded()) {
                    return 0
                }
                if (!u.qrs) {
                    u.qrs = {
                        result: null,
                        count: y.count,
                        count2: y.count
                    }
                }
                var C = u.qrs;
                if (C.result == 2 || (C.result !== null && y.count === C.count)) {
                    return C.result
                }
                C.count = y.count;
                if (C.count - C.count2 > (s.JAVATOJSBRIDGE ? D : 0) + B) {
                    C.result = 2;
                    return 2
                }
                if (!s.JAVATOJSBRIDGE) {
                    return 1
                }
                r = u.obj();
                w = u.readyState();
                if ((j.isNum(w) && w != 4) || !r) {
                    C.result = 0;
                    return 0
                }
                try {
                    v = r.dummyAppletProp()
                } catch (z) {
                    A = z;
                }
                if (q[0]) {
                    C.result = 2;
                    return 2
                }
                if (!s.JSTOJAVABRIDGE || C.count - C.count2 < D) {
                    C.result = 0;
                    return 0
                }
                try {
                    v = r.getVersion()
                } catch (z) {
                    x = z;
                }
                if (x) {
                    if (A && A !== x && A.name !== x.name) {
                        C.result = 2;
                        s.JSTOJAVABRIDGE = 0
                    } else {
                        C.result = 0
                    }
                    return C.result
                }
                C.result = 1;
                return 1
            },
            shouldContinueQuery: function() {
                var t = this,
                    s = a,
                    r = s.applet,
                    q, p;
                if (t.allHTMLloaded()) {
                    p = 0;
                    for (q = 0; q < r.results.length; q++) {
                        if (r.HTML[q] && t.queryReadyState(q) != 2) {
                            p = 1;
                            break
                        }
                    }
                    if (!p) {
                        return p
                    }
                }
                p = 0;
                for (q = 0; q < r.results.length; q++) {
                    if (r.HTML[q]) {
                        if (!r.results[q][0] && (r.allowed[q] >= 2 || (r.allowed[q] == 1 && !r.getResult()[0])) && (!t.count || t.isAppletActive(q) >= 0)) {
                            p = 1
                        }
                    }
                }
                return p
            },
            isJavaActive: function(s) {
                var u = this,
                    r = a,
                    p, q, t = -9;
                for (p = 0; p < r.applet.HTML.length; p++) {
                    q = u.isAppletActive(p, s);
                    if (q > t) {
                        t = q
                    }
                }
                return t
            },
            isAppletActive: function(t, u) {
                var v = this,
                    q = a,
                    A = q.navigator,
                    p = q.applet,
                    w = p.HTML[t],
                    s = p.active,
                    z, r = 0,
                    y, B = s[t];
                if (u || B >= 1.5 || !w || !w.span()) {
                    return B
                }
                y = j.DOM.getTagStatus(w, p.DummySpanTagHTML, p.DummyObjTagHTML, p.DummyObjTagHTML2, v.count);
                for (z = 0; z < s.length; z++) {
                    if (s[z] > 0) {
                        r = 1
                    }
                }
                if (y != 1) {
                    B = y
                } else {
                    if (j.browser.isIE || (q.version0 && A.javaEnabled() && A.mimeObj && (w.tagName == "object" || r))) {
                        B = 1
                    } else {
                        B = 0
                    }
                }
                s[t] = B;
                return B
            },
            onIntervalQuery: function() {
                var q = a.NOTF,
                    p;
                q.count++;
                if (a.OTF == 3) {
                    p = q.queryAllApplets();
                    if (!q.shouldContinueQuery()) {
                        q.queryCompleted(p)
                    }
                }
                if (a.OTF == 3) {
                    j.ev.setTimeout(q.onIntervalQuery, q.intervalLength)
                }
            },
            queryAllApplets: function() {
                var t = this,
                    s = a,
                    r = s.applet,
                    q, p;
                for (q = 0; q < r.results.length; q++) {
                    r.query(q)
                }
                p = r.getResult();
                return p
            },
            queryCompleted: function(p) {
                var r = this,
                    q = a;
                if (q.OTF >= 4) {
                    return
                }
                q.OTF = 4;
                r.isJavaActive();
                q.setPluginStatus(p[0], p[1], 0);
                j.ev.callArray(q.DoneHndlrs);
            }
        }
    };
    PluginDetect.addPlugin("java", a);
})();