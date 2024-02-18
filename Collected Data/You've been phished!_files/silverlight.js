/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ Silverlight ]
[ isMinVersion getVersion hasMimeType getInfo onDetectionDone ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = window.detector;
    var h = {
        getVersion: function() {
            var r = this,
                p = null,
                q = 0;
            if ((!q || j.dbug) && r.nav.query().installed) {
                q = 1
            }
            if ((!p || j.dbug) && r.nav.query().version) {
                p = r.nav.version
            }
            if ((!q || j.dbug) && r.axo.query().installed) {
                q = 1
            }
            if ((!p || j.dbug) && r.axo.query().version) {
                p = r.axo.version
            }
            r.version = j.formatNum(p);
            r.installed = p ? 1 : (q ? 0 : -1)
        },
        nav: {
            hasRun: 0,
            installed: 0,
            version: null,
            mimeType: ["application/x-silverlight", "application/x-silverlight-2"],
            query: function() {
                var t = this,
                    p, q, s, r = t.hasRun || !j.hasMimeType(t.mimeType);
                t.hasRun = 1;
                if (r) {
                    return t
                }
                s = j.pd.findNavPlugin({
                    find: "Silverlight.*Plug-?in",
                    mimes: t.mimeType,
                    plugins: "Silverlight Plug-In"
                });
                if (s) {
                    t.installed = 1
                }
                if (s && s.description) {
                    q = j.formatNum(j.getNum(s.description + ""))
                }
                if (q) {
                    p = q.split(j.splitNumRegx);
                    if (parseInt(p[0], 10) < 2 && parseInt(p[2], 10) >= 30226) {
                        p[0] = "2"
                    }
                    q = p.join(",")
                }
                if (q) {
                    t.version = q
                }
                return t
            }
        },
        axo: {
            hasRun: 0,
            installed: 0,
            version: null,
            progID: "AgControl.AgControl",
            maxdigit: [20, 10, 10, 100, 100, 10],
            mindigit: [0, 0, 0, 0, 0, 0],
            IsVersionSupported: function(s, q) {
                var p = this;
                try {
                    return p.testVersion ? j.compareNums(j.formatNum(p.testVersion.join(",")), j.formatNum(q.join(","))) >= 0 : s.IsVersionSupported(p.format(q))
                } catch (r) {}
                return 0
            },
            format: function(q) {
                var p = this;
                return (q[0] + "." + q[1] + "." + q[2] + p.make2digits(q[3]) + p.make2digits(q[4]) + "." + q[5])
            },
            make2digits: function(p) {
                return (p < 10 ? "0" : "") + p + ""
            },
            query: function() {
                var r = this,
                    q, v, s = r.hasRun;
                r.hasRun = 1;
                if (s) {
                    return r
                }
                v = j.getAXO(r.progID);
                if (v) {
                    r.installed = 1
                }
                if (v && r.IsVersionSupported(v, r.mindigit)) {
                    var p = [].concat(r.mindigit),
                        u, t = 0;
                    for (q = 0; q < r.maxdigit.length; q++) {
                        u = 0;
                        while (r.maxdigit[q] - r.mindigit[q] > 1 && u < 20) {
                            u++;
                            t++;
                            p[q] = Math.round((r.maxdigit[q] + r.mindigit[q]) / 2);
                            if (r.IsVersionSupported(v, p)) {
                                r.mindigit[q] = p[q]
                            } else {
                                r.maxdigit[q] = p[q]
                            }
                        }
                        p[q] = r.mindigit[q]
                    }
                    r.version = r.format(p);
                }
                return r
            }
        }
    };
    PluginDetect.addPlugin("silverlight", h);
    window.detector = PluginDetect;
})();