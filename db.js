// طبقة التخزين المحلي: تحفظ بيانات التطبيق داخل متصفح الهاتف (IndexedDB)
// حالياً تُملأ من البيانات التجريبية في data.js، وفي المرحلة 4 ستُملأ من الخادم.
(function () {
  "use strict";

  var DB_NAME = "dalil";
  var DB_VERSION = 1;
  var STORES = ["villages", "serviceTypes", "services", "adCategories", "ads", "routes", "photoCats", "photos", "complaints"];
  var DRAFT_KEY = "dalil_draft_complaint";
  var dbPromise = null;

  var Store = { available: false };

  function open() {
    if (dbPromise) { return dbPromise; }
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("no-indexeddb")); return; }
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        STORES.forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) { db.createObjectStore(s, { keyPath: "id" }); }
        });
        if (!db.objectStoreNames.contains("meta")) { db.createObjectStore("meta", { keyPath: "key" }); }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error("open-failed")); };
      req.onblocked = function () { reject(new Error("blocked")); };
    });
    return dbPromise;
  }

  // يشغّل عملية على قاعدة البيانات ويعيد النتيجة بعد اكتمالها بالكامل
  function tx(storeNames, mode, work) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var out = { v: undefined };
        var t = db.transaction(storeNames, mode);
        t.oncomplete = function () { resolve(out.v); };
        t.onerror = function () { reject(t.error || new Error("tx-error")); };
        t.onabort = function () { reject(t.error || new Error("tx-aborted")); };
        work(t, out);
      });
    });
  }

  function getAll(store) {
    return tx([store], "readonly", function (t, out) {
      var r = t.objectStore(store).getAll();
      r.onsuccess = function () { out.v = r.result; };
    });
  }

  function getMeta(key) {
    return tx(["meta"], "readonly", function (t, out) {
      var r = t.objectStore("meta").get(key);
      r.onsuccess = function () { out.v = r.result ? r.result.value : undefined; };
    });
  }

  function setMeta(key, value) {
    return tx(["meta"], "readwrite", function (t) {
      t.objectStore("meta").put({ key: key, value: value });
    });
  }

  // يستبدل كل الجداول دفعة واحدة، فإما أن ينجح كله أو لا يتغير شيء
  function replaceAll(data, metaPairs) {
    return tx(STORES.concat(["meta"]), "readwrite", function (t) {
      STORES.forEach(function (s) {
        var os = t.objectStore(s);
        os.clear();
        (data[s] || []).forEach(function (row) { os.put(row); });
      });
      metaPairs.forEach(function (m) { t.objectStore("meta").put(m); });
    });
  }

  function seed(sample) {
    return getMeta("seedVersion").then(function (v) {
      if (v === sample.version) { return; }
      var data = {};
      STORES.forEach(function (s) { data[s] = sample[s] || []; });
      return replaceAll(data, [
        { key: "seedVersion", value: sample.version },
        { key: "updated", value: sample.updated || {} },
        { key: "seededAt", value: new Date().toISOString() }
      ]);
    });
  }

  function bumpOpens() {
    return getMeta("opens").then(function (n) { return setMeta("opens", (n || 0) + 1); });
  }

  function loadAll() {
    var out = {};
    return Promise.all(STORES.map(function (s) {
      return getAll(s).then(function (rows) { out[s] = rows || []; });
    })).then(function () {
      return tx(["meta"], "readonly", function (t, o) {
        var r = t.objectStore("meta").getAll();
        r.onsuccess = function () { o.v = r.result; };
      });
    }).then(function (rows) {
      var m = {};
      (rows || []).forEach(function (x) { m[x.key] = x.value; });
      out.updated = m.updated || {};
      out.draft = m.draft || null;
      out.meta = { source: "indexeddb", opens: m.opens, seededAt: m.seededAt, seedVersion: m.seedVersion };
      return out;
    });
  }

  function lsDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { return null; }
  }

  // إن لم يتوفر IndexedDB (مثلاً في بعض أوضاع التصفح الخاص) نعمل من الذاكرة المؤقتة
  function fallback(sample, err) {
    var out = {};
    STORES.forEach(function (s) { out[s] = sample[s] || []; });
    out.updated = sample.updated || {};
    out.draft = lsDraft();
    out.meta = { source: "memory", error: String((err && err.message) || err) };
    return out;
  }

  Store.init = function (sample) {
    return open().then(function () { return seed(sample); }).then(function () {
      Store.available = true;
      return bumpOpens();
    }).then(loadAll).catch(function (err) {
      Store.available = false;
      return fallback(sample, err);
    });
  };

  Store.saveDraft = function (d) {
    if (Store.available) { return setMeta("draft", d).catch(function () { /* تجاهل */ }); }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) { /* التخزين غير متاح */ }
    return Promise.resolve();
  };

  window.Store = Store;
})();
