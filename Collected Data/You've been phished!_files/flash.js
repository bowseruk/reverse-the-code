/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ Flash ]
[ isMinVersion getVersion hasMimeType getInfo ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = PluginDetect;
    var e = {
        mimeType: "application/x-shockwave-flash",
        setPluginStatus: function(t, q, p) {
            var s = this,
                r;
            s.installed = q ? 1 : (t ? 0 : -1);
            s.precision = p;
            s.version = j.formatNum(q);
            r = s.installed == -1 || s.instance.version;
            r = r || s.axo.version;
            s.getVersionDone = r ? 1 : 0;
        },
        getPrecision: function(t) {
            if (j.isString(t)) {
                var q, s = "\\d+",
                    r = "[\\._,]",
                    p = [s, s, s, s];
                for (q = 4; q > 0; q--) {
                    if ((new RegExp(p.slice(0, q).join(r))).test(t)) {
                        return q
                    }
                }
            }
            return 0
        },
        getVersion: function(u, r) {
            var s = this,
                q = null,
                t = 0,
                p = 0;
            if ((!t || j.dbug) && s.navPlugin.query().installed) {
                t = 1
            }
            if ((!q || j.dbug) && s.navPlugin.query().version) {
                q = s.navPlugin.version;
                p = s.navPlugin.precision
            }
            if ((!t || j.dbug) && s.axo.query().installed) {
                t = 1
            }
            if ((!q || j.dbug) && s.axo.query().version) {
                q = s.axo.version;
                p = s.axo.precision
            }
            if (((!t && !q) || r || j.dbug) && s.instance.query().version) {
                t = 1;
                q = s.instance.version;
                p = s.instance.precision
            }
            s.setPluginStatus(t, q, p)
        },
        navPlugin: {
            hasRun: 0,
            installed: 0,
            precision: 0,
            version: null,
            getNum: function(q) {
                if (!q) {
                    return null
                }
                var p = /[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(q);
                return p ? p[0].replace(/[rRdD\.]/g, ",").replace(/\s/g, "") : null
            },
            query: function() {
                var s = this,
                    q = e,
                    p, t, r = s.hasRun || !j.hasMimeType(q.mimeType);
                s.hasRun = 1;
                if (r) {
                    return s
                }
                t = j.pd.findNavPlugin({
                    find: "Shockwave.*Flash",
                    mimes: q.mimeType,
                    plugins: ["Shockwave Flash"]
                });
                if (t) {
                    s.installed = 1;
                    if (t.description) {
                        p = s.getNum(t.description)
                    }
                }
                if (p) {
                    p = j.getPluginFileVersion(t, p)
                }
                if (p && /(\d+[_,]\d+[_,]\d+[_,]\d+)[^\d]+$/.test(t.filename)) {
                    p = j.getPluginFileVersion({
                        filename: RegExp.$1,
                        name: t.name,
                        description: t.description
                    }, p, 0, "filename")
                }
                if (p) {
                    s.version = p;
                    s.precision = q.getPrecision(p)
                }
                return s
            }
        },
        axo: {
            hasRun: 0,
            installed: 0,
            precision: 0,
            version: null,
            progID: "ShockwaveFlash.ShockwaveFlash",
            classID: "clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",
            query: function() {
                var r = this,
                    q, p, u, s = r.hasRun;
                r.hasRun = 1;
                if (s) {
                    return r
                }
                for (p = 0; p < 10; p++) {
                    u = j.getAXO(r.progID + (p ? "." + p : ""));
                    if (u) {
                        r.installed = 1;
                        q = 0;
                        try {
                            q = j.getNum(u.GetVariable("$version") + "");
                        } catch (t) {}
                        if (q) {
                            r.version = q;
                            r.precision = e.getPrecision(q);
                            if (!j.dbug) {
                                break
                            }
                        }
                    }
                }
                return r
            }
        },
        instance: {
            hasRun: 0,
            precision: 0,
            version: null,
            HTML: null,
            HTML2: null,
            isEnabled: function() {
                var q = this,
                    r = e,
                    p = 1;
                if (q.hasRun || j.DOM.isEnabled.objectTagUsingActiveX() || !j.DOM.isEnabled.objectTag() || !j.hasMimeType(r.mimeType)) {
                    p = 0
                }
                return p
            },
            query: function() {
                var p = this,
                    r = e,
                    s, q = p.isEnabled();
                p.hasRun = 1;
                if (q) {
                    p.HTML = j.DOM.insert("object", ["type", r.mimeType], ["play", "false", "menu", "false"], "", r);
                    try {
                        s = p.HTML.obj().GetVariable("$version") + "";
                        p.version = j.getNum(s);
                    } catch (t) {}
                    if (!p.version || j.dbug) {
                        p.HTML2 = j.DOM.insert("embed", ["type", r.mimeType, "play", "false", "menu", "false"], [], "", r);
                        try {
                            s = p.HTML2.obj().GetVariable("$version") + "";
                            p.version = j.getNum(s);
                        } catch (t) {}
                    }
                    p.precision = r.getPrecision(p.version);
                }
                return p
            }
        },
        getInfo: function() {
            var q = e,
                p = {
                    version: q.version,
                    precision: q.precision,
                    flashObjUsed: (q.instance.HTML2 && q.instance.HTML2.obj()) || (q.instance.HTML && q.instance.HTML.obj()) ? true : false
                };
            p.flashObjUsed = p.flashObjUsed || (q.axo.version ? true : false);
            return p
        }
    };
    PluginDetect.addPlugin("flash", e);
})();