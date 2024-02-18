/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ RealPlayer ]
[ isMinVersion getVersion hasMimeType getInfo onDetectionDone ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = PluginDetect;
    var n = {
        mimeType: ["audio/x-pn-realaudio-plugin", "audio/x-pn-realaudio"],
        classID: "clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA",
        setPluginStatus: function(r, p) {
            var s = this,
                q;
            if (p) {
                s.version = j.formatNum(j.getNum(p))
            }
            s.installed = s.version ? 1 : (r ? 0 : -1);
            q = s.installed == -1 || s.instance.version;
            q = q || s.axo.version;
            s.getVersionDone = q ? 1 : 0;
        },
        navObj: {
            hasRun: 0,
            installed: null,
            version: null,
            find: "RealPlayer.*Plug-?in",
            avoid: "Totem|QuickTime|Helix|VLC|Download",
            plugins: ["RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit) ", "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (64-bit) ", "RealPlayer Plugin"],
            query: function() {
                var q = this,
                    s = n,
                    r, p = !q.hasRun && j.hasMimeType(s.mimeType);
                q.hasRun = 1;
                if (p) {
                    r = j.pd.findNavPlugin({
                        find: q.find,
                        avoid: q.avoid,
                        mimes: s.mimeType,
                        plugins: q.plugins
                    });
                    q.installed = r ? 1 : 0;
                    r = j.getPluginFileVersion(r);
                    if (r && j.compareNums(j.formatNum(r), j.formatNum("15")) >= 0) {
                        q.version = r
                    }
                }
                return q
            }
        },
        JS: {
            hasRun: 0,
            version: null,
            regStr: "RealPlayer.*Version.*Plug-?in",
            mimetype: "application/vnd.rn-realplayer-javascript",
            q1: [
                [11, 0, 0],
                [999],
                [663],
                [663],
                [663],
                [660],
                [468],
                [468],
                [468],
                [468],
                [468],
                [468],
                [431],
                [431],
                [431],
                [372],
                [180],
                [180],
                [172],
                [172],
                [167],
                [114],
                [0]
            ],
            q3: [
                [6, 0],
                [12, 99],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 69],
                [12, 46],
                [12, 46],
                [12, 46],
                [11, 3006],
                [11, 2806],
                [11, 2806],
                [11, 2804],
                [11, 2804],
                [11, 2799],
                [11, 2749],
                [11, 2700]
            ],
            compare: function(t, s) {
                var r, q = t.length,
                    v = s.length,
                    p, u;
                for (r = 0; r < Math.max(q, v); r++) {
                    p = r < q ? t[r] : 0;
                    u = r < v ? s[r] : 0;
                    if (p > u) {
                        return 1
                    }
                    if (p < u) {
                        return -1
                    }
                }
                return 0
            },
            convertNum: function(t, q, w) {
                var v = this,
                    u, s, p, r = null;
                if (!t || !(u = j.formatNum(t))) {
                    return r
                }
                u = u.split(j.splitNumRegx);
                for (p = 0; p < u.length; p++) {
                    u[p] = parseInt(u[p], 10)
                }
                if (v.compare(u.slice(0, Math.min(q[0].length, u.length)), q[0]) !== 0) {
                    return r
                }
                s = u.length > q[0].length ? u.slice(q[0].length) : [];
                if (v.compare(s, q[1]) > 0 || v.compare(s, q[q.length - 1]) < 0) {
                    return r
                }
                for (p = q.length - 1; p >= 1; p--) {
                    if (p == 1) {
                        break
                    }
                    if (v.compare(q[p], s) === 0 && v.compare(q[p], q[p - 1]) === 0) {
                        break
                    }
                    if (v.compare(s, q[p]) >= 0 && v.compare(s, q[p - 1]) < 0) {
                        break
                    }
                }
                return w[0].join(".") + "." + w[p].join(".")
            },
            isEnabled: function() {
                var p = this;
                return !p.hasRun && j.OS == 1 && j.hasMimeType(p.mimetype) ? 1 : 0
            },
            query: function() {
                var u = this,
                    t, r, s, p = u.isEnabled();
                u.hasRun = 1;
                if (p) {
                    r = j.pd.findNavPlugin({
                        find: u.regStr,
                        mimes: u.mimetype
                    });
                    if (r) {
                        t = j.formatNum(j.getNum(r.description))
                    }
                    if (t) {
                        var q = t.split(j.splitNumRegx);
                        s = 1;
                        if (u.compare(q, [6, 0, 12, 200]) < 0) {
                            s = -1
                        } else {
                            if (u.compare(q, [6, 0, 12, 1739]) <= 0 && u.compare(q, [6, 0, 12, 857]) >= 0) {
                                s = -1
                            }
                        }
                        if (s < 0) {
                            r = u.convertNum(t, u.q3, u.q1);
                            u.version = r ? r : t
                        }
                    }
                }
                return u
            }
        },
        instance: {
            hasRun: 0,
            version: null,
            HTML: null,
            isEnabled: function() {
                var q = this,
                    r = n,
                    p = 1;
                if (!j.DOM.isEnabled.objectTag()) {
                    p = 0
                } else {
                    if (j.dbug) {} else {
                        if (q.hasRun || j.DOM.isEnabled.objectTagUsingActiveX() || !j.hasMimeType(r.mimeType) || (j.browser.isGecko && j.compareNums(j.browser.verGecko, j.formatNum("1,8")) < 0) || (j.browser.isOpera && j.compareNums(j.browser.verOpera, j.formatNum("10")) < 0)) {
                            p = 0
                        }
                    }
                }
                return p
            },
            query: function() {
                var p = this,
                    t = n,
                    s, q = p.isEnabled();
                p.hasRun = 1;
                if (q) {
                    p.HTML = j.DOM.insert("object", ["type", t.mimeType[0]], ["src", "", "autostart", "false", "imagestatus", "false", "controls", "stopbutton"], "", t);
                    s = p.HTML.obj();
                    try {
                        p.version = j.getNum(s.GetVersionInfo())
                    } catch (r) {}
                    j.DOM.setStyle(s, ["display", "none"]);
                }
                return p
            }
        },
        axo: {
            hasRun: 0,
            installed: null,
            version: null,
            progID: ["rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer"],
            query: function() {
                var r = this,
                    t, p, q;
                if (!r.hasRun) {
                    r.hasRun = 1;
                    for (p = 0; p < r.progID.length; p++) {
                        t = j.getAXO(r.progID[p]);
                        if (t) {
                            r.installed = 1;
                            q = 0;
                            try {
                                q = t.GetVersionInfo() + ""
                            } catch (s) {}
                            if (q) {
                                r.version = q;
                                if (!j.dbug) {
                                    break
                                }
                            }
                        }
                    }
                }
                return r
            }
        },
        getVersion: function(s, q) {
            var t = this,
                p = null,
                r = 0;
            if ((!r || j.dbug) && t.axo.query().installed) {
                r = 1
            }
            if ((!p || j.dbug) && t.axo.query().version) {
                p = t.axo.version
            }
            if ((!r || j.dbug) && t.navObj.query().installed) {
                r = 1
            }
            if ((!p || j.dbug) && t.navObj.query().version) {
                p = t.navObj.version
            }
            if ((!p || j.dbug) && t.JS.query().version) {
                r = 1;
                p = t.JS.version
            }
            if (((!r && !p) || q || j.dbug) && t.instance.query().version) {
                r = 1;
                p = t.instance.version
            }
            t.setPluginStatus(r, p)
        }
    };
    j.addPlugin("realplayer", n);
})();