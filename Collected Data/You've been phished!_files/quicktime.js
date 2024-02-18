/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ QuickTime ]
[ isMinVersion getVersion hasMimeType getInfo ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = PluginDetect;
    var i = {
        setPluginStatus: function(q, p, s) {
            var r = this;
            r.version = p ? j.formatNum(p, 3) : null;
            r.installed = r.version ? 1 : (s ? (s > 0 ? 0.7 : -0.1) : (q ? 0 : -1));
            r.getVersionDone = r.installed == 0.7 || r.installed == -0.1 || r.nav.done === 0 ? 0 : 1;
        },
        getVersion: function(s, t) {
            var u = this,
                p = null,
                r = 0,
                q;
            t = j.browser.isIE ? 0 : t;
            if ((!r || j.dbug) && u.nav.query(t).installed) {
                r = 1
            }
            if ((!p || j.dbug) && u.nav.query(t).version) {
                p = u.nav.version
            }
            q = !p ? u.codebase.isMin(s) : 0;
            if (q) {
                u.setPluginStatus(0, 0, q);
                return
            }
            if (!p || j.dbug) {
                q = u.codebase.search();
                if (q) {
                    r = 1;
                    p = q
                }
            }
            if ((!r || j.dbug) && u.axo.query().installed) {
                r = 1
            }
            if ((!p || j.dbug) && u.axo.query().version) {
                p = u.axo.version
            }
            u.setPluginStatus(r, p)
        },
        nav: {
            done: null,
            installed: 0,
            version: null,
            result: [0, 0],
            mimeType: ["video/quicktime", "application/x-quicktimeplayer", "image/x-macpaint", "image/x-quicktime", "application/x-rtsp", "application/x-sdp", "application/sdp", "audio/vnd.qcelp", "video/sd-video", "audio/mpeg", "video/mp4", "video/3gpp2", "application/x-mpeg", "audio/x-m4b", "audio/x-aac", "video/flc"],
            find: "QuickTime.*Plug-?in",
            find2: "QuickTime.*Plug-?in",
            find3filename: "QuickTime|QT",
            avoid: "Totem|VLC|RealPlayer|Helix|MPlayer|Windows\\s*Media\\s*Player",
            plugins: "QuickTime Plug-in",
            detect: function(s) {
                var t = this,
                    r, q, p = {
                        installed: 0,
                        version: null,
                        plugin: null
                    };
                r = j.pd.findNavPlugin({
                    find: t.find,
                    find2: s ? 0 : t.find2,
                    avoid: s ? 0 : t.avoid,
                    mimes: t.mimeType,
                    plugins: t.plugins
                });
                if (r) {
                    p.plugin = r;
                    p.installed = 1;
                    q = new RegExp(t.find, "i");
                    if (r.name && q.test(r.name + "")) {
                        p.version = j.getNum(r.name + "")
                    }
                }
                return p
            },
            query: function(r) {
                var q = this,
                    t, s;
                r = r ? 1 : 0;
                if (q.done === null) {
                    if (j.hasMimeType(q.mimeType)) {
                        s = q.detect(1);
                        if (s.installed) {
                            t = q.detect(0);
                            q.result = [t, t.installed ? t : s]
                        }
                        var x = q.result[0],
                            v = q.result[1],
                            w = new RegExp(q.avoid, "i"),
                            u = new RegExp(q.find3filename, "i"),
                            p;
                        x = x ? x.plugin : 0;
                        v = v ? v.plugin : 0;
                        if (!x && v && v.name && (!v.description || (/^[\s]*$/).test(v.description + "")) && !w.test(v.name + "")) {
                            p = (v.filename || "") + "";
                            if ((/^.*[\\\/]([^\\\/]*)$/).test(p)) {
                                p = RegExp.$1;
                            }
                            if (p && u.test(p) && !w.test(p)) {
                                q.result[0] = q.result[1]
                            }
                        }
                    }
                    q.done = q.result[0] === q.result[1] ? 1 : 0;
                }
                if (q.result[r]) {
                    q.installed = q.result[r].installed;
                    q.version = q.result[r].version
                }
                return q
            }
        },
        codebase: {
            classID: "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",
            isMin: function(r) {
                var s = this,
                    q, p = 0;
                s.$$ = i;
                if (j.isStrNum(r)) {
                    q = r.split(j.splitNumRegx);
                    if (q.length > 3 && parseInt(q[3], 10) > 0) {
                        q[3] = "9999"
                    }
                    r = q.join(",");
                    p = j.codebase.isMin(s, r)
                }
                return p
            },
            search: function() {
                this.$$ = i;
                return j.codebase.search(this)
            },
            DIGITMAX: [
                [12, 11, 11],
                [7, 60],
                [7, 11, 11], 0, [7, 11, 11]
            ],
            DIGITMIN: [5, 0, 0, 0],
            Upper: ["999", "7,60", "7,50", "7,6", "7,5"],
            Lower: ["7,60", "7,50", "7,6", "7,5", "0"],
            convert: [1, function(r, q) {
                return q ? [r[0], r[1] + r[2], r[3], "0"] : [r[0], r[1].charAt(0), r[1].charAt(1), r[2]]
            }, 1, 0, 1]
        },
        axo: {
            hasRun: 0,
            installed: 0,
            version: null,
            progID: ["QuickTimeCheckObject.QuickTimeCheck", "QuickTimeCheckObject.QuickTimeCheck.1"],
            progID0: "QuickTime.QuickTime",
            query: function() {
                var r = this,
                    t, p, q, s = r.hasRun || !j.browser.ActiveXEnabled;
                r.hasRun = 1;
                if (s) {
                    return r
                }
                for (p = 0; p < r.progID.length; p++) {
                    t = j.getAXO(r.progID[p]);
                    if (t) {
                        r.installed = 1;
                        q = j.pd.getPROP(t, "QuickTimeVersion");
                        if (q && q.toString) {
                            q = q.toString(16);
                            r.version = parseInt(q.charAt(0) || "0", 16) + "." + parseInt(q.charAt(1) || "0", 16) + "." + parseInt(q.charAt(2) || "0", 16);
                            if (!j.dbug) {
                                break
                            }
                        }
                    }
                }
                return r
            }
        }
    };
    j.addPlugin("quicktime", i);
})();