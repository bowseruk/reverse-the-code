/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ WindowsMediaPlayer ]
[ isMinVersion getVersion hasMimeType getInfo onDetectionDone ]
[ AllowActiveX BetterIE ]
*/
(function() {
    j = PluginDetect;
    var o = {
        setPluginStatus: function(p, r) {
            var q = this;
            if (p) {
                q.version = j.formatNum(p)
            }
            q.installed = q.version ? 1 : (r ? 0 : -1);
            q.getVersionDone = q.installed === 0 ? 0 : 1;
        },
        getVersion: function(t, q) {
            var r = this,
                s, p = null;
            if ((!s || j.dbug) && r.nav.query().installed) {
                s = 1
            }
            if ((!s || j.dbug) && r.axo.query().installed) {
                s = 1
            }
            if ((!p || j.dbug) && r.axo.query().version) {
                p = r.axo.version
            }
            if (((!s && !p) || q || j.dbug) && r.FirefoxPlugin.query().version) {
                s = 1;
                p = r.FirefoxPlugin.version
            }
            r.setPluginStatus(p, s)
        },
        mimeType: ["application/x-ms-wmp", "application/asx", "application/x-mplayer2", "video/x-ms-asf", "video/x-ms-wm", "video/x-ms-asf-plugin"],
        find: ["Microsoft.*Windows\\s*Media\\s*Player.*Firefox.*Plug-?in", "Windows\\s*Media\\s*Player\\s*Plug-?in\\s*Dynamic\\s*Link\\s*Library", "Flip4Mac.*Windows\\s*Media.*Plug-?in|Flip4Mac.*WMV.*Plug-?in"],
        avoid: "Totem|VLC|RealPlayer|Helix",
        plugins: ["Microsoft" + String.fromCharCode(174) + " Windows Media Player Firefox Plugin", "Windows Media Player Plug-in Dynamic Link Library"],
        nav: {
            hasRun: 0,
            installed: 0,
            query: function() {
                var s = this,
                    p = o,
                    r, q = s.hasRun || !j.hasMimeType(p.mimeType);
                s.hasRun = 1;
                if (q) {
                    return s
                }
                r = j.pd.findNavPlugin({
                    find: p.find.join("|"),
                    avoid: p.avoid,
                    mimes: p.mimeType,
                    plugins: p.plugins
                });
                if (r) {
                    s.installed = 1
                }
                return s
            }
        },
        FirefoxPlugin: {
            hasRun: 0,
            version: null,
            isDisabled: function() {
                var p = this,
                    r = o,
                    q = j.browser;
                if (p.hasRun || (q.isGecko && j.compareNums(q.verGecko, j.formatNum("1.8")) < 0) || (q.isOpera && j.compareNums(q.verOpera, j.formatNum("10")) < 0) || j.DOM.isEnabled.objectTagUsingActiveX() || !j.hasMimeType(r.mimeType) || !j.pd.findNavPlugin({
                        find: r.find[0],
                        avoid: r.avoid,
                        mimes: r.mimeType,
                        plugins: r.plugins[0]
                    })) {
                    return 1
                }
                return 0
            },
            query: function() {
                var q = this,
                    r = o,
                    p, s = q.isDisabled();
                q.hasRun = 1;
                if (s) {
                    return q
                }
                p = j.pd.getPROP(j.DOM.insert("object", ["type", j.hasMimeType(r.mimeType).type, "data", ""], ["src", ""], "", r).obj(), "versionInfo");
                if (p) {
                    q.version = j.getNum(p)
                }
                return q
            }
        },
        axo: {
            hasRun: 0,
            installed: null,
            version: null,
            progID: ["WMPlayer.OCX", "WMPlayer.OCX.7"],
            classID: "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",
            query: function() {
                var s = this,
                    t, p, q, r = !s.hasRun;
                s.hasRun = 1;
                if (r) {
                    for (p = 0; p < s.progID.length; p++) {
                        t = j.getAXO(s.progID[p]);
                        if (t) {
                            s.installed = 1;
                            q = j.pd.getPROP(t, "versionInfo", 0);
                            if (q) {
                                q = j.getNum(q)
                            }
                            if (q) {
                                s.version = q;
                                if (!j.dbug) {
                                    break
                                }
                            }
                        }
                    }
                }
                return s
            }
        },
        result: 0,
        getInfo: function() {
            var q = this,
                p = q.installed;
            if (!q.result) {
                q.result = {
                    ActiveXPlugin: !!(q.axo.version),
                    FirefoxPlugin: !!((p === 0 || p == 1) && j.pd.findNavPlugin({
                        find: q.find[0],
                        avoid: q.avoid,
                        mimes: q.mimeType,
                        plugins: q.plugins[0]
                    })),
                    DllPlugin: !!((p === 0 || p == 1) && j.pd.findNavPlugin({
                        find: q.find[1],
                        avoid: q.avoid,
                        mimes: q.mimeType,
                        plugins: q.plugins[1]
                    })),
                    Flip4macPlugin: !!((p === 0 || p == 1) && j.pd.findNavPlugin({
                        find: q.find[2],
                        avoid: q.avoid,
                        mimes: q.mimeType,
                        plugins: 1
                    }))
                };
                q.result.Scriptable = !!(p == 1 || q.result.FirefoxPlugin)
            }
            return q.result
        }
    };
    j.addPlugin("windowsmediaplayer", o);
})();