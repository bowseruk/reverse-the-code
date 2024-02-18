/*
PluginDetect v0.9.1
www.pinlady.net/PluginDetect/license/
[ AdobeReader PDFjs ]
[ isMinVersion getVersion hasMimeType getInfo onDetectionDone ]
[ AllowActiveX ]
*/
(function() {
    j = PluginDetect;
    var c = {
        OTF: null,
        setPluginStatus: function() {
            var p = this,
                B = p.OTF,
                v = p.nav.detected,
                x = p.nav.version,
                z = p.nav.precision,
                C = z,
                u = x,
                s = v > 0;
            var H = p.axo.detected,
                r = p.axo.version,
                w = p.axo.precision,
                D = p.doc.detected,
                G = p.doc.version,
                t = p.doc.precision,
                E = p.doc2.detected,
                F = p.doc2.version,
                y = p.doc2.precision;
            u = F || u || r || G;
            C = y || C || w || t;
            s = E > 0 || s || H > 0 || D > 0;
            u = u || null;
            p.version = j.formatNum(u);
            p.precision = C;
            var q = -1;
            if (B == 3) {
                q = p.version ? 0.5 : -0.5
            } else {
                if (u) {
                    q = 1
                } else {
                    if (s) {
                        q = 0
                    } else {
                        if (H == -0.5 || D == -0.5) {
                            q = -0.15
                        } else {
                            if (j.browser.isIE && (!j.browser.ActiveXEnabled || j.browser.ActiveXFilteringEnabled)) {
                                q = -1.5
                            }
                        }
                    }
                }
            }
            p.installed = q;
            if (p.getVersionDone != 1) {
                var A = 1;
                if ((p.verify && p.verify.isEnabled()) || p.installed == 0.5 || p.installed == -0.5) {
                    A = 0
                } else {
                    if (p.doc2.isDisabled() == 1) {
                        A = 0
                    }
                }
                p.getVersionDone = A
            }
        },
        getVersion: function(s, r) {
            var p = this,
                q = 0,
                t = p.verify;
            if (p.getVersionDone === null) {
                p.OTF = 0;
                if (t) {
                    t.init()
                }
            }
            j.file.save(p, ".pdf", r);
            if (p.getVersionDone === 0) {
                p.doc2.insertHTMLQuery();
                p.setPluginStatus();
                return
            }
            if ((!q || j.dbug) && p.nav.query().version) {
                q = 1
            }
            if ((!q || j.dbug) && p.axo.query().version) {
                q = 1
            }
            if ((!q || j.dbug) && p.doc.query().version) {
                q = 1
            }
            if (1) {
                p.doc2.insertHTMLQuery()
            }
            p.setPluginStatus()
        },
        getPrecision: function(v, u, t) {
            if (j.isString(v)) {
                u = u || "";
                t = t || "";
                var q, s = "\\d+",
                    r = "[\\.]",
                    p = [s, s, s, s];
                for (q = 4; q > 0; q--) {
                    if ((new RegExp(u + p.slice(0, q).join(r) + t)).test(v)) {
                        return q
                    }
                }
            }
            return 0
        },
        nav: {
            detected: 0,
            version: null,
            precision: 0,
            mimeType: ["application/pdf", "application/vnd.adobe.pdfxml"],
            find: "Adobe.*PDF.*Plug-?in|Adobe.*Acrobat.*Plug-?in|Adobe.*Reader.*Plug-?in",
            plugins: ["Adobe Acrobat", "Adobe Acrobat and Reader Plug-in", "Adobe Reader Plugin"],
            query: function() {
                var r = this,
                    q, p = null;
                if (r.detected || !j.hasMimeType(r.mimeType)) {
                    return r
                }
                q = j.pd.findNavPlugin({
                    find: r.find,
                    mimes: r.mimeType,
                    plugins: r.plugins
                });
                r.detected = q ? 1 : -1;
                if (q) {
                    p = j.getNum(q.description) || j.getNum(q.name);
                    p = j.getPluginFileVersion(q, p);
                    if (!p) {
                        p = r.attempt3()
                    }
                    if (p) {
                        r.version = p;
                        r.precision = c.getPrecision(p)
                    }
                }
                return r
            },
            attempt3: function() {
                var p = null;
                if (j.OS == 1) {
                    if (j.hasMimeType("application/vnd.adobe.pdfxml")) {
                        p = "9"
                    } else {
                        if (j.hasMimeType("application/vnd.adobe.x-mars")) {
                            p = "8"
                        } else {
                            if (j.hasMimeType("application/vnd.adobe.xfdf")) {
                                p = "6"
                            }
                        }
                    }
                }
                return p
            }
        },
        activexQuery: function(w) {
            var u = "",
                t, q, s, r, p = {
                    precision: 0,
                    version: null
                };
            try {
                if (w) {
                    u = w.GetVersions() + "";
                }
            } catch (v) {}
            if (u && j.isString(u)) {
                t = /\=\s*[\d\.]+/g;
                r = u.match(t);
                if (r) {
                    for (q = 0; q < r.length; q++) {
                        s = j.formatNum(j.getNum(r[q]));
                        if (s && (!p.version || j.compareNums(s, p.version) > 0)) {
                            p.version = s
                        }
                    }
                    p.precision = c.getPrecision(u, "\\=\\s*")
                }
            }
            return p
        },
        axo: {
            detected: 0,
            version: null,
            precision: 0,
            progID: ["AcroPDF.PDF", "AcroPDF.PDF.1", "PDF.PdfCtrl", "PDF.PdfCtrl.5", "PDF.PdfCtrl.1"],
            progID_dummy: "AcroDUMMY.DUMMY",
            query: function() {
                var t = this,
                    q = c,
                    u, v, s, r, p, w;
                if (t.detected) {
                    return t
                }
                t.detected = -1;
                v = j.getAXO(t.progID_dummy);
                if (!v) {
                    w = j.errObj
                }
                for (p = 0; p < t.progID.length; p++) {
                    v = j.getAXO(t.progID[p]);
                    if (v) {
                        t.detected = 1;
                        u = q.activexQuery(v);
                        s = u.version;
                        r = u.precision;
                        if (!j.dbug && s) {
                            break
                        }
                    } else {
                        if (w && j.errObj && w !== j.errObj && w.message !== j.errObj.message) {
                            t.detected = -0.5
                        }
                    }
                }
                if (s) {
                    t.version = s
                }
                if (r) {
                    t.precision = r
                }
                return t
            }
        },
        doc: {
            detected: 0,
            version: null,
            precision: 0,
            classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",
            classID_dummy: "clsid:CA8A9780-280D-11CF-A24D-BA9876543210",
            DummySpanTagHTML: 0,
            HTML: 0,
            DummyObjTagHTML1: 0,
            DummyObjTagHTML2: 0,
            isDisabled: function() {
                var q = this,
                    p = 0;
                if (q.HTML) {
                    p = 1
                } else {
                    if (j.dbug) {} else {
                        if (!j.DOM.isEnabled.objectTagUsingActiveX()) {
                            p = 1
                        }
                    }
                }
                return p
            },
            query: function() {
                var y = this,
                    v = c,
                    p = j.DOM.altHTML,
                    r = 1,
                    s, x, w, t, u = 1,
                    q;
                if (y.isDisabled()) {
                    return y
                }
                s = j.DOM.iframe.insert(99, "Adobe Reader");
                y.DummySpanTagHTML = j.DOM.insert("", [], [], p, v, u, s);
                y.HTML = j.DOM.insert("object", ["classid", y.classID], [], p, v, u, s);
                y.DummyObjTagHTML2 = j.DOM.insert("object", ["classid", y.classID_dummy], [], p, v, u, s);
                j.DOM.iframe.close(s);
                q = j.DOM.getTagStatus(y.HTML, y.DummySpanTagHTML, y.DummyObjTagHTML1, y.DummyObjTagHTML2, 0, 0, r);
                x = v.activexQuery(y.HTML.obj());
                w = x.version;
                t = x.precision;
                y.detected = q > 0 || w ? 1 : (q == -0.1 || q == -0.5 ? -0.5 : -1);
                if (w) {
                    y.version = w
                }
                if (t) {
                    y.precision = t
                }
                return y
            }
        },
        doc2: {
            detected: 0,
            version: null,
            precision: 0,
            classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",
            mimeType: "application/pdf",
            HTML: 0,
            count: 0,
            count2: 0,
            time2: 0,
            intervalLength: 25,
            maxCount: 350,
            isDisabled: function() {
                var r = this,
                    v = c,
                    u = v.axo,
                    p = v.nav,
                    x = v.doc,
                    w, t, q = 0,
                    s;
                if (r.HTML) {
                    q = 2
                } else {
                    if (j.dbug) {} else {
                        if (!j.DOM.isEnabled.objectTagUsingActiveX()) {
                            q = 2
                        } else {
                            w = (p ? p.version : 0) || (u ? u.version : 0) || (x ? x.version : 0) || 0;
                            t = (p ? p.precision : 0) || (u ? u.precision : 0) || (x ? x.precision : 0) || 0;
                            if (!w || !t || t > 2 || j.compareNums(j.formatNum(w), j.formatNum("11")) < 0) {
                                q = 2
                            }
                        }
                    }
                }
                if (q < 2) {
                    s = j.file.getValid(v);
                    if (!s || !s.full) {
                        q = 1
                    }
                }
                return q
            },
            handlerSet: 0,
            onMessage: function() {
                var p = this;
                return function(q) {
                    if (p.version) {
                        return
                    }
                    p.detected = 1;
                    if (j.isArray(q)) {
                        q = q[0]
                    }
                    q = j.getNum(q + "");
                    if (q) {
                        if ((/^(\d+)[.,_]?$/).test(q)) {
                            q = RegExp.$1 + ",0,0,0";
                            p.precision = 3
                        } else {
                            if ((/^(\d+)[.,_](\d)(\d\d)$/).test(q) || (/^(\d+)[.,_](\d\d\d)(\d\d\d\d\d)$/).test(q)) {
                                q = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + ",0";
                                p.precision = 3
                            } else {
                                if ((/^(\d+)[.,_](\d\d\d)(\d\d\d\d\d)(\d+)$/).test(q)) {
                                    q = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + "," + RegExp.$4;
                                    p.precision = 4
                                } else {
                                    if ((/^(\d+)[.,_](\d)(\d)$/).test(q)) {
                                        q = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + ",0";
                                        p.precision = 3
                                    } else {
                                        if ((/^(\d+)[.,_](\d)$/).test(q)) {
                                            q = RegExp.$1 + "," + RegExp.$2 + ",0,0";
                                            p.precision = 3
                                        }
                                    }
                                }
                            }
                        }
                        p.version = j.formatNum(q);
                        c.setPluginStatus()
                    }
                }
            },
            isDefinedMsgHandler: function(q, r) {
                try {
                    return q ? q.messageHandler !== r : 0
                } catch (p) {}
                return 1
            },
            queryObject: function() {
                var r = this,
                    s = r.HTML,
                    q = s ? s.obj() : 0;
                if (!q) {
                    return
                }
                if (!r.handlerSet && r.isDefinedMsgHandler(q)) {
                    try {
                        q.messageHandler = {
                            onMessage: r.onMessage()
                        }
                    } catch (p) {}
                    r.handlerSet = 1;
                    r.count2 = r.count;
                    r.time2 = (new Date()).getTime()
                }
                if (!r.detected) {
                    if (r.count > 3 && !r.handlerSet) {
                        r.detected = -1
                    } else {
                        if (r.time2 && r.count - r.count2 >= r.maxCount && (new Date()).getTime() - r.time2 >= r.intervalLength * r.maxCount) {
                            r.detected = -0.5
                        }
                    }
                }
                if (r.detected) {
                    if (r.detected != -1) {}
                }
            },
            insertHTMLQuery: function() {
                var u = this,
                    p = c,
                    r = j.DOM.altHTML,
                    q, s, t = 0;
                if (u.isDisabled()) {
                    return u
                }
                if (p.OTF < 2) {
                    p.OTF = 2
                }
                q = j.file.getValid(p).full;
                s = j.DOM.iframe.insert(0, "Adobe Reader");
                j.DOM.iframe.write(s, '<script type="text/javascript"><\/script>');
                u.HTML = j.DOM.insert("object", ["data", q].concat(j.browser.isIE ? ["classid", u.classID] : ["type", u.mimeType]), ["src", q], r, p, t, s);
                j.DOM.iframe.addHandler(s, u.onIntervalQuery);
                if (p.OTF < 3 && u.HTML) {
                    p.OTF = 3;
                }
                j.DOM.iframe.close(s);
                return u
            },
            onIntervalQuery: function() {
                var p = c,
                    q = p.doc2;
                q.count++;
                if (p.OTF == 3) {
                    q.queryObject();
                    if (q.detected) {
                        q.queryCompleted()
                    }
                }
                if (p.OTF == 3) {
                    j.ev.setTimeout(q.onIntervalQuery, q.intervalLength)
                }
            },
            queryCompleted: function() {
                var q = this,
                    p = c;
                if (p.OTF == 4) {
                    return
                }
                p.OTF = 4;
                p.setPluginStatus();
                j.ev.callArray(p.DoneHndlrs);
            },
            z: 0
        },
        getInfo: function() {
            var q = this;
            q.setPluginStatus();
            var p = {
                OTF: (q.OTF < 3 ? 0 : (q.OTF == 3 ? 1 : 2)),
                DummyPDFused: false,
                version: q.version,
                precision: q.precision
            };
            if (q.doc2.detected == 1 || q.doc2.detected == -0.5) {
                p.DummyPDFused = true
            }
            return p
        }
    };
    j.addPlugin("adobereader", c);
    var b = {
        OTF: null,
        setPluginStatus: function() {
            var q = this,
                r = q.doc.result,
                p = q.OTF;
            q.version = null;
            if (p == 3) {
                q.installed = -0.5
            } else {
                q.installed = r > 0 ? 0 : -1
            }
            if (q.verify && q.verify.isEnabled()) {
                q.getVersionDone = 0
            } else {
                if (q.getVersionDone != 1) {
                    q.getVersionDone = (q.installed == -0.5 || (q.installed == -1 && q.doc.isDisabled() < 2)) ? 0 : 1
                }
            }
        },
        getVersion: function(r, q) {
            var s = this,
                p = false,
                u = s.verify,
                t = s.doc;
            if (s.getVersionDone === null) {
                s.OTF = 0;
                if (u) {
                    u.init()
                }
            }
            j.file.save(s, ".pdf", q);
            if (s.getVersionDone === 0) {
                if (u && u.isEnabled() && j.isNum(s.installed) && s.installed >= 0) {
                    return
                }
            }
            if ((!p || j.dbug) && t.insertHTMLQuery() > 0) {
                p = true
            }
            s.setPluginStatus()
        },
        doc: {
            result: 0,
            mimeType: "application/pdf",
            mimeType_dummy: "application/dummymimepdf",
            DummySpanTagHTML: 0,
            HTML: 0,
            DummyObjTagHTML1: 0,
            isDisabled: function() {
                var t = this,
                    s = b,
                    r = 0,
                    p = j.browser,
                    q;
                if (s.OTF >= 2 || !j.DOM.isEnabled.objectTag() || j.DOM.isEnabled.objectTagUsingActiveX()) {
                    r = 2
                } else {
                    if (j.dbug) {} else {
                        if (!p.isGecko || j.compareNums(p.verGecko, j.formatNum("10")) < 0 || (j.compareNums(p.verGecko, j.formatNum("19")) < 0 && j.hasMimeType(t.mimeType))) {
                            r = 2
                        }
                    }
                }
                if (r < 2) {
                    q = j.file.getValid(s);
                    if (!q || !q.full) {
                        r = 1
                    }
                }
                return r
            },
            tabIndex: null,
            method: "",
            queryObject: function(r) {
                var u = this,
                    t = u.HTML ? u.HTML.obj() : 0,
                    v, q, p = j.dbug && (u.HTML && !u.HTML.loaded) ? 0 : 1;
                v = j.DOM.getTagStatus(u.HTML, u.DummySpanTagHTML, u.DummyObjTagHTML1, 0);
                if ((!u.result || j.dbug) && v < -0.1) {
                    if (p) {
                        u.result = -1
                    }
                    u.method += "1,";
                }
                if ((!u.result || j.dbug) && v > 0 && !j.hasMimeType(u.mimeType)) {
                    if (p) {
                        u.result = 1
                    }
                    u.method += "2,";
                }
                try {
                    q = t ? t.tabIndex : null
                } catch (s) {}
                if (!j.isNum(u.tabIndex) && j.isNum(q)) {
                    u.tabIndex = q
                }
                if ((!u.result || j.dbug) && v > 0) {
                    if (j.isNum(q) && j.isNum(u.tabIndex) && u.tabIndex !== q) {
                        if (p) {
                            u.result = 1
                        }
                        u.method += "4,";
                    } else {
                        if (p) {
                            u.result = -1
                        }
                        u.method += "5,";
                    }
                }
                return u.result
            },
            insertHTMLQuery: function() {
                var u = this,
                    s = b,
                    q, r, t = 1,
                    p = j.DOM.altHTML;
                if (u.isDisabled()) {
                    return u.result
                }
                if (s.OTF < 2) {
                    s.OTF = 2
                }
                q = j.file.getValid(s).full;
                r = j.DOM.iframe.insert(99, "PDFjs");
                u.DummySpanTagHTML = j.DOM.insert("", [], [], p, s, t, r);
                u.HTML = j.DOM.insert("object", ["type", u.mimeType, "data", q], ["src", q], p, s, t, r);
                u.DummyObjTagHTML1 = j.DOM.insert("object", ["type", u.mimeType_dummy], [], p, s, t, r);
                j.DOM.iframe.close(r);
                u.queryObject();
                if (u.result && !j.dbug) {
                    return u.result
                }
                s.NOTF.init();
                return u.result
            }
        },
        NOTF: {
            count: 0,
            intervalLength: 250,
            init: function() {
                var r = this,
                    p = b,
                    q = p.doc;
                if (p.OTF < 3 && q.HTML) {
                    p.OTF = 3;
                    j.ev.setTimeout(r.onIntervalQuery, r.intervalLength);
                }
            },
            onIntervalQuery: function() {
                var p = b.doc,
                    q = b.NOTF;
                q.count++;
                if (b.OTF == 3) {
                    p.queryObject(q.count);
                    if (p.result) {
                        q.queryCompleted()
                    }
                }
                if (b.OTF == 3) {
                    j.ev.setTimeout(q.onIntervalQuery, q.intervalLength)
                }
            },
            queryCompleted: function() {
                var q = this,
                    p = b;
                if (p.OTF == 4) {
                    return
                }
                p.OTF = 4;
                p.setPluginStatus();
                j.ev.callArray(p.DoneHndlrs);
            }
        }
    };
    j.addPlugin("pdfjs", b);
})();